"use client";
import React, { useState, useEffect, Suspense } from 'react';
import api from '@/lib/api';
import { useSearchParams, useRouter } from 'next/navigation';
import ConnectWhatsApp from './ConnectWhatsApp';
import { Save, Lock, Smartphone, Key, Cpu, Eye, EyeOff } from 'lucide-react';

function SettingsContent() {
  const [formData, setFormData] = useState({
    ai_api_key: '',
    ai_provider: 'openai',
    system_prompt: '',
    whatsapp_phone_id: '',
    whatsapp_api_key: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAiKey, setShowAiKey] = useState(false);
  const [showWhatsappKey, setShowWhatsappKey] = useState(false);
  
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      handleOAuthCode(code);
    } else {
      fetchProfile();
    }
  }, [searchParams]);

  const handleOAuthCode = async (code) => {
    setLoading(true);
    try {
      await api.post('/auth/whatsapp/connect', { code });
      alert('WhatsApp connected successfully!');
      // Remove code from URL
      router.replace('/dashboard/settings');
      fetchProfile(); // Refresh profile/status
    } catch (err) {
      console.error(err);
      alert('Failed to connect WhatsApp: ' + (err.response?.data?.error || err.message));
      router.replace('/dashboard/settings');
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await api.get('/auth/profile');
      setFormData({
        ai_api_key: res.data.ai_api_key || '',
        ai_provider: res.data.ai_provider || 'openai',
        system_prompt: res.data.system_prompt || '',
        whatsapp_phone_id: res.data.whatsapp_phone_id || '',
        whatsapp_api_key: res.data.whatsapp_api_key || ''
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/auth/profile', formData);
      alert('Settings saved successfully!');
    } catch (err) {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const getProviderName = (p) => {
    if (p === 'openai') return 'OpenAI';
    if (p === 'gemini') return 'Google Gemini';
    if (p === 'groq') return 'Groq (Llama 3)';
    if (p === 'openrouter') return 'OpenRouter';
    return 'AI';
  };

  return (
    <div>
      <h1 style={{ marginBottom: '32px' }}>Settings</h1>

      <div className="glass-panel" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSave}>
          
          {/* AI Configuration Section */}
          <div style={{ marginBottom: '32px' }}>
             <h3 style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
               <Cpu size={20} style={{ marginRight: '10px', color: 'var(--accent-primary)' }} /> AI Intelligence
             </h3>
             
             <div style={{ marginBottom: '16px' }}>
               <label className="label">AI Provider</label>
               <select 
                 className="input-field" 
                 value={formData.ai_provider}
                 onChange={e => setFormData({...formData, ai_provider: e.target.value})}
               >
                 <option value="openai">OpenAI (GPT-3.5)</option>
                 <option value="gemini">Google Gemini (Pro)</option>
                 <option value="groq">Groq (Llama 3 - Ultra Fast)</option>
                 <option value="openrouter">OpenRouter (Free Models)</option>
               </select>
             </div>

             <div style={{ marginBottom: '16px' }}>
               <label className="label">{getProviderName(formData.ai_provider)} API Key</label>
               <div style={{ position: 'relative' }}>
                   <input 
                   type={showAiKey ? "text" : "password"}
                   className="input-field pr-10" 
                   placeholder={`Enter your ${getProviderName(formData.ai_provider)} Key...`}
                   value={formData.ai_api_key}
                   onChange={e => setFormData({...formData, ai_api_key: e.target.value})}
                 />
                 <button 
                  type="button"
                  onClick={() => setShowAiKey(!showAiKey)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '12px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                 >
                   {showAiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                 </button>
               </div>
               <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                 Required for generating smart replies when no FAQ matches.
               </p>
             </div>

             <div style={{ marginBottom: '16px' }}>
               <label className="label">System Instructions (Persona)</label>
               <textarea 
                 className="input-field" 
                 placeholder="e.g. You are a helpful assistant for a Pizza Shop. Be funny and use emojis."
                 value={formData.system_prompt}
                 onChange={e => setFormData({...formData, system_prompt: e.target.value})}
                 style={{ minHeight: '100px', resize: 'vertical' }}
               />
               <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                 Tell the AI who it is and how it should behave.
               </p>
             </div>
          </div>

          <hr style={{ borderColor: 'var(--glass-border)', margin: '24px 0', opacity: 0.5 }} />

           {/* WhatsApp Configuration Section */}
           <div style={{ marginBottom: '32px' }}>
              <ConnectWhatsApp />
              
              <div style={{ marginTop: '24px', opacity: 0.6, pointerEvents: 'none' }}>
                  <p style={{ fontSize: '0.8rem', fontStyle: 'italic' }}>
                      Manual configuration is deprecated. Please use the OAuth connection above.
                  </p>
              </div>
           </div>

          <button type="submit" className="btn btn-primary" disabled={saving}>
            <Save size={18} style={{ marginRight: '8px' }} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div style={{padding: '40px', textAlign: 'center'}}>Loading...</div>}>
      <SettingsContent />
    </Suspense>
  );
}
