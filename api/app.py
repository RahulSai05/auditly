import os
import numpy as np
import csv
from send_email import send_email
from pydantic import BaseModel
from database import engine, SessionLocal
from models import Base, Brand, Item, CustomerItemData, CustomerData, BaseData, ReturnDestination, CustomerItemCondition
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import distinct
from fastapi.middleware.cors import CORSMiddleware
from io import StringIO
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
    allow_origins=["http://localhost:3000"],  # React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/item_order_instance")
async def get_item_instance_details(order_number: str, db: Session = Depends(get_db)):
    """
    Retrieve details of an item instance based on the Serial Number or Return Order Number.
    """
    item_instance = db.query(CustomerItemData).filter(
        (CustomerItemData.serial_number == order_number) |
        (CustomerItemData.return_order_number == order_number)
    ).first()

    if not item_instance:
        raise HTTPException(status_code=404, detail="Item Instance not found")

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
        "customer_id": item_instance.id 
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
    
    UPLOAD_DIRECTORY = "/Users/rahul/Desktop/auditly/customer_image"   
    

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

@app.post("/compare-images/")
async def compare_images(request: CompareImagesRequest, db: Session = Depends(get_db)):
    """
    Compare base and customer images and return similarity scores.
    """
    # Extract base_id and customer_id
    customer_id = request.customer_id
    item_id = request.item_id

    # Retrieve base data
    base_data = db.query(BaseData).filter(BaseData.base_to_item_mapping == item_id).first()
    if not base_data:
        raise HTTPException(status_code=404, detail="Base images not found")

    # Retrieve customer data
    customer_data = db.query(CustomerData).filter(CustomerData.id == customer_id).first()
    if not customer_data:
        raise HTTPException(status_code=404, detail="Customer images not found")

    # Perform comparisons
    front_similarity = calculate_similarity(base_data.base_front_image, customer_data.customer_front_image)
    back_similarity = calculate_similarity(base_data.base_back_image, customer_data.customer_back_image)

    ssi_front = calculate_ssi(base_data.base_front_image, customer_data.customer_front_image)
    ssi_back = calculate_ssi(base_data.base_back_image, customer_data.customer_back_image)

    average_ssi = (ssi_front + ssi_back) / 2

    # Classification logic
    def classify_condition(front_score, back_score, ssi_score):
        average_score = (front_score + back_score) / 2
        if front_score < 0.40 or back_score < 0.40 or ssi_score < 0.5:
            return "Damaged"
        if average_score > 0.85 and ssi_score > 0.7:
            return "Used"
        elif average_score > 0.75 and ssi_score > 0.6:
            return "Like-New"
        elif average_score > 0.60 and ssi_score > 0.5:
            return "New"
        return "Different"

    overall_condition = classify_condition(front_similarity, back_similarity, average_ssi)

    save_item_condition(front_similarity, back_similarity, ssi_front, ssi_back, average_ssi, overall_condition, db, customer_id)
    # Convert all values to standard Python types
    return {
        "front_similarity": float(front_similarity),
        "back_similarity": float(back_similarity),
        "ssi_front": float(ssi_front),
        "ssi_back": float(ssi_back),
        "average_ssi": float(average_ssi),
        "overall_condition": overall_condition,
    }

def save_item_condition(front_similarity, back_similarity, ssi_front, ssi_back, average_ssi, overall_condition, db, customer_id):
    new_item_condition = CustomerItemCondition(
        front_similarity=front_similarity,
        back_similarity=back_similarity,
        ssi_front=ssi_front,
        ssi_back=ssi_back,
        average_ssi=average_ssi,
        overall_condition=overall_condition,
        customer_item_condition_mapping_id=customer_id
    )
    db.add(new_item_condition)
    db.commit()
    db.refresh(new_item_condition)


# Pydantic models
class CustomerDataCreate(BaseModel):
    customer_front_image: str
    customer_back_image: str
    customer_id: int



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
    UPLOAD_DIRECTORY = "/Users/rahul/Desktop/auditly/base_images"

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
        "message": "Base images uploaded and saved successfully.",
        "data": {
            "id": new_base_data.id,
            "front_image_path": front_image_path,
            "back_image_path": back_image_path,
            "item_number": item_number
        }
    }






# @app.get("/brands")
# async def get_brands(db: Session = Depends(get_db)):
#     """Retrieve all unique brands from the database."""
#     # Use distinct on the brand_name column
#     brands = db.query(Brand).all()
#     print("test")
#     result = [
#         {"id": brand.id, "brand_name": brand.brand_name, "description": brand.description}
#         for brand in brands
#     ]
#     return result

# @app.get("/items/by-brand/{brand_name}")
# async def get_items_by_brand(brand_name: str, db: Session = Depends(get_db)):
#     """Retrieve all items for a specific brand."""
#     items = (
#         db.query(Item)
#         .join(Brand)
#         .filter(Brand.brand_name == brand_name)
#         .all()
#     )
#     if not items:
#         raise HTTPException(status_code=404, detail="No items found for this brand")

#     return [
#         {"item_number": item.item_number, "item_description": item.item_description}
#         for item in items
#     ]

# @app.get("/items/by-number/{item_number}")
# async def get_item_description_and_brand(item_number: str, db: Session = Depends(get_db)):
#     """Retrieve item description and brand name based on item number."""
#     item = db.query(Item).filter(Item.item_number == item_number).first()
#     if not item:
#         raise HTTPException(status_code=404, detail="Item not found")

#     brand = db.query(Brand).filter(Brand.id == item.brand_id).first()
#     if not brand:
#         raise HTTPException(status_code=404, detail="Brand not found for this item")

#     return {
#         "item_description": item.item_description,
#         "brand_name": brand.brand_name
#     }

# @app.post("/brands")
# async def create_brand(brand_name: str, description: str = "", db: Session = Depends(get_db)):
#     """Create a new brand in the database."""
#     # Check if the brand already exists
#     existing_brand = db.query(Brand).filter(Brand.brand_name == brand_name).first()
#     if existing_brand:
#         raise HTTPException(status_code=400, detail="Brand already exists")
    
#     # Create and add the new brand
#     new_brand = Brand(brand_name=brand_name, description=description)
#     db.add(new_brand)
#     db.commit()
#     db.refresh(new_brand)
#     return {"id": new_brand.id, "brand_name": new_brand.brand_name, "description": new_brand.description}



# @app.post("/items")
# async def create_item(
#     item_number: int,
#     item_description: str,
#     brand_id: int,
#     category: str,
#     configuration: str,
#     db: Session = Depends(get_db),
# ):
#     """
#     Create a new item in the database.
#     """
#     try:
#         # Check if the item number already exists
#         existing_item = db.query(Item).filter(Item.item_number == item_number).first()
#         if existing_item:
#             raise HTTPException(status_code=400, detail=f"Item with number {item_number} already exists.")
        
#         # Check if the brand exists
#         brand = db.query(Brand).filter(Brand.id == brand_id).first()
#         if not brand:
#             raise HTTPException(status_code=404, detail=f"Brand with ID {brand_id} not found.")
        
#         # Create and add the new item
#         new_item = Item(
#             item_number=item_number,
#             item_description=item_description,
#             brand_id=brand_id,
#             category=category,
#             configuration=configuration,
#         )
#         db.add(new_item)
#         db.commit()
#         db.refresh(new_item)

#         # Format the response using column names and values
#         return {
#             "id": new_item.id,
#             "item_number": new_item.item_number,
#             "item_description": new_item.item_description,
#             "brand_id": new_item.brand_id,
#             "category": new_item.category,
#             "configuration": new_item.configuration,
#         }
#     except HTTPException as http_exc:
#         raise http_exc
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error creating item: {str(e)}")
