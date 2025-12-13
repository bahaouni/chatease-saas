"use client";
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Smartphone, CheckCircle, XCircle, Loader, Phone, Key, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ConnectWhatsApp() {
  const [status, setStatus] = useState({ connected: false, loading: true });
  const [step, setStep] = useState('initial'); // initial, phone_input, code_sent, verifying, connected
  const [phoneNumber, setPhoneNumber] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [tempData, setTempData] = useState(null); // Stores waba_id, phone_number_id
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await api.get('/auth/whatsapp/status');
      setStatus({ ...res.data, loading: false });
      if (res.data.connected) {
        setStep('connected');
      }
    } catch (err) {
      console.error(err);
      setStatus({ connected: false, loading: false });
    }
  };

  const handleRegisterPhone = async (e) => {
    e.preventDefault();
    
    if (!phoneNumber.startsWith('+')) {
      toast.error('Phone number must start with + (e.g., +1234567890)');
      return;
    }

    setProcessing(true);
    const toastId = toast.loading('Registering phone number...');

    try {
      const res = await api.post('/auth/whatsapp/embedded/register', {
        phone_number: phoneNumber,
        display_name: displayName || 'My Business'
      });

      setTempData({
        waba_id: res.data.waba_id,
        phone_number_id: res.data.phone_number_id
      });

      toast.success('Phone registered! Requesting verification code...', { id: toastId });
      
      // Automatically request SMS code
      await requestCode(res.data.phone_number_id, 'SMS');
      
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Registration failed', { id: toastId });
    } finally {
      setProcessing(false);
    }
  };

  const requestCode = async (phoneNumberId, method = 'SMS') => {
    const toastId = toast.loading(`Sending verification code via ${method}...`);
    try {
      await api.post('/auth/whatsapp/embedded/request-code', {
        phone_number_id: phoneNumberId || tempData?.phone_number_id,
        method: method
      });

      toast.success(`Verification code sent via ${method}!`, { id: toastId });
      setStep('code_sent');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to send code', { id: toastId });
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('Please enter the 6-digit verification code');
      return;
    }

    setProcessing(true);
    const toastId = toast.loading('Verifying code...');

    try {
      const res = await api.post('/auth/whatsapp/embedded/verify', {
        phone_number_id: tempData.phone_number_id,
        waba_id: tempData.waba_id,
        code: verificationCode
      });

      toast.success('WhatsApp connected successfully! 🎉', { id: toastId });
      setStep('connected');
      fetchStatus(); // Refresh status
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Verification failed', { id: toastId });
    } finally {
      setProcessing(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm("Are you sure you want to disconnect? Messaging will stop.")) return;
    try {
      await api.post('/auth/whatsapp/disconnect');
      toast.success('Disconnected successfully');
      setStep('initial');
      setPhoneNumber('');
      setDisplayName('');
      setVerificationCode('');
      setTempData(null);
      fetchStatus();
    } catch (err) {
      toast.error("Failed to disconnect");
    }
  };

  const handleStartOver = () => {
    setStep('initial');
    setPhoneNumber('');
    setDisplayName('');
    setVerificationCode('');
    setTempData(null);
  };

  if (status.loading) {
    return (
      <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Loader className="spin" size={20} /> Loading status...
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ marginTop: '20px', border: '1px solid var(--glass-border)' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', fontSize: '1.1rem' }}>
        <Smartphone size={20} style={{ marginRight: '10px', color: '#25D366' }} /> 
        WhatsApp Connection (Embedded Signup)
      </h3>

      {step === 'connected' || status.connected ? (
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', color: '#10b981' }}>
             <CheckCircle size={20} style={{ marginRight: '8px' }} />
             <span style={{ fontWeight: 600 }}>Connected via Embedded Signup</span>
          </div>
          <p style={{ margin: '4px 0', fontSize: '0.9rem' }}><strong>WABA ID:</strong> {status.waba_id}</p>
          <p style={{ margin: '4px 0', fontSize: '0.9rem' }}><strong>Phone:</strong> {status.phone_number}</p>
          
          <button 
            onClick={handleDisconnect}
            className="btn" 
            style={{ 
              marginTop: '16px', 
              background: 'transparent', 
              border: '1px solid var(--error)', 
              color: 'var(--error)',
              fontSize: '0.85rem',
              padding: '6px 12px'
            }}
          >
            Disconnect Account
          </button>
        </div>
      ) : step === 'initial' ? (
        <div>
          <div style={{ 
            background: 'rgba(59, 130, 246, 0.1)', 
            padding: '12px', 
            borderRadius: '8px', 
            marginBottom: '16px',
            border: '1px solid rgba(59, 130, 246, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
              <AlertCircle size={18} style={{ color: '#3b82f6', marginTop: '2px', flexShrink: 0 }} />
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <strong style={{ color: '#3b82f6' }}>No Facebook Login Required!</strong>
                <p style={{ margin: '4px 0 0 0' }}>
                  Simply enter your phone number. We'll send a verification code via SMS.
                  No Facebook Business Verification needed for MVP.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleRegisterPhone}>
            <div style={{ marginBottom: '16px' }}>
              <label className="label">Business Display Name</label>
              <input 
                type="text"
                className="input-premium" 
                placeholder="My Business"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                This will be shown to your customers
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="label">Phone Number (E.164 Format)</label>
              <input 
                type="tel"
                className="input-premium" 
                placeholder="+1234567890"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                required
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Must start with + and country code (e.g., +1 for USA)
              </p>
            </div>

            <button 
              type="submit"
              disabled={processing || !phoneNumber}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {processing ? (
                <>
                  <Loader className="spin" size={18} style={{ marginRight: '8px' }} />
                  Registering...
                </>
              ) : (
                <>
                  <Phone size={18} style={{ marginRight: '8px' }} />
                  Register Phone Number
                </>
              )}
            </button>
          </form>
        </div>
      ) : step === 'code_sent' ? (
        <div>
          <div style={{ 
            background: 'rgba(16, 185, 129, 0.1)', 
            padding: '12px', 
            borderRadius: '8px', 
            marginBottom: '16px',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981' }}>
              <CheckCircle size={18} />
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                Verification code sent to {phoneNumber}
              </span>
            </div>
          </div>

          <form onSubmit={handleVerifyCode}>
            <div style={{ marginBottom: '16px' }}>
              <label className="label">Enter 6-Digit Verification Code</label>
              <input 
                type="text"
                className="input-premium" 
                placeholder="123456"
                value={verificationCode}
                onChange={e => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                required
                style={{ fontSize: '1.5rem', textAlign: 'center', letterSpacing: '0.5rem' }}
              />
            </div>

            <button 
              type="submit"
              disabled={processing || verificationCode.length !== 6}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginBottom: '12px' }}
            >
              {processing ? (
                <>
                  <Loader className="spin" size={18} style={{ marginRight: '8px' }} />
                  Verifying...
                </>
              ) : (
                <>
                  <Key size={18} style={{ marginRight: '8px' }} />
                  Verify Code
                </>
              )}
            </button>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                type="button"
                onClick={() => requestCode(tempData?.phone_number_id, 'SMS')}
                className="btn"
                style={{ flex: 1, fontSize: '0.8rem', padding: '8px', background: 'transparent', border: '1px solid var(--glass-border)' }}
              >
                Resend SMS
              </button>
              <button 
                type="button"
                onClick={() => requestCode(tempData?.phone_number_id, 'VOICE')}
                className="btn"
                style={{ flex: 1, fontSize: '0.8rem', padding: '8px', background: 'transparent', border: '1px solid var(--glass-border)' }}
              >
                Call Me
              </button>
              <button 
                type="button"
                onClick={handleStartOver}
                className="btn"
                style={{ flex: 1, fontSize: '0.8rem', padding: '8px', background: 'transparent', border: '1px solid var(--error)', color: 'var(--error)' }}
              >
                Start Over
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
