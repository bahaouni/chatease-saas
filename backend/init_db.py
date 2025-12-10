from app import app, db
from models import User, FAQ, MessageLog, WhatsAppConnection

with app.app_context():
    print("Creating all tables if not exist...")
    db.create_all()
    print("Done.")
