from cryptography.fernet import Fernet
import os
from dotenv import load_dotenv

load_dotenv()

ENCRYPTION_KEY = os.getenv('ENCRYPTION_KEY')

if not ENCRYPTION_KEY:
    # Fallback/Warning (Should ideally be forced)
    print("WARNING: ENCRYPTION_KEY not found in .env. Encryption will fail.")
    cipher_suite = None
else:
    cipher_suite = Fernet(ENCRYPTION_KEY.encode())

def encrypt_value(value):
    if not value: return None
    if not cipher_suite: return value # Fail open vs closed? Choosing open for now to not break dev, but unsafe. 
    return cipher_suite.encrypt(value.encode()).decode()

def decrypt_value(token):
    if not token: return None
    if not cipher_suite: return token
    try:
        return cipher_suite.decrypt(token.encode()).decode()
    except Exception:
        # If decryption fails (e.g. old plain text data), return original
        return token
