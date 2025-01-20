import pymysql
import pandas as pd

# Load the Excel data
file_path = '/Users/rahul/Downloads/Costco Item Master.xlsx'
data = pd.read_excel(file_path)

# Database connection details
DB_HOST = '127.0.0.1'
DB_USER = 'root'
DB_PASSWORD = 'a1b2c3d4'
DB_NAME = 'auditly'

# Connect to the database
connection = pymysql.connect(
    host=DB_HOST,
    user=DB_USER,
    password=DB_PASSWORD,
    database=DB_NAME
)

try:
    with connection.cursor() as cursor:
        # Insert brands into the brand table
        brand_ids = {}
        for brand in data['Brand'].unique():
            cursor.execute(
                """
                INSERT INTO brand (brand_name, description)
                VALUES (%s, %s)
                ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)
                """,
                (brand, '')
            )
            brand_ids[brand] = cursor.lastrowid

        # Insert items into the item table
        for _, row in data.iterrows():
            cursor.execute(
                """
                INSERT INTO item (item_number, item_description, brand_id)
                VALUES (%s, %s, %s)
                """,
                (row['Item Number'], row['Item Desc'], brand_ids[row['Brand']])
            )

    # Commit the changes
    connection.commit()

finally:
    connection.close()

print("Data has been uploaded successfully.")
