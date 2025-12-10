import openai
import google.generativeai as genai
from groq import Groq
from difflib import SequenceMatcher
from models import FAQ
from utils.encryption import decrypt_value
import io

def transcribe_audio(audio_bytes, user):
    """
    Transcribes audio using Groq (Free/Fast) or OpenAI (Standard).
    """
    api_key = decrypt_value(user.ai_api_key)
    provider = user.ai_provider or 'openai'
    
    # Defaults to Groq for speed/cost if provider is Groq or OpenRouter (OpenRouter doesn't do audio upload well directly)
    # Actually, let's try to use the configured provider's logic.
    
    try:
        # Create a file-like object
        audio_file = io.BytesIO(audio_bytes)
        audio_file.name = "voice_message.ogg" # WhatsApp usually sends OGG
        
        if provider == 'groq':
            client = Groq(api_key=api_key)
            transcription = client.audio.transcriptions.create(
                file=(audio_file.name, audio_file.read()),
                model="whisper-large-v3",
                response_format="text"
            )
            return transcription
            
        elif provider == 'openai':
            client = openai.OpenAI(api_key=api_key)
            transcription = client.audio.transcriptions.create(
                model="whisper-1", 
                file=audio_file,
                response_format="text"
            )
            return transcription

        # Fallback/Gemini? Gemini audio is complex (requires File API upload). 
        # For now, if user is on Gemini, we can't easily transcribe without a separate key.
        # But wait, maybe we can use a free/demo key or ask user.
        return "Sorry, voice transcription is currrently only supported with OpenAI or Groq keys."

    except Exception as e:
        print(f"Transcription Error: {e}")
        return None

def find_best_faq_match(user_id, user_message):
    faqs = FAQ.query.filter_by(user_id=user_id).all()
    best_match = None
    best_ratio = 0.0

    for faq in faqs:
        ratio = SequenceMatcher(None, user_message.lower(), faq.question.lower()).ratio()
        if ratio > best_ratio:
            best_ratio = ratio
            best_match = faq

    if best_ratio > 0.7:
        return best_match.answer
    return None

def generate_ai_reply(user_id, user_message, user_model):
    # 1. Check FAQ first
    faq_answer = find_best_faq_match(user_id, user_message)
    if faq_answer:
        return faq_answer

    # 2. Check for API configuration
    api_key = decrypt_value(user_model.ai_api_key)
    provider = user_model.ai_provider or 'openai'

    if not api_key:
        return f"Auto-reply is not configured (Missing {provider.capitalize()} Key)."

    # 3. Load Context
    try:
        faqs = FAQ.query.filter_by(user_id=user_id).all()
        faq_context = "\n".join([f"Q: {f.question}\nA: {f.answer}" for f in faqs])
        
        default_instructions = "You are a helpful customer support assistant. Answer the user query based ONLY on the following FAQ knowledge base. If the answer is not in the knowledge base, answer politely that you will check with a human agent, or try to be helpful based on general knowledge if permitted (but prioritize the FAQ)."
        
        custom_instructions = user_model.system_prompt if user_model.system_prompt else default_instructions

        system_prompt = f"""
{custom_instructions}

FAQ Knowledge Base:
{faq_context}
"""

        # 4. Route to Provider
        if provider == 'openai':
            return _call_openai(api_key, system_prompt, user_message)
        elif provider == 'gemini':
            return _call_gemini(api_key, system_prompt, user_message)
        elif provider == 'groq':
            return _call_groq(api_key, system_prompt, user_message)
        elif provider == 'openrouter':
            return _call_openrouter(api_key, system_prompt, user_message)
        else:
            return "Unknown AI Provider selected."

    except Exception as e:
        error_msg = str(e)
        print(f"AI Error ({provider}): {error_msg}")
        if "429" in error_msg:
             return f"⚠️ Error: {provider.capitalize()} Quota Exceeded. Please checks your billing or try another provider."
        return f"⚠️ Error: {error_msg}"

def _call_openrouter(api_key, system_prompt, user_message):
    client = openai.OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=api_key,
    )
    try:
        print(f"DEBUG: Calling OpenRouter with model: meta-llama/llama-3-8b-instruct:free") # Let's try Llama 3 again or Mistral
        response = client.chat.completions.create(
            model="mistralai/mistral-7b-instruct:free",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            extra_headers={
                "HTTP-Referer": "https://chatease.ai",
                "X-Title": "ChatEase AI",
            }
        )
        print(f"DEBUG: OpenRouter Response: {response}")
        content = response.choices[0].message.content.strip()
        return content.replace("<s>", "").replace("</s>", "").strip()
    except Exception as e:
        with open("error_log.txt", "a") as f:
            f.write(f"CRITICAL OpenRouter Error: {str(e)}\n")
        print(f"CRITICAL OpenRouter Error: {e}")
        return "I am having trouble thinking right now. Please try again later."

def _call_openai(api_key, system_prompt, user_message):
    client = openai.OpenAI(api_key=api_key)
    response = client.chat.completions.create(
        model="gpt-4o-mini", # Cheaper and better than 3.5-turbo
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ],
        max_tokens=300
    )
    return response.choices[0].message.content.strip()

def _call_gemini(api_key, system_prompt, user_message):
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-2.5-pro')
    # Gemini doesn't have system messages in the same way, we prepend context
    full_prompt = f"{system_prompt}\n\nUser Message: {user_message}"
    response = model.generate_content(full_prompt)
    return response.text

def _call_groq(api_key, system_prompt, user_message):
    client = Groq(api_key=api_key)
    chat_completion = client.chat.completions.create(
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ],
        model="llama3-8b-8192",
    )
    return chat_completion.choices[0].message.content
