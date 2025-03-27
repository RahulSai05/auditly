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
import requests 
import httpx
import traceback
import time     
import httpx
import jwt
import json
from authlib.integrations.base_client.errors import MismatchingStateError, OAuthError
from send_email import send_email
from settings import ENV
from datetime import datetime, timedelta, timezone    
from secret import get_secret
from pydantic import BaseModel
from jwt import decode as jwt_decode
from email_body import _login_email_body, _forget_password_email_body, _generate_inspection_email_body, _generate_inspection_email_subject
from request_models import CompareImagesRequest, AuditlyUserRequest, LoginRequest, VerifyLogin, LogoutRequest, ForgetPassword, ResettPassword, ReceiptSearchRequest, UpdateProfileRequest, Onboard, UpdateUserTypeRequest, ReceiptSearch
from database import engine, SessionLocal
from models import Base, Item, CustomerItemData, CustomerData, BaseData, ReturnDestination, CustomerItemCondition, AuditlyUser, Brand, OnboardUser, SalesData, PowerBiUser, PowerBiSqlMapping
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Query, Request
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import Optional
from sqlalchemy import distinct, desc, or_
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
    client_kwargs={
        "scope": "openid profile email https://analysis.windows.net/powerbi/api/.default",
        "prompt": "select_account",  # Forces account selection
        # "tenant": "common",  # Allow work/school accounts (use "common" for personal accounts too)
        "response_type": "code",

    },
    server_metadata_url=f"https://login.microsoftonline.com/{AZURE_TENANT_ID}/v2.0/.well-known/openid-configuration",
    authorize_url=f"https://login.microsoftonline.com/{AZURE_TENANT_ID}/oauth2/v2.0/authorize",
    access_token_url=f"https://login.microsoftonline.com/{AZURE_TENANT_ID}/oauth2/v2.0/token",
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

    # existing_customer_data = db.query(CustomerData).filter_by(customer_item_data_id=customer_item_data_id).first()
    
    # if ENV == "TEST":UPLOAD_DIRECTORY = "/auditly/static/customer_image"   
    # elif ENV == "DEV":UPLOAD_DIRECTORY = "/Users/rahul/Desktop/auditly/customer_image"   


    # # Define S3 file paths
    # front_image_path = os.path.join(UPLOAD_DIRECTORY, front_image.filename)
    # back_image_path = os.path.join(UPLOAD_DIRECTORY, back_image.filename)

    
    # # try:
    # # Save front image
    # if front_image and back_image:
    #     # front_image_path = os.path.join(UPLOAD_DIRECTORY, front_image.filename)
    #     # with open(front_image_path, "wb") as f:
    #     #     f.write(await front_image.read())

    #     # # Save back image
    #     # back_image_path = os.path.join(UPLOAD_DIRECTORY, back_image.filename)
    #     # with open(back_image_path, "wb") as f:
    #     #     f.write(await back_image.read())
    #     # Create S3 client
    #     s3_client = boto3.client(
    #         "s3",
    #         aws_access_key_id=aws_access_key,
    #         aws_secret_access_key=aws_secret_key
    #     )
    #     # Upload front image
    #     s3_client.upload_fileobj(front_image.file, s3_bucket, front_image_path)

    #     # Upload back image
    #     s3_client.upload_fileobj(back_image.file, s3_bucket, back_image_path)

    # else:
    #     front_image_path, back_image_path = None, None
        

    # # Save file paths in the database
    # if not existing_customer_data: 
    #     new_customer_data = CustomerData(
    #         customer_item_data_id=customer_item_data_id,
    #         customer_front_image=front_image_path,
    #         customer_back_image=back_image_path,
    #         factory_seal=factory_seal,
    #         no_factory_seal=no_factory_seal,
    #         minimal_tear=minimal_tear,
    #         no_package=no_package,
    #         new_conditiono=new_conditiono,
    #         not_new_condition=not_new_condition,
    #         bio_stains=bio_stains,
    #         package_stains=package_stains,
    #     )
    #     db.add(new_customer_data)
    #     db.commit()
    #     db.refresh(new_customer_data)
    # else:
    #     existing_customer_data.customer_front_image = front_image_path or existing_customer_data.customer_front_image
    #     existing_customer_data.customer_back_image = back_image_path or existing_customer_data.customer_back_image
    #     existing_customer_data.factory_seal = factory_seal
    #     existing_customer_data.no_factory_seal = no_factory_seal
    #     existing_customer_data.minimal_tear = minimal_tear
    #     existing_customer_data.no_package = no_package
    #     existing_customer_data.new_conditiono = new_conditiono
    #     existing_customer_data.not_new_condition = not_new_condition
    #     existing_customer_data.bio_stains = bio_stains
    #     existing_customer_data.package_stains = package_stains
    #     db.commit()
    #     db.refresh(existing_customer_data)

    # return {
    #     "message": "Images uploaded and saved successfully.",
    #     "data": {
    #         "id": customer_item_data_id,
    #         "front_image_path": front_image_path,
    #         "back_image_path": back_image_path,
    #     },
    # }

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
        decoded_content = content.decode("utf-8").splitlines()
        csv_reader = csv.DictReader(decoded_content)

        for row in csv_reader:
            item_number = int(row["item_number"])
            brand_id = int(row["brand_id"])

            # Check if the item already exists
            existing_item = db.query(Item).filter(Item.item_number == item_number).first()

            if existing_item:
                # Update the existing item
                existing_item.item_description = row["item_description"]
                existing_item.brand_id = brand_id
                existing_item.category = row["category"]
                existing_item.configuration = row["configuration"]
            else:
                # Create a new item
                new_item = Item(
                    item_number=item_number,
                    item_description=row["item_description"],
                    brand_id=brand_id,
                    category=row["category"],
                    configuration=row["configuration"],
                )
                db.add(new_item)

        db.commit()
        return {"message": "CSV uploaded successfully and items added/updated."}
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
            user_data.reset_otp_expiration = datetime.datetime.now()+datetime.timedelta(seconds=600)
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
        user_data.last_login_time = datetime.datetime.now()
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
            user_data.last_logout_time = datetime.datetime.now()
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


# @app.post("/forget-password")
# async def forget_password(request: ForgetPassword, db: Session = Depends(get_db)):   
#     """
#     API to send otp to reset password 
#     """ 
#     try:  
#         auditly_user_name = request.user_name
#         auditly_user_id = request.user_id

#         user_data = db.query(AuditlyUser).filter(or_(AuditlyUser.auditly_user_name == auditly_user_name,AuditlyUser.auditly_user_id == auditly_user_id)).first()

#         if user_data:
#             otp = _gen_otp()
#             user_data.reset_otp = otp
#             user_data.reset_otp_expiration = datetime.datetime.now()+datetime.timedelta(seconds=600)
#             db.commit()
#             db.refresh(user_data)
#             print(send_email)
#             if ENV == "DEV":
#                 email_body = """
# Dear User,

# We received a request to reset your password for your Auditly account. To proceed, please use the One-Time Password (OTP) provided below:

# Your OTP to Reset Password:
# {otp}

# This OTP is valid for the next 5 minutes. For security reasons, please do not share this code with anyone.

# If you did not request this password reset, please contact our support team immediately at support@auditly.com or visit our Help Center: https://www.auditlyai.com/help-center.

# Best regards,
# The Auditly Team
# """
#                 send_email("rahulgr20@gmail.com", "fxei hthz bulr slzh", user_data.email, "Reset Your Auditly Password", email_body.format(otp=str(otp)))

#             elif ENV == "TEST":
#                 secret_data = get_secret("test/auditly/secrets")
#                 email_body = """
# Dear User,

# We received a request to reset your password for your Auditly account. To proceed, please use the One-Time Password (OTP) provided below:

# Your OTP to Reset Password:
# {otp}

# This OTP is valid for the next 5 minutes. For security reasons, please do not share this code with anyone.

# If you did not request this password reset, please contact our support team immediately at support@auditly.com or visit our Help Center: https://www.auditlyai.com/help-center.

# Best regards,
# The Auditly Team
# """
#                 send_email(secret_data["from_email_address"], secret_data["from_email_password"], user_data.email, "Reset Your Auditly Password", email_body.format(otp=str(otp)))            
#             return {
#                 "message": "OTP Sent Successfully to registerd email"
#              }
#         else:
#             return {
#                 "message": "User does not exist"
#              }
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error processing search: {str(e)}")

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
            user_data.reset_otp_expiration = datetime.datetime.now() + datetime.timedelta(seconds=600)
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
    if user_data and user_data.reset_otp_expiration > datetime.datetime.now():
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

@app.post("/api/onboard")
async def onboard(request: Onboard, db: Session = Depends(get_db)):   
    """
    API to onboard an third party to use api
    """ 
    try:  
        onboard_name = request.onboard_name
        onboard_email = request.onboard_email
        
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


        customer_data = db.query(OnboardUser).filter(OnboardUser.customer_user_id == customer_user_id).first()

        subject = """Onboarding Details: Auditly"""
        
        body = """
Hello """+onboard_name+""",

You are now Onboarded!

Below are the details:

Customer User ID -  """+customer_data.customer_user_id+"""
Authorization Token – """+token+"""

Thanks,
Audit team
"""
       # send_email("rahulgr20@gmail.com", "fxei hthz bulr slzh", onboard_email, subject, body)
        if ENV == "DEV": send_email("rahulgr20@gmail.com", "fxei hthz bulr slzh", onboard_email, subject, body)
        elif ENV == "TEST":
            secret_data = get_secret("test/auditly/secrets")
            send_email(secret_data["from_email_address"], secret_data["from_email_password"], onboard_email, subject, body)
        


        return {
            "message": "Onboarded Successfully.",
            "data": {
                "Customer User Id": customer_data.customer_user_id,
                "Customer Token": customer_data.token
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing search: {str(e)}")

   
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

# @app.get("/api/images/{item_number}") 
# async def get_images_by_item_number(item_number: int, db: Session = Depends(get_db)):
#     """
#     Retrieve base front and back images using the item number.

#     Args:
#         item_number (int): The item number to fetch images for.
#         db (Session): The database session dependency.

#     Returns:
#         dict: Contains the item details and relative image paths.
#     """
#     # Fetch the item based on the item_number
#     item = db.query(Item).filter(Item.item_number == item_number).first()
    
#     if not item:
#         raise HTTPException(status_code=404, detail="Item not found")

#     # Fetch the base image data using the item's ID
#     base_data = db.query(BaseData).filter(BaseData.base_to_item_mapping == item.id).first()

#     if not base_data:
#         raise HTTPException(status_code=404, detail="Base images not found for this item")

#     # Return relative paths for the images
#     return {
#         "item_id": item.id,
#         "item_number": item.item_number,
#         "item_description": item.item_description,
#         "brand_id": item.brand_id,
#         "category": item.category,
#         "configuration": item.configuration,
#         "front_image_path": f"/static/base_images/{os.path.basename(base_data.base_front_image)}",  # Relative path
#         "back_image_path": f"/static/base_images/{os.path.basename(base_data.base_back_image)}",    # Relative path
#     }

# @app.post("/api/get-inspection-data")
# async def get_receipt_data(request: ReceiptSearch, db: Session = Depends(get_db)):
#     # request_user_id = request.search_user_id
#     # token = request.token
#     # user_data = db.query(AuditlyUser).filter(AuditlyUser.auditly_user_id == request_user_id).first()
#     # print(user_data)
#     # customer_data = db.query(OnboardUser).filter(OnboardUser.customer_user_id == request_user_id).filter(OnboardUser.token == request.token).first()
#     # if not ((user_data and not token) or (token and customer_data)): 
#     #       return {
#     #         "message": "Invalid User",
#     # }
#     if request.receipt_number is None:
#         data = db.query(
#             CustomerItemCondition,
#             CustomerItemData,
#             Item,
#             Brand
#         ).join(
#             CustomerItemData, CustomerItemCondition.customer_item_condition_mapping_id == CustomerItemData.id
#         ).join(
#             Item, CustomerItemData.item_id == Item.id
#         ).join(
#             Brand, Item.brand_id == Brand.id
#         ).all()
#     else:
#         data = db.query(
#             CustomerItemCondition,
#             CustomerItemData,
#             Item,
#             Brand
#         ).join(
#             CustomerItemData, CustomerItemCondition.customer_item_condition_mapping_id == CustomerItemData.id
#         ).join(
#             Item, CustomerItemData.item_id == Item.id
#         ).join(
#             Brand, Item.brand_id == Brand.id
#         ).filter(
#             CustomerItemCondition.ack_number == request.receipt_number
#         ).first()
         
#         data = [data]

#     if not data:
#         raise HTTPException(status_code=404, detail="Data not found based on receipt number")

#     receipt_data_list = []
#     for condition, item_data, item, brand in data:
#         receipt_data_list.append({
#             "receipt_number": condition.ack_number,
#             "overall_condition": condition.overall_condition,
#             "item_description": item.item_description,
#             "brand_name": brand.brand_name,
#             "original_sales_order_number": item_data.original_sales_order_number,
#             "return_order_number": item_data.return_order_number,
#             "return_qty": item_data.return_qty,
#             "shipping_info": {
#                 "shipped_to_person": item_data.shipped_to_person,
#                 "address": item_data.shipped_to_address,
#                 "city": item_data.city,
#                 "state": item_data.state,
#                 "country": item_data.country
#             }
#         })
#     return receipt_data_list


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


# @app.post("/api/get-inspection-data")
# async def get_receipt_data(request: ReceiptSearch, db: Session = Depends(get_db)):
#     # Authentication checks (commented out as per your example)
#     # if request.receipt_number is None:
#     #     data = db.query(
#     #         CustomerItemCondition,
#     #         CustomerItemData,
#     #         Item,
#     #         Brand
#     #     ).join(
#     #         CustomerItemData, CustomerItemCondition.customer_item_condition_mapping_id == CustomerItemData.id
#     #     ).join(
#     #         Item, CustomerItemData.item_id == Item.id
#     #     ).join(
#     #         Brand, Item.brand_id == Brand.id
#     #     ).all()
#     # else:
#     #     data = db.query(
#     #         CustomerItemCondition,
#     #         CustomerItemData,
#     #         Item,
#     #         Brand
#     #     ).join(
#     #         CustomerItemData, CustomerItemCondition.customer_item_condition_mapping_id == CustomerItemData.id
#     #     ).join(
#     #         Item, CustomerItemData.item_id == Item.id
#     #     ).join(
#     #         Brand, Item.brand_id == Brand.id
#     #     ).filter(
#     #         CustomerItemCondition.ack_number == request.receipt_number
#     #     ).first()
#     #     
#     #     data = [data]

#     # Modified query to include base_data for images
#     if request.receipt_number is None:
#         data = db.query(
#             CustomerItemCondition,
#             CustomerItemData,
#             Item,
#             Brand,
#             BaseData  # Added BaseData to the query
#         ).join(
#             CustomerItemData, CustomerItemCondition.customer_item_condition_mapping_id == CustomerItemData.id
#         ).join(
#             Item, CustomerItemData.item_id == Item.id
#         ).join(
#             Brand, Item.brand_id == Brand.id
#         ).outerjoin(  # Using outerjoin in case base images don't exist
#             BaseData, BaseData.base_to_item_mapping == Item.id
#         ).all()
#     else:
#         data = db.query(
#             CustomerItemCondition,
#             CustomerItemData,
#             Item,
#             Brand,
#             BaseData  # Added BaseData to the query
#         ).join(
#             CustomerItemData, CustomerItemCondition.customer_item_condition_mapping_id == CustomerItemData.id
#         ).join(
#             Item, CustomerItemData.item_id == Item.id
#         ).join(
#             Brand, Item.brand_id == Brand.id
#         ).outerjoin(  # Using outerjoin in case base images don't exist
#             BaseData, BaseData.base_to_item_mapping == Item.id
#         ).filter(
#             CustomerItemCondition.ack_number == request.receipt_number
#         ).first()
        
#         data = [data]

#     if not data:
#         raise HTTPException(status_code=404, detail="Data not found based on receipt number")

#     receipt_data_list = []
#     for condition, item_data, item, brand, base_data in data:  # Now unpacking base_data too
#         receipt_data = {
#             "receipt_number": condition.ack_number,
#             "overall_condition": condition.overall_condition,
#             "item_description": item.item_description,
#             "brand_name": brand.brand_name,
#             "original_sales_order_number": item_data.original_sales_order_number,
#             "return_order_number": item_data.return_order_number,
#             "return_qty": item_data.return_qty,
#             "shipping_info": {
#                 "shipped_to_person": item_data.shipped_to_person,
#                 "address": item_data.shipped_to_address,
#                 "city": item_data.city,
#                 "state": item_data.state,
#                 "country": item_data.country
#             },
#             # Adding image data
#             "images": {
#                 "difference_images": {
#                     "front": condition.difference_front_image,
#                     "back": condition.difference_back_image
#                 },
#                 "similarity_scores": {
#                     "front": condition.front_similarity,
#                     "back": condition.back_similarity,
#                     "average": condition.average_ssi
#                 }
#             }
#         }
        
#         # Add base images if they exist
#         if base_data:
#             receipt_data["images"]["base_images"] = {
#                 "front": base_data.base_front_image,
#                 "back": base_data.base_back_image
#             }
        
#         receipt_data_list.append(receipt_data)
    
#     return receipt_data_list


from fastapi import HTTPException
from fastapi.responses import FileResponse
import os

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

# Add these new endpoints to serve images
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




@app.get("/powerbi/auth_login")
async def powerbi_auth_login(request: Request):
    # Convert URL object to string explicitly
    # redirect_uri = str(request.url_for("powerbi_callback"))
    redirect_uri = "https://auditlyai.com/powerbi/callback"

    
    print("\n=== AUTH_LOGIN START ===")
    print(f"Initial session keys: {list(request.session.keys())}")
    print(f"Redirect URI: {redirect_uri} (type: {type(redirect_uri)})")

    # Generate state
    state = str(int(time.time()))
    request.session["oauth_state"] = state
    
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


@app.get("/powerbi/callback")
async def powerbi_callback(request: Request, db: Session = Depends(get_db)):
    print("\n=== POWERBI CALLBACK STARTED ===")
    
    try:
        # Debug incoming request
        print(f"Query params: {dict(request.query_params)}")
        
        # Verify state parameter
        expected_state = request.session.pop("oauth_state", None)
        received_state = request.query_params.get("state")
        
        if not expected_state or expected_state != received_state:
            print("State mismatch error")
            raise OAuthError("Invalid state parameter")

        # Get tokens
        token = await oauth.microsoft.authorize_access_token(request)
        print("Token received successfully")
        
        # Decode ID token
        id_token = token.get('id_token')
        if not id_token:
            raise OAuthError("No ID token received")
            
        claims = jwt.decode(id_token, options={"verify_signature": False})
        print(f"User claims decoded: {claims.keys()}")

        # Prepare user data
        user_data = {
            'id': claims.get('oid') or claims.get('sub'),
            'email': claims.get('email') or claims.get('preferred_username'),
            'name': claims.get('name', ''),
            'tenant_id': claims.get('tid'),
            'claims': claims
        }

        # Calculate token expiry (1 hour default if not specified)
        expires_in = token.get("expires_in", 3600)
        token_expiry = datetime.now(timezone.utc) + timedelta(seconds=expires_in)

        # Check if user exists
        existing_user = db.query(PowerBiUser).filter(
            PowerBiUser.power_bi_user_id == user_data['id']
        ).first()

        if existing_user:
            print("Updating existing user")
            # print(token['access_token'])
            headers = {
                "Authorization": f"Bearer {token['access_token']}"
            }

            # Get all workspaces
            response = requests.get(
                "https://api.powerbi.com/v1.0/myorg/groups",
                headers=headers
            )
            print(response)
            existing_user.access_token = token['access_token']
            if 'refresh_token' in token:
                existing_user.refresh_token = token['refresh_token']
            existing_user.token_expiry = token_expiry
            existing_user.power_bi_response = user_data['claims']
        else:
            print("Creating new user")
            powerbi_user = PowerBiUser(
                power_bi_email=user_data['email'],
                power_bi_username=user_data['name'],
                power_bi_user_id=user_data['id'],
                power_bi_response=user_data['claims'],
                access_token=token['access_token'],
                refresh_token=token.get('refresh_token', ''),
                token_expiry=token_expiry,
                tenant_id=user_data['tenant_id'],
                created_at=datetime.now(timezone.utc)

            )
            db.add(powerbi_user)
        
        db.commit()
        print("Data successfully saved to database")

        # Store minimal session data
        request.session.update({
            "powerbi_user_id": user_data['id'],
            "powerbi_user_email": user_data['email']
        })

        return RedirectResponse(url="https://auditlyai.com/dashboard")
        
    except OAuthError as e:
        db.rollback()
        print(f"OAuth error: {str(e)}")
        return RedirectResponse(url=f"http://localhost:3000/error?message={str(e)}")
        
    except Exception as e:
        db.rollback()
        print(f"Unexpected error: {traceback.format_exc()}")
        return RedirectResponse(url="http://localhost:3000/error?message=auth_failed")
    
