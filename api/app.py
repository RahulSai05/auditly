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
from pydantic import BaseModel, EmailStr
from jwt import decode as jwt_decode
from email_body import _login_email_body, _forget_password_email_body, _generate_inspection_email_body, _generate_inspection_email_subject
from request_models import CompareImagesRequest, AuditlyUserRequest, LoginRequest, VerifyLogin, LogoutRequest, ForgetPassword, ResettPassword, ReceiptSearchRequest, UpdateProfileRequest, Onboard, UpdateUserTypeRequest, ReceiptSearch
from database import engine, SessionLocal
from models import Base, Item, CustomerItemData, CustomerData, BaseData, ReturnDestination, CustomerItemCondition, AuditlyUser, Brand, OnboardUser, SalesData, PowerBiUser, PowerBiSqlMapping, TeamEmail, CronJobTable, NotificationTable
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Query, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import Optional
from sqlalchemy import distinct, desc, or_, inspect, text, Table, MetaData
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

# oauth = OAuth()
# oauth.register(
#     name="microsoft",
#     client_id=AZURE_CLIENT_ID,
#     client_secret=AZURE_CLIENT_SECRET,
#     client_kwargs={
#         "scope": "openid profile email https://analysis.windows.net/powerbi/api/.default",
#         "prompt": "select_account",  # Forces account selection
#         # "tenant": "common",  # Allow work/school accounts (use "common" for personal accounts too)
#         "response_type": "code",

#     },
#     server_metadata_url=f"https://login.microsoftonline.com/{AZURE_TENANT_ID}/v2.0/.well-known/openid-configuration",
#     authorize_url=f"https://login.microsoftonline.com/{AZURE_TENANT_ID}/oauth2/v2.0/authorize",
#     access_token_url=f"https://login.microsoftonline.com/{AZURE_TENANT_ID}/oauth2/v2.0/token",
# )

# oauth = OAuth()
# oauth.register(
#     name="microsoft",
#     client_id=AZURE_CLIENT_ID,
#     client_secret=AZURE_CLIENT_SECRET,
#     client_kwargs={
#         "scope": "openid profile email https://analysis.windows.net/powerbi/api/.default",
#         "prompt": "select_account",
#         "response_type": "code",
#     },
#     server_metadata_url="https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration",
#     authorize_url="https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
#     access_token_url="https://login.microsoftonline.com/common/oauth2/v2.0/token",
# )

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
    identifier: str = Query(..., title="Serial Number or Return Order Number"),  # Single input field
    db: Session = Depends(get_db)
):
    """
    Retrieve details of an item instance using a single identifier.
    The identifier can be either a Serial Number or a Return Order Number.
    """

    # Query to check if the identifier matches serial_number or return_order_number
    item_instance = db.query(CustomerItemData).filter(
        (CustomerItemData.serial_number == identifier) |
        (CustomerItemData.return_order_number == identifier)
    ).first()

    if not item_instance:
        raise HTTPException(status_code=404, detail="Item Instance not found.")

    return {
        "original_sales_order_number": item_instance.original_sales_order_number,
        "original_sales_order_line": item_instance.original_sales_order_line,
        "ordered_qty": item_instance.ordered_qty,
        "return_order_number": item_instance.return_order_number,
        "return_order_line": item_instance.return_order_line,
        "return_qty": item_instance.return_qty,
        "return_destination": item_instance.return_destination,
        "return_condition": item_instance.return_condition,
        "return_carrier": item_instance.return_carrier,
        "return_warehouse": item_instance.return_warehouse,
        "item_id": item_instance.item_id,
        "serial_number": item_instance.serial_number,
        "sscc_number": item_instance.sscc_number,
        "tag_number": item_instance.tag_number,
        "vendor_item_number": item_instance.vendor_item_number,
        "shipped_from_warehouse": item_instance.shipped_from_warehouse,
        "shipped_to_person": item_instance.shipped_to_person,
        "shipped_to_address": {
            "street_number": item_instance.street_number,
            "city": item_instance.city,
            "state": item_instance.state,
            "country": item_instance.country,
        },
        "dimensions": {
            "depth": item_instance.dimensions_depth,
            "length": item_instance.dimensions_length,
            "breadth": item_instance.dimensions_breadth,
            "weight": item_instance.dimensions_weight,
            "volume": item_instance.dimensions_volume,
            "size": item_instance.dimensions_size,
        },
        "customer_id": item_instance.id,
    }


@app.post("/api/upload-customer-images")
async def upload_customer_images(
    customer_item_data_id: int,  
    factory_seal: bool = False,
    no_factory_seal: bool = False,
    minimal_tear: bool = False,
    no_package: bool = False,
    new_conditiono: bool = False,
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
    if (factory_seal and new_conditiono) or send_email_flag:
        update_return_condition("sealy_pickup", customer_item_data_id, db)
        #send_email("rahulgr20@gmail.com", "fxei hthz bulr slzh", "geereddyrahul@gmail.com", "Test", "Test Message")
        print("email Sent!")

    if factory_seal and new_conditiono:
        update_return_condition("sealy_pickup", customer_item_data_id, db)   
    else:
        update_return_condition("returns_processing", customer_item_data_id, db)    

    existing_customer_data = db.query(CustomerData).filter_by(customer_item_data_id=customer_item_data_id).first()

    if ENV == "TEST":UPLOAD_DIRECTORY = "/home/ec2-user/auditly/static/customer_image"   
    elif ENV == "DEV":UPLOAD_DIRECTORY = "/Users/rahul/Desktop/auditly/customer_image"   
        

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
            customer_item_data_id=customer_item_data_id,
            customer_front_image=front_image_path,
            customer_back_image=back_image_path,
            factory_seal=factory_seal,
            no_factory_seal=no_factory_seal,
            minimal_tear=minimal_tear,
            no_package=no_package,
            new_conditiono=new_conditiono,
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
        existing_customer_data.new_conditiono = new_conditiono
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



@app.get("/api/customer-images/{id}")
async def get_customer_images(id: int, db: Session = Depends(get_db)):
    """
    Retrieve the paths to the customer's front and back images from the database.

    Args:
        id (int): The ID of the customer record.
        db (Session): The database session dependency.

    Returns:
        dict: Contains the paths to the front and back images.
    """
    # Query the database for the customer record with the given ID
    customer_data = db.query(CustomerData).filter(CustomerData.id == id).first()

    # Check if the record exists
    if not customer_data:
        raise HTTPException(status_code=404, detail="Customer images not found")

    # Return the image paths
    return {
        "id": customer_data.id,
        "front_image_path": customer_data.customer_front_image,
        "back_image_path": customer_data.customer_back_image,
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

@app.post("/api/upload-customer-return-item-data")
async def upload_customer_item_data(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Upload a CSV file and insert data into the customer_item_data table.
    """
    try:
        contents = (await file.read()).decode("utf-8")
        csv_reader = csv.DictReader(contents.splitlines())

        for row in csv_reader:
            item = CustomerItemData(
                original_sales_order_number=row["original_sales_order_number"],
                original_sales_order_line=row["original_sales_order_line"],
                ordered_qty=row["ordered_qty"],
                return_order_number=row["return_order_number"],
                return_order_line=row["return_order_line"],
                return_qty=row["return_qty"],
                return_destination=row["return_destination"],
                return_condition=row["return_condition"],
                return_carrier=row["return_carrier"],
                return_warehouse=row["return_warehouse"],
                item_id=row["item_id"],
                serial_number=row["serial_number"],
                sscc_number=row["sscc_number"],
                tag_number=row["tag_number"],
                vendor_item_number=row["vendor_item_number"],
                shipped_from_warehouse=row["shipped_from_warehouse"],
                shipped_to_person=row["shipped_to_person"],
                shipped_to_address=row["shipped_to_address"],
                street_number=row["street_number"],
                city=row["city"],
                state=row["state"],
                country=row["country"],
                dimensions_depth=row["dimensions_depth"],
                dimensions_length=row["dimensions_length"],
                dimensions_breadth=row["dimensions_breadth"],
                dimensions_weight=row["dimensions_weight"],
                dimensions_volume=row["dimensions_volume"],
                dimensions_size=row["dimensions_size"],
            )
            db.add(item)
        db.commit()

        return {"message": "File uploaded and data inserted successfully!"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing file: {str(e)}")
    
@app.get("/api/search-customer-return-item-data")
async def search_customer_item_data(query: str, db: Session = Depends(get_db)):
    """
    Search the customer_item_data table based on a query.
    """
    try:
        results = db.query(CustomerItemData).filter(
            (CustomerItemData.serial_number.like(f"%{query}%")) |
            (CustomerItemData.return_order_number.like(f"%{query}%")) |
            (CustomerItemData.return_warehouse.like(f"%{query}%")) |
            (CustomerItemData.city.like(f"%{query}%"))
        ).all()

        # Convert results into dictionaries, excluding private attributes
        return [
            {column.name: getattr(result, column.name) for column in result.__table__.columns}
            for result in results
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing search: {str(e)}")


@app.post("/api/upload-items-csv")
async def upload_items_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Upload a CSV file to add or update items in the database.
    """
    try:
        content = await file.read()
        decoded_content = content.decode("utf-8")
        csv_reader = csv.DictReader(StringIO(decoded_content))

        # Normalize headers
        csv_reader.fieldnames = [field.strip().lower() for field in csv_reader.fieldnames]
        required_fields = {"item_number", "item_description", "brand_id", "category", "configuration"}
        if not required_fields.issubset(set(csv_reader.fieldnames)):
            raise HTTPException(status_code=400, detail="Missing required columns in CSV.")

        added, updated = 0, 0

        for row in csv_reader:
            try:
                print("Processing row:", row)  # Debug log
                item_number = int(row["item_number"])
                brand_id = int(row["brand_id"])

                # Check if brand exists
                brand_exists = db.query(Brand).filter(Brand.id == brand_id).first()
                if not brand_exists:
                    raise HTTPException(status_code=400, detail=f"Brand ID {brand_id} does not exist.")

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
                print(f"Skipping row due to error: {row_error} | Row data: {row}")
                continue  # Skip problematic row and continue with the rest

        db.commit()
        return {
            "message": "CSV processed.",
            "items_added": added,
            "items_updated": updated
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
    return_flag_dict = {
        "sealy_pickup": False, 
        "returns_processing" : False,
    }
    if status == "sealy_pickup" : return_flag_dict["sealy_pickup"] = True
    elif status == "returns_processing" : return_flag_dict["returns_processing"] = True
    new_return_mapping = ReturnDestination(
        sealy_pickup = return_flag_dict["sealy_pickup"],
        returns_processing = return_flag_dict["returns_processing"],
        return_order_mapping_key = return_order_mapping_key
    )
    db.add(new_return_mapping)
    db.commit()
    db.refresh(new_return_mapping)


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


@app.get("/api/customer-item-data")
async def get_customer_item_data(db: Session = Depends(get_db)):
    customer_item_data = db.query(CustomerItemData).join(Item).all()
    
    response = []
    for data in customer_item_data:
        response.append({
            "id": data.id,
            "original_sales_order_number": data.original_sales_order_number,
            "original_sales_order_line": data.original_sales_order_line,
            "ordered_qty": data.ordered_qty,
            "return_order_number": data.return_order_number,
            "return_order_line": data.return_order_line,
            "return_qty": data.return_qty,
            "return_destination": data.return_destination,
            "return_condition": data.return_condition,
            "return_carrier": data.return_carrier,
            "return_warehouse": data.return_warehouse,
            "item_id": data.item_id,
            "serial_number": data.serial_number,
            "sscc_number": data.sscc_number,
            "tag_number": data.tag_number,
            "vendor_item_number": data.vendor_item_number,
            "shipped_from_warehouse": data.shipped_from_warehouse,
            "shipped_to_person": data.shipped_to_person,
            "shipped_to_address": data.shipped_to_address,
            "street_number": data.street_number,
            "city": data.city,
            "state": data.state,
            "country": data.country,
            "dimensions_depth": float(data.dimensions_depth) if data.dimensions_depth else None,
            "dimensions_length": float(data.dimensions_length) if data.dimensions_length else None,
            "dimensions_breadth": float(data.dimensions_breadth) if data.dimensions_breadth else None,
            "dimensions_weight": float(data.dimensions_weight) if data.dimensions_weight else None,
            "dimensions_volume": float(data.dimensions_volume) if data.dimensions_volume else None,
            "dimensions_size": data.dimensions_size,
            "barcode": data.barcode,
            "customer_email": data.customer_email,
            "account_number": data.account_number,
            "date_purchased": data.date_purchased.isoformat() if data.date_purchased else None,
            "date_shipped": data.date_shipped.isoformat() if data.date_shipped else None,
            "date_delivered": data.date_delivered.isoformat() if data.date_delivered else None,
            "return_created_date": data.return_created_date.isoformat() if data.return_created_date else None,
            "item_details": {
                "item_id": data.item.id,
                "item_number": data.item.item_number,
                "item_description": data.item.item_description,
                "brand_id": data.item.brand_id,
                "category": data.item.category,
                "configuration": data.item.configuration,
            }
        })
    
    return response

    
    


@app.get("/api/item-details/{return_order_number}")
async def get_item_details(return_order_number: str, db: Session = Depends(get_db)):
    """
    Fetch item details based on the return order number.
    """
    try:
        result = db.query(Item, CustomerItemData).join(CustomerItemData, Item.id == CustomerItemData.item_id).filter(
            CustomerItemData.return_order_number == return_order_number
        ).first()

        if result:
            item, customer_item = result
            return {
                "item_number": item.item_number,
                "item_description": item.item_description,
                "brand_id": item.brand_id,
                "category": item.category,
                "configuration": item.configuration,
                "return_order_number": customer_item.return_order_number,
                "return_qty": customer_item.return_qty,
                "return_condition": customer_item.return_condition
            }
        else:
            raise HTTPException(status_code=404, detail="Item not found for the given return order number.")
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
    API for verifying otp to login
    """ 
   # try:  
    auditly_user_name = request.user_name
    login_otp = request.login_otp

    user_data = db.query(AuditlyUser).filter(AuditlyUser.auditly_user_name == auditly_user_name,AuditlyUser.reset_otp == login_otp).first()


    if user_data:
        user_data.last_login_time = datetime.now()
        db.commit()
        db.refresh(user_data)
        return {
            "message": "Login Successfull",
            "data": {
                "User ID": user_data.auditly_user_id,
                "User Name": user_data.auditly_user_name,
                "User Type": [_key for _key, _value in {"reports_user": user_data.is_reports_user, "admin": user_data.is_admin, "inpection_user": user_data.is_inspection_user}.items() if _value == 1]                
            }
            }
    else:
        return {
            "message": "Invalid User Name or otp",
            }
    # except Exception as e:
    #     raise HTTPException(status_code=500, detail=f"Error processing search: {str(e)}")

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

    customer_data = db.query(CustomerData).filter(CustomerData.customer_item_data_id == customer_id).first()
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
        CustomerItemCondition,
        CustomerItemData,
        Item,
        Brand
    ).join(
        CustomerItemData, CustomerItemCondition.customer_item_condition_mapping_id == CustomerItemData.id
    ).join(
        Item, CustomerItemData.item_id == Item.id
    ).join(
        Brand, Item.brand_id == Brand.id
    ).filter(
        CustomerData.customer_item_data_id == customer_id
    ).first()


    condition, item_data, item, brand = data

    sales_order_number = item_data.original_sales_order_number
    account_number = item_data.account_number
    account_name = item_data.shipped_to_person
    serial_number = item_data.serial_number
    return_order_number = item_data.return_order_number
    customer_email = item_data.customer_email
    factory_seal = customer_data.factory_seal
    new_conditiono = customer_data.new_conditiono
    user_front_image = customer_data.customer_front_image
    user_back_image = customer_data.customer_back_image
    

    if factory_seal and new_conditiono:
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

# def send_inspection_email(account_name, account_number, serial_number, sales_order_number, return_order_number, receipt_number, customer_email, user_front_image, user_back_image, factory_seal, new_condition):
#     if factory_seal and new_condition:
#         condition = "in good condition, making it resalable."
#     else:
#         condition = "NOT in good condition, hence cannot be resold."

#     subject = _generate_inspection_email_subject(account_number, serial_number, receipt_number)
#     body = _generate_inspection_email_body(account_name, account_number, serial_number, sales_order_number, return_order_number, receipt_number, condition)

#     print("Sent Email")
#     print(customer_email)

#     if ENV == "DEV":
#         send_email("rahulgr20@gmail.com", "fxei hthz bulr slzh", customer_email, subject, body, [user_front_image, user_back_image])
#     elif ENV == "TEST":
#         secret_data = get_secret("test/auditly/secrets")
#         send_email(secret_data["from_email_address"], secret_data["from_email_password"], customer_email, subject, body, [user_front_image, user_back_image])

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



@app.post("/api/get-receipt-data/")
async def get_receipt_data(request: ReceiptSearchRequest, db: Session = Depends(get_db)):
    # Assuming CustomerItemCondition links to CustomerItemData which links to Item and so on
    data = db.query(
        CustomerItemCondition,
        CustomerItemData,
        Item,
        Brand
    ).join(
        CustomerItemData, CustomerItemCondition.customer_item_condition_mapping_id == CustomerItemData.id
    ).join(
        Item, CustomerItemData.item_id == Item.id
    ).join(
        Brand, Item.brand_id == Brand.id
    ).filter(
        CustomerItemCondition.ack_number == request.receipt_number
    ).first()

    if not data:
        raise HTTPException(status_code=404, detail="Data not found based on receipt number")

    # Unpack the data from the joined query result
    condition, item_data, item, brand = data

    return {
        "receipt_number": request.receipt_number,
        "overall_condition": condition.overall_condition,
        "item_description": item.item_description,
        "brand_name": brand.brand_name,
        "original_sales_order_number": item_data.original_sales_order_number,
        "return_order_number": item_data.return_order_number,
        "return_qty": item_data.return_qty,
        "shipping_info": {
            "shipped_to_person": item_data.shipped_to_person,
            "address": item_data.shipped_to_address,
            "city": item_data.city,
            "state": item_data.state,
            "country": item_data.country
        }
    }

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




@app.post("/api/customer-serial-upload/")
async def upload_customer_data(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Upload a CSV file to add or update customer data in the database.
    """
    try:
        content = await file.read()
        decoded_content = content.decode("utf-8").splitlines()
        csv_reader = csv.DictReader(io.StringIO('\n'.join(decoded_content)))

        for row in csv_reader:
            customer = db.query(SalesData).filter(SalesData.SalesOrder == row["SalesOrder"]).first()

            if customer:
                # Update existing customer record
                customer.CustomerAccount = row["CustomerAccount"]
                customer.Name = row["Name"]
                customer.ReturnReasonCode = row["ReturnReasonCode"]
                customer.ReturnStatus = row["ReturnStatus"]
                customer.RMANumber = row["RMANumber"]
                customer.InvoiceAccount = row["InvoiceAccount"]
                customer.OrderType = row["OrderType"]
                customer.CustomerRequisition = row["CustomerRequisition"]
                customer.Status = row["Status"]
                customer.ProjectID = row["ProjectID"]
                customer.DoNotProcess = row["DoNotProcess"]
                customer.Legacy = row["Legacy"]
                customer.Segment = row["Segment"]
                customer.Subsegment = row["Subsegment"]
            else:
                # Create a new customer record
                new_customer = SalesData(**row)
                db.add(new_customer)

        db.commit()
        return {"message": "CSV uploaded successfully and customer data added/updated."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")




@app.get("/api/search-customer-serials")
async def search_customers(query: str = "", db: Session = Depends(get_db)):
    """
    Search for customer data in the database by various fields like SalesOrder, CustomerAccount, Name, etc.
    """
    try:
        results = db.query(SalesData).filter(
            (SalesData.SalesOrder.like(f"%{query}%")) |
            (SalesData.CustomerAccount.like(f"%{query}%")) |
            (SalesData.Name.like(f"%{query}%")) |
            (SalesData.RMANumber.like(f"%{query}%")) |
            (SalesData.OrderType.like(f"%{query}%"))
        ).all()

        # Returning the records as dictionaries for easy JSON serialization
        return [result.__dict__ for result in results]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching customer data: {str(e)}")




@app.get("/api/users")
async def get_users(db: Session = Depends(get_db)):
    try:
        users = db.query(AuditlyUser).all()
        return {
            "message": "Users retrieved successfully.",
            "data": [{
                "user_id": user.auditly_user_id,
                "user_name": user.auditly_user_name,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "gender": user.gender,
                "email": user.email,
                "is_reports_user": user.is_reports_user,
                "is_admin": user.is_admin,
                "is_inpection_user": user.is_inspection_user,
                "user_company": user.user_company 


            } for user in users]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving users: {str(e)}")

# @app.post("/api/onboard")
# async def onboard(request: Onboard, db: Session = Depends(get_db)):   
#     """
#     API to onboard an third party to use api
#     """ 
#     try:  
#         onboard_name = request.onboard_name
#         onboard_email = request.onboard_email
        
#         customer_user_id = f'CUST{_gen_otp()}'
#         token = f'{_gen_otp()}{_gen_otp()}{customer_user_id}{_gen_otp()}'

#         new_user = OnboardUser(
#         onboard_name = onboard_name,
#         onboard_email = onboard_email,
#         token = token,
#         customer_user_id = customer_user_id,
#         )
#         db.add(new_user)
#         db.commit()
#         db.refresh(new_user)


#         customer_data = db.query(OnboardUser).filter(OnboardUser.customer_user_id == customer_user_id).first()

#         subject = """Onboarding Details: Auditly"""
        
#         body = """
# Hello """+onboard_name+""",

# You are now Onboarded!

# Below are the details:

# Customer User ID -  """+customer_data.customer_user_id+"""
# Authorization Token – """+token+"""

# Thanks,
# Audit team
# """
#        # send_email("rahulgr20@gmail.com", "fxei hthz bulr slzh", onboard_email, subject, body)
#         if ENV == "DEV": send_email("rahulgr20@gmail.com", "fxei hthz bulr slzh", onboard_email, subject, body)
#         elif ENV == "TEST":
#             secret_data = get_secret("test/auditly/secrets")
#             send_email(secret_data["from_email_address"], secret_data["from_email_password"], onboard_email, subject, body)
        


#         return {
#             "message": "Onboarded Successfully.",
#             "data": {
#                 "Customer User Id": customer_data.customer_user_id,
#                 "Customer Token": customer_data.token
#             }
#         }
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error processing search: {str(e)}")


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
    if request.receipt_number is None:
        data = db.query(
            CustomerItemCondition,
            CustomerItemData,
            Item,
            Brand,
            BaseData
        ).join(
            CustomerItemData, CustomerItemCondition.customer_item_condition_mapping_id == CustomerItemData.id
        ).join(
            Item, CustomerItemData.item_id == Item.id
        ).join(
            Brand, Item.brand_id == Brand.id
        ).outerjoin(
            BaseData, BaseData.base_to_item_mapping == Item.id
        ).all()
    else:
        data = db.query(
            CustomerItemCondition,
            CustomerItemData,
            Item,
            Brand,
            BaseData
        ).join(
            CustomerItemData, CustomerItemCondition.customer_item_condition_mapping_id == CustomerItemData.id
        ).join(
            Item, CustomerItemData.item_id == Item.id
        ).join(
            Brand, Item.brand_id == Brand.id
        ).outerjoin(
            BaseData, BaseData.base_to_item_mapping == Item.id
        ).filter(
            CustomerItemCondition.ack_number == request.receipt_number
        ).first()
        
        data = [data]

    if not data:
        raise HTTPException(status_code=404, detail="Data not found based on receipt number")

    receipt_data_list = []
    for condition, item_data, item, brand, base_data in data:
        # Construct web-accessible URLs for difference images
        front_diff_url = f"/api/difference-images/{condition.id}/front" if condition.difference_front_image else None
        back_diff_url = f"/api/difference-images/{condition.id}/back" if condition.difference_back_image else None
        
        receipt_data = {
            "receipt_number": condition.ack_number,
            "overall_condition": condition.overall_condition,
            "item_description": item.item_description,
            "brand_name": brand.brand_name,
            "original_sales_order_number": item_data.original_sales_order_number,
            "return_order_number": item_data.return_order_number,
            "return_qty": item_data.return_qty,
            "shipping_info": {
                "shipped_to_person": item_data.shipped_to_person,
                "address": item_data.shipped_to_address,
                "city": item_data.city,
                "state": item_data.state,
                "country": item_data.country
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


# @app.get("/api/powerbi/auth_login")
# async def powerbi_auth_login(request: Request):
#     # Convert URL object to string explicitly
#     redirect_uri = str(request.url_for("powerbi_callback"))
    
#     print("\n=== AUTH_LOGIN START ===")
#     print(f"Initial session keys: {list(request.session.keys())}")
#     print(f"Redirect URI: {redirect_uri} (type: {type(redirect_uri)})")

#     # Generate state
#     state = str(int(time.time()))
#     request.session["oauth_state"] = state
    
#     try:
#         # Use authorize_redirect instead of create_authorization_url
#         return await oauth.microsoft.authorize_redirect(
#             request,
#             redirect_uri,
#             state=state,
#             prompt="select_account"
#         )
#     except Exception as e:
#         print("\n!!! AUTH INITIATION FAILURE !!!")
#         print(f"Error type: {type(e)}")
#         print(f"Error details: {str(e)}")
#         print(f"Traceback: {traceback.format_exc()}")
#         raise HTTPException(
#             status_code=400,
#             detail="Authentication initiation failed. Please check server logs."
#         )


# @app.get("/api/powerbi/callback")
# async def powerbi_callback(request: Request, db: Session = Depends(get_db)):
#     print("\n=== POWERBI CALLBACK STARTED ===")
    
#     try:
#         # Debug incoming request
#         print(f"Query params: {dict(request.query_params)}")
        
#         # Verify state parameter
#         expected_state = request.session.pop("oauth_state", None)
#         received_state = request.query_params.get("state")
        
#         if not expected_state or expected_state != received_state:
#             print("State mismatch error")
#             raise OAuthError("Invalid state parameter")

#         # Get tokens
#         token = await oauth.microsoft.authorize_access_token(request)
#         print("Token received successfully")
        
#         # Decode ID token
#         id_token = token.get('id_token')
#         if not id_token:
#             raise OAuthError("No ID token received")
            
#         claims = jwt.decode(id_token, options={"verify_signature": False})
#         print(f"User claims decoded: {claims.keys()}")

#         # Prepare user data
#         user_data = {
#             'id': claims.get('oid') or claims.get('sub'),
#             'email': claims.get('email') or claims.get('preferred_username'),
#             'name': claims.get('name', ''),
#             'tenant_id': claims.get('tid'),
#             'claims': claims
#         }

#         # Calculate token expiry (1 hour default if not specified)
#         expires_in = token.get("expires_in", 3600)
#         token_expiry = datetime.now(timezone.utc) + timedelta(seconds=expires_in)

#         # Check if user exists
#         existing_user = db.query(PowerBiUser).filter(
#             PowerBiUser.power_bi_user_id == user_data['id']
#         ).first()

#         if existing_user:
#             print("Updating existing user")
#             # print(token['access_token'])
#             headers = {
#                 "Authorization": f"Bearer {token['access_token']}"
#             }

#             # Get all workspaces
#             response = requests.get(
#                 "https://api.powerbi.com/v1.0/myorg/groups",
#                 headers=headers
#             )
#             print(response)
#             existing_user.access_token = token['access_token']
#             if 'refresh_token' in token:
#                 existing_user.refresh_token = token['refresh_token']
#             existing_user.token_expiry = token_expiry
#             existing_user.power_bi_response = user_data['claims']
#         else:
#             print("Creating new user")
#             powerbi_user = PowerBiUser(
#                 power_bi_email=user_data['email'],
#                 power_bi_username=user_data['name'],
#                 power_bi_user_id=user_data['id'],
#                 power_bi_response=user_data['claims'],
#                 access_token=token['access_token'],
#                 refresh_token=token.get('refresh_token', ''),
#                 token_expiry=token_expiry,
#                 tenant_id=user_data['tenant_id'],
#                 created_at=datetime.now(timezone.utc)

#             )
#             db.add(powerbi_user)
        
#         db.commit()
#         print("Data successfully saved to database")

#         # Store minimal session data
#         request.session.update({
#             "powerbi_user_id": user_data['id'],
#             "powerbi_user_email": user_data['email']
#         })

#         return RedirectResponse(url="https://auditlyai.com/auth/success")
        
#     except OAuthError as e:
#         db.rollback()
#         print(f"OAuth error: {str(e)}")
#         return RedirectResponse(url=f"https://auditlyai.com/auth/success/error?message={str(e)}")
        
#     except Exception as e:
#         db.rollback()
#         print(f"Unexpected error: {traceback.format_exc()}")
#         return RedirectResponse(url="https://auditlyai.com/auth/success/error?message=auth_failed")


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
                tenant_id=user_data['tenant_id'],
                created_at=datetime.now(timezone.utc),
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

@app.post("/api/powerbi/get-powerbi-table-columns")
async def get_powerbi_table_column(request: GetPowerBITableColumns, db: Session = Depends(get_db)):
    workspace_id = request.workspace_id
    dataset_id = request.dataset_id
    power_bi_table_name = request.power_bi_table_name

    ACCESS_TOKEN = db.query(PowerBiUser).first().access_token

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

@app.post("/api/power-bi-sql-mapping/")
async def powerbi_sql_mapping(request: PowerBiSqlMappingBase, db: Session = Depends(get_db)):
    """
    Create or update a mapping based on mapping_name. If the mapping_name already exists, update the existing record,
    otherwise create a new mapping record.
    """
    mapping_name = f"{request.user_id}-{request.bi_table_name}-{request.sql_table_name}"

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
            date_filter_value = datetime.strptime(request.date_filter_value, "%m-%d-%Y")

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


@app.get("/api/get-powerbi-dataset-ids")
async def get_dataset_ids(workspace_id: str = Query(..., description="The ID of the Power BI workspace to query."), db: Session = Depends(get_db)):
    """
    Fetch all dataset IDs in the specified Power BI workspace.
    """
    access_token = db.query(PowerBiUser).first().access_token  # Ensure you have a model to fetch this or adapt as needed

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    url = f"https://api.powerbi.com/v1.0/myorg/groups/{workspace_id}/datasets"
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # This will raise an exception for HTTP error codes
        datasets = response.json().get('value', [])
        dataset_ids = [dataset['id'] for dataset in datasets]  # Extract only the IDs
        return {"dataset_ids": dataset_ids}
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))



class GetPowerBITableData(BaseModel):
    workspace_id: str
    dataset_id: str
    sql_table_name: str
    user_id: int
    power_bi_table_name: str
    access_token: Optional[str] = None


# @app.post("/api/powerbi/get-table-data")
# async def get_powerbi_table_data(request: GetPowerBITableData, db: Session = Depends(get_db)):
#     """
#     Fetch table data from Power BI Dataset
#     """
#     sql_table_name = request.sql_table_name
#     user_id = request.user_id
#     workspace_id = request.workspace_id
#     dataset_id = request.dataset_id
#     power_bi_table_name = request.power_bi_table_name

#     power_bi_table_data = db.query(PowerBiSqlMapping).filter(PowerBiSqlMapping.sql_table_name == sql_table_name).filter(PowerBiSqlMapping.power_bi_sql_user_mapping_id == user_id ).first()
#     power_bi_user_mapping = power_bi_table_data.mapping
#     ACCESS_TOKEN = db.query(PowerBiUser).first().access_token
     
#     headers = {
#         "Authorization": f"Bearer {ACCESS_TOKEN}",
#         "Content-Type": "application/json"
#     }

#     url = f"https://api.powerbi.com/v1.0/myorg/groups/{workspace_id}/datasets/{dataset_id}/executeQueries"


#     dax_query = {
#         "queries": [{"query": f"EVALUATE '{power_bi_table_name}'"}], #name of the table in powerbi we are getting it as an input
#         "serializerSettings": {"includeNulls": True}
#     }

#     response = requests.post(url, headers=headers, json=dax_query)
#     print(response)
#     response_table = response.json()["results"][0]["tables"][0]["rows"]
#     bi_response_mapping = response_table.pop(0)
#     availabe_column_name = [k for k,v in power_bi_user_mapping.items()] #columns which user has saved in the frotned from powerbi
#     mapping_dict = {}
#     for key, value in bi_response_mapping.items():
#         if value not in availabe_column_name and value != "id" and value != power_bi_table_data.date_filter_column_name:
#             return {"data": "Mapping Missmatch"}
#         elif value == power_bi_table_data.date_filter_column_name:
#             filter_column = key
#         elif value in availabe_column_name:
#             mapping_dict.update({key:power_bi_user_mapping[value]})
#     table = Table(sql_table_name, metadata, autoload_with=engine)
#     transformed_data = []
#     for record in response_table:
#         filter_check = None
#         formatted_entry = {}
#         for key, value in record.items():
#             if key == filter_column and datetime.strptime(value, "%m-%d-%Y") < power_bi_table_data.date_filter_value:
#                 filter_check = True
#                 continue
#             if key in [k for k,v in mapping_dict.items()]:
#                 formatted_entry[mapping_dict[key]] = value
#         if(not filter_check):
#             transformed_data.append(formatted_entry)
#     db.execute(table.insert(), transformed_data)
#     db.commit()
#     return response.json()




@app.get("/api/powerbi/workspace-data")
async def get_powerbi_workspace_data(db: Session = Depends(get_db)):
    """
    Fetch all datasets and their tables from a Power BI workspace.
    """
    WORKSPACE_ID = "313280a3-6d47-44c9-9c67-9cfaf97fb0b4"
    ACCESS_TOKEN = db.query(PowerBiUser).first().access_token
   
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }

    # Step 1: Get all datasets in the workspace
    datasets_url = f"https://api.powerbi.com/v1.0/myorg/groups/{WORKSPACE_ID}/datasets"
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

        tables_url = f"https://api.powerbi.com/v1.0/myorg/groups/{WORKSPACE_ID}/datasets/{dataset_id}/tables"
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

    return {"workspace_id": WORKSPACE_ID, "datasets": all_data}



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

    power_bi_table_data = db.query(PowerBiSqlMapping).filter(PowerBiSqlMapping.sql_table_name == sql_table_name).filter(PowerBiSqlMapping.power_bi_sql_user_mapping_id == user_id ).first()
    power_bi_user_mapping = power_bi_table_data.mapping
    ACCESS_TOKEN = db.query(PowerBiUser).first().access_token
     
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
    print(response)
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

@app.post("/api/add-cronjobs")
async def create_or_update_cron_job(cron_job_data: CronJobCreate, db: Session = Depends(get_db)):
    """
    Create a new cron job or update an existing one in the database.
    """
    # Check if there is already a cron job for the given user ID and mapping name
    existing_cron_job = db.query(CronJobTable).filter(
        CronJobTable.auditly_user_id == cron_job_data.auditly_user_id,
        CronJobTable.cron_to_mapping_name == cron_job_data.cron_to_mapping_name
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
            auditly_user_id=cron_job_data.auditly_user_id
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
    print(cron_entry)
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


@app.get("/api/power-bi-users")
def get_power_bi_users(db: Session = Depends(get_db)):
    try:
        users = db.query(PowerBiUser).all()
        return [
            {
                "power_bi_email": user.power_bi_email,
                "power_bi_username": user.power_bi_username,
            }
            for user in users
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching Power BI users: {str(e)}")

