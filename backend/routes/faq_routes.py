from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, FAQ

faq_bp = Blueprint('faq', __name__)

@faq_bp.route('/faq', methods=['GET'])
@jwt_required()
def get_faqs():
    user_id = get_jwt_identity()
    faqs = FAQ.query.filter_by(user_id=user_id).all()
    return jsonify([f.to_dict() for f in faqs]), 200

@faq_bp.route('/faq', methods=['POST'])
@jwt_required()
def create_faq():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    question = data.get('question')
    answer = data.get('answer')

    if not question or not answer:
        return jsonify({"error": "Question and Answer are required"}), 400

    new_faq = FAQ(user_id=user_id, question=question, answer=answer)
    db.session.add(new_faq)
    db.session.commit()

    return jsonify(new_faq.to_dict()), 201

@faq_bp.route('/faq/<int:id>', methods=['PUT'])
@jwt_required()
def update_faq(id):
    user_id = get_jwt_identity()
    data = request.get_json()
    faq = FAQ.query.filter_by(id=id, user_id=user_id).first()

    if not faq:
        return jsonify({"error": "FAQ not found"}), 404

    faq.question = data.get('question', faq.question)
    faq.answer = data.get('answer', faq.answer)
    db.session.commit()

    return jsonify(faq.to_dict()), 200

@faq_bp.route('/faq/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_faq(id):
    user_id = get_jwt_identity()
    faq = FAQ.query.filter_by(id=id, user_id=user_id).first()

    if not faq:
        return jsonify({"error": "FAQ not found"}), 404

    db.session.delete(faq)
    db.session.commit()

    return jsonify({"message": "FAQ deleted"}), 200
