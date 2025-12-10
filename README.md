# ChatEase AI - MVP

A WhatsApp Auto-Reply System for Small Sellers using AI.

## Project Structure
- **/backend**: Python Flask API
- **/frontend**: Next.js Dashboard

## Prerequisites
- Python 3.8+
- Node.js 16+
- OpenAI API Key
- Meta for Developers Account (WhatsApp Business API)
- Stripe Account (for billing simulation)

## Setup Instructions

### Backend
1. Navigate to `backend`:
   ```bash
   cd backend
   ```
2. Create virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the server:
   ```bash
   python app.py
   ```

### Frontend
1. Navigate to `frontend`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Configuration
You will need to configure your API keys in the application settings or `.env` files (instructions to follow).
