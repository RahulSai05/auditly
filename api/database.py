import urllib.parse
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from settings import ENV

_user = "root"
_host = "127.0.0.1"
_port = 3306
_database = "auditly"
if ENV == "DEV":_password = "a1b2c3d4"
elif ENV == "TEST":_password = urllib.parse.quote_plus("Test@12345") 

# Correctly formatted DATABASE_URL
DATABASE_URL = f"mysql+pymysql://{_user}:{_password}@{_host}:{_port}/{_database}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()