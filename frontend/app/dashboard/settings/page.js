"use client";
import React, { useState, useEffect, Suspense } from 'react';
import api from '@/lib/api';
import { useSearchParams, useRouter } from 'next/navigation';
import ConnectWhatsApp from './ConnectWhatsApp';
import { Save, Lock, Smartphone, Key, Cpu, Eye, EyeOff } from 'lucide-react';

import toast from 'react-hot-toast';
import PremiumToggle from '@/app/components/PremiumToggle';

function SettingsContent() {
  const [formData, setFormData] = useState({
    ai_api_key: '',
    ai_provider: 'openai',
    system_prompt: '',
    whatsapp_phone_id: '',
    whatsapp_api_key: '',
    bot_enabled: true,
    active_outside_business_hours: false,
    business_start_hour: 9,
    business_end_hour: 17,
    bot_language: 'en'
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
    const toastId = toast.loading('Connecting WhatsApp...');
    try {
      await api.post('/auth/whatsapp/connect', { code });
      toast.success('WhatsApp connected successfully!', { id: toastId });
      // Remove code from URL
      router.replace('/dashboard/settings');
      fetchProfile(); // Refresh profile/status
    } catch (err) {
      console.error(err);
      toast.error('Failed to connect: ' + (err.response?.data?.error || err.message), { id: toastId });
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
        whatsapp_api_key: res.data.whatsapp_api_key || '',
        bot_enabled: res.data.bot_enabled !== undefined ? res.data.bot_enabled : true,
        active_outside_business_hours: res.data.active_outside_business_hours || false,
        business_start_hour: res.data.business_start_hour || 9,
        business_end_hour: res.data.business_end_hour || 17,
        bot_language: res.data.bot_language || 'en'
      });
    } catch (err) {
      console.error(err);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const toastId = toast.loading('Saving settings...');
    try {
      await api.put('/auth/profile', formData);
      toast.success('Settings saved successfully!', { id: toastId });
    } catch (err) {
      toast.error('Failed to save settings', { id: toastId });
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
          
          {/* Bot Control Section */}
           <div style={{ marginBottom: '32px' }}>
             <h3 style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
               <Smartphone size={20} style={{ marginRight: '10px', color: 'var(--accent-primary)' }} /> Bot Control
             </h3>

             {/* Master Toggle */}
             <div className="mb-4">
               <PremiumToggle
                  label="Enable Bot"
                  description="Turn the automated assistant on or off globally."
                  checked={formData.bot_enabled}
                  onChange={(val) => setFormData({...formData, bot_enabled: val})}
               />
             </div>

             {/* Language */}
             <div style={{ marginBottom: '16px' }}>
               <label className="label">Bot Language</label>
               <select 
                 className="input-premium" 
                 value={formData.bot_language}
                 onChange={e => setFormData({...formData, bot_language: e.target.value})}
               >
                 <option value="en">English (Default)</option>
                 <option value="ar">Arabic (العربية)</option>
               </select>
               <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                 The AI will be instructed to reply in this language.
               </p>
             </div>

             {/* Business Hours */}
             <div style={{ marginBottom: '16px', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                <div style={{ marginBottom: '16px' }}>
                   <PremiumToggle
                      label="Auto-Reply Outside Business Hours"
                      description="If enabled, the bot will ONLY reply when you are closed."
                      checked={formData.active_outside_business_hours}
                      onChange={(val) => setFormData({...formData, active_outside_business_hours: val})}
                   />
                </div>

                {formData.active_outside_business_hours && (
                   <div style={{ display: 'flex', gap: '16px', animation: 'fadeIn 0.3s ease' }}>
                     <div style={{ flex: 1 }}>
                       <label className="label">Start Hour (0-23)</label>
                       <input 
                         type="number" min="0" max="23"
                         className="input-premium" 
                         value={formData.business_start_hour}
                         onChange={e => setFormData({...formData, business_start_hour: e.target.value})}
                       />
                     </div>
                     <div style={{ flex: 1 }}>
                       <label className="label">End Hour (0-23)</label>
                       <input 
                         type="number" min="0" max="23"
                         className="input-premium" 
                         value={formData.business_end_hour}
                         onChange={e => setFormData({...formData, business_end_hour: e.target.value})}
                       />
                     </div>
                   </div>
                )}
             </div>
           </div>
           
           <hr style={{ borderColor: 'var(--glass-border)', margin: '24px 0', opacity: 0.5 }} />

           {/* AI Configuration Section */}
          <div style={{ marginBottom: '32px' }}>
             <h3 style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
               <Cpu size={20} style={{ marginRight: '10px', color: 'var(--accent-primary)' }} /> AI Intelligence
             </h3>
             
             <div style={{ marginBottom: '16px' }}>
               <label className="label">AI Provider</label>
               <select 
                 className="input-premium" 
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
                   className="input-premium pr-10" 
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
               <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                 Required for generating smart replies when no FAQ matches.
               </p>
             </div>

             <div style={{ marginBottom: '16px' }}>
               <label className="label">System Instructions (Persona)</label>
               <textarea 
                 className="input-premium" 
                 placeholder="e.g. You are a helpful assistant for a Pizza Shop. Be funny and use emojis."
                 value={formData.system_prompt}
                 onChange={e => setFormData({...formData, system_prompt: e.target.value})}
                 style={{ minHeight: '100px', resize: 'vertical' }}
               />
               <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                 Tell the AI who it is and how it should behave.
               </p>
             </div>
          </div>

          <hr style={{ borderColor: 'var(--glass-border)', margin: '24px 0', opacity: 0.5 }} />

           {/* WhatsApp Configuration Section */}
           <div style={{ marginBottom: '32px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <MessageSquare size={20} style={{ marginRight: '10px', color: 'var(--success)' }} /> WhatsApp Connection
              </h3>
              <ConnectWhatsApp />
              
               <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '8px', color: 'var(--text-secondary)' }}>Alternative: Manual Connection</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                      If you have your own WABA ID and Token, you can connect manually without the Meta login flow.
                  </p>
                  <button 
                      type="button" // Prevent form submit
                      onClick={() => router.push('/dashboard/settings/manual')}
                      className="btn"
                      style={{ fontSize: '0.8rem', padding: '6px 12px', background: 'transparent', border: '1px solid var(--glass-border)' }}
                  >
                      enter credentials manually
                  </button>
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
