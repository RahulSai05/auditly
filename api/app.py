import os
import numpy as np
import csv
import cv2
import random
import io
import datetime
import base64
import hashlib
import boto3
import httpx
import traceback
import time     
import httpx
import subprocess
import requests
import logging
import jwt
import json
from authlib.integrations.base_client.errors import MismatchingStateError, OAuthError
from send_email import send_email
from urllib.parse import urljoin, quote, unquote
from settings import ENV
from io import StringIO
from datetime import datetime, timedelta, timezone, date
from secret import get_secret
from pydantic import BaseModel, EmailStr, conint
from jwt import decode as jwt_decode
from email_body import _login_email_body, _forget_password_email_body, _generate_inspection_email_body, _generate_inspection_email_subject
from request_models import CompareImagesRequest, AuditlyUserRequest, LoginRequest, VerifyLogin, LogoutRequest, ForgetPassword, ResettPassword, ReceiptSearchRequest, UpdateProfileRequest, Onboard, UpdateUserTypeRequest, ReceiptSearch
from database import engine, SessionLocal
from models import Base, Item, CustomerItemData, CustomerData, BaseData, ReturnDestination, CustomerItemCondition, AuditlyUser, Brand, OnboardUser, SalesData, PowerBiUser, PowerBiSqlMapping, TeamEmail, CronJobTable, SaleItemData, ReturnItemData, NotificationTable, Agent, AgentManager
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Query, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import Optional
from sqlalchemy import distinct, desc, or_, inspect, text, Table, MetaData, func
from starlette.responses import RedirectResponse
from starlette.middleware.sessions import SessionMiddleware
from authlib.integrations.starlette_client import OAuth
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input
from tensorflow.keras.preprocessing.image import img_to_array, load_img
from tensorflow.keras.models import Model
from skimage.metrics import structural_similarity as ssim
from fastapi import HTTPException
from typing import List, Dict, Optional

# Initialize the database tables if not already done
Base.metadata.create_all(bind=engine)

s3_bucket = "myauditlybucket"

# sercet value = zmP8Q~nk07PYr1fBGpojD7hD7bCTt4SXuABErapM
AZURE_CLIENT_ID="2146b62a-5753-4fd8-b359-6ad3e1e7b814"
#AZURE_CLIENT_SECRET="1ef9af97-56cf-4be2-9533-c2e332e94d5a"
AZURE_CLIENT_SECRET="zmP8Q~nk07PYr1fBGpojD7hD7bCTt4SXuABErapM"
AZURE_TENANT_ID="fc09811c-498c-4e79-b20f-ba5cfa421942"
REDIRECT_URI= "http://localhost:8000/callback"

def get_db():
    """Provide a database session to the API endpoints."""
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

# Hash password using SHA-256
def hash_password_sha256(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

# Verify password function
def verify_password_sha256(plain_password, hashed_password) -> bool:
    return hash_password_sha256(plain_password) == hashed_password

app = FastAPI()

metadata = MetaData()
metadata.reflect(bind=engine) 

app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SESSION_SECRET_KEY", "a_random_secret_key"), 
    session_cookie="pb_session",
    same_site="Lax",  # Critical for OAuth flows
    https_only=False,  
    max_age=86400
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TENANT_ID = AZURE_TENANT_ID
OAUTH_DISCOVERY_URL = f"https://login.microsoftonline.com/{TENANT_ID}/v2.0/.well-known/openid-configuration"


oauth = OAuth()
oauth.register(
    name="microsoft",
    client_id=AZURE_CLIENT_ID,
    client_secret=AZURE_CLIENT_SECRET,
    server_metadata_url="https://login.microsoftonline.com/fc09811c-498c-4e79-b20f-ba5cfa421942/v2.0/.well-known/openid-configuration",
    client_kwargs={
        "scope": "openid profile email https://analysis.windows.net/powerbi/api/.default",
        "prompt": "select_account",
        "response_type": "code",
    }
)



@app.get("/api/item_order_instance")
async def get_item_instance_details(
    identifier: str = Query(..., title="Serial Number or Return Order Number"),
    db: Session = Depends(get_db)
):
    """
    Retrieve details of an item instance using a single identifier.
    Includes linked item details from the Item table.
    """

    item_instance = db.query(SaleItemData).filter(
        (SaleItemData.serial_number == identifier) | 
        (SaleItemData.original_sales_order_number == identifier)
    ).first()
    if item_instance:
        return_instance = db.query(ReturnItemData).filter(ReturnItemData.original_sales_order_number == item_instance.original_sales_order_number).first()
    else:
        return_instance = db.query(ReturnItemData).filter(
        (ReturnItemData.return_order_number == identifier)
    ).first()
        item_instance = db.query(SaleItemData).filter(
            SaleItemData.original_sales_order_number == return_instance.original_sales_order_number
        ).first()
    if not item_instance:
        raise HTTPException(status_code=404, detail="Item Instance not found.")

    item_details = db.query(Item).filter(Item.id == item_instance.item_id).first()

    return {
        "original_sales_order_number": item_instance.original_sales_order_number,
        "original_sales_order_line": item_instance.original_sales_order_line,
        "ordered_qty": item_instance.ordered_qty,
        "return_order_number": return_instance.return_order_number,
        "return_order_line": return_instance.return_order_line,
        "return_qty": return_instance.return_qty,
        "return_destination": return_instance.return_destination,
        "return_condition": return_instance.return_condition,
        "return_carrier": return_instance.return_carrier,
        "return_warehouse": return_instance.return_warehouse,
        "item_id": item_instance.item_id,
        "serial_number": item_instance.serial_number,
        "sscc_number": item_instance.sscc_number,
        "tag_number": item_instance.tag_number,
        "vendor_item_number": item_instance.vendor_item_number,
        "shipped_from_warehouse": item_instance.shipped_from_warehouse,
        "shipped_to_person": item_instance.shipped_to_person,
        "shipped_to_address": {
            "apt_number": item_instance.shipped_to_apt_number,
            "street": item_instance.shipped_to_street,
            "city": item_instance.shipped_to_city,
            "zip": item_instance.shipped_to_zip,
            "state": item_instance.shipped_to_state,
            "country": item_instance.shipped_to_country,
        },
        "dimensions": {
            "depth": item_instance.dimension_depth,
            "length": item_instance.dimension_length,
            "breadth": item_instance.dimension_breadth,
            "weight": item_instance.dimension_weight,
            "volume": item_instance.dimension_volume,
            "size": item_instance.dimension_size,
        },
        "item_details": {
            "item_number": item_details.item_number if item_details else None,
            "item_description": item_details.item_description if item_details else None,
            "brand_id": item_details.brand_id if item_details else None,
            "category": item_details.category if item_details else None,
            "configuration": item_details.configuration if item_details else None,
        },
        "customer_id": item_instance.id,
    }


class AgentCreate(BaseModel):
    agent_name: str
    manager_id: Optional[dict] = None
    current_address: Optional[str] = None
    delivery_type: str  # 'Delivery', 'Return', or 'Both'
    pickup_routing_mode: Optional[bool] = False
    delivery_routing_mode: Optional[bool] = False
    servicing_state: Optional[str] = None
    servicing_city: Optional[str] = None
    servicing_zip: Optional[str] = None
    permanent_adress: Optional[str] = None
    permanent_address_state: Optional[str] = None
    permanent_address_city: Optional[str] = None
    permanent_address_zip: Optional[str] = None
    is_verified: Optional[bool] = False
    gender: str  # 'Male', 'Female', 'Other', 'Prefer not to say'
    dob: Optional[date] = None
    work_schedule: Optional[dict] = None
    company_id: Optional[int] = None
    agent_to_user_mapping_id: Optional[int] = None
    additional_info_1: Optional[str] = None
    additional_info_2: Optional[str] = None
    additional_info_3: Optional[str] = None

@app.post("/api/create-agent/")
def create_agent(agent: AgentCreate, db: Session = Depends(get_db)):
    new_agent = Agent(
        agent_name=agent.agent_name,
        manager_id=agent.manager_id,
        current_address=agent.current_address,
        delivery_type=agent.delivery_type,
        pickup_routing_mode=agent.pickup_routing_mode,
        delivery_routing_mode=agent.delivery_routing_mode,
        servicing_state=agent.servicing_state,
        servicing_city=agent.servicing_city,
        servicing_zip=agent.servicing_zip,
        permanent_adress=agent.permanent_adress,
        permanent_address_state=agent.permanent_address_state,
        permanent_address_city=agent.permanent_address_city,
        permanent_address_zip=agent.permanent_address_zip,
        is_verified=agent.is_verified,
        gender=agent.gender,
        dob=agent.dob,
        work_schedule=agent.work_schedule,
        company_id=agent.company_id,
        agent_to_user_mapping_id=agent.agent_to_user_mapping_id,
        additional_info_1=agent.additional_info_1,
        additional_info_2=agent.additional_info_2,
        additional_info_3=agent.additional_info_3
    )

    db.add(new_agent)
    db.commit()
    db.refresh(new_agent)
    return {"message": "Agent created successfully", "agent_id": new_agent.agent_id}

@app.get("/api/pending-agent-approval")
def pending_agent_approval(db: Session = Depends(get_db)):
    agents = db.query(Agent, AuditlyUser).join(
        AuditlyUser, Agent.agent_to_user_mapping_id == AuditlyUser.auditly_user_id
    ).filter(
        AuditlyUser.is_agent == False
    ).all()
    result = [
        {
            "agent": {
                "agent_id": agent.agent_id,
                "agent_name": agent.agent_name,
                "delivery_type": agent.delivery_type,
                "current_address": agent.current_address,
                "servicing_state": agent.servicing_state,
                "servicing_city": agent.servicing_city,
                "is_verified": agent.is_verified,
                "gender": agent.gender,
                "dob": agent.dob,
                "created_at": agent.created_at,
                "updated_at": agent.updated_at,
            },
            "user": {
                "auditly_user_id": user.auditly_user_id,
                "auditly_user_name": user.auditly_user_name,
                "email": user.email,
                "user_type": user.user_type,
                "is_agent": user.is_agent,
                "is_inspection_user": user.is_inspection_user,
                "is_admin": user.is_admin,
            }
        }
        for agent, user in agents
    ]
    return {"agents": result}



class AgentApprovalRequest(BaseModel):
    agent_id: int
    approver_id: int

@app.post("/api/approve-agent")
def approve_agent(request: AgentApprovalRequest, db: Session = Depends(get_db)):
    # Fetch user
    approver = db.query(AuditlyUser).filter(AuditlyUser.auditly_user_id == request.approver_id).first()
    if not approver:
        raise HTTPException(status_code=404, detail="AuditlyUser not found")

    # Fetch agent
    agent = db.query(Agent).filter(Agent.agent_id == request.agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    # Update user
    user = db.query(AuditlyUser).filter(AuditlyUser.auditly_user_id == agent.agent_to_user_mapping_id).first()
    user.is_agent = True

    # Update agent
    agent.approved_by_auditly_user_id = request.approver_id

    db.commit()
    return {"message": "Agent approved and user updated successfully"}


class AgentScheduleCheckRequest(BaseModel):
    agent_id: int

@app.post("/api/check-agent-last-working-day")
def is_last_working_day(request: AgentScheduleCheckRequest, db: Session = Depends(get_db)):
    agent = db.query(Agent).filter(Agent.agent_id == request.agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    if not agent.work_schedule or "days" not in agent.work_schedule:
        raise HTTPException(status_code=400, detail="Work schedule not set for agent")

    try:
        working_days = list(map(int, agent.work_schedule["days"].split(",")))
        today = datetime.today().isoweekday()  # Monday = 1, Sunday = 7
        is_last_day = today == max(working_days)
        return {"is_last_working_day": is_last_day}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Invalid work schedule format: {e}")

class UpdateScheduleRequest(BaseModel):
    agent_id: int
    work_schedule: Dict

@app.post("/api/update-work-schedule")
def update_work_schedule(request: UpdateScheduleRequest, db: Session = Depends(get_db)):
    agent = db.query(Agent).filter(Agent.agent_id == request.agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    try:
        if "days" not in request.work_schedule:
            raise ValueError("Missing 'days' in work_schedule")

        day_list = list(map(int, request.work_schedule["days"].split(",")))
        if any(day < 1 or day > 7 for day in day_list):
            raise ValueError("Days must be between 1 (Monday) and 7 (Sunday)")

        agent.work_schedule = request.work_schedule
        db.commit()
        return {
            "message": "Work schedule updated successfully",
            "agent_id": agent.agent_id,
            "work_schedule": agent.work_schedule
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid input: {e}")
    
class UpdateRoutingModesRequest(BaseModel):
    agent_id: int
    pickup_routing_mode: Optional[conint(ge=0, le=1)] = None  # Accepts only 0 or 1
    delivery_routing_mode: Optional[conint(ge=0, le=1)] = None

@app.post("/api/update-routing-modes")
def update_routing_modes(request: UpdateRoutingModesRequest, db: Session = Depends(get_db)):
    agent = db.query(Agent).filter(Agent.agent_id == request.agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    try:
        if request.pickup_routing_mode is not None:
            agent.pickup_routing_mode = bool(request.pickup_routing_mode)
        if request.delivery_routing_mode is not None:
            agent.delivery_routing_mode = bool(request.delivery_routing_mode)

        db.commit()
        return {
            "message": "Routing modes updated successfully",
            "agent_id": agent.agent_id,
            "pickup_routing_mode": int(agent.pickup_routing_mode),
            "delivery_routing_mode": int(agent.delivery_routing_mode)
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error updating routing modes: {e}")
    

class ManagerCreate(BaseModel):
    manager_name: str
    servicing_state: Optional[str] = None
    servicing_city: Optional[str] = None
    servicing_zip: Optional[str] = None
    permanent_address: Optional[str] = None
    permanent_address_state: Optional[str] = None
    permanent_address_city: Optional[str] = None
    permanent_address_zip: Optional[str] = None
    address: Optional[str] = None
    is_verified: Optional[bool] = False
    dob: Optional[date] = None
    gender: Optional[str] = None  # 'Male', 'Female', 'Other', etc.
    work_schedule: Optional[dict] = None
    company_id: Optional[int] = None
    manager_user_mapping_id: Optional[int] = None
    additional_info_1: Optional[str] = None
    additional_info_2: Optional[str] = None


@app.post("/api/create-manager/")
def create_manager(manager: ManagerCreate, db: Session = Depends(get_db)):
    new_manager = AgentManager(
        manager_name=manager.manager_name,
        servicing_state=manager.servicing_state,
        servicing_city=manager.servicing_city,
        servicing_zip=manager.servicing_zip,
        permanent_address=manager.permanent_address,
        permanent_address_state=manager.permanent_address_state,
        permanent_address_city=manager.permanent_address_city,
        permanent_address_zip=manager.permanent_address_zip,
        address=manager.address,
        is_verified=manager.is_verified,
        dob=manager.dob,
        gender=manager.gender,
        work_schedule=manager.work_schedule,
        company_id=manager.company_id,
        manager_user_mapping_id=manager.manager_user_mapping_id,
        additional_info_1=manager.additional_info_1,
        additional_info_2=manager.additional_info_2
    )

    db.add(new_manager)
    db.commit()
    db.refresh(new_manager)
    return {
        "message": "Manager created successfully",
        "manager_id": new_manager.manager_id
    }


@app.get("/api/pending-manager-approval")
def pending_manager_approval(db: Session = Depends(get_db)):
    managers = db.query(AgentManager, AuditlyUser).join(
        AuditlyUser, AgentManager.manager_user_mapping_id == AuditlyUser.auditly_user_id
    ).filter(
        AuditlyUser.is_manager == False  # assumes this field exists
    ).all()

    result = [
        {
            "manager": {
                "manager_id": manager.manager_id,
                "manager_name": manager.manager_name,
                "servicing_state": manager.servicing_state,
                "servicing_city": manager.servicing_city,
                "servicing_zip": manager.servicing_zip,
                "permanent_address": manager.permanent_address,
                "permanent_address_state": manager.permanent_address_state,
                "permanent_address_city": manager.permanent_address_city,
                "permanent_address_zip": manager.permanent_address_zip,
                "address": manager.address,
                "is_verified": manager.is_verified,
                "gender": manager.gender,
                "dob": manager.dob,
                "created_at": manager.created_at,
                "updated_at": manager.updated_at,
            },
            "user": {
                "auditly_user_id": user.auditly_user_id,
                "auditly_user_name": user.auditly_user_name,
                "email": user.email,
                "user_type": user.user_type,
                "is_manager": user.is_manager,
                "is_inspection_user": user.is_inspection_user,
                "is_admin": user.is_admin,
            }
        }
        for manager, user in managers
    ]
    return {"managers": result}

    
class ManagerApprovalRequest(BaseModel):
    manager_id: int
    approver_id: int

@app.post("/api/approve-manager")
def approve_manager(request: ManagerApprovalRequest, db: Session = Depends(get_db)):
    # Validate approver
    approver = db.query(AuditlyUser).filter(AuditlyUser.auditly_user_id == request.approver_id).first()
    if not approver:
        raise HTTPException(status_code=404, detail="Approver (AuditlyUser) not found")

    # Get manager record
    manager = db.query(AgentManager).filter(AgentManager.manager_id == request.manager_id).first()
    if not manager:
        raise HTTPException(status_code=404, detail="Manager not found")

    # Update corresponding user's role
    user = db.query(AuditlyUser).filter(AuditlyUser.auditly_user_id == manager.manager_user_mapping_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User linked to manager not found")

    user.is_manager = True
    manager.approved_by_auditly_user_id = request.approver_id  # This line stores the approver

    db.commit()
    return {"message": "Manager approved, role updated, and approver recorded successfully"}

class ManagerStateRequest(BaseModel):
    manager_id: int

@app.post("/api/sale-items-by-manager-state")
def get_sale_items_by_manager_state(request: ManagerStateRequest, db: Session = Depends(get_db)):
    manager = db.query(AgentManager).filter(AgentManager.manager_id == request.manager_id).first()
    if not manager:
        raise HTTPException(status_code=404, detail="Manager not found")

    servicing_state = manager.servicing_state

    sale_items = db.query(SaleItemData).filter(SaleItemData.shipped_to_state == servicing_state).all()

    return {
        "manager_state": servicing_state,
        "sale_items": [
            {
                "id": item.id,
                "sales_order": item.original_sales_order_number,
                "order_line": item.original_sales_order_line,
                "serial_number": item.serial_number,
                "sscc_number": item.sscc_number,
                "account_number": item.account_number,
                "customer_email": item.customer_email,
                "shipped_to_city": item.shipped_to_city,
                "shipped_to_state": item.shipped_to_state,
                "shipped_to_zip": item.shipped_to_zip,
                "status": item.status,
                "date_purchased": item.date_purchased,
                "date_shipped": item.date_shipped,
                "date_delivered": item.date_delivered,
                "item": {
                    "item_number": item.item.item_number if item.item else None,
                    "description": item.item.item_description if item.item else None,
                    "category": item.item.category if item.item else None
                }
            } for item in sale_items
        ]
    }

@app.post("/api/return-items-by-manager-state")
def get_return_items_by_manager_state(request: ManagerStateRequest, db: Session = Depends(get_db)):
    manager = db.query(AgentManager).filter(AgentManager.manager_id == request.manager_id).first()
    if not manager:
        raise HTTPException(status_code=404, detail="Manager not found")

    servicing_state = manager.servicing_state

    return_items = db.query(ReturnItemData).filter(ReturnItemData.return_state == servicing_state).all()

    return {
        "manager_state": servicing_state,
        "return_items": [
            {
                "id": item.id,
                "return_order": item.return_order_number,
                "order_line": item.return_order_line,
                "item_id": item.item_id,
                "return_condition": item.return_condition,
                "return_carrier": item.return_carrier,
                "return_destination": item.return_destination,
                "return_state": item.return_state,
                "return_zip": item.return_zip,
                "status": item.status,
                "date_purchased": item.date_purchased,
                "date_shipped": item.date_shipped,
                "date_delivered": item.date_delivered,
                "return_created_date": item.return_created_date,
                "return_received_date": item.return_received_date,
                "item": {
                    "item_number": item.item.item_number if item.item else None,
                    "description": item.item.item_description if item.item else None,
                    "category": item.item.category if item.item else None
                }
            } for item in return_items
        ]
    }

   

@app.post("/api/upload-customer-images")
async def upload_customer_images(
    customer_item_data_id: int,  
    factory_seal: bool = False,
    no_factory_seal: bool = False,
    minimal_tear: bool = False,
    no_package: bool = False,
    new_condition: bool = False,
    not_new_condition: bool = False,
    bio_stains: bool = False,
    package_stains: bool = False,
    send_email_flag: bool = False,
    front_image: UploadFile = File(None),
    back_image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    
    """
    Upload customer front and back images, and save their file paths in the database.
    """
    if (factory_seal and new_condition) or send_email_flag:
        update_return_condition("sealy_pickup", customer_item_data_id, db)
        #send_email("rahulgr20@gmail.com", "fxei hthz bulr slzh", "geereddyrahul@gmail.com", "Test", "Test Message")
        print("email Sent!")

    if factory_seal and new_condition:
        update_return_condition("sealy_pickup", customer_item_data_id, db)   
    else:
        update_return_condition("returns_processing", customer_item_data_id, db)    

    existing_customer_data = db.query(CustomerData).filter_by(sale_item_data_id=customer_item_data_id).first()

    if ENV == "TEST":UPLOAD_DIRECTORY = "/home/ec2-user/auditly/static/customer_image"   
    elif ENV == "DEV":UPLOAD_DIRECTORY = "/Users/rahul/Desktop/"   
        

    # try:
    # Save front image
    if front_image and back_image:
        front_image_path = os.path.join(UPLOAD_DIRECTORY, front_image.filename)
        with open(front_image_path, "wb") as f:
            f.write(await front_image.read())

        # Save back image
        back_image_path = os.path.join(UPLOAD_DIRECTORY, back_image.filename)
        with open(back_image_path, "wb") as f:
            f.write(await back_image.read())
    else:
        front_image_path, back_image_path = None, None
        

    # Save file paths in the database
    if not existing_customer_data: 
        new_customer_data = CustomerData(
            sale_item_data_id=customer_item_data_id,
            customer_front_image=front_image_path,
            customer_back_image=back_image_path,
            factory_seal=factory_seal,
            no_factory_seal=no_factory_seal,
            minimal_tear=minimal_tear,
            no_package=no_package,
            new_condition=new_condition,
            not_new_condition=not_new_condition,
            bio_stains=bio_stains,
            package_stains=package_stains,
        )
        db.add(new_customer_data)
        db.commit()
        db.refresh(new_customer_data)
    else:
        existing_customer_data.customer_front_image = front_image_path or existing_customer_data.customer_front_image
        existing_customer_data.customer_back_image = back_image_path or existing_customer_data.customer_back_image
        existing_customer_data.factory_seal = factory_seal
        existing_customer_data.no_factory_seal = no_factory_seal
        existing_customer_data.minimal_tear = minimal_tear
        existing_customer_data.no_package = no_package
        existing_customer_data.new_condition = new_condition
        existing_customer_data.not_new_condition = not_new_condition
        existing_customer_data.bio_stains = bio_stains
        existing_customer_data.package_stains = package_stains
        db.commit()
        db.refresh(existing_customer_data)

    return {
        "message": "Images uploaded and saved successfully.",
        "data": {
            "id": customer_item_data_id,
            "front_image_path": front_image_path,
            "back_image_path": back_image_path,
        },
    }



@app.get("/api/base-images/{item-number}")
async def get_base_images(id: int, db: Session = Depends(get_db)):
    """
    Retrieve the paths to the base front and back images from the database.

    Args:
        id (int): The ID of the base data record.
        db (Session): The database session dependency.

    Returns:
        dict: Contains the paths to the front and back images.
    """
    # Query the database for the base data record with the given ID
    base_data = db.query(BaseData).filter(BaseData.base_to_item_mapping == id).first()

    # Check if the record exists
    if not base_data:
        raise HTTPException(status_code=404, detail="Base images not found")

    # Return the image paths
    return {
        "id": base_data.id,
        "front_image_path": base_data.base_front_image,
        "back_image_path": base_data.base_back_image,
    }


@app.post("/api/upload-items-csv")
async def upload_items_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Upload a CSV file to add or update items in the database.
    Skips rows with invalid or duplicate data and returns a summary.
    """
    try:
        content = await file.read()
        decoded_content = content.decode("utf-8")
        csv_reader = csv.DictReader(StringIO(decoded_content))

        # Normalize headers
        csv_reader.fieldnames = [field.strip().lower() for field in csv_reader.fieldnames]
        required_fields = {"item_number", "item_description", "brand_id", "category", "configuration"}
        if not required_fields.issubset(set(csv_reader.fieldnames)):
            raise HTTPException(status_code=400, detail=f"Missing required columns. Required: {required_fields}")

        added, updated = 0, 0
        skipped_rows = []
        seen_items = set()

        for row in csv_reader:
            try:
                # Strip and normalize all values in row
                row = {k.strip().lower(): v.strip() for k, v in row.items()}

                item_number_str = row.get("item_number")
                brand_id_str = row.get("brand_id")

                # Validate item_number and brand_id
                if not item_number_str or not item_number_str.isdigit():
                    raise ValueError("Invalid or missing item_number")
                if not brand_id_str or not brand_id_str.isdigit():
                    raise ValueError("Invalid or missing brand_id")

                item_number = int(item_number_str)
                brand_id = int(brand_id_str)

                # Check for duplicate item_number in the uploaded CSV
                if item_number in seen_items:
                    raise ValueError(f"Duplicate item_number {item_number} in CSV")
                seen_items.add(item_number)

                # Check if brand exists
                brand_exists = db.query(Brand).filter(Brand.id == brand_id).first()
                if not brand_exists:
                    raise ValueError(f"Brand ID {brand_id} does not exist")

                # Add or update item
                existing_item = db.query(Item).filter(Item.item_number == item_number).first()
                if existing_item:
                    existing_item.item_description = row["item_description"]
                    existing_item.brand_id = brand_id
                    existing_item.category = row["category"]
                    existing_item.configuration = row["configuration"]
                    updated += 1
                else:
                    new_item = Item(
                        item_number=item_number,
                        item_description=row["item_description"],
                        brand_id=brand_id,
                        category=row["category"],
                        configuration=row["configuration"],
                    )
                    db.add(new_item)
                    added += 1

            except Exception as row_error:
                skipped_rows.append({
                    "row_data": row,
                    "error": str(row_error)
                })
                continue  # move to next row

        db.commit()
        return {
            "message": "CSV processed.",
            "items_added": added,
            "items_updated": updated,
            "rows_skipped": skipped_rows
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@app.post("/api/upload-sale-items-csv")
async def upload_sale_items_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        content = await file.read()
        decoded_content = content.decode("utf-8")
        csv_reader = csv.DictReader(StringIO(decoded_content))

        # Normalize headers
        csv_reader.fieldnames = [field.strip().lower() for field in csv_reader.fieldnames]

        required_fields = {
            "item_id", "original_sales_order_number", "original_sales_order_line", "ordered_qty",
            "serial_number", "customer_email", "account_number", "sscc_number", "tag_number",
            "vendor_item_number", "shipped_from_warehouse", "shipped_to_person", "shipped_to_billing_address",
            "shipped_to_apt_number", "shipped_to_street", "shipped_to_city", "shipped_to_zip",
            "shipped_to_state", "shipped_to_country", "dimension_depth", "dimension_length",
            "dimension_breadth", "dimension_weight", "dimension_volume", "dimension_size",
            "date_purchased", "date_shipped", "date_delivered"
        }

        if not required_fields.issubset(set(csv_reader.fieldnames)):
            raise HTTPException(status_code=400, detail="Missing required columns in CSV.")

        added, skipped = 0, []
        seen_combinations = set()

        for row in csv_reader:
            try:
                row = {k.strip().lower(): v.strip() for k, v in row.items()}
                item_id = int(row["item_id"])
                order_no = row["original_sales_order_number"]
                order_line = int(row["original_sales_order_line"])
                serial = row["serial_number"]

                unique_key = (order_no, order_line, serial)

                # Check for duplicates in CSV
                if unique_key in seen_combinations:
                    raise ValueError("Duplicate row in CSV file.")
                seen_combinations.add(unique_key)

                # Check for duplicates in DB
                db_duplicate = db.query(SaleItemData).filter(
                    SaleItemData.original_sales_order_number == order_no,
                    SaleItemData.original_sales_order_line == order_line,
                    SaleItemData.serial_number == serial
                ).first()
                if db_duplicate:
                    raise ValueError("Duplicate already exists in database.")

                # Check item existence
                if not db.query(Item).filter(Item.id == item_id).first():
                    raise ValueError(f"Item ID {item_id} does not exist.")

                sale_item = SaleItemData(
                    item_id=item_id,
                    original_sales_order_number=order_no,
                    original_sales_order_line=order_line,
                    ordered_qty=int(row["ordered_qty"]),
                    serial_number=serial,
                    customer_email=row["customer_email"],
                    account_number=row["account_number"],
                    sscc_number=row["sscc_number"],
                    tag_number=row["tag_number"],
                    vendor_item_number=row["vendor_item_number"],
                    shipped_from_warehouse=row["shipped_from_warehouse"],
                    shipped_to_person=row["shipped_to_person"],
                    shipped_to_billing_address=row["shipped_to_billing_address"],
                    shipped_to_apt_number=row["shipped_to_apt_number"],
                    shipped_to_street=row["shipped_to_street"],
                    shipped_to_city=row["shipped_to_city"],
                    shipped_to_zip=int(row["shipped_to_zip"]),
                    shipped_to_state=row["shipped_to_state"],
                    shipped_to_country=row["shipped_to_country"],
                    dimension_depth=float(row["dimension_depth"]),
                    dimension_length=float(row["dimension_length"]),
                    dimension_breadth=float(row["dimension_breadth"]),
                    dimension_weight=float(row["dimension_weight"]),
                    dimension_volume=float(row["dimension_volume"]),
                    dimension_size=row["dimension_size"],
                    date_purchased=datetime.strptime(row["date_purchased"], "%Y-%m-%d").date(),
                    date_shipped=datetime.strptime(row["date_shipped"], "%Y-%m-%d").date(),
                    date_delivered=datetime.strptime(row["date_delivered"], "%Y-%m-%d").date()
                )

                db.add(sale_item)
                db.commit()  # Commit before assignment

                # Retrieve inserted record by unique key
                added_sale_item = db.query(SaleItemData).filter(
                    SaleItemData.original_sales_order_number == order_no,
                    SaleItemData.original_sales_order_line == order_line,
                    SaleItemData.serial_number == serial
                ).first()

                # Call assignment function
                _assign_sales_order(db, added_sale_item.id)

                added += 1

            except Exception as row_error:
                skipped.append({
                    "row_data": row,
                    "error": str(row_error)
                })
                continue

        return {
            "message": "Sale items CSV processed.",
            "items_added": added,
            "rows_skipped": skipped
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@app.post("/api/upload-return-items-csv")
async def upload_return_items_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        content = await file.read()
        decoded_content = content.decode("utf-8")
        csv_reader = csv.DictReader(StringIO(decoded_content))

        csv_reader.fieldnames = [field.strip().lower() for field in csv_reader.fieldnames]

        required_fields = {
            "original_sales_order_number", "return_order_number", "return_order_line", "return_qty",
            "item_id", "return_destination", "return_condition", "return_carrier", "return_warehouse",
            "return_house_number", "return_street", "return_city", "return_zip", "return_state", "return_country",
            "date_purchased", "date_shipped", "date_delivered", "return_created_date", "return_received_date"
        }

        if not required_fields.issubset(set(csv_reader.fieldnames)):
            raise HTTPException(status_code=400, detail=f"Missing required fields: {required_fields - set(csv_reader.fieldnames)}")

        added, skipped = 0, []
        seen_keys = set()

        for row in csv_reader:
            try:
                row = {k.strip().lower(): v.strip() for k, v in row.items()}

                order_number = row["return_order_number"]
                order_line = int(row["return_order_line"])
                item_id = int(row["item_id"])
                unique_key = (order_number, order_line)

                if unique_key in seen_keys:
                    raise ValueError("Duplicate return entry in CSV")
                seen_keys.add(unique_key)

                exists = db.query(ReturnItemData).filter(
                    ReturnItemData.return_order_number == order_number,
                    ReturnItemData.return_order_line == order_line
                ).first()

                if exists:
                    raise ValueError("Duplicate return entry already exists in DB")

                return_item = ReturnItemData(
                    original_sales_order_number=row["original_sales_order_number"],
                    return_order_number=order_number,
                    return_order_line=order_line,
                    return_qty=int(row["return_qty"]),
                    item_id=item_id,
                    return_destination=row["return_destination"],
                    return_condition=row["return_condition"],
                    return_carrier=row["return_carrier"],
                    return_warehouse=row["return_warehouse"],
                    return_house_number=row["return_house_number"],
                    return_street=row["return_street"],
                    return_city=row["return_city"],
                    return_zip=int(row["return_zip"]),
                    return_state=row["return_state"],
                    return_country=row["return_country"],
                    date_purchased=datetime.strptime(row["date_purchased"], "%Y-%m-%d").date(),
                    date_shipped=datetime.strptime(row["date_shipped"], "%Y-%m-%d").date(),
                    date_delivered=datetime.strptime(row["date_delivered"], "%Y-%m-%d").date(),
                    return_created_date=datetime.strptime(row["return_created_date"], "%Y-%m-%d").date(),
                    return_received_date=datetime.strptime(row["return_received_date"], "%Y-%m-%d").date()
                )

                db.add(return_item)
                db.commit()

                added_return_item = db.query(ReturnItemData).filter(
                    ReturnItemData.return_order_number == order_number,
                    ReturnItemData.return_order_line == order_line
                ).first()

                _assign_return_order(db, added_return_item.id)

                added += 1

            except Exception as row_error:
                skipped.append({"row_data": row, "error": str(row_error)})
                continue

        return {
            "message": "Return items CSV processed.",
            "items_added": added,
            "rows_skipped": skipped
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")


@app.get("/api/search-items")
async def search_items(query: str = "", db: Session = Depends(get_db)):
    """
    Search for items in the database by item_number, item_description, or brand_id.
    """
    try:
        results = db.query(Item).filter(
            (Item.item_number.like(f"%{query}%")) |
            (Item.item_description.like(f"%{query}%")) |
            (Item.brand_id.like(f"%{query}%"))
        ).all()

        return [result.__dict__ for result in results]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching items: {str(e)}")


def update_return_condition(status, return_order_mapping_key, db): 
    # return_flag_dict = {
    #     "sealy_pickup": False, 
    #     "returns_processing" : False,
    # }
    # if status == "sealy_pickup" : return_flag_dict["sealy_pickup"] = True
    # elif status == "returns_processing" : return_flag_dict["returns_processing"] = True
    # new_return_mapping = ReturnDestination(
    #     sealy_pickup = return_flag_dict["sealy_pickup"],
    #     returns_processing = return_flag_dict["returns_processing"],
    #     return_order_mapping_key = return_order_mapping_key
    # )
    # db.add(new_return_mapping)
    # db.commit()
    # db.refresh(new_return_mapping)
    pass


@app.post("/api/upload-base-images/")
async def upload_base_images(
    item_number: int,
    front_image: UploadFile = File(...),
    back_image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload base front and back images and map them to an item based on item_number.
    """
    if ENV == "TEST":UPLOAD_DIRECTORY = "/home/ec2-user/auditly/static/base_images"   
    elif ENV == "DEV":UPLOAD_DIRECTORY = "/Users/rahul/Desktop/auditly/base_images"   

    # Check if the item exists
    item = db.query(Item).filter(Item.item_number == item_number).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found for the given item_number")

    base_image_exists = db.query(BaseData).filter(BaseData.base_to_item_mapping == item.id).first()
    # Save front image
    front_image_path = os.path.join(UPLOAD_DIRECTORY, front_image.filename)
    with open(front_image_path, "wb") as f:
        f.write(await front_image.read()) 

    # Save back image
    back_image_path = os.path.join(UPLOAD_DIRECTORY, back_image.filename)
    with open(back_image_path, "wb") as f:
        f.write(await back_image.read())

    if base_image_exists:
        base_image_exists.base_front_image=front_image_path
        base_image_exists.base_back_image=back_image_path
        db.commit()
        db.refresh(base_image_exists)

    else:
    # Create a new BaseData entry
        new_base_data = BaseData(
            base_front_image=front_image_path,
            base_back_image=back_image_path,
            base_to_item_mapping=item.id
        ) 
        db.add(new_base_data)
        db.commit()
        db.refresh(new_base_data)

    

    return {
        "message": "Images uploaded and saved successfully.",
        "data": {
            "front_image_path": front_image_path,
            "back_image_path": back_image_path,
            "item_number": item_number
        }
    }


@app.get("/api/items")
def get_all_items(db: Session = Depends(get_db)):
    items = db.query(Item).all()

    return [
        {
            "id": item.id,
            "item_number": item.item_number,
            "item_description": item.item_description,
            "category": item.category,
            "configuration": item.configuration,
            "brand": {
                "id": item.brand.id,
                "brand_name": item.brand.brand_name,
                "description": item.brand.description
            }
        }
        for item in items
    ]


@app.get("/api/sale-data")
def get_all_sale_items(db: Session = Depends(get_db)):
    results = db.query(
        SaleItemData.original_sales_order_number.label("sales_order"),
        SaleItemData.original_sales_order_line.label("order_line"),
        SaleItemData.account_number,
        SaleItemData.shipped_to_person.label("customer_name"),
        Item.item_description,
        Item.configuration.label("item_configuration"),
        Brand.brand_name.label("brand"),
        SaleItemData.serial_number,
        SaleItemData.date_purchased,
        SaleItemData.date_shipped,
        SaleItemData.date_delivered
    ).join(Item, SaleItemData.item_id == Item.id
    ).join(Brand, Item.brand_id == Brand.id
    ).all()

    return [dict(row._mapping) for row in results]


@app.get("/api/returns-data")
def get_full_return_data(db: Session = Depends(get_db)):
    results = db.query(
        ReturnItemData.return_order_number.label("rma_number"),
        SaleItemData.account_number,
        SaleItemData.shipped_to_person.label("customer_name"),
        Item.item_description,
        Item.configuration,
        SaleItemData.original_sales_order_number.label("sales_order"),
        SaleItemData.original_sales_order_line.label("line"),
        SaleItemData.serial_number,
        ReturnItemData.date_purchased.label("purchased"),
        ReturnItemData.date_shipped.label("shipped"),
        ReturnItemData.date_delivered.label("delivered"),
        ReturnItemData.return_received_date.label("return_date")
    ).join(
        SaleItemData, ReturnItemData.original_sales_order_number == SaleItemData.original_sales_order_number
    ).join(
        Item, SaleItemData.item_id == Item.id
    ).all()

    return [dict(row._mapping) for row in results]

    

@app.get("/api/item-details/{identifier}")
async def get_item_details(
    identifier: str,
    db: Session = Depends(get_db)
):
    """
    Fetch item details by searching:
    - Return order number (ReturnItemData.return_order_number)
    - Original sales order number (SaleItemData.original_sales_order_number)
    - Serial number (SaleItemData.serial_number)
    
    Automatically checks all three fields and returns the first match.
    """
    try:
        # Check if the identifier matches a return order number
        return_order_result = db.query(
            Item.item_number,
            Item.item_description,
            Brand.brand_name,
            Item.category,
            Item.configuration,
            ReturnItemData.return_order_number,
            ReturnItemData.return_qty,
            ReturnItemData.return_condition,
            SaleItemData.serial_number,
            SaleItemData.original_sales_order_number
        ).join(
            SaleItemData, SaleItemData.item_id == Item.id
        ).join(
            ReturnItemData, SaleItemData.original_sales_order_number == ReturnItemData.original_sales_order_number
        ).join(
            Brand, Item.brand_id == Brand.id
        ).filter(
            ReturnItemData.return_order_number == identifier
        ).first()

        if return_order_result:
            return dict(return_order_result._mapping)

        # If not found, check if it matches a sales order number
        sales_order_result = db.query(
            Item.item_number,
            Item.item_description,
            Brand.brand_name,
            Item.category,
            Item.configuration,
            ReturnItemData.return_order_number,
            ReturnItemData.return_qty,
            ReturnItemData.return_condition,
            SaleItemData.serial_number,
            SaleItemData.original_sales_order_number
        ).join(
            SaleItemData, SaleItemData.item_id == Item.id
        ).join(
            ReturnItemData, SaleItemData.original_sales_order_number == ReturnItemData.original_sales_order_number
        ).join(
            Brand, Item.brand_id == Brand.id
        ).filter(
            SaleItemData.original_sales_order_number == identifier
        ).first()

        if sales_order_result:
            return dict(sales_order_result._mapping)

        # If still not found, check if it matches a serial number
        serial_number_result = db.query(
            Item.item_number,
            Item.item_description,
            Brand.brand_name,
            Item.category,
            Item.configuration,
            ReturnItemData.return_order_number,
            ReturnItemData.return_qty,
            ReturnItemData.return_condition,
            SaleItemData.serial_number,
            SaleItemData.original_sales_order_number
        ).join(
            SaleItemData, SaleItemData.item_id == Item.id
        ).join(
            ReturnItemData, SaleItemData.original_sales_order_number == ReturnItemData.original_sales_order_number
        ).join(
            Brand, Item.brand_id == Brand.id
        ).filter(
            SaleItemData.serial_number == identifier
        ).first()

        if serial_number_result:
            return dict(serial_number_result._mapping)

        # If nothing found, return 404
        raise HTTPException(status_code=404, detail="Item not found for the given identifier (checked return order, sales order, and serial number).")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving item details: {str(e)}")




@app.post("/api/register")
async def register(request: AuditlyUserRequest, db: Session = Depends(get_db)):   
    """
    API to register new user and return user ID.
    """ 
    try:  
        auditly_user_name = request.user_name
        first_name = request.first_name
        last_name = request.last_name
        gender = request.gender
        email = request.email
        password = request.password
        user_company = request.user_company


        # Check if the username already exists
        existing_user = db.query(AuditlyUser).filter(AuditlyUser.auditly_user_name == auditly_user_name).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already exists. Please choose a different username.")

        hashed_password = hash_password_sha256(password)

        new_user = AuditlyUser(
            auditly_user_name = auditly_user_name,
            first_name = first_name,
            last_name = last_name,
            gender = gender,
            email = email,
            password = hashed_password,
            user_company = user_company

        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return {
            "message": "User Created successfully.",
            "data": {
                "User ID": new_user.auditly_user_id,
                "User Name": new_user.auditly_user_name
            }
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")


@app.post("/api/login")
async def login(request: LoginRequest, db: Session = Depends(get_db)):   
    """
    API for logging in with user id and passoword.
    """ 
    try:  
        auditly_user_name = request.user_name
        password = request.password

        user_data = db.query(AuditlyUser).filter(AuditlyUser.auditly_user_name == auditly_user_name).first()
        if not user_data or not verify_password_sha256(password, user_data.password):
                raise HTTPException(status_code=401, detail="Invalid credentials")

        else:
            otp_login = _gen_otp()
            user_data.reset_otp = otp_login
            user_data.reset_otp_expiration = datetime.now()+timedelta(seconds=600)
            db.commit()
            db.refresh(user_data)
            if ENV == "DEV":
                email_body = _login_email_body(otp_login)
                send_email("rahulgr20@gmail.com", "fxei hthz bulr slzh", user_data.email, "Your Auditly Login OTP", email_body.format(otp=str(otp_login)))

            elif ENV == "TEST":
                secret_data = get_secret("test/auditly/secrets")
                email_body = _login_email_body(otp_login)
                send_email(secret_data["from_email_address"], secret_data["from_email_password"], user_data.email, "Your Auditly Login OTP", email_body.format(otp=str(otp_login)))            
            return {
                "message": "OTP Sent Successfully to registerd email",
                "auditly_user_name": user_data.auditly_user_name,
             }
       
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing search: {str(e)}")


@app.post("/api/verify-login-otp")
async def verify_login_otp(request: VerifyLogin, db: Session = Depends(get_db)):
    """
    API for verifying OTP to login
    """ 
    auditly_user_name = request.user_name
    login_otp = request.login_otp

    user_data = db.query(AuditlyUser).filter(
        AuditlyUser.auditly_user_name == auditly_user_name,
        AuditlyUser.reset_otp == login_otp
    ).first()

    if user_data:
        user_data.last_login_time = datetime.now()
        db.commit()
        db.refresh(user_data)

        return {
            "message": "Login Successfull",
            "data": {
                "User ID": user_data.auditly_user_id,
                "User Name": user_data.auditly_user_name,
                "User Type": [
                    key for key, val in {
                        "reports_user": user_data.is_reports_user,
                        "admin": user_data.is_admin,
                        "inspection_user": user_data.is_inspection_user
                    }.items() if val
                ],
                "is_admin": user_data.is_admin,
                "is_agent": user_data.is_agent,
                "is_manager": user_data.is_manager,
                "is_inspection_user": user_data.is_inspection_user
            }
        }
    else:
        return {
            "message": "Invalid User Name or otp"
        }


@app.post("/api/logout")
async def login(request: LogoutRequest, db: Session = Depends(get_db)):   
    """
    API for logging out.
    """ 
    try:  
        auditly_user_name = request.user_name
        auditly_user_id = request.user_id

        user_data = db.query(AuditlyUser).filter(or_(AuditlyUser.auditly_user_name == auditly_user_name,AuditlyUser.auditly_user_id == auditly_user_id)).first()

        if user_data:
            user_data.last_logout_time = datetime.now()
            db.commit()
            db.refresh(user_data)
            return {
                "message": "Logout Successfull"
             }
        else:
            return {
                "message": "User does not exist"
             }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing search: {str(e)}")



def _gen_otp():
    otp = random.randint(100000, 999999)
    return otp



@app.post("/api/forget-password")
async def forget_password(request: ForgetPassword, db: Session = Depends(get_db)):   
    """
    API to send OTP to reset password.
    """ 
    try:  
        auditly_user_name = request.user_name
        auditly_user_id = request.user_id

        user_data = db.query(AuditlyUser).filter(or_(AuditlyUser.auditly_user_name == auditly_user_name, AuditlyUser.auditly_user_id == auditly_user_id)).first()

        if user_data:
            otp = _gen_otp()
            user_data.reset_otp = otp
            user_data.reset_otp_expiration = datetime.now() + timedelta(seconds=600)
            db.commit()
            db.refresh(user_data)

            if ENV == "DEV":
                email_body = _forget_password_email_body(otp)
                send_email("rahulgr20@gmail.com", "fxei hthz bulr slzh", user_data.email, "Reset Your Auditly Password", email_body.format(otp=str(otp)))

            elif ENV == "TEST":
                secret_data = get_secret("test/auditly/secrets")
                email_body = _forget_password_email_body(otp)
                send_email(secret_data["from_email_address"], secret_data["from_email_password"], user_data.email, "Reset Your Auditly Password", email_body.format(otp=str(otp)))            
            
            return {
                "message": "OTP Sent Successfully to registered email",
                "auditly_user_name": user_data.auditly_user_name,
             }
        else:
            return {
                "message": "User does not exist"
             }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

@app.post("/api/reset-password")
async def reset_password(request: ResettPassword, db: Session = Depends(get_db)):   
    """
    API to send otp to reset password 
    """ 
    # try:  
    auditly_user_name = request.user_name
    email = request.email
    reset_opt = request.otp
    new_password = request.password

    hashed_password = hash_password_sha256(new_password)
    user_data = db.query(AuditlyUser).filter(AuditlyUser.auditly_user_name == auditly_user_name,AuditlyUser.email == email,AuditlyUser.reset_otp == reset_opt).first()
    if user_data and user_data.reset_otp_expiration > datetime.now():
        user_data.password = hashed_password
        user_data.reset_otp_expiration = None   
        user_data.reset_otp = None
        db.commit()
        db.refresh(user_data)
        return {
            "message": "Password Reset Successfull"
            }
    else:
        return {
            "message": "User email not found or OTP expired"
            }
    # except Exception as e:
    #     raise HTTPException(status_code=500, detail=f"Error processing search: {str(e)}")







@app.post("/api/compare-images/")
async def compare_images(request: CompareImagesRequest, db: Session = Depends(get_db)):
    """
    Compare base and customer images and return similarity scores with highlighted differences in Base64.
    """
    customer_id = request.customer_id
    item_id = request.item_id

    base_data = db.query(BaseData).filter(BaseData.base_to_item_mapping == item_id).first()
    if not base_data:
        raise HTTPException(status_code=404, detail="Base images not found")

    customer_data = db.query(CustomerData).filter(CustomerData.sale_item_data_id == customer_id).first()
    if not customer_data:
        raise HTTPException(status_code=404, detail="Customer images not found")

    front_similarity = calculate_similarity(base_data.base_front_image, customer_data.customer_front_image)
    back_similarity = calculate_similarity(base_data.base_back_image, customer_data.customer_back_image)

    ssi_front = calculate_ssi(base_data.base_front_image, customer_data.customer_front_image)
    ssi_back = calculate_ssi(base_data.base_back_image, customer_data.customer_back_image)

    average_ssi = (ssi_front + ssi_back) / 2

    front_diff_image_path = highlight_differences(base_data.base_front_image, customer_data.customer_front_image, "front", str(customer_id)+str(item_id))
    back_diff_image_path = highlight_differences(base_data.base_back_image, customer_data.customer_back_image, "back", str(customer_id)+str(item_id))

    front_diff_image_base64 = encode_image_to_base64(front_diff_image_path)
    back_diff_image_base64 = encode_image_to_base64(back_diff_image_path)

    receipt_number = random.randint(100000000, 999999999)

    data = db.query(
        # CustomerItemCondition,
        # CustomerItemData,
        SaleItemData,
        ReturnItemData,
        Item,
        Brand
    # ).join(
        # SaleItemData, CustomerItemCondition.customer_item_condition_mapping_id == SaleItemData.id
    ).join(
        ReturnItemData, SaleItemData.original_sales_order_number == ReturnItemData.original_sales_order_number
    ).join(
        Item, SaleItemData.item_id == Item.id
    ).join(
        Brand, Item.brand_id == Brand.id
    ).filter(
        CustomerData.sale_item_data_id == customer_id
    ).first()

    # condition, sale_data, return_data, item, brand = data
    sale_data, return_data, item, brand = data


    sales_order_number = sale_data.original_sales_order_number
    account_number = sale_data.account_number
    account_name = sale_data.shipped_to_person
    serial_number = sale_data.serial_number
    return_order_number = return_data.return_order_number
    customer_email = sale_data.customer_email
    factory_seal = customer_data.factory_seal
    new_condition = customer_data.new_condition
    user_front_image = customer_data.customer_front_image
    user_back_image = customer_data.customer_back_image
    

    if factory_seal and new_condition:
        condition = "in good condition, making it resalable."
        print("Sent Email")

    else:
        condition = "NOT in good condition, hence cannot be resold."
        print("Sent Email")

    subject = """
     Customer Account - """+str(account_number)+"""; Serial Number - """+str(serial_number)+"""; Inspection Id - """+str(receipt_number)+"""
"""
    body = """
Hello,

The serial """+str(serial_number)+ """ returned by the customer """+str(account_name)+""" – """+str(account_number)+""" was inspected for returns and found to be """+condition+""" 

Below are the reference details:

Customer Name –  """+account_name+"""
Customer Account – """+str(account_number)+"""
Serial Number – """+str(serial_number)+"""
Sales Order number- """+str(sales_order_number)+"""
Return Order Number- """+str(return_order_number)+"""
Inspection Number - """+str(receipt_number)+"""

Returned Images are atached.

Thanks,
Audit team
"""
    print(customer_email)
    if ENV == "DEV": send_email("rahulgr20@gmail.com", "fxei hthz bulr slzh", customer_email, subject, body, [user_front_image, user_back_image])
    elif ENV == "TEST":
        secret_data = get_secret("test/auditly/secrets")
        send_email(secret_data["from_email_address"], secret_data["from_email_password"], customer_email, subject, body, [user_front_image, user_back_image])

    def classify_condition(front_score, back_score, ssi_score):
        average_score = (front_score + back_score) / 2
    # Assess if any of the individual scores suggest the item is damaged.
        if front_score < 0.40 or back_score < 0.40 or ssi_score < 0.5:
            return "Damaged"

    # Evaluate the average score against the specified thresholds.
        if average_score >= 0.8:
            return "New"
        elif average_score >= 0.6:
             return "Like-New"
        elif average_score >= 0.4:
             return "Used"
        else:
            return "Damaged"

    overall_condition = classify_condition(front_similarity, back_similarity, average_ssi)

    save_item_condition(front_similarity, back_similarity, ssi_front, ssi_back, average_ssi, overall_condition, db, customer_id, receipt_number, front_diff_image_path, back_diff_image_path)

    return {
        "front_similarity": float(front_similarity),
        "back_similarity": float(back_similarity),
        "ssi_front": float(ssi_front),
        "ssi_back": float(ssi_back),
        "average_ssi": float(average_ssi),
        "overall_condition": overall_condition,
        "front_diff_image_base64": front_diff_image_base64,
        "back_diff_image_base64": back_diff_image_base64,
        "receipt_number": receipt_number

    }


def save_item_condition(front_similarity, back_similarity, ssi_front, ssi_back, average_ssi, overall_condition, db, customer_id, receipt_number, front_diff_image_path, back_diff_image_path):
    new_item_condition = CustomerItemCondition(
        front_similarity=front_similarity,
        back_similarity=back_similarity,
        ssi_front=ssi_front,
        ssi_back=ssi_back,
        average_ssi=average_ssi,
        overall_condition=overall_condition,
        customer_item_condition_mapping_id=customer_id,
        ack_number=receipt_number,
        difference_front_image=front_diff_image_path,
        difference_back_image=back_diff_image_path
    )
    db.add(new_item_condition)
    db.commit()
    db.refresh(new_item_condition)

# Initialize feature extractor globally to avoid reloading it multiple times
feature_extractor = ResNet50(weights="imagenet", include_top=False, pooling="avg")
model = Model(inputs=feature_extractor.input, outputs=feature_extractor.output)

# Preprocessing function
def preprocess_image(image_path, target_size=(224, 224)):
    if not os.path.exists(image_path):
        raise HTTPException(status_code=404, detail=f"Image not found: {image_path}")
    image = load_img(image_path, target_size=target_size)
    image = img_to_array(image)
    image = np.expand_dims(image, axis=0)
    return preprocess_input(image)

# Cosine similarity
def calculate_similarity(image1_path, image2_path):
    img1 = preprocess_image(image1_path)
    img2 = preprocess_image(image2_path)

    features1 = model.predict(img1).flatten()
    features2 = model.predict(img2).flatten()

    features1 = features1 / np.linalg.norm(features1)
    features2 = features2 / np.linalg.norm(features2)

    return np.dot(features1, features2)

# Structural similarity
def calculate_ssi(image1_path, image2_path, target_size=(224, 224)):
    img1 = load_img(image1_path, target_size=target_size)
    img2 = load_img(image2_path, target_size=target_size)

    img1 = img_to_array(img1).astype("float32") / 255.0
    img2 = img_to_array(img2).astype("float32") / 255.0

    ssi_r = ssim(img1[..., 0], img2[..., 0], data_range=1.0)
    ssi_g = ssim(img1[..., 1], img2[..., 1], data_range=1.0)
    ssi_b = ssim(img1[..., 2], img2[..., 2], data_range=1.0)

    return (ssi_r + ssi_g + ssi_b) / 3

# Function to highlight differences
def highlight_differences(image1_path, image2_path, view, path, target_size=(224, 224)):
    img1 = cv2.resize(cv2.imread(image1_path), target_size)
    img2 = cv2.resize(cv2.imread(image2_path), target_size)

    gray_img1 = cv2.cvtColor(img1, cv2.COLOR_BGR2GRAY)
    gray_img2 = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY)

    score, diff = ssim(gray_img1, gray_img2, full=True)
    diff = (diff * 255).astype("uint8")

    thresh = cv2.threshold(diff, 0, 255, cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)[1]
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    for contour in contours:
        if cv2.contourArea(contour) > 40:  # filter small differences
            x, y, w, h = cv2.boundingRect(contour)
            cv2.rectangle(img2, (x, y), (x + w, y + h), (0, 0, 255), 2)

    if ENV == "TEST":output_dir = "/home/ec2-user/auditly/image_outputs/"+path  
    elif ENV == "DEV":output_dir = "/Users/rahul/Desktop/Auditly Git copy/Auditly1/api/finalImages/"+path

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    output_path = os.path.join(output_dir, f"{view}_differences.png")
    cv2.imwrite(output_path, img2)

    return output_path

# Function to encode image to Base64
def encode_image_to_base64(image_path):
    with open(image_path, "rb") as img_file:
        return base64.b64encode(img_file.read()).decode('utf-8')



@app.get("/api/base-images/mapping/{base_to_item_mapping}")
async def get_base_images_by_mapping(base_to_item_mapping: int, db: Session = Depends(get_db)):
    base_data_records = db.query(BaseData).filter(BaseData.base_to_item_mapping == base_to_item_mapping).all()

    if not base_data_records:
        raise HTTPException(status_code=404, detail="Base images not found for the given mapping")

    def encode_image(image_path):
        try:
            with open(image_path, "rb") as image_file:
                return base64.b64encode(image_file.read()).decode("utf-8")
        except FileNotFoundError:
            return None  # Return None if the file doesn't exist

    return [
        {
            "front_image_base64": encode_image(base_data.base_front_image),
            "back_image_base64": encode_image(base_data.base_back_image),
        }
        for base_data in base_data_records
    ]
    
@app.put("/api/update-profile")
async def update_profile(request: UpdateProfileRequest, db: Session = Depends(get_db)):
    """
    API to update user profile details.
    """
    try:
        auditly_user_name = request.user_name

        user_data = db.query(AuditlyUser).filter(AuditlyUser.auditly_user_name == auditly_user_name).first()

        if not user_data:
            raise HTTPException(status_code=404, detail="User not found")

        # Update the fields if they are provided in the request
        if request.first_name is not None:
            user_data.first_name = request.first_name
        if request.last_name is not None:
            user_data.last_name = request.last_name
        if request.gender is not None:
            user_data.gender = request.gender
        if request.email is not None:
            user_data.email = request.email


        db.commit()
        db.refresh(user_data)

        return {
            "message": "Profile updated successfully",
            "data": {
                "User ID": user_data.auditly_user_id,
                "User Name": user_data.auditly_user_name,
                "First Name": user_data.first_name,
                "Last Name": user_data.last_name,
                "Gender": user_data.gender,
                "Email": user_data.email
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating profile: {str(e)}")


@app.get("/api/sales-data")
async def get_sales_data(db: Session = Depends(get_db)):
    try:
        sales_data = db.query(SalesData).all()
        return {
            "message": "Data retrieved successfully.",
            "data": [
                {
                    "SalesOrder": data.SalesOrder,
                    "CustomerAccount": data.CustomerAccount,
                    "Name": data.Name,
                    "ReturnReasonCode": data.ReturnReasonCode,
                    "ReturnStatus": data.ReturnStatus,
                    "RMANumber": data.RMANumber,
                    "InvoiceAccount": data.InvoiceAccount,
                    "OrderType": data.OrderType,
                    "CustomerRequisition": data.CustomerRequisition,
                    "Status": data.Status,
                    "ProjectID": data.ProjectID,
                    "DoNotProcess": data.DoNotProcess,
                    "Legacy": data.Legacy,
                    "Segment": data.Segment,
                    "Subsegment": data.Subsegment
                } for data in sales_data
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving sales data: {str(e)}")


@app.get("/api/return-data")
def get_full_return_data(db: Session = Depends(get_db)):
    results = db.query(
        ReturnItemData.return_order_number.label("rma_number"),
        SaleItemData.account_number,
        SaleItemData.shipped_to_person.label("customer_name"),
        Item.item_description,
        Item.configuration,
        SaleItemData.original_sales_order_number.label("sales_order"),
        SaleItemData.original_sales_order_line.label("line"),
        SaleItemData.serial_number,
        ReturnItemData.date_purchased.label("purchased"),
        ReturnItemData.date_shipped.label("shipped"),
        ReturnItemData.date_delivered.label("delivered"),
        ReturnItemData.return_received_date.label("return_date")
    ).join(
        SaleItemData, ReturnItemData.original_sales_order_number == SaleItemData.original_sales_order_number
    ).join(
        Item, SaleItemData.item_id == Item.id
    ).all()

    return [dict(row._mapping) for row in results]



@app.get("/api/users")
def get_users(db: Session = Depends(get_db)):
    try:
        users_with_roles = (
            db.query(
                AuditlyUser,
                Agent.agent_id,
                AgentManager.manager_id,
                AgentManager.approved_by_auditly_user_id
            )
            .outerjoin(Agent, Agent.agent_to_user_mapping_id == AuditlyUser.auditly_user_id)
            .outerjoin(AgentManager, AgentManager.manager_user_mapping_id == AuditlyUser.auditly_user_id)
            .all()
        )

        result = []
        for user, agent_id, manager_id, approved_by in users_with_roles:
            is_manager = approved_by is not None  

            result.append({
                "user_id": user.auditly_user_id,
                "user_name": user.auditly_user_name,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "gender": user.gender,
                "email": user.email,
                "is_reports_user": user.is_reports_user,
                "is_admin": user.is_admin,
                "is_inspection_user": user.is_inspection_user,
                "is_manager": is_manager,
                "is_agent": user.is_agent,
                "user_company": user.user_company,
                "agent_id": agent_id,
                "manager_id": manager_id
            })

        return {
            "message": "Users retrieved successfully.",
            "data": result
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving users: {str(e)}")
    
@app.get("/api/users/access-status/{user_id}")
def get_user_access_status(user_id: int, db: Session = Depends(get_db)):
    try:
        # Fetch agent info
        agent = db.query(Agent).filter(Agent.agent_to_user_mapping_id == user_id).first()
        is_agent = agent is not None and agent.approved_by_auditly_user_id is not None
        pending_agent = agent is not None and agent.approved_by_auditly_user_id is None

        # Fetch manager info
        manager = db.query(AgentManager).filter(AgentManager.manager_user_mapping_id == user_id).first()
        is_manager = manager is not None and manager.approved_by_auditly_user_id is not None
        pending_manager = manager is not None and manager.approved_by_auditly_user_id is None

        return {
            "message": "Access status retrieved successfully.",
            "data": {
                "user_id": user_id,
                "is_agent": is_agent,
                "pending_agent": pending_agent,
                "agent_id": agent.agent_id if agent else None,
                "is_manager": is_manager,
                "pending_manager": pending_manager,
                "manager_id": manager.manager_id if manager else None,
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving access status: {str(e)}")


@app.post("/api/onboard")
async def onboard(request: Onboard, db: Session = Depends(get_db)):   
    """
    API to onboard a third party to use the API
    """
    try:  
        onboard_name = request.onboard_name
        onboard_email = request.onboard_email

        # Check if the user already exists
        existing_user = db.query(OnboardUser).filter(OnboardUser.onboard_name == onboard_name, OnboardUser.onboard_email == onboard_email).first()
        if existing_user:
            return {
                "message": "User already onboarded.",
                "data": {
                    "Customer User Id": existing_user.customer_user_id,
                    "Customer Token": existing_user.token
                }
            }

        # Generate new customer ID and token
        customer_user_id = f'CUST{_gen_otp()}'
        token = f'{_gen_otp()}{_gen_otp()}{customer_user_id}{_gen_otp()}'

        new_user = OnboardUser(
            onboard_name = onboard_name,
            onboard_email = onboard_email,
            token = token,
            customer_user_id = customer_user_id,
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        subject = "Onboarding Details: Auditly"
        
        body = f"""
Hello {onboard_name},

You are now Onboarded!

Below are the details:

Customer User ID - {new_user.customer_user_id}
Authorization Token – {token}

Thanks,
Audit team
"""
        if ENV == "DEV":
            send_email("rahulgr20@gmail.com", "fxei hthz bulr slzh", onboard_email, subject, body)
        elif ENV == "TEST":
            secret_data = get_secret("test/auditly/secrets")
            send_email(secret_data["from_email_address"], secret_data["from_email_password"], onboard_email, subject, body)

        return {
            "message": "Onboarded Successfully.",
            "data": {
                "Customer User Id": new_user.customer_user_id,
                "Customer Token": new_user.token
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

   
@app.post("/api/update-user-type")
async def update_user_type(request: UpdateUserTypeRequest, db: Session = Depends(get_db)):
    """
    API to allow an admin to change roles for other users.
    Only a user with is_admin=True can modify user roles.
    A user cannot modify their own roles.
    """

    # Fetch the user making the change
    modifier_user = db.query(AuditlyUser).filter(AuditlyUser.auditly_user_id == request.modifier_user_id).first()
    if not modifier_user:
        raise HTTPException(status_code=404, detail="Modifier user not found.")

    # Check if the user is trying to modify their own roles
    if request.modifier_user_id == request.target_user_id:
        raise HTTPException(status_code=403, detail="Permission Denied. You cannot modify your own roles.")

    # Ensure only admins can modify roles
    if not modifier_user.is_admin:
        raise HTTPException(status_code=403, detail="Permission Denied. Only admins can update user roles.")

    # Fetch the target user
    target_user = db.query(AuditlyUser).filter(AuditlyUser.auditly_user_id == request.target_user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="Target user not found.")

    # Update user roles
    target_user.is_reports_user = request.is_reports_user
    target_user.is_admin = request.is_admin
    target_user.is_inspection_user = request.is_inspection_user

    db.commit()
    db.refresh(target_user)

    return {
        "message": "User type updated successfully!",
        "updated_user": {
            "User ID": target_user.auditly_user_id,
            "is_inspection_user": target_user.is_inspection_user,
            "is_admin": target_user.is_admin,
            "is_reports_user": target_user.is_reports_user
        }
    }


if ENV == "DEV":
    static_dir = "/Users/rahul/Desktop/auditly/auditly/static"  # Local development path
else:
    static_dir = "/home/ec2-user/auditly/static"  # Cloud deployment path

    # Ensure the directory exists
if not os.path.exists(static_dir):
    os.makedirs(static_dir, exist_ok=True)

# Mount the static directory
app.mount("/static", StaticFiles(directory=static_dir), name="static")




@app.get("/api/images/search")
async def get_images_by_item_number_or_description(
    item_number: Optional[int] = None,
    item_description: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Retrieve base front and back images using either the item number or item description.

    Args:
        item_number (int, optional): The item number to fetch images for.
        item_description (str, optional): The item description to search for.
        db (Session): The database session dependency.

    Returns:
        dict: Contains the item details and relative image paths.
    """
    if not item_number and not item_description:
        raise HTTPException(
            status_code=400,
            detail="Either item_number or item_description must be provided"
        )

    # Start building the query
    query = db.query(Item)
    
    if item_number:
        query = query.filter(Item.item_number == item_number)
    if item_description:
        query = query.filter(Item.item_description.contains(item_description))
    
    item = query.first()
    
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    # Fetch the base image data using the item's ID
    base_data = db.query(BaseData).filter(BaseData.base_to_item_mapping == item.id).first()

    if not base_data:
        raise HTTPException(status_code=404, detail="Base images not found for this item")

    # Return relative paths for the images
    return {
        "item_id": item.id,
        "item_number": item.item_number,
        "item_description": item.item_description,
        "brand_id": item.brand_id,
        "category": item.category,
        "configuration": item.configuration,
        "front_image_path": f"/static/base_images/{os.path.basename(base_data.base_front_image)}",
        "back_image_path": f"/static/base_images/{os.path.basename(base_data.base_back_image)}",
    }



@app.post("/api/get-inspection-data")
async def get_receipt_data(request: ReceiptSearch, db: Session = Depends(get_db)):
    # If no receipt number provided, return all
    if request.receipt_number is None:
        data = db.query(
            CustomerItemCondition,
            SaleItemData,
            ReturnItemData,
            Item,
            Brand,
            BaseData
        ).join(
            SaleItemData, CustomerItemCondition.customer_item_condition_mapping_id == SaleItemData.id
        ).join(
            Item, SaleItemData.item_id == Item.id
        ).join(
            Brand, Item.brand_id == Brand.id
        ).outerjoin(
            BaseData, BaseData.base_to_item_mapping == Item.id
        ).outerjoin(
            ReturnItemData, SaleItemData.original_sales_order_number == ReturnItemData.original_sales_order_number
        ).all()
    else:
        # Filter by receipt number
        data = db.query(
            CustomerItemCondition,
            SaleItemData,
            ReturnItemData,
            Item,
            Brand,
            BaseData
        ).join(
            SaleItemData, CustomerItemCondition.customer_item_condition_mapping_id == SaleItemData.id
        ).join(
            Item, SaleItemData.item_id == Item.id
        ).join(
            Brand, Item.brand_id == Brand.id
        ).outerjoin(
            BaseData, BaseData.base_to_item_mapping == Item.id
        ).outerjoin(
            ReturnItemData, SaleItemData.original_sales_order_number == ReturnItemData.original_sales_order_number
        ).filter(
            CustomerItemCondition.ack_number == request.receipt_number
        ).first()
        
        data = [data] if data else []

    if not data:
        raise HTTPException(status_code=404, detail="Data not found based on receipt number")

    receipt_data_list = []
    for condition, sale_data, return_data, item, brand, base_data in data:
        front_diff_url = f"/api/difference-images/{condition.id}/front" if condition.difference_front_image else None
        back_diff_url = f"/api/difference-images/{condition.id}/back" if condition.difference_back_image else None

        receipt_data = {
            "receipt_number": condition.ack_number,
            "overall_condition": condition.overall_condition,
            "item_description": item.item_description,
            "brand_name": brand.brand_name,
            "original_sales_order_number": sale_data.original_sales_order_number,
            "return_order_number": return_data.return_order_number if return_data else None,
            "return_qty": return_data.return_qty if return_data else None,
            "shipping_info": {
                "shipped_to_person": sale_data.shipped_to_person,
                "address": sale_data.shipped_to_street,
                "city": sale_data.shipped_to_city,
                "state": sale_data.shipped_to_state,
                "country": sale_data.shipped_to_country
            },
            "images": {
                "difference_images": {
                    "front": front_diff_url,
                    "back": back_diff_url
                },
                "similarity_scores": {
                    "front": condition.front_similarity,
                    "back": condition.back_similarity,
                    "average": condition.average_ssi
                }
            }
        }

        if base_data:
            receipt_data["images"]["base_images"] = {
                "front": f"/api/base-images/{base_data.id}/front",
                "back": f"/api/base-images/{base_data.id}/back"
            }

        receipt_data_list.append(receipt_data)

    return receipt_data_list


@app.get("/api/difference-images/{condition_id}/{image_type}")
async def get_difference_image(condition_id: int, image_type: str, db: Session = Depends(get_db)):
    condition = db.query(CustomerItemCondition).filter(CustomerItemCondition.id == condition_id).first()
    if not condition:
        raise HTTPException(status_code=404, detail="Condition not found")
    
    image_path = condition.difference_front_image if image_type == "front" else condition.difference_back_image
    if not image_path:
        raise HTTPException(status_code=404, detail="Image not found")
    
    # Security check
    if not os.path.exists(image_path):
        raise HTTPException(status_code=404, detail="Image file not found")
    
    return FileResponse(image_path)

@app.get("/api/base-images/{base_data_id}/{image_type}")
async def get_base_image(base_data_id: int, image_type: str, db: Session = Depends(get_db)):
    base_data = db.query(BaseData).filter(BaseData.id == base_data_id).first()
    if not base_data:
        raise HTTPException(status_code=404, detail="Base data not found")
    
    image_path = base_data.base_front_image if image_type == "front" else base_data.base_back_image
    if not image_path:
        raise HTTPException(status_code=404, detail="Image not found")
    
    # Security check
    if not os.path.exists(image_path):
        raise HTTPException(status_code=404, detail="Image file not found")
    
    return FileResponse(image_path)


@app.get("/api/powerbi/auth_login")
async def powerbi_auth_login(request: Request):
    # Convert URL object to string explicitly
    redirect_uri = str(request.url_for("powerbi_callback"))
    
    print("\n=== AUTH_LOGIN START ===")
    print(f"Initial session keys: {list(request.session.keys())}")
    print(f"Redirect URI: {redirect_uri} (type: {type(redirect_uri)})")

    # Generate state
    state = str(int(time.time()))
    request.session["oauth_state"] = state
    
    mapping_id = request.query_params.get("mapping_id")
    if not mapping_id:
        raise HTTPException(status_code=400, detail="Missing 'mapping_id' in query parameters")
    
    request.session["power_bi_user_mapping_id"] = mapping_id
    print(f"Stored mapping_id in session: {mapping_id}")
    
    connection_type = request.query_params.get("connection_type")
    if not connection_type:
        raise HTTPException(status_code=400, detail="Missing 'connection_type' in query parameters")
    
    request.session["connection_type"] = connection_type
    print(f"Stored connection_type in session: {connection_type}")

    try:
        # Use authorize_redirect instead of create_authorization_url
        return await oauth.microsoft.authorize_redirect(
            request,
            redirect_uri,
            state=state,
            prompt="select_account"
        )
    except Exception as e:
        print("\n!!! AUTH INITIATION FAILURE !!!")
        print(f"Error type: {type(e)}")
        print(f"Error details: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=400,
            detail="Authentication initiation failed. Please check server logs."
        )


@app.get("/api/powerbi/callback")
async def powerbi_callback(request: Request, db: Session = Depends(get_db)):
    print("\n=== POWERBI CALLBACK STARTED ===")
    
    try:
        # Debug incoming request
        print(f"Query params: {dict(request.query_params)}")
        
        # Verify state parameter
        expected_state = request.session.pop("oauth_state", None)
        received_state = request.query_params.get("state")
        if not expected_state or expected_state != received_state:
            raise OAuthError("Invalid state parameter")

        # Retrieve mapping ID from session
        mapping_id = request.session.pop("power_bi_user_mapping_id", None)
        if not mapping_id:
            raise HTTPException(status_code=400, detail="Session missing 'mapping_id'")
        
        print(f"Retrieved mapping_id from session: {mapping_id}")

        connection_type = request.session.pop("connection_type", None)
        if not connection_type:
            raise HTTPException(status_code=400, detail="connection_type missing 'connection_type'")
        
        print(f"Retrieved connection_type from session: {connection_type}")

        # Exchange auth code for token
        token = await oauth.microsoft.authorize_access_token(request)
        print("Token received successfully")

        # Decode claims
        id_token = token.get('id_token')
        if not id_token:
            raise OAuthError("Missing ID token")

        claims = jwt.decode(id_token, options={"verify_signature": False})
        print(f"User claims: {claims}")

        user_data = {
            'id': claims.get('oid') or claims.get('sub'),
            'email': claims.get('email') or claims.get('preferred_username'),
            'name': claims.get('name', ''),
            'tenant_id': claims.get('tid'),
            'claims': claims
        }

        # Token expiry
        expires_in = token.get("expires_in", 3600)
        token_expiry = datetime.now(timezone.utc) + timedelta(seconds=expires_in)

        # Check if user already exists
        existing_user = db.query(PowerBiUser).filter(
            PowerBiUser.power_bi_user_id == user_data['id']
        ).first()

        if existing_user:
            print("Updating existing Power BI user...")
            existing_user.access_token = token['access_token']
            if 'refresh_token' in token:
                existing_user.refresh_token = token['refresh_token']
            existing_user.token_expiry = token_expiry
            existing_user.power_bi_response = user_data['claims']

            # ✅ ADD THIS LINE TO UPDATE THE MAPPING ID
            existing_user.power_bi_user_mapping_id = mapping_id
            existing_user.connection_type = connection_type

        else:
            print("Creating new Power BI user...")
            powerbi_user = PowerBiUser(
                power_bi_email=user_data['email'],
                power_bi_username=user_data['name'],
                power_bi_user_id=user_data['id'],
                power_bi_response=user_data['claims'],
                access_token=token['access_token'],
                refresh_token=token.get('refresh_token', ''),
                token_expiry=token_expiry,
                # existing_user=existing_user,
                tenant_id=user_data['tenant_id'],
                created_at=datetime.now(timezone.utc),
                connection_type=connection_type,
                power_bi_user_mapping_id=mapping_id  # ✅ Save mapping ID for new user
                
            )
            db.add(powerbi_user)

        db.commit()
        print("User saved successfully")

        # Store session info
        request.session.update({
            "powerbi_user_id": user_data['id'],
            "powerbi_user_email": user_data['email']
        })

        return RedirectResponse(url="https://auditlyai.com/auth/success")
        
    except OAuthError as e:
        db.rollback()
        print(f"OAuth error: {str(e)}")
        return RedirectResponse(url=f"https://auditlyai.com/auth/success/error?message={str(e)}")
        
    except Exception as e:
        db.rollback()
        print(f"Unexpected error: {traceback.format_exc()}")
        return RedirectResponse(url="https://auditlyai.com/auth/success/error?message=auth_failed")

@app.get("/api/team-emails/")
def get_team_emails(db: Session = Depends(get_db)):
    team_emails = db.query(TeamEmail.id, TeamEmail.team_name, TeamEmail.email, TeamEmail.description).all()
    return [{"id": id, "team_name": team_name, "email": email, "description": description} for id, team_name, email, description in team_emails]

class TeamEmailUpdateRequest(BaseModel):
    email: Optional[EmailStr] = None
    description: Optional[str] = None
    team_name: Optional[str] = None
    
@app.put("/api/team-emails/{team_id}")
def update_team_email(team_id: int, update_request: TeamEmailUpdateRequest, db: Session = Depends(get_db)):
    team_email = db.query(TeamEmail).filter(TeamEmail.id == team_id).first()
    if not team_email:
        raise HTTPException(status_code=404, detail="Team email not found")

    if update_request.email is not None:
        team_email.email = update_request.email
    if update_request.description is not None:
        team_email.description = update_request.description
    if update_request.team_name is not None:
        team_email.team_name = update_request.team_name

    db.commit()
    return team_email


class GetPowerBITableColumns(BaseModel):
    workspace_id: str
    dataset_id: str
    power_bi_table_name: str
    power_bi_id: int
    auditly_user_id: int
    

@app.post("/api/powerbi/get-powerbi-table-columns")
async def get_powerbi_table_column(request: GetPowerBITableColumns, db: Session = Depends(get_db)):
    workspace_id = request.workspace_id
    dataset_id = request.dataset_id
    power_bi_table_name = request.power_bi_table_name

    ACCESS_TOKEN = db.query(PowerBiUser).filter(PowerBiUser.power_bi_id == request.power_bi_id).filter(PowerBiUser.power_bi_user_mapping_id == request.auditly_user_id).first().access_token

    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }

    url = f"https://api.powerbi.com/v1.0/myorg/groups/{workspace_id}/datasets/{dataset_id}/executeQueries"
    dax_query = {
        "queries": [{"query": f"EVALUATE '{power_bi_table_name}'"}],  # Ensure table name is quoted
        "serializerSettings": {"includeNulls": True}
    }

    response = requests.post(url, headers=headers, json=dax_query)
    if response.status_code != 200:
        # Log response for debugging
        print("Failed to fetch data:", response.text)
        raise HTTPException(status_code=response.status_code, detail="API call failed")

    try:
        data = response.json()
        response_table = data["results"][0]["tables"][0]["rows"]
        bi_response_mapping = response_table.pop(0)
        return bi_response_mapping
    except KeyError as e:
        # Log this exception along with the response data to debug
        print("KeyError - Expected key not found:", e)
        print("API Response:", response.text)
        raise HTTPException(status_code=500, detail=f"Key {e} not found in response")

    except IndexError as e:
        # Handle cases where the lists are empty
        print("IndexError - Data not found:", e)
        raise HTTPException(status_code=404, detail="Data not found in API response")




@app.get("/api/tables")
async def get_all_tables(db: Session = Depends(get_db)):
    """
    Retrieve all table names in the database.
    """
    try:
        inspector = inspect(db.bind)
        tables = inspector.get_table_names()
        return {"tables": tables}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving tables: {str(e)}")
    
@app.get("/api/columns/{table_name}")
async def get_columns(table_name: str, exclude_auto_increment: bool = True, db: Session = Depends(get_db)):
    """
    Retrieve all column names for a given table, excluding auto-increment columns.

    Args:
        table_name (str): The name of the table to fetch columns for.
        exclude_auto_increment (bool): If True, exclude auto-increment columns.

    Returns:
        dict: Contains the column names of the selected table.
    """
    try:
        inspector = inspect(db.bind)
        
        if table_name not in inspector.get_table_names():
            raise HTTPException(status_code=404, detail="Table not found")

        # Get all columns
        columns = inspector.get_columns(table_name)

        # Query INFORMATION_SCHEMA to identify auto-increment columns
        auto_increment_columns = set()
        result = db.execute(text(f"""
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = :table_name 
            AND EXTRA LIKE '%auto_increment%'
        """), {"table_name": table_name})

        for row in result:
            auto_increment_columns.add(row[0])

        # Filter columns
        filtered_columns = [
            col["name"] for col in columns 
            if not (exclude_auto_increment and col["name"] in auto_increment_columns)
        ]

        return {
            "table_name": table_name,
            "columns": filtered_columns
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving columns: {str(e)}")



class PowerBiSqlMappingBase(BaseModel):
    sql_table_name: str
    bi_table_name: str
    date_filter_column_name: str
    mapping: Optional[dict] = None
    user_id: int
    date_filter_value: str
    bi_user_id: int

@app.post("/api/power-bi-sql-mapping/")
async def powerbi_sql_mapping(request: PowerBiSqlMappingBase, db: Session = Depends(get_db)):
    """
    Create or update a mapping based on mapping_name. If the mapping_name already exists, update the existing record,
    otherwise create a new mapping record.
    """
    mapping_name = f"{request.user_id}-{request.bi_table_name}-{request.sql_table_name}-{request.bi_user_id}"

    # Check if the mapping already exists
    existing_mapping = db.query(PowerBiSqlMapping).filter_by(mapping_name=mapping_name).first()
    
    if existing_mapping:
        # Update existing mapping
        existing_mapping.mapping = request.mapping
        existing_mapping.sql_table_name = request.sql_table_name
        existing_mapping.bi_table_name = request.bi_table_name
        existing_mapping.date_filter_column_name = request.date_filter_column_name
        existing_mapping.date_filter_value = datetime.strptime(request.date_filter_value, "%m-%d-%Y")
        db.commit()
        message = "Mapping updated successfully."
    else:
        # Create a new mapping
        new_mapping_data = PowerBiSqlMapping(
            mapping=request.mapping,
            power_bi_sql_user_mapping_id=request.user_id,
            sql_table_name=request.sql_table_name,
            bi_table_name=request.bi_table_name,
            mapping_name=mapping_name,
            date_filter_column_name=request.date_filter_column_name,
            date_filter_value = datetime.strptime(request.date_filter_value, "%m-%d-%Y"),
            bi_user_mapping_id = request.bi_user_id
        )
        db.add(new_mapping_data)
        db.commit()
        db.refresh(new_mapping_data)
        message = "Mapping created successfully."

    return {
        "message": message,
        "data": {
            "mapping_name": mapping_name
        }
    }

# fixthiss
class GetPowerBiDatasets(BaseModel):
    power_bi_id: str
    auditly_user_id: str  
    workspace_id: str
    
@app.post("/api/get-powerbi-dataset-ids")
async def get_dataset_ids(request:GetPowerBiDatasets, db: Session = Depends(get_db)):
    """
    Fetch all dataset IDs in the specified Power BI workspace.
    """
    ACCESS_TOKEN = db.query(PowerBiUser).filter(PowerBiUser.power_bi_id == request.power_bi_id).filter(PowerBiUser.power_bi_user_mapping_id == request.auditly_user_id).first().access_token

    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }
    
    url = f"https://api.powerbi.com/v1.0/myorg/groups/{request.workspace_id}/datasets"
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # This will raise an exception for HTTP error codes
        datasets = response.json().get('value', [])
        dataset_ids = [dataset['id'] for dataset in datasets]  # Extract only the IDs
        return {"dataset_ids": dataset_ids}
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))



class GetWorksapceData(BaseModel):
    power_bi_id: str
    auditly_user_id: str    
    workspace_id: str

@app.post("/api/powerbi/workspace-data")
async def get_powerbi_workspace_data(request: GetWorksapceData,db: Session = Depends(get_db)):
    """
    Fetch all datasets and their tables from a Power BI workspace.
    """
    ACCESS_TOKEN = db.query(PowerBiUser).filter(PowerBiUser.power_bi_id == request.power_bi_id).filter(PowerBiUser.power_bi_user_mapping_id == request.auditly_user_id).first().access_token
   
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }

    # Step 1: Get all datasets in the workspace
    datasets_url = f"https://api.powerbi.com/v1.0/myorg/groups/{request.workspace_id}/datasets"
    try:
        datasets_response = requests.get(datasets_url, headers=headers)
        datasets_response.raise_for_status()
        datasets_data = datasets_response.json().get("value", [])
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error fetching datasets: {str(e)}")

    # Step 2: Get tables for each dataset
    all_data = []
    for dataset in datasets_data:
        dataset_id = dataset["id"]
        dataset_name = dataset["name"]

        tables_url = f"https://api.powerbi.com/v1.0/myorg/groups/{request.workspace_id}/datasets/{dataset_id}/tables"
        try:
            tables_response = requests.get(tables_url, headers=headers)
            tables_response.raise_for_status()
            tables_data = tables_response.json().get("value", [])
        except requests.exceptions.RequestException:
            tables_data = []  # If tables API fails, return an empty list

        # Step 3: Organize Data
        dataset_info = {
            "dataset_id": dataset_id,
            "dataset_name": dataset_name,
            "tables": [{"table_name": table["name"]} for table in tables_data]
        }
        all_data.append(dataset_info)

    return {"workspace_id": request.workspace_id, "datasets": all_data}

class GetPowerBITableData(BaseModel):
    workspace_id: str
    dataset_id: str
    sql_table_name: str
    user_id: int
    power_bi_table_name: str
    access_token: Optional[str] = None
    bi_user_id: int


@app.post("/api/powerbi/get-table-data")
async def get_powerbi_table_data(request: GetPowerBITableData, db: Session = Depends(get_db)):
    """
    Fetch table data from Power BI Dataset
    """
    sql_table_name = request.sql_table_name
    user_id = request.user_id
    workspace_id = request.workspace_id
    dataset_id = request.dataset_id
    power_bi_table_name = request.power_bi_table_name
    bi_user_id = request.bi_user_id

    power_bi_table_data = db.query(PowerBiSqlMapping).filter(PowerBiSqlMapping.sql_table_name == sql_table_name).filter(PowerBiSqlMapping.power_bi_sql_user_mapping_id == user_id ).filter(PowerBiSqlMapping.bi_user_mapping_id == bi_user_id).first()
    power_bi_user_mapping = power_bi_table_data.mapping
    ACCESS_TOKEN = db.query(PowerBiUser).filter(PowerBiUser.power_bi_id == bi_user_id).filter(PowerBiUser.power_bi_user_mapping_id == user_id).first().access_token
     
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }

    url = f"https://api.powerbi.com/v1.0/myorg/groups/{workspace_id}/datasets/{dataset_id}/executeQueries"


    dax_query = {
        "queries": [{"query": f"EVALUATE '{power_bi_table_name}'"}], #name of the table in powerbi we are getting it as an input
        "serializerSettings": {"includeNulls": True}
    }

    response = requests.post(url, headers=headers, json=dax_query)
    response_table = response.json()["results"][0]["tables"][0]["rows"]
    bi_response_mapping = response_table.pop(0)
    availabe_column_name = [k for k,v in power_bi_user_mapping.items()] #columns which user has saved in the frotned from powerbi
    mapping_dict = {}
    for key, value in bi_response_mapping.items():
        if value not in availabe_column_name and value != "id" and value != power_bi_table_data.date_filter_column_name:
            # notification = db.query(NotificationTable).filter(NotificationTable.auditly_user_id == user_id).first()
            # # Update the read_at field
            # if notification:
            #     notification.notification_message = f"Mapping missmatched while syncing at: {power_bi_table_name}"
            # else:
            notification_new = NotificationTable(
                auditly_user_id = user_id,
                notification_message = f"Mapping missmatched while syncing at: {power_bi_table_name}",        
            )
            db.add(notification_new)   
            db.commit()
            return {"data": "Mapping Missmatch"}
        elif value == power_bi_table_data.date_filter_column_name:
            filter_column = key
        elif value in availabe_column_name:
            mapping_dict.update({key:power_bi_user_mapping[value]})
    table = Table(sql_table_name, metadata, autoload_with=engine)
    transformed_data = []
    for record in response_table:
        filter_check = None
        formatted_entry = {}
        for key, value in record.items():
            if key == filter_column and datetime.strptime(value, "%m-%d-%Y") < power_bi_table_data.date_filter_value:
                filter_check = True
                continue
            if key in [k for k,v in mapping_dict.items()]:
                formatted_entry[mapping_dict[key]] = value
        if(not filter_check):
            transformed_data.append(formatted_entry)
    db.execute(table.insert(), transformed_data)
    db.commit()
    return response.json()




class CronJobCreate(BaseModel):
    cron_to_mapping_name: str
    cron_expression: str
    auditly_user_id: int
    bi_user_mapping_id: int

@app.post("/add-cronjobs")
async def create_or_update_cron_job(cron_job_data: CronJobCreate, db: Session = Depends(get_db)):
    """
    Create a new cron job or update an existing one in the database.
    """
    # Check if there is already a cron job for the given user ID and mapping name
    existing_cron_job = db.query(CronJobTable).filter(
        CronJobTable.auditly_user_id == cron_job_data.auditly_user_id,
        CronJobTable.cron_to_mapping_name == cron_job_data.cron_to_mapping_name,
        CronJobTable.bi_user_mapping_id == cron_job_data.bi_user_mapping_id
    ).first()

    if existing_cron_job:
        # Update the existing cron job
        existing_cron_job.cron_expression = cron_job_data.cron_expression
        response_message = "Cron job updated successfully."
    else:
        # Create a new cron job if it doesn't exist
        new_cron_job = CronJobTable(
            cron_to_mapping_name=cron_job_data.cron_to_mapping_name,
            cron_expression=cron_job_data.cron_expression,
            auditly_user_id=cron_job_data.auditly_user_id,
            bi_user_mapping_id=cron_job_data.bi_user_mapping_id
        )
        db.add(new_cron_job)
        response_message = "Cron job created successfully."
    mapping_data = db.query(PowerBiSqlMapping).filter(PowerBiSqlMapping.mapping_name == cron_job_data.cron_to_mapping_name).first()

    db.commit()  # Commit the transaction
    
    manage_cron_job('add', cron_job_data.auditly_user_id, 
                       cron_job_data.cron_to_mapping_name, cron_job_data.cron_expression, mapping_data.sql_table_name, mapping_data.bi_table_name)
    response_message = "Cron job created successfully."
    
    return {
        "message": response_message,
        "cron_job_details": {
            "cron_to_mapping_name": cron_job_data.cron_to_mapping_name,
            "cron_expression": cron_job_data.cron_expression,
            "auditly_user_id": cron_job_data.auditly_user_id
        }
    }


def manage_cron_job(action: str, user_id: int, mapping_name: str, cron_expression: Optional[str] = None,
                    sql_table_name: str = "default_sql_table", power_bi_table_name: str = "default_powerbi_table"):
    """
    Add, update, or remove a cron job on the local system
    action: 'add', 'update', or 'remove'
    sql_table_name: name of the SQL table
    power_bi_table_name: name of the Power BI table
    """

    command = f'''root curl -X POST 127.0.0.1:8000/api/powerbi/get-table-data -H "accept: application/json" -H "Content-Type: application/json" -d "{{\\"workspace_id\\": \\"313280a3-6d47-44c9-9c67-9cfaf97fb0b4\\", \\"dataset_id\\": \\"2d7e8848-9215-431c-a1c4-8a26938be0f2\\", \\"sql_table_name\\": \\"{sql_table_name}\\", \\"user_id\\": {user_id}, \\"power_bi_table_name\\": \\"{power_bi_table_name}\\", \\"access_token\\": \\"$(curl -s -X POST https://login.microsoftonline.com/fc09811c-498c-4e79-b20f-ba5cfa421942/oauth2/v2.0/token -H 'Content-Type: application/x-www-form-urlencoded' -d 'grant_type=client_credentials' -d 'client_id=2146b62a-5753-4fd8-b359-6ad3e1e7b814' -d 'client_secret=zmP8Q~nk07PYr1fBGpojD7hD7bCTt4SXuABErapM' -d 'scope=https://graph.microsoft.com/.default' | jq -r .access_token)\\"}}"\n '''
    # command = "echo 'Hello Cron' >> /tmp/cron_test.log"
    # Get current crontab
    result = subprocess.run(['crontab', '-l'], capture_output=True, text=True)
    current_crontab = result.stdout.strip()

    # Initialize variables
    new_crontab = ""
    cron_entry = f"{cron_expression} {command}" if cron_expression else ""
    entry_exists = cron_entry in current_crontab if cron_expression else False
    # Process based on action
    if action == 'add':
        if entry_exists:
            return "Cron job already exists"
        new_crontab = current_crontab + "\n" + cron_entry if current_crontab else cron_entry
    elif action == 'update':
        # Remove existing entry if it exists
        lines = [line for line in current_crontab.split('\n') 
                if line.strip() and not line.strip().endswith(command)]
        new_crontab = '\n'.join(lines) + "\n" + cron_entry if cron_expression else '\n'.join(lines)
    elif action == 'remove':
        # Remove all entries for this command
        new_crontab = '\n'.join([line for line in current_crontab.split('\n') 
                                if line.strip() and not line.strip().endswith(command)])
    else:
        raise ValueError("Invalid action")
    
    print(new_crontab)
    
    cron_file_path = f"/etc/cron.d/auditlycron"

    with open(cron_file_path, "w") as f:
            f.write(new_crontab)
        
    subprocess.run(["chmod", "644", cron_file_path], check=True)
    # Update crontab
    # process = subprocess.Popen(['crontab', '-'], stdin=subprocess.PIPE)
    # process.communicate(input=new_crontab.encode())
    
    # if process.returncode != 0:
    #     raise Exception("Failed to update crontab")
    
    return f"Cron job {action} successful"



@app.get("/export/customer-items")
def export_customer_items():
    query = """
    SELECT 
        cid.id AS customer_item_id,
        cid.original_sales_order_number,
        cid.return_order_number,
        cid.serial_number,
        cid.return_condition,
        cid.return_warehouse,
        cid.date_purchased,
        cid.date_delivered,
        i.item_number,
        i.item_description,
        b.brand_name
    FROM customer_item_data cid
    LEFT JOIN item i ON cid.item_id = i.id
    LEFT JOIN brand b ON i.brand_id = b.id
    LIMIT 1000
    """

    with engine.connect() as conn:
        result = conn.execute(text(query)).fetchall()

    # Convert datetime fields to strings
    data = []
    for row in result:
        item = dict(row._mapping)
        for key, value in item.items():
            if isinstance(value, (datetime, date)):  # ✅ FIXED check
                item[key] = value.isoformat()
        data.append(item)

    return JSONResponse(content=data)



@app.get("/api/get-notifications")
def get_notifications(user_id: int, db: Session = Depends(get_db)):
    notifications = db.query(NotificationTable).filter(NotificationTable.auditly_user_id == user_id).all()
    
    return [
    {column.name: getattr(result, column.name) for column in result.__table__.columns}
    for result in notifications
]


@app.put("/api/update-notification/{notification_id}")
def update_notification(notification_id: int, db: Session = Depends(get_db)):
    # Retrieve the notification by ID
    notification = db.query(NotificationTable).filter(NotificationTable.id == notification_id).first()
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")

    # Update the read_at field
    notification.read_at = datetime.now()
    db.commit()

    return {"message": "Notification updated successfully", "notification_id": notification_id, "read_at": notification.read_at}




POWERBI_PUSH_URL = f"https://api.powerbi.com/beta/fc09811c-498c-4e79-b20f-ba5cfa421942/datasets/49a05538-5cc7-4b32-9445-e728e550471e/rows?experience=power-bi&key=uGgdQLAY%2FiFyZD8mKOYQmahMUEf%2FEUJR8UnDnxyhwLD8XHvE%2BvXMWOwnVflnY%2FcqHIkDPJ88CWC5LF%2F5IbhOQQ%3D%3D"

@app.post("/api/push-to-powerbi")
def push_to_powerbi(db: Session = Depends(get_db)):
    # Step 1: Get items from database
    items = db.query(Item).all()

    # Step 2: Format the data for Power BI
    data = [
        {
            "brand_id": str(item.brand_id),
            "item_number": int(item.item_number),  # cast to int if it contains numeric strings
            "configuration": item.configuration or "USA",
            "category": item.category or "Mattress",
            "item_description": item.item_description
        }
        for item in items
    ]

    # Step 3: Push data to Power BI
    response = requests.post(POWERBI_PUSH_URL, json=data)

    if response.status_code == 200:
        return {"status": "Success", "message": "Data pushed to Power BI"}
    else:
        return {
            "status": "Failed",
            "message": f"Power BI responded with {response.status_code}: {response.text}"
        }


class DatabaseJsonItem(BaseModel):
    onboard_token: str
    onboard_user_id: str
    json_data: List
    
@app.post("/api/update-database-json-item")
def upload_database_json_item(data_base_json_item: DatabaseJsonItem, db: Session = Depends(get_db)):
    onboard_token = data_base_json_item.onboard_token
    onboard_user_id = data_base_json_item.onboard_user_id
    json_data = data_base_json_item.json_data
   
    # Retrieve the user from the database
    onboard_user = db.query(OnboardUser).filter(
        OnboardUser.customer_user_id == onboard_user_id,
        OnboardUser.token == onboard_token
    ).first()

    # Check if the user exists
    if not onboard_user:
        raise HTTPException(status_code=404, detail="Invalid user or token.")

    # Define a list of valid column names
    valid_column_names = ["item_number", "item_description", "brand_id", "category", "configuration"]
    
    # Process each item in the provided JSON data
    for row in json_data:
        # Check each key in the row against the list of valid column names
        if any(key not in valid_column_names for key in row.keys()):
            raise HTTPException(status_code=400, detail="Invalid JSON: contains invalid keys.")
        
        # If valid, create a new item and add to the session
        new_item = Item(**row)
        db.add(new_item)
    
    # Commit all additions to the database
    db.commit()
    
    # Return a success message
    return {"message": "Data has been inserted successfully!"}

class SaleItem(BaseModel):
    item_id: int
    original_sales_order_number: str
    original_sales_order_line: int
    ordered_qty: int
    serial_number: str
    sscc_number: str
    tag_number: str
    vendor_item_number: str
    shipped_from_warehouse: str
    shipped_to_person: str
    shipped_to_billing_address: str
    account_number: str
    customer_email: str
    shipped_to_apt_number: str
    shipped_to_street: str
    shipped_to_city: str
    shipped_to_zip: int
    shipped_to_state: str
    shipped_to_country: str
    dimension_depth: float
    dimension_length: float
    dimension_breadth: float
    dimension_weight: float
    dimension_volume: float
    dimension_size: str
    date_purchased: datetime
    date_shipped: datetime
    date_delivered: datetime

class DatabaseJsonSaleItem(BaseModel):
    onboard_token: str
    onboard_user_id: str
    json_data: List[SaleItem]  # ✅ Typed validation here

# Step 2: FastAPI route
@app.post("/api/update-database-json-customer-serials")
def upload_sale_items_json(data: DatabaseJsonSaleItem, db: Session = Depends(get_db)):
    onboard_user = db.query(OnboardUser).filter(
        OnboardUser.customer_user_id == data.onboard_user_id,
        OnboardUser.token == data.onboard_token
    ).first()

    if not onboard_user:
        raise HTTPException(status_code=404, detail="Invalid user or token.")

    added = 0
    skipped = []

    for row in data.json_data:
        try:
            sale_item = SaleItemData(**row.dict())
            db.add(sale_item)
            db.commit()
            added += 1
            added_sale_item = db.query(SaleItemData).filter(SaleItemData.original_sales_order_number ==  row.original_sales_order_number).first()
            _assign_sales_order(db,added_sale_item.id)
        except Exception as e:
            skipped.append({
                "row_data": row.dict(),
                "error": str(e)
            })

    return {
        "message": f"{added} sale items inserted successfully.",
        "rows_skipped": skipped
    }

class ReturnItem(BaseModel):
    item_id: int
    original_sales_order_number: str
    return_order_number: str
    return_order_line: int
    return_qty: int
    return_destination: str
    return_condition: str
    return_carrier: str
    return_warehouse: str
    return_house_number: str
    return_street: str
    return_city: str
    return_zip: int
    return_state: str
    return_country: str
    date_purchased: datetime
    date_shipped: datetime
    date_delivered: datetime
    return_created_date: datetime
    return_received_date: datetime

class DatabaseJsonReturnItem(BaseModel):
    onboard_token: str
    onboard_user_id: str
    json_data: List[ReturnItem]

@app.post("/api/update-database-json-return-items")
def upload_return_items_json(data: DatabaseJsonReturnItem, db: Session = Depends(get_db)):
    onboard_user = db.query(OnboardUser).filter(
        OnboardUser.customer_user_id == data.onboard_user_id,
        OnboardUser.token == data.onboard_token
    ).first()

    if not onboard_user:
        raise HTTPException(status_code=404, detail="Invalid user or token.")

    added = 0
    skipped = []

    for row in data.json_data:
        # try:
            return_item = ReturnItemData(**row.dict())
            db.add(return_item)
            db.commit()
            added += 1
            added_return_item = db.query(ReturnItemData).filter(ReturnItemData.original_sales_order_number == row.original_sales_order_number).first()
            _assign_return_order(db,added_return_item.id)

    return {
        "message": f"{added} return items inserted successfully.",
        "rows_skipped": skipped
    }

@app.get("/api/onboard-users")
def read_users(db: Session = Depends(get_db)):
    users = db.query(OnboardUser).all()
    return [{"onboard_name": user.onboard_name, "onboard_email": user.onboard_email, "token": user.token, "customer_user_id": user.customer_user_id} for user in users]


@app.delete("/api/users/delete-by-customer-id/{customer_id}", status_code=200)
def delete_user_by_customer_id(customer_id: str, db: Session = Depends(get_db)):
    user_to_delete = db.query(OnboardUser).filter(OnboardUser.customer_user_id == customer_id).first()
    if not user_to_delete:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user_to_delete)
    db.commit()
    return {"message": "User deleted successfully"}



class GetPowerBiUsers(BaseModel):
    auditly_user_id: int
    connection_type: str

@app.post("/api/power-bi-users")
def get_power_bi_users(request: GetPowerBiUsers, db: Session = Depends(get_db)):
    try:
        users = db.query(PowerBiUser).filter(PowerBiUser.power_bi_user_mapping_id == request.auditly_user_id).filter(PowerBiUser.connection_type == request.connection_type)
        return [
            {
                "power_bi_email": user.power_bi_email,
                "power_bi_username": user.power_bi_username,
                "power_bi_id": user.power_bi_id,
                "connection_type": user.connection_type,
                "connection_status": _check_connection_status(user.access_token)
            }
            for user in users
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching Power BI users: {str(e)}")


def _check_connection_status(access_token):
    
    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    # Using a lightweight endpoint to validate the token
    # url = "https://api.powerbi.com/v1.0/myorg/groups"

    # async with httpx.AsyncClient() as client:
    # response = await client.get(url, headers=headers)

    response = requests.get(
    "https://api.powerbi.com/v1.0/myorg/groups",
    headers=headers
    )
    if response.status_code == 200:
        return "Active"
    elif response.status_code == 401 or response.status_code == 403:
        return "Inactive"  
    


def generate_dataset_schema(dataset_name="AuditlyItemsDataset"):
    return {
        "name": dataset_name,
        "defaultMode": "Push",  # This is required for real-time datasets
        "tables": [
            {
                "name": "Items",
                "columns": [
                    {"name": "brand_id", "dataType": "string"},
                    {"name": "item_number", "dataType": "Int64"},
                    {"name": "configuration", "dataType": "string"},
                    {"name": "category", "dataType": "string"},
                    {"name": "item_description", "dataType": "string"},
                ]
            }
        ]
    }

def get_powerbi_headers(access_token: str):
    return {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }


def create_powerbi_dataset(access_token: str, dataset_name: str) -> str:
    url = "https://api.powerbi.com/v1.0/myorg/datasets"
    schema = generate_dataset_schema(dataset_name)
    headers = get_powerbi_headers(access_token)

    response = requests.post(url, json=schema, headers=headers)

    if response.status_code == 201:
        return response.json().get("id")
    else:
        raise Exception(f"Failed to create dataset: {response.status_code} - {response.text}")


def get_push_url(dataset_id: str):
    return f"https://api.powerbi.com/v1.0/myorg/datasets/{dataset_id}/tables/Items/rows"

def prepare_item_data(db: Session):
    items = db.query(Item).all()
    return [
        {
            "brand_id": str(item.brand_id),
            "item_number": int(item.item_number),
            "configuration": item.configuration or "USA",
            "category": item.category or "Mattress",
            "item_description": item.item_description
        }
        for item in items
    ]
def push_to_powerbi(access_token: str, push_url: str, data: list):
    headers = get_powerbi_headers(access_token)
    payload = {"rows": data}

    response = requests.post(push_url, headers=headers, json=payload)

    if response.status_code == 200:
        print("✅ Data pushed successfully")
        return {"status": "Success"}
    else:
        print(f"❌ Failed to push: {response.status_code}, {response.text}")
        return {
            "status": "Failed",
            "message": f"Power BI responded with {response.status_code}: {response.text}"
        }

def get_existing_dataset_id(access_token: str, dataset_name: str):
    url = "https://api.powerbi.com/v1.0/myorg/datasets"
    headers = get_powerbi_headers(access_token)
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        datasets = response.json().get("value", [])
        for ds in datasets:
            if ds["name"].lower() == dataset_name.lower():
                return ds["id"]
    return None


class PowerBIPushRequest(BaseModel):
    power_bi_email: str
    auditly_user_id: int
    dataset_name: str

@app.post("/api/powerbi/create-and-push")
def create_and_push(request: PowerBIPushRequest, db: Session = Depends(get_db)):
    try:
        user = db.query(PowerBiUser).filter(
            PowerBiUser.power_bi_email == request.power_bi_email,
            PowerBiUser.power_bi_user_mapping_id == request.auditly_user_id
        ).first()

        if not user or not user.access_token:
            raise HTTPException(status_code=404, detail="Valid Power BI user not found")

        access_token = user.access_token

        # Step 1: Check if dataset exists
        dataset_id = get_existing_dataset_id(access_token, request.dataset_name)
        created_new = False

        if not dataset_id:
            dataset_id = create_powerbi_dataset(access_token, request.dataset_name)
            created_new = True

        # Step 2: Build push URL
        push_url = get_push_url(dataset_id)

        # Step 3: Prepare your data
        data = prepare_item_data(db)

        # Step 4: Push to Power BI
        result = push_to_powerbi(access_token, push_url, data)

        result["dataset_id"] = dataset_id
        result["dataset_name"] = request.dataset_name
        result["message"] = "Dataset created and data pushed successfully." if created_new else "Existing dataset updated with new data."

        return result

    except Exception as e:
        return {"status": "Error", "message": str(e)}



class PowerBiUserDeleteRequest(BaseModel):
    power_bi_email: str
    power_bi_user_mapping_id: int
    connection_type: str

@app.post("/api/power-bi-users/delete")
async def delete_power_bi_user(request: PowerBiUserDeleteRequest, db: Session = Depends(get_db)):
    """
    Delete a Power BI user connection by email, user mapping ID, and connection type.
    """
    try:
        # Validate inputs
        if not request.power_bi_email:
            raise HTTPException(status_code=400, detail="power_bi_email is required")
        if not request.power_bi_user_mapping_id:
            raise HTTPException(status_code=400, detail="power_bi_user_mapping_id is required")
        if request.connection_type not in ["inbound", "outbound"]:
            raise HTTPException(status_code=400, detail="connection_type must be 'inbound' or 'outbound'")

        # Query for the Power BI user
        power_bi_user = db.query(PowerBiUser).filter(
            PowerBiUser.power_bi_email == request.power_bi_email,
            PowerBiUser.power_bi_user_mapping_id == request.power_bi_user_mapping_id,
            PowerBiUser.connection_type == request.connection_type
        ).first()

        if not power_bi_user:
            raise HTTPException(status_code=404, detail="Power BI user not found")

        # Check if there are any dependent records in cron_job_table
        dependent_records = db.query(CronJobTable).filter(
            CronJobTable.bi_user_mapping_id == power_bi_user.power_bi_id
        ).count()

        if dependent_records > 0:
            raise HTTPException(
                status_code=400,
                detail="Cannot delete this Power BI user because it has associated mappings in the system. "
                       "Please contact your administrator to remove these dependencies first."
            )

        # Delete the user
        db.delete(power_bi_user)
        db.commit()

        return {
            "message": "Power BI user deleted successfully",
            "data": {
                "power_bi_email": request.power_bi_email,
                "power_bi_user_mapping_id": request.power_bi_user_mapping_id,
                "connection_type": request.connection_type
            }
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error deleting Power BI user: {str(e)}")



def _assign_sales_order(db: Session = Depends(get_db), sales_order_id = None):
    sale_order = db.query(SaleItemData).filter(SaleItemData.id == sales_order_id).first()
    return_message = "Agent not available"
    if sale_order.status == "Agent Assigned":
        return_message = "Agent Already Assigned"
    elif sale_order.status == "Deliverd":
        return_message = "Already Deliverd"
    else:
        availabe_agent = db.query(Agent).filter(Agent.servicing_zip == sale_order.shipped_to_zip).filter((Agent.delivery_type == "Delivery") | (Agent.delivery_type == "Both")).filter(Agent.delivery_routing_mode == 0)
        agent_minimum_order_number = 100
        agent_id_min = None
        for agent in availabe_agent:
            if agent.approved_by_auditly_user_id is not None and str(datetime.today().isoweekday()) in agent.work_schedule["days"].split(","):
                    if db.query(SaleItemData).filter(SaleItemData.delivery_agent_id == agent.agent_id).count() < agent_minimum_order_number:
                        agent_minimum_order_number = db.query(SaleItemData).filter(SaleItemData.delivery_agent_id == agent.agent_id).count()
                        agent_id_min = agent.agent_id
        if agent_id_min != None:
            sale_order.delivery_agent_id = agent_id_min
            sale_order.status = "Agent Assigned"
            db.commit()
            return_message = "Agent Assigned"
    return return_message

def _assign_return_order(db: Session = Depends(get_db), return_order_id = None):
    return_order = db.query(ReturnItemData).filter(ReturnItemData.id == return_order_id).first()
    return_message = "Agent not available"
    if return_order.status == "Agent Assigned":
        return_message = "Agent Already Assigned`"
    elif return_order.status == "Picked Up":
        return_message = "Already Picked Up"
    else:
        availabe_agent = db.query(Agent).filter(Agent.servicing_zip == return_order.return_zip).filter((Agent.delivery_type == "Return") | (Agent.delivery_type == "Both")).filter(Agent.pickup_routing_mode == 0)
        agent_minimum_order_number = 100
        agent_id_min = None
        for agent in availabe_agent:
            if agent.approved_by_auditly_user_id is not None and str(datetime.today().isoweekday()) in agent.work_schedule["days"].split(","):
                if db.query(ReturnItemData).filter(ReturnItemData.return_agent_id == agent.agent_id).count() < agent_minimum_order_number:
                    agent_minimum_order_number = db.query(ReturnItemData).filter(ReturnItemData.return_agent_id == agent.agent_id).count()
                    agent_id_min = agent.agent_id
        if agent_id_min != None:
            return_order.return_agent_id = agent_id_min
            return_order.status = "Agent Assigned"
            db.commit()
            return_message = "Agent Assigned"
    return return_message


@app.get("/api/agent/sales-orders/{agent_id}")
def get_agent_orders_with_item(agent_id: int, db: Session = Depends(get_db)):
    orders = db.query(SaleItemData).filter(SaleItemData.delivery_agent_id == agent_id).all()

    if not orders:
        raise HTTPException(status_code=404, detail="No orders found for this agent")

    return [
        {
            "id": order.id,
            "item_id": order.item_id,
            "serial_number": order.serial_number,
            "original_sales_order_number": order.original_sales_order_number,
            "original_sales_order_line": order.original_sales_order_line,
            "ordered_qty": order.ordered_qty,
            "sscc_number": order.sscc_number,
            "tag_number": order.tag_number,
            "vendor_item_number": order.vendor_item_number,
            "shipped_from_warehouse": order.shipped_from_warehouse,
            "shipped_to_person": order.shipped_to_person,
            "shipped_to_billing_address": order.shipped_to_billing_address,
            "account_number": order.account_number,
            "customer_email": order.customer_email,
            "shipped_to_apt_number": order.shipped_to_apt_number,
            "shipped_to_street": order.shipped_to_street,
            "shipped_to_city": order.shipped_to_city,
            "shipped_to_zip": order.shipped_to_zip,
            "shipped_to_state": order.shipped_to_state,
            "shipped_to_country": order.shipped_to_country,
            "dimension_depth": order.dimension_depth,
            "dimension_length": order.dimension_length,
            "dimension_breadth": order.dimension_breadth,
            "dimension_weight": order.dimension_weight,
            "dimension_volume": order.dimension_volume,
            "dimension_size": order.dimension_size,
            "date_purchased": order.date_purchased,
            "date_shipped": order.date_shipped,
            "date_delivered": order.date_delivered,
            "status": order.status,
            "delivery_agent_id": order.delivery_agent_id,
            "item": {
                "item_number": order.item.item_number if order.item else None,
                "item_description": order.item.item_description if order.item else None,
                "category": order.item.category if order.item else None,
                "configuration": order.item.configuration if order.item else None
            }
        }
        for order in orders
    ]

@app.get("/api/agent/return-orders/{agent_id}")
def get_return_orders_for_agent(agent_id: int, db: Session = Depends(get_db)):
    # Get all return orders for the agent
    return_orders = db.query(ReturnItemData).filter(ReturnItemData.return_agent_id == agent_id).all()

    if not return_orders:
        raise HTTPException(status_code=404, detail="No return orders found for this agent")

    result = []
    
    for return_order in return_orders:
        # Try to find matching sales order
        sales_order = db.query(SaleItemData).filter(
            SaleItemData.original_sales_order_number == return_order.original_sales_order_number,
            SaleItemData.original_sales_order_line == return_order.return_order_line
        ).first()

        # Build the order object with merged data
        order_data = {
            "id": return_order.id,
            "item_id": return_order.item_id,
            "original_sales_order_number": return_order.original_sales_order_number,
            "original_sales_order_line": return_order.return_order_line,
            "ordered_qty": return_order.return_qty,
            "serial_number": return_order.serial_number if hasattr(return_order, "serial_number") else None,
            "sscc_number": sales_order.sscc_number if sales_order else None,
            "tag_number": sales_order.tag_number if sales_order else None,
            "vendor_item_number": sales_order.vendor_item_number if sales_order else None,
            "shipped_from_warehouse": return_order.return_warehouse,
            "shipped_to_person": sales_order.shipped_to_person if sales_order else "Return Customer",
            "shipped_to_billing_address": sales_order.shipped_to_billing_address if sales_order else None,
            "account_number": sales_order.account_number if sales_order else None,
            "customer_email": sales_order.customer_email if sales_order else None,
            "shipped_to_apt_number": sales_order.shipped_to_apt_number if sales_order else None,
            "shipped_to_street": return_order.return_street or (sales_order.shipped_to_street if sales_order else None),
            "shipped_to_city": return_order.return_city or (sales_order.shipped_to_city if sales_order else None),
            "shipped_to_zip": return_order.return_zip or (sales_order.shipped_to_zip if sales_order else None),
            "shipped_to_state": return_order.return_state or (sales_order.shipped_to_state if sales_order else None),
            "shipped_to_country": return_order.return_country or (sales_order.shipped_to_country if sales_order else None),
            "dimension_depth": sales_order.dimension_depth if sales_order else None,
            "dimension_length": sales_order.dimension_length if sales_order else None,
            "dimension_breadth": sales_order.dimension_breadth if sales_order else None,
            "dimension_weight": sales_order.dimension_weight if sales_order else None,
            "dimension_volume": sales_order.dimension_volume if sales_order else None,
            "dimension_size": sales_order.dimension_size if sales_order else None,
            "date_purchased": return_order.date_purchased or (sales_order.date_purchased if sales_order else None),
            "date_shipped": return_order.date_shipped or (sales_order.date_shipped if sales_order else None),
            "date_delivered": return_order.date_delivered or (sales_order.date_delivered if sales_order else None),
            "status": return_order.status or "Return Requested",
            "delivery_agent_id": agent_id,
            "item": {
                "item_number": return_order.item.item_number if return_order.item else None,
                "item_description": return_order.item.item_description if return_order.item else None,
                "category": return_order.item.category if return_order.item else None,
                "configuration": return_order.item.configuration if return_order.item else None
            },
            # Additional return-specific fields that might be useful
            "return_specific": {
                "return_order_number": return_order.return_order_number,
                "return_condition": return_order.return_condition,
                "return_carrier": return_order.return_carrier,
                "return_destination": return_order.return_destination,
                "return_created_date": return_order.return_created_date,
                "return_received_date": return_order.return_received_date
            }
        }
        
        result.append(order_data)

    return result


class SalesOrderAgentFilterRequest(BaseModel):
    sales_order_id: int

@app.post("/api/eligible-delivery-agents")
def get_eligible_agents_for_delivery(request: SalesOrderAgentFilterRequest, db: Session = Depends(get_db)):
    sale_order = db.query(SaleItemData).filter(SaleItemData.id == request.sales_order_id).first()

    if not sale_order:
        raise HTTPException(status_code=404, detail="Sales order not found")

    zip_code = sale_order.shipped_to_zip
    today = str(datetime.today().isoweekday())  # Monday = 1, Sunday = 7

    agents = db.query(Agent).filter(
        Agent.servicing_zip == str(zip_code),
        Agent.delivery_type.in_(["Delivery", "Both"]),
        Agent.delivery_routing_mode == True,
        Agent.approved_by_auditly_user_id.isnot(None)
    ).all()

    eligible_agents = []
    for agent in agents:
        if agent.work_schedule and "days" in agent.work_schedule:
            working_days = agent.work_schedule["days"].split(",")
            if today in working_days:
                assigned_orders_count = db.query(func.count(SaleItemData.id)).filter(
                    SaleItemData.delivery_agent_id == agent.agent_id
                ).scalar()

                eligible_agents.append({
                    "agent_id": agent.agent_id,
                    "agent_name": agent.agent_name,
                    "servicing_zip": agent.servicing_zip,
                    "delivery_type": agent.delivery_type,
                    "gender": agent.gender,
                    "is_verified": agent.is_verified,
                    "work_schedule": agent.work_schedule,
                    "assigned_sales_order_count": assigned_orders_count
                })

    return {"eligible_agents": eligible_agents}


class ReturnOrderAgentFilterRequest(BaseModel):
    return_order_id: int
   
@app.post("/api/eligible-return-agents")
def get_eligible_agents_for_return(request: ReturnOrderAgentFilterRequest, db: Session = Depends(get_db)):
    return_order = db.query(ReturnItemData).filter(ReturnItemData.id == request.return_order_id).first()

    if not return_order:
        raise HTTPException(status_code=404, detail="Return order not found")

    return_zip = return_order.return_zip
    today = str(datetime.today().isoweekday())  # 1 = Monday, ..., 7 = Sunday

    agents = db.query(Agent).filter(
        Agent.servicing_zip == str(return_zip),
        Agent.delivery_type.in_(["Return", "Both"]),
        Agent.pickup_routing_mode == True,
        Agent.approved_by_auditly_user_id.isnot(None)
    ).all()

    eligible_agents = []
    for agent in agents:
        # Check if agent works today
        if agent.work_schedule and "days" in agent.work_schedule:
            working_days = agent.work_schedule["days"].split(",")
            if today in working_days:
                # Count assigned return orders
                assigned_orders_count = db.query(func.count(ReturnItemData.id)).filter(
                    ReturnItemData.return_agent_id == agent.agent_id
                ).scalar()

                eligible_agents.append({
                    "agent_id": agent.agent_id,
                    "agent_name": agent.agent_name,
                    "servicing_zip": agent.servicing_zip,
                    "delivery_type": agent.delivery_type,
                    "gender": agent.gender,
                    "is_verified": agent.is_verified,
                    "work_schedule": agent.work_schedule,
                    "assigned_return_order_count": assigned_orders_count
                })

    return {"eligible_agents": eligible_agents}

class SalesAgentAssignmentRequest(BaseModel):
    order_id: int
    agent_id: int

@app.post("/api/assign-manual-agent-sales-order")
def assign_agent_to_order(request: SalesAgentAssignmentRequest, db: Session = Depends(get_db)):
    order = db.query(SaleItemData).filter(SaleItemData.id == request.order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Sale item not found")

    order.delivery_agent_id = request.agent_id
    order.status = "Assigned to Agent"

    db.commit()
    db.refresh(order)

    return {
        "message": "Agent assigned successfully",
        "order_id": order.id,
        "assigned_agent_id": order.delivery_agent_id
    }

class ReturnAgentAssignmentRequest(BaseModel):
    order_id: int
    agent_id: int

@app.post("/api/assign-manual-agent-return-order")
def assign_agent_to_return_order(request: ReturnAgentAssignmentRequest, db: Session = Depends(get_db)):
    return_order = db.query(ReturnItemData).filter(ReturnItemData.id == request.order_id).first()

    if not return_order:
        raise HTTPException(status_code=404, detail="Return order not found")

    return_order.return_agent_id = request.agent_id
    return_order.status = "Assigned to Agent"

    db.commit()
    db.refresh(return_order)

    return {
        "message": "Return agent assigned successfully",
        "return_order_id": return_order.id,
        "assigned_agent_id": return_order.return_agent_id
    }


class ManagerStateFilterRequest(BaseModel):
    state: str

@app.post("/api/available-managers-by-state")
def get_available_managers(request: ManagerStateFilterRequest, db: Session = Depends(get_db)):
    managers = db.query(AgentManager).filter(
        AgentManager.servicing_state == request.state,
        AgentManager.approved_by_auditly_user_id.isnot(None),
    ).all()

    if not managers:
        return {"managers": []}

    return {
        "managers": [
            {
                "manager_id": m.manager_id,
                "manager_name": m.manager_name,
                "servicing_state": m.servicing_state,
                "servicing_city": m.servicing_city,
                "servicing_zip": m.servicing_zip,
                "gender": m.gender,
                "work_schedule": m.work_schedule
            }
            for m in managers
        ]
    }

class ManagerAssignmentRequest(BaseModel):
    agent_id: int
    manager_id: str 

@app.post("/api/assign-managers-to-agent")
def assign_managers_to_agent(request: ManagerAssignmentRequest, db: Session = Depends(get_db)):
    agent = db.query(Agent).filter(Agent.agent_id == request.agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    try:
        # Validate IDs are integers
        ids = [int(mid.strip()) for mid in request.manager_id.split(",") if mid.strip().isdigit()]
        if not ids:
            raise ValueError("No valid manager IDs provided")

        # Validate against UserManager
        existing = db.query(AgentManager.manager_id).filter(AgentManager.manager_id.in_(ids)).all()
        existing_ids = set(mid for (mid,) in existing)
        invalid = set(ids) - existing_ids

        if invalid:
            raise HTTPException(status_code=400, detail=f"Invalid manager IDs: {', '.join(map(str, invalid))}")

        agent.manager_id = {"manager_id": request.manager_id}
        db.commit()

        return {
            "message": "Manager IDs saved as JSON successfully",
            "agent_id": agent.agent_id,
            "manager_id_json": agent.manager_id
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error: {e}")

