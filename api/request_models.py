from pydantic import BaseModel
from typing import Optional

class CompareImagesRequest(BaseModel):
    customer_id: int
    item_id: int

class AuditlyUserRequest(BaseModel):
    user_name : str
    first_name: str
    last_name: str
    gender: str
    email: str
    password: str
    user_company: str

class LoginRequest(BaseModel):
    user_name : str
    password: str    

class VerifyLogin(BaseModel):
    user_name : str
    login_otp: str   

class LogoutRequest(BaseModel):
    user_name : str
    user_id: str    

class ForgetPassword(BaseModel):
    user_name : str
    user_id: str    

class ResettPassword(BaseModel):
    user_name : str
    email : str
    otp : str
    password : str    

class ReceiptSearchRequest(BaseModel):
    receipt_number: str

class UpdateProfileRequest(BaseModel):
    user_name: str
    first_name: str = None
    last_name: str = None
    gender: str = None
    email: str = None

class Onboard(BaseModel):
    onboard_name: str
    onboard_email: str   


class UpdateUserTypeRequest(BaseModel):
    modifier_user_id: int  # Admin ID making the request
    target_user_id: int  # ID of the user whose type is being modified
    is_inspection_user: bool
    is_admin: bool
    is_reports_user: bool

class ReceiptSearch(BaseModel):
    receipt_number: Optional[str] = None