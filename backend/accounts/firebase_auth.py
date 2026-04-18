from firebase_admin import auth
from firebase_admin.exceptions import FirebaseError

from config.firebase_admin import *

def verify_firebase_token(id_token: str):
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except FirebaseError as e:
        print(f'Error verifying Firebase token: {e}')
        return None
    except Exception as e:
        print(f'Unexpected error verifying Firebase token: {e}')
        return None