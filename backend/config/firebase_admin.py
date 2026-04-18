import firebase_admin
from firebase_admin import credentials
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
FIREBASE_CRED_PATH = BASE_DIR / 'serviceAccountKey.json'
if not firebase_admin._apps:
    cred = credentials.Certificate(str(FIREBASE_CRED_PATH))
    firebase_admin.initialize_app(cred)