# import smtplib
# import os
# from email.mime.text import MIMEText
# from email.mime.multipart import MIMEMultipart
# from email.mime.base import MIMEBase
# from email import encoders

# def send_email(sender_email, sender_password, recipient_email, subject, message, image_list=[]):
#     """
#     Sends an email using an SMTP server, with an optional list of images to attach.
    
#     Args:
#         sender_email (str): Email address of the sender.
#         sender_password (str): Password for the sender's email.
#         recipient_email (str): Email address of the recipient.
#         subject (str): Subject of the email.
#         message (str): Body of the email.
#         image_list (list, optional): List of paths to image files to attach. Defaults to an empty list.
    
#     Returns:
#         None
#     """
#     try:
#         # Create the email
#         msg = MIMEMultipart()
#         msg['From'] = sender_email
#         msg['To'] = recipient_email
#         msg['Subject'] = subject

#         # Attach the email body
#         msg.attach(MIMEText(message, 'plain'))

#         # Attach each image in the image list, if any
#         for image_path in image_list:
#             with open(image_path, "rb") as img_file:
#             # Extract the filename from the path
#                 filename = os.path.basename(image_path)
                
#                 # Create a MIMEBase instance
#                 mime_base = MIMEBase("application", "octet-stream")
#                 mime_base.set_payload(img_file.read())
#                 encoders.encode_base64(mime_base)
                
#                 # Correctly specify the filename in the header
#                 mime_base.add_header("Content-Disposition", f"attachment; filename={image_path[-5:]}")
#                 msg.attach(mime_base)
                            
#         # Connect to the SMTP server and send the email
#         with smtplib.SMTP('smtpout.secureserver.net', 587) as server:
#             server.ehlo()
#             server.starttls()
#             print("loggin in")
#             server.login(sender_email, sender_password)
#             print("logged in to server")
#             server.send_message(msg)

#         print("Email sent successfully!")
#     except Exception as e:
#         print(f"Failed to send email: {e}")


import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders

def send_email(sender_email, sender_password, recipient_email, subject, message, image_list=[]):
    """
    Sends an email using Microsoft 365 SMTP, with optional image attachments.

    Args:
        sender_email (str): Email address of the sender.
        sender_password (str): Password for the sender's email.
        recipient_email (str): Email address of the recipient.
        subject (str): Subject of the email.
        message (str): Body of the email.
        image_list (list, optional): List of paths to image files to attach.

    Returns:
        None
    """
    try:
        # Create the email
        msg = MIMEMultipart()
        msg["From"] = sender_email
        msg["To"] = recipient_email
        msg["Subject"] = subject

        # Attach the email body
        msg.attach(MIMEText(message, "plain"))

        # Attach images (if any)
        for image_path in image_list:
            try:
                with open(image_path, "rb") as img_file:
                    filename = os.path.basename(image_path)
                    mime_base = MIMEBase("application", "octet-stream")
                    mime_base.set_payload(img_file.read())
                    encoders.encode_base64(mime_base)
                    mime_base.add_header("Content-Disposition", f"attachment; filename={filename}")
                    msg.attach(mime_base)
            except Exception as e:
                print(f"Error attaching file {image_path}: {e}")

        # Connect to SMTP server and send email
        with smtplib.SMTP("smtp.office365.com", 587) as server:
            server.ehlo()
            server.starttls()  # Upgrade connection to secure
            print("Logging in...")
            server.login(sender_email, sender_password)  # Login
            print("Logged in successfully.")
            server.send_message(msg)
            print("Email sent successfully!")

    except smtplib.SMTPAuthenticationError:
        print("Error: SMTP authentication failed. Check your email and password.")
    except smtplib.SMTPConnectError:
        print("Error: Unable to connect to the SMTP server. Check your internet and firewall settings.")
    except smtplib.SMTPException as e:
        print(f"SMTP error occurred: {e}")
    except Exception as e:
        print(f"Failed to send email: {e}")
