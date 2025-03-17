def _login_email_body(otp):
    email_body = f"""
Dear User,

Thank you for choosing Auditly, your trusted partner for streamlined audits and compliance management.

To ensure the security of your account, we require you to verify your identity using a One-Time Password (OTP). Please find your OTP below:

Your OTP for Login:
{otp}

This OTP is valid for the next 5 minutes. Please do not share this code with anyone for security reasons.

If you did not request this OTP or are having trouble logging in, please contact our support team immediately at support@auditly.com or visit our Help Center: https://www.auditlyai.com/help-center.

Best regards,
The Auditly Team
"""

    return email_body


def _forget_password_email_body(otp):
    email_body = f"""
Dear User,

We received a request to reset your password for your Auditly account. To proceed, please use the One-Time Password (OTP) provided below:

Your OTP to Reset Password:
{otp}

This OTP is valid for the next 5 minutes. For security reasons, please do not share this code with anyone.

If you did not request this password reset, please contact our support team immediately at support@auditly.com or visit our Help Center: https://www.auditlyai.com/help-center.

Best regards,
The Auditly Team
"""
    return email_body


def _generate_inspection_email_body(account_name, account_number, serial_number, sales_order_number, return_order_number, receipt_number, condition):
    body = f"""
Hello,

The serial {serial_number} returned by the customer {account_name} – {account_number} was inspected for returns and found to be {condition}.

Below are the reference details:

Customer_Name – {account_name}
Customer_Account – {account_number}
Serial_Number – {serial_number}
Sales Order number – {sales_order_number}
Return Order Number – {return_order_number}
Inspection Number – {receipt_number}

Returned Images are attached.

Thanks,
Audit team
"""
    return body

def _generate_inspection_email_subject(account_number, serial_number, receipt_number):
    subject = f"""
Customer Account - {account_number}; Serial Number - {serial_number}; Inspection Id - {receipt_number}
"""
    return subject