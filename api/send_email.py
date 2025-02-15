import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders

def send_email(sender_email, sender_password, recipient_email, subject, message, image_list):
    """
    Sends an email using an SMTP server.
    
    Args:
        sender_email (str): Email address of the sender.
        sender_password (str): Password for the sender's email.
        recipient_email (str): Email address of the recipient.
        subject (str): Subject of the email.
        message (str): Body of the email.
    
    Returns:
        None
    """
    try:
        # Create the email
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = recipient_email
        msg['Subject'] = subject

        # Attach the email body
        msg.attach(MIMEText(message, 'plain'))

        for image_path in image_list:
            with open(image_path, "rb") as img_file:
                    mime_base = MIMEBase("application", "octet-stream")
                    mime_base.set_payload(img_file.read())
                    encoders.encode_base64(mime_base)
                    mime_base.add_header("Content-Disposition", f"attachment; filename={image_path[-5:]}")
                    msg.attach(mime_base)
                    
        # Connect to the SMTP server and send the email
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()  # Secure the connection
            server.login(sender_email, sender_password)
            server.send_message(msg)

        print("Email sent successfully!")
    except Exception as e:
        print(f"Failed to send email: {e}")
