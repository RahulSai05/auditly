import os
from barcode import Code128
from barcode.writer import ImageWriter
from sqlalchemy import MetaData, Table
from sqlalchemy.orm import Session
from database import engine, SessionLocal

# Setup for Barcode directory
BARCODE_DIR = "barcodes"
os.makedirs(BARCODE_DIR, exist_ok=True)

# Reflect the database table
metadata = MetaData()
customer_item_data = Table('customer_item_data', metadata, autoload_with=engine)

# Initialize session
session = SessionLocal()

def generate_barcode(serial_number):
    """Generate a barcode for the given serial number and save it as an image."""
    barcode = Code128(serial_number, writer=ImageWriter())
    barcode_path = os.path.join(BARCODE_DIR, f"{serial_number}.png")
    barcode.save(barcode_path)
    return barcode_path

def update_database_with_barcode():
    """Update the database with barcode paths for each item."""
    records = session.execute(customer_item_data.select()).fetchall()
    for record in records:
        serial_number = record.serial_number
        if serial_number:
            barcode_path = generate_barcode(serial_number)
            # Update the record with the new barcode path
            session.execute(
                customer_item_data.update().
                where(customer_item_data.c.serial_number == serial_number).
                values(barcode=barcode_path)
            )
    session.commit()
    print("Barcodes generated and database updated successfully.")

if __name__ == "__main__":
    update_database_with_barcode()
