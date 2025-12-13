from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    whatsapp_api_key = db.Column(db.String(256), nullable=True) # Storing raw for MVP simplicity, assume secure env
    whatsapp_phone_id = db.Column(db.String(50), nullable=True)
    ai_api_key = db.Column(db.String(256), nullable=True) # Generic key for selected provider
    ai_provider = db.Column(db.String(50), default='openai') # openai, gemini, groq, openrouter
    system_prompt = db.Column(db.Text, nullable=True) # Custom instructions
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Bot Controls
    bot_enabled = db.Column(db.Boolean, default=True)
    active_outside_business_hours = db.Column(db.Boolean, default=False)
    business_start_hour = db.Column(db.Integer, default=9) # 9 AM
    business_end_hour = db.Column(db.Integer, default=17) # 5 PM
    business_end_hour = db.Column(db.Integer, default=17) # 5 PM
    bot_language = db.Column(db.String(10), default='en') # en, ar
    
    # RBAC
    # RBAC
    role = db.Column(db.String(20), default='user') # user, admin

    # Relationships
    faqs = db.relationship('FAQ', backref='owner', lazy=True)
    logs = db.relationship('MessageLog', backref='owner', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'whatsapp_phone_id': self.whatsapp_phone_id,
            'is_active': self.is_active,
            'role': self.role,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Feedback(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True) # Optional, can be anon
    message = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(20), default='general') # bug, feature, complaint, general
    rating = db.Column(db.Integer, default=0) # 0-5 stars
    status = db.Column(db.String(20), default='new') # new, resolved
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'message': self.message,
            'type': self.type,
            'rating': self.rating,
            'status': self.status,
            'created_at': self.created_at.isoformat()
        }

class FAQ(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    question = db.Column(db.Text, nullable=False)
    answer = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'question': self.question,
            'answer': self.answer
        }

class MessageLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    incoming_msg = db.Column(db.Text, nullable=False)
    ai_reply = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'incoming': self.incoming_msg,
            'reply': self.ai_reply,
            'timestamp': self.timestamp.isoformat()
        }

class WhatsAppConnection(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    waba_id = db.Column(db.String(50), nullable=False)
    phone_number_id = db.Column(db.String(50), nullable=False)
    display_phone_number = db.Column(db.String(20), nullable=True)
    access_token = db.Column(db.Text, nullable=False) # Should be encrypted in prod
    token_expires_at = db.Column(db.DateTime, nullable=True) # Long-lived token expiry
    business_id = db.Column(db.String(50), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref=db.backref('whatsapp_connection', uselist=False))

    def to_dict(self):
        return {
            'id': self.id,
            'waba_id': self.waba_id,
            'phone_number_id': self.phone_number_id,
            'display_phone_number': self.display_phone_number,
            'business_id': self.business_id,
            'created_at': self.created_at.isoformat()
        }

class CommandLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    customer_number = db.Column(db.String(50), nullable=False)
    command_type = db.Column(db.String(20), nullable=False) # order, book, price
    message_content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'customer_number': self.customer_number,
            'command_type': self.command_type,
            'message_content': self.message_content,
            'timestamp': self.timestamp.isoformat()
        }
