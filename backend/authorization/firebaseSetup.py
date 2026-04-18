# backend/firebase_setup.py
import firebase_admin
from firebase_admin import credentials

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
FIREBASE_CRED_PATH = BASE_DIR / 'config' / 'renaissance-7d41e-firebase-adminsdk-fbsvc-ca6096092c.json'

if not firebase_admin._apps:
    cred = credentials.Certificate(str(FIREBASE_CRED_PATH))
    firebase_admin.initialize_app(cred)