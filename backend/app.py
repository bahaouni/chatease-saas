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
from routes.test_routes import test_bp
app.register_blueprint(test_bp)
from routes.stats_routes import stats_bp
app.register_blueprint(stats_bp)

# Create DB Tables
with app.app_context():
    db.create_all()

@app.route('/')
def home():
    return jsonify({"status": "running", "message": "ChatEase AI Backend is Live"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
