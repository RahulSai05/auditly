from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, Text, Float, DateTime, SmallInteger
from sqlalchemy.orm import relationship, Mapped, mapped_column
from sqlalchemy.sql import func
from database import Base
from datetime import datetime

class Brand(Base):
    __tablename__ = "brand"

    id = Column(Integer, primary_key=True, index=True)
    brand_name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    items = relationship("Item", back_populates="brand", cascade="all, delete-orphan")  # One-to-many relationship


class Item(Base):
    __tablename__ = "item"

    id = Column(Integer, primary_key=True, index=True)
    item_number = Column(String, nullable=False, unique=True)
    item_description = Column(Text, nullable=False)
    brand_id = Column(Integer, ForeignKey("brand.id", ondelete="CASCADE"), nullable=False)
    category = Column(String(255), default="Mattress", nullable=True)
    configuration = Column(String(255), default="USA", nullable=True)

    brand = relationship("Brand", back_populates="items")
    customer_item_data = relationship("CustomerItemData", back_populates="item")


class OnboardUser(Base):
    __tablename__ = "onboard_user"

    onboard_user_id = Column(Integer, primary_key=True, autoincrement=True)
    onboard_name = Column(String(255))
    onboard_email = Column(String(255))
    token = Column(String(255))
    created_at = Column(DateTime, default=func.current_timestamp())
    customer_user_id = Column(String(255))


class AuditlyUser(Base):
    __tablename__ = "auditly_user"

    auditly_user_id = Column(Integer, primary_key=True, autoincrement=True)
    auditly_user_name = Column(String(255), unique=True, nullable=False)
    first_name = Column(String(255))
    last_name = Column(String(255))
    gender = Column(String(255))
    email = Column(String(255))
    password = Column(String(255))
    created_at = Column(DateTime, default=func.current_timestamp())
    last_login_time = Column(DateTime, nullable=True)
    last_logout_time = Column(DateTime, nullable=True)
    reset_otp = Column(String(255), nullable=True )
    reset_otp_expiration = Column(DateTime,nullable=True)
    user_type = Column(String(255), default="common_user")
    is_reports_user = Column(Boolean, default=True)
    is_inspection_user = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=True)
    user_company = Column(String(255), nullable=True)



class CustomerItemData(Base):
    __tablename__ = 'customer_item_data'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    original_sales_order_number = Column(String(255))
    original_sales_order_line = Column(Integer)
    ordered_qty = Column(Integer)
    return_order_number = Column(String(255))
    return_order_line = Column(Integer)
    return_qty = Column(Integer)
    return_destination = Column(String(255))
    return_condition = Column(String(255))
    return_carrier = Column(String(255))
    return_warehouse = Column(String(255))
    item_id = Column(Integer, ForeignKey('item.id'))
    serial_number = Column(String(255), unique=True)
    sscc_number = Column(String(255))
    tag_number = Column(String(255))
    vendor_item_number = Column(String(255))
    shipped_from_warehouse = Column(String(255))
    shipped_to_person = Column(String(255))
    shipped_to_address = Column(String(255))
    street_number = Column(String(255))
    city = Column(String(255))
    state = Column(String(255))
    country = Column(String(255))
    dimensions_depth = Column(Float)
    dimensions_length = Column(Float)
    dimensions_breadth = Column(Float)
    dimensions_weight = Column(Float)
    dimensions_volume = Column(Float)
    dimensions_size = Column(String(255))
    barcode = Column(String(255), unique=True)
    customer_email = Column(String(255))
    account_number = Column(String(255))
    date_purchased = Column(DateTime)
    date_shipped = Column(DateTime)
    date_delivered = Column(DateTime)
    return_created_date = Column(DateTime)
    item = relationship("Item", back_populates="customer_item_data", lazy="joined")

    

class CustomerData(Base):
    __tablename__ = 'customer_data'

    id = Column(Integer, primary_key=True, autoincrement=True)  # Matches the schema
    customer_front_image = Column(String(5555))  # Path to the front image
    customer_back_image = Column(String(5555))  # Path to the back image
    factory_seal = Column(Boolean, default=False)
    no_factory_seal = Column(Boolean, default=False)
    minimal_tear = Column(Boolean, default=False)
    no_package = Column(Boolean, default=False)
    new_conditiono = Column(Boolean, default=False)
    not_new_condition = Column(Boolean, default=False)
    bio_stains = Column(Boolean, default=False)
    package_stains = Column(Boolean, default=False)
    customer_item_data_id = Column(Integer, ForeignKey("customer_item_data.id"), nullable=True)
    #customer_item_data = Foreign key referencing customer_item_data(id)
    # customer_item_data = relationship("customer_item_data", back_populates="CustomerDatas")
    # customer_item_data = Column(Integer, ForeignKey("customer_item_data.id"), nullable=False)

    
class BaseData(Base):
    __tablename__ = 'base_data'

    id = Column(Integer, primary_key=True, autoincrement=True)  # Matches the schema
    base_front_image = Column(String(5555))  # Path to the front image
    base_back_image = Column(String(5555))  # Path to the back image
    base_to_item_mapping = Column(Integer, ForeignKey('item.id'))  



class ReturnDestination(Base):
    __tablename__ = 'return_destination'

    id = Column(Integer, primary_key=True, autoincrement=True) 
    sealy_pickup = Column(Boolean, default=False)
    returns_processing = Column(Boolean, default=False)
    return_order_mapping_key = Column(Integer, ForeignKey("customer_item_data.id"), nullable=True)

class CustomerItemCondition(Base):
    __tablename__ = 'customer_item_condition'

    id = Column(Integer, primary_key=True, autoincrement=True)  # Matches the schema
    front_similarity = Column(String(100))
    back_similarity = Column(String(100))
    ssi_front = Column(String(100))
    ssi_back = Column(String(100))
    average_ssi = Column(String(100))
    overall_condition = Column(String(100))
    ack_number = Column(String(100))
    difference_front_image = Column(String(5555))
    difference_back_image = Column(String(5555))
    customer_item_condition_mapping_id = Column(Integer, ForeignKey("customer_item_data.id"), nullable=True)
    
class SalesData(Base):
    __tablename__ = 'sales_data'

    id = Column(Integer, primary_key=True, autoincrement=True)
    SalesOrder = Column(String(255))
    CustomerAccount = Column(String(255))
    Name = Column(String(255))
    ReturnReasonCode = Column(String(255))
    ReturnStatus = Column(String(255))
    RMANumber = Column(String(255))
    InvoiceAccount = Column(String(255))
    OrderType = Column(String(255))
    CustomerRequisition = Column(String(255))
    Status = Column(String(255))
    ProjectID = Column(String(255))
    DoNotProcess = Column(String(255))
    Legacy = Column(String(255))
    Segment = Column(String(255))
    Subsegment = Column(String(255))