import os
from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS

load_dotenv()
from flask_jwt_extended import JWTManager
from models import db, User
from routes.auth_routes import auth_bp

# Initialize App
app = Flask(__name__)
# Explicitly allow localhost:3000 and generic access
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True, allow_headers=["Content-Type", "Authorization"])

# Configuration
# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///app_v2.db')
if app.config['SQLALCHEMY_DATABASE_URI'] and app.config['SQLALCHEMY_DATABASE_URI'].startswith("postgres://"):
    app.config['SQLALCHEMY_DATABASE_URI'] = app.config['SQLALCHEMY_DATABASE_URI'].replace("postgres://", "postgresql://", 1)

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'super-secret-key-change-this-in-prod')

# Initialize Extensions
db.init_app(app)
jwt = JWTManager(app)

# Register Blueprints
app.register_blueprint(auth_bp)
from routes.faq_routes import faq_bp
app.register_blueprint(faq_bp)
from routes.whatsapp_routes import whatsapp_bp
app.register_blueprint(whatsapp_bp)
from routes.billing_routes import billing_bp
app.register_blueprint(billing_bp)
from routes.stats_routes import stats_bp
app.register_blueprint(stats_bp)
from routes.log_routes import log_bp
app.register_blueprint(log_bp, url_prefix='/api')
from routes.admin_routes import admin_bp
app.register_blueprint(admin_bp)
from routes.user_feedback_routes import feedback_bp
app.register_blueprint(feedback_bp)
from routes.simulator_routes import simulator_bp
app.register_blueprint(simulator_bp)
from routes.waha_routes import waha_bp
app.register_blueprint(waha_bp, url_prefix='/api')

from sqlalchemy import text

# Create DB Tables & Run Migrations
with app.app_context():
    db.create_all()
    
    # Auto-Migration for Production
    try:
        with db.engine.connect() as conn:
            # 1. Add User columns
            columns = [
                ("bot_enabled", "BOOLEAN DEFAULT TRUE"),
                ("active_outside_business_hours", "BOOLEAN DEFAULT FALSE"),
                ("business_start_hour", "INTEGER DEFAULT 9"),
                ("business_end_hour", "INTEGER DEFAULT 17"),
                ("bot_language", "VARCHAR(10) DEFAULT 'en'"),
                ("role", "VARCHAR(20) DEFAULT 'user'")
            ]
            for col_name, col_type in columns:
                try:
                    conn.execute(text(f"ALTER TABLE \"user\" ADD COLUMN {col_name} {col_type}"))
                    print(f"Migration: Added {col_name}")
                except Exception:
                    pass # Column likely exists

            # 2. Add rating to feedback
            try:
                conn.execute(text("ALTER TABLE feedback ADD COLUMN rating INTEGER DEFAULT 0"))
                print("Migration: Added rating")
            except Exception:
                pass

            conn.commit()
            print("Auto-migration complete.")
    except Exception as e:
        print(f"Migration error (harmless if db is new): {e}")

@app.route('/')
def home():
    return jsonify({"status": "running", "message": "ChatEase AI Backend is Live"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
