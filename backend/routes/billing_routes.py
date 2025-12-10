from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import stripe
import os

billing_bp = Blueprint('billing', __name__)

# This would come from env vars
STRIPE_SECRET_KEY = os.getenv('STRIPE_SECRET_KEY', 'sk_test_placeholder')
stripe.api_key = STRIPE_SECRET_KEY

@billing_bp.route('/billing/create-checkout-session', methods=['POST'])
@jwt_required()
def create_checkout_session():
    user_id = get_jwt_identity()
    domain_url = os.getenv('DOMAIN', 'http://localhost:3000')

    try:
        # MVP: Hardcoded Price ID for $9/month
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[
                {
                    'price_data': {
                        'currency': 'usd',
                        'product_data': {
                            'name': 'ChatEase AI Pro',
                        },
                        'unit_amount': 900,
                        'recurring': {
                            'interval': 'month',
                        },
                    },
                    'quantity': 1,
                },
            ],
            mode='subscription',
            success_url=domain_url + '/dashboard?success=true',
            cancel_url=domain_url + '/dashboard?canceled=true',
            metadata={'user_id': user_id}
        )
        return jsonify({'url': checkout_session.url})
    except Exception as e:
        return jsonify({'error': str(e)}), 403

@billing_bp.route('/billing/webhook', methods=['POST'])
def webhook():
    # Placeholder for webhook listener to update user subscription status
    return jsonify({'status': 'received'}), 200
