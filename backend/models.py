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
    
    # Relationships
    faqs = db.relationship('FAQ', backref='owner', lazy=True)
    logs = db.relationship('MessageLog', backref='owner', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'whatsapp_phone_id': self.whatsapp_phone_id,
            'is_active': self.is_active
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
