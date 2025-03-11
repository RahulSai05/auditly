import boto3
import json

def get_secret(secret_name):
    region_name = "us-east-1"  

    # Create a Secrets Manager client
    session = boto3.session.Session()
    client = session.client(service_name="secretsmanager", region_name=region_name)

    try:
        response = client.get_secret_value(SecretId=secret_name)
        
        # Parse the secret
        if "SecretString" in response:
            secret = json.loads(response["SecretString"])
            return secret
            
        else:
            raise ValueError("SecretString not found in response.")
    except Exception as e:
        print(f"Error retrieving secret: {e}")
        return None
