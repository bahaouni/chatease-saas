from app import app
from models import db, User
from werkzeug.security import generate_password_hash

def create_admin():
    with app.app_context():
        email = "admin@example.com"
        password = "adminpassword123"
        
        user = User.query.filter_by(email=email).first()
        
        if user:
            print(f"User {email} exists. Updating role to admin...")
            user.role = 'admin'
        else:
            print(f"Creating new admin user {email}...")
            hashed_password = generate_password_hash(password)
            user = User(
                email=email,
                password_hash=hashed_password,
                role='admin',
                is_active=True
            )
            db.session.add(user)
            
        db.session.commit()
        print(f"Admin account ready.\nEmail: {email}\nPassword: {password}")

if __name__ == "__main__":
    create_admin()
