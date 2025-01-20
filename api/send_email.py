import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_email(sender_email, sender_password, recipient_email, subject, message):
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

        # Connect to the SMTP server and send the email
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()  # Secure the connection
            server.login(sender_email, sender_password)
            server.send_message(msg)

        print("Email sent successfully!")
    except Exception as e:
        print(f"Failed to send email: {e}")
