import os
import numpy as np
import csv
import cv2
import random
import io
import datetime
import base64
from send_email import send_email
from pydantic import BaseModel
from database import engine, SessionLocal
from models import Base, Item, CustomerItemData, CustomerData, BaseData, ReturnDestination, CustomerItemCondition, AuditlyUser, Brand, OnboardUser, SalesData
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Query
from sqlalchemy.orm import Session
from typing import Optional
from sqlalchemy import distinct, desc, or_
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input
from tensorflow.keras.preprocessing.image import img_to_array, load_img
from tensorflow.keras.models import Model
from skimage.metrics import structural_similarity as ssim

# Initialize the database tables if not already done
Base.metadata.create_all(bind=engine)

def get_db():
    """Provide a database session to the API endpoints."""
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/item_order_instance")
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


@app.post("/upload-customer-images")
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
    
    UPLOAD_DIRECTORY = "/home/ec2-user/auditly/static/customer_image"   
    

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


@app.get("/customer-images/{id}")
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

@app.get("/base-images/{id}")
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
    base_data = db.query(BaseData).filter(BaseData.id == id).first()

    # Check if the record exists
    if not base_data:
        raise HTTPException(status_code=404, detail="Base images not found")

    # Return the image paths
    return {
        "id": base_data.id,
        "front_image_path": base_data.base_front_image,
        "back_image_path": base_data.base_back_image,
    }

class CompareImagesRequest(BaseModel):
    customer_id: int
    item_id: int
@app.post("/upload-customer-return-item-data")
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
    
@app.get("/search-customer-return-item-data")
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

@app.post("/upload-items-csv")
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

@app.get("/search-items")
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


@app.post("/upload-base-images/")
async def upload_base_images(
    item_number: int,
    front_image: UploadFile = File(...),
    back_image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload base front and back images and map them to an item based on item_number.
    """
    UPLOAD_DIRECTORY = "/home/ec2-user/auditly/static/base_images"

    # Check if the item exists
    item = db.query(Item).filter(Item.item_number == item_number).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found for the given item_number")

    # Save front image
    front_image_path = os.path.join(UPLOAD_DIRECTORY, front_image.filename)
    with open(front_image_path, "wb") as f:
        f.write(await front_image.read()) 

    # Save back image
    back_image_path = os.path.join(UPLOAD_DIRECTORY, back_image.filename)
    with open(back_image_path, "wb") as f:
        f.write(await back_image.read())

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
            "id": new_base_data.id,
            "front_image_path": front_image_path,
            "back_image_path": back_image_path,
            "item_number": item_number
        }
    }

# @app.get("/items")
# async def get_items(db: Session = Depends(get_db)):
#     items = db.query(Item).all()
#     return items

@app.get("/items")
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
# @app.get("/customer-item-data")
# async def get_customer_item_data(db: Session = Depends(get_db)):
#     customer_item_data = db.query(CustomerItemData).all()
#     return customer_item_data


@app.get("/customer-item-data")
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

    
    


@app.get("/item-details/{return_order_number}")
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



class AuditlyUserRequest(BaseModel):
    user_name : str
    first_name: str
    last_name: str
    gender: str
    email: str
    password: str


@app.post("/register")
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

        # Check if the username already exists
        existing_user = db.query(AuditlyUser).filter(AuditlyUser.auditly_user_name == auditly_user_name).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already exists. Please choose a different username.")

        new_user = AuditlyUser(
            auditly_user_name = auditly_user_name,
            first_name = first_name,
            last_name = last_name,
            gender = gender,
            email = email,
            password = password
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


class LoginRequest(BaseModel):
    user_name : str
    password: str

@app.post("/login")
async def login(request: LoginRequest, db: Session = Depends(get_db)):   
    """
    API for logging in with user id and passoword.
    """ 
    try:  
        auditly_user_name = request.user_name
        password = request.password

        user_data = db.query(AuditlyUser).filter(AuditlyUser.auditly_user_name == auditly_user_name).filter(AuditlyUser.password == password).first()

        if user_data:
            otp_login = _gen_otp()
            user_data.reset_otp = otp_login
            user_data.reset_otp_expiration = datetime.datetime.now()+datetime.timedelta(seconds=600)
            db.commit()
            db.refresh(user_data)
            send_email("rahulgr20@gmail.com", "fxei hthz bulr slzh", user_data.email, "Login OTP", "Pleae find the OPT login: "+str(otp_login))
            return {
                "message": "OTP Sent Successfully to registerd email",
                "auditly_user_name": user_data.auditly_user_name,
                "user_type": user_data.user_type
             }
        else:
            return {
                "message": "Invalid Username or Password",
             }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing search: {str(e)}")


class VerifyLogin(BaseModel):
    user_name : str
    login_otp: str

@app.post("/verify-login-otp")
async def verify_login_otp(request: VerifyLogin, db: Session = Depends(get_db)):
    """
    API for verifying otp to login
    """
    auditly_user_name = request.user_name
    login_otp = request.login_otp

    user_data = db.query(AuditlyUser).filter(
        AuditlyUser.auditly_user_name == auditly_user_name,
        AuditlyUser.reset_otp == login_otp
    ).first()

    if user_data:
        user_data.last_login_time = datetime.datetime.now()
        db.commit()
        db.refresh(user_data)
        return {
            "message": "Login Successfull",
            "data": {
                "User ID": user_data.auditly_user_id,
                "User Name": user_data.auditly_user_name,
                "user_type": user_data.user_type  # Include user_type in the response
            }
        }
    else:
        return {
            "message": "Invalid User Name or otp",
        }
    
class LogoutRequest(BaseModel):
    user_name : str
    user_id: str


@app.post("/logout")
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

class ForgetPassword(BaseModel):
    user_name : str
    user_id: str

@app.post("/forget-password")
async def forget_password(request: ForgetPassword, db: Session = Depends(get_db)):   
    """
    API to send otp to reset password 
    """ 
    try:  
        auditly_user_name = request.user_name
        auditly_user_id = request.user_id

        user_data = db.query(AuditlyUser).filter(or_(AuditlyUser.auditly_user_name == auditly_user_name,AuditlyUser.auditly_user_id == auditly_user_id)).first()

        if user_data:
            otp = _gen_otp()
            user_data.reset_otp = otp
            user_data.reset_otp_expiration = datetime.datetime.now()+datetime.timedelta(seconds=600)
            db.commit()
            db.refresh(user_data)
            print(send_email)
            send_email("rahulgr20@gmail.com", "fxei hthz bulr slzh", user_data.email, "Reset OTP", "Pleae find the OPT to restet your password: "+str(otp))
            return {
                "message": "OTP Sent Successfully to registerd email"
             }
        else:
            return {
                "message": "User does not exist"
             }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing search: {str(e)}")



class ResettPassword(BaseModel):
    user_name : str
    email : str
    otp : str
    password : str

@app.post("/reset-password")
async def reset_password(request: ResettPassword, db: Session = Depends(get_db)):   
    """
    API to send otp to reset password 
    """ 
    # try:  
    auditly_user_name = request.user_name
    email = request.email
    reset_opt = request.otp
    new_password = request.password

    user_data = db.query(AuditlyUser).filter(AuditlyUser.auditly_user_name == auditly_user_name,AuditlyUser.email == email,AuditlyUser.reset_otp == reset_opt).first()
    if user_data and user_data.reset_otp_expiration > datetime.datetime.now():
        user_data.password = new_password
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



@app.post("/compare-images/")
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

The serial """+str(serial_number)+ """returned by the customer """+str(account_name)+""" – """+str(account_number)+""" was inspected for returns and found to be """+condition+""" 

Below are the reference details:

Customer_Name –  """+account_name+"""
Customer_Account – """+str(account_number)+"""
Serial_Number – """+str(serial_number)+"""
Sales Order number- """+str(sales_order_number)+"""
Return Order Number- """+str(return_order_number)+"""
Inspection Number - """+str(receipt_number)+"""

Returned Images are atached.

Thanks,
Audit team
"""
    print(customer_email)
    send_email("rahulgr20@gmail.com", "fxei hthz bulr slzh", customer_email, subject, body, [user_front_image, user_back_image])


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

# Pydantic models
class CompareImagesRequest(BaseModel):
    customer_id: int
    item_id: int

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

    output_dir = "/home/ec2-user/auditly/image_outputs/"+path
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    output_path = os.path.join(output_dir, f"{view}_differences.png")
    cv2.imwrite(output_path, img2)

    return output_path

# Function to encode image to Base64
def encode_image_to_base64(image_path):
    with open(image_path, "rb") as img_file:
        return base64.b64encode(img_file.read()).decode('utf-8')

class ReceiptSearchRequest(BaseModel):
    receipt_number: str

@app.post("/get-receipt-data/")
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



class ReceiptSearch(BaseModel):
    search_user_id: str
    receipt_number: Optional[str] = None
    token: Optional[str] = None

# @app.post("/get-inspection-data")
# async def get_receipt_data(request: ReceiptSearch, db: Session = Depends(get_db)):
#     request_user_id = request.search_user_id
#     token = request.token
#     user_data = db.query(AuditlyUser).filter(AuditlyUser.auditly_user_id == request_user_id).first()
#     print(user_data)
#     customer_data = db.query(OnboardUser).filter(OnboardUser.customer_user_id == request_user_id).filter(OnboardUser.token == request.token).first()
#     if not ((user_data and not token) or (token and customer_data)): 
#           return {
#             "message": "Invalid User",
#     }

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

@app.post("/get-inspection-data")
async def get_receipt_data(request: ReceiptSearch, db: Session = Depends(get_db)):
    request_user_id = request.search_user_id
    token = request.token
    user_data = db.query(AuditlyUser).filter(AuditlyUser.auditly_user_id == request_user_id).first()
    customer_data = db.query(OnboardUser).filter(
        OnboardUser.customer_user_id == request_user_id, OnboardUser.token == request.token
    ).first()
    
    if not ((user_data and not token) or (token and customer_data)):
        return {"message": "Invalid User"}
    
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
    ).all()
    
    if not data:
        raise HTTPException(status_code=404, detail="Data not found")
    
    receipt_data_list = []
    for condition, item_data, item, brand in data:
        receipt_data_list.append({
            "shipped_to_person": item_data.shipped_to_person,
            "original_sales_order_number": item_data.original_sales_order_number,
            "item_number": item.item_number,
            "item_description": item.item_description,
            "original_sales_order_line": item_data.original_sales_order_line,
            "serial_number": item_data.serial_number,
            "return_order_number": item_data.return_order_number,
            "date_purchased": item_data.date_purchased,
            "date_shipped": item_data.date_shipped,
            "date_delivered": item_data.date_delivered,
            "return_created_date": item_data.return_created_date,
            "ack_number": condition.ack_number,
            "difference_front_image": condition.difference_front_image,
            "difference_back_image": condition.difference_back_image
        })
    
    return receipt_data_list

@app.get("/base-images/mapping/{base_to_item_mapping}")
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



class UpdateProfileRequest(BaseModel):
    user_name: str
    first_name: str = None
    last_name: str = None
    gender: str = None
    email: str = None

    
@app.put("/update-profile")
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


@app.get("/sales-data")
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




@app.post("/customer-serial-upload/")
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




@app.get("/search-customer-serials")
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



@app.get("/users")
async def get_users(db: Session = Depends(get_db)):
    try:
        users = db.query(AuditlyUser).all()
        return {
            "message": "Users retrieved successfully.",
            "data": [{
                "user_name": user.auditly_user_name,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "gender": user.gender,
                "email": user.email
            } for user in users]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving users: {str(e)}")



class Onboard(BaseModel):
    onboard_name: str
    onboard_email: str

@app.post("/onboard")
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
        send_email("rahulgr20@gmail.com", "fxei hthz bulr slzh", onboard_email, subject, body)


        return {
            "message": "Onboarded Successfully.",
            "data": {
                "Customer User Id": customer_data.customer_user_id,
                "Customer Token": customer_data.token
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing search: {str(e)}")


