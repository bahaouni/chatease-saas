"use client";
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Smartphone, CheckCircle, XCircle, Loader, ExternalLink } from 'lucide-react';

export default function ConnectWhatsApp() {
  const [status, setStatus] = useState({ connected: false, loading: true });
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await api.get('/auth/whatsapp/status');
      setStatus({ ...res.data, loading: false });
    } catch (err) {
      console.error(err);
      setStatus({ connected: false, loading: false });
    }
  };

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const res = await api.get('/auth/whatsapp/url');
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      alert("Failed to initiate connection");
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm("Are you sure you want to disconnect? Messaging will stop.")) return;
    try {
      await api.post('/auth/whatsapp/disconnect');
      fetchStatus();
    } catch (err) {
      alert("Failed to disconnect");
    }
  };

  if (status.loading) return <div style={{ padding: '20px' }}><Loader className="spin" size={20} /> Loading status...</div>;

  return (
    <div className="glass-panel" style={{ marginTop: '20px', border: '1px solid var(--glass-border)' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', fontSize: '1.1rem' }}>
        <Smartphone size={20} style={{ marginRight: '10px', color: '#25D366' }} /> 
        WhatsApp Connection (OAuth)
      </h3>

      {status.connected ? (
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', color: '#10b981' }}>
             <CheckCircle size={20} style={{ marginRight: '8px' }} />
             <span style={{ fontWeight: 600 }}>Connected to Meta</span>
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
      ) : (
        <div>
          <p style={{ marginBottom: '16px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Connect your WhatsApp Business Account to automatically send and receive AI messages.
          </p>
          <button 
            onClick={handleConnect} 
            disabled={connecting}
            className="btn"
            style={{ 
              background: '#1877F2', 
              color: 'white', 
              border: 'none',
              width: '100%',
              justifyContent: 'center'
            }}
          >
            {connecting ? 'Redirecting...' : 'Connect with Facebook'}
          </button>
          <p style={{ marginTop: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}>
            <ExternalLink size={12} style={{ marginRight: '4px' }} /> 
            Redirects to secure Meta login
          </p>
        </div>
      )}
    </div>
  );
}
