"use client";
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, QrCode, Key, HelpCircle, Copy, ExternalLink, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManualConnectionPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('manual'); // 'manual' | 'qr'
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
      phone_id: '',
      waba_id: '',
      access_token: ''
  });

  // Waha QR State
  const [wahaStatus, setWahaStatus] = useState('IDLE'); // IDLE, STARTING, SCAN_QR, WORKING
  const [qrBlobUrl, setQrBlobUrl] = useState(null);

  useEffect(() => {
    let interval;
    if (activeTab === 'qr') {
        startQrSession(); // Auto start when tab opened
        interval = setInterval(checkWahaStatus, 3000);
    }
    return () => clearInterval(interval);
  }, [activeTab]);

  const handleManualConnect = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
          await api.post('/auth/whatsapp/manual', formData);
          toast.success('WhatsApp Connected Successfully!');
          router.push('/dashboard/settings');
      } catch (err) {
          toast.error(err.response?.data?.error || 'Connection Failed');
      } finally {
          setLoading(false);
      }
  };

  const startQrSession = async () => {
      setWahaStatus('STARTING');
      try {
          await api.post('/api/auth/whatsapp/waha/start');
          setTimeout(fetchQrCode, 2000);
      } catch (err) {
          console.error("Waha Start Error (Is Waha running?)", err);
           // If 404/500, maybe Waha service isn't in docker-compose yet
      }
  };

  const fetchQrCode = async () => {
    try {
        const response = await api.get('/api/auth/whatsapp/waha/qr', { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        setQrBlobUrl(url);
    } catch (err) {
        console.log("QR not ready yet");
    }
  };

  const checkWahaStatus = async () => {
      try {
          const res = await api.get('/api/auth/whatsapp/waha/status');
          setWahaStatus(res.data.status);
          if (res.data.status === 'SCAN_QR_CODE' && !qrBlobUrl) {
              fetchQrCode();
          }
          if (res.data.status === 'WORKING') {
               toast.success("WhatsApp Connected via QR Code!");
               router.push('/dashboard/settings');
          }
      } catch (err) {
          console.error(err);
      }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', gap: '24px', flexDirection: 'column' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
                onClick={() => router.back()} 
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
                <ArrowLeft size={18} /> Back
            </button>
            <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Connect WhatsApp</h1>
        </div>

        <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid var(--glass-border)' }}>
                <button 
                    onClick={() => setActiveTab('manual')}
                    style={{ 
                        flex: 1, 
                        padding: '16px', 
                        background: activeTab === 'manual' ? 'rgba(255,255,255,0.05)' : 'transparent',
                        border: 'none',
                        color: activeTab === 'manual' ? 'white' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                    }}
                >
                    <Key size={18} /> Manual API Keys
                </button>
                <button 
                    onClick={() => setActiveTab('qr')}
                    style={{ 
                        flex: 1, 
                        padding: '16px', 
                        background: activeTab === 'qr' ? 'rgba(255,255,255,0.05)' : 'transparent',
                        border: 'none',
                        color: activeTab === 'qr' ? 'white' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                    }}
                >
                    <QrCode size={18} /> Scan QR Code
                </button>
            </div>

            <div style={{ padding: '32px' }}>
                {activeTab === 'manual' ? (
                    <div>
                        <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
                            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#60a5fa', marginBottom: '8px', marginTop: 0 }}>
                                <HelpCircle size={16} /> How to get these keys?
                            </h4>
                            <ol style={{ paddingLeft: '20px', margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                <li>Go to <a href="https://developers.facebook.com/apps/" target="_blank" style={{ color: '#60a5fa', textDecoration: 'underline' }}>Meta Developers</a> and create an app (Business type).</li>
                                <li>In the Dashboard, add <strong>WhatsApp</strong> product.</li>
                                <li>Go to <strong>API Setup</strong> in the sidebar.</li>
                                <li>Copy the <strong>Phone Number ID</strong> and <strong>WABA ID</strong>.</li>
                                <li>For the Token: Generate a <strong>Permanent Token</strong> in Business Settings &gt; System Users (Recommended) or use the Temporary one for testing.</li>
                            </ol>
                        </div>

                        <form onSubmit={handleManualConnect} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label className="label">Phone Number ID</label>
                                <input 
                                    className="input-premium"
                                    value={formData.phone_id}
                                    onChange={e => setFormData({...formData, phone_id: e.target.value})}
                                    placeholder="e.g. 104xxxxxxxxxx"
                                    required
                                />
                            </div>
                            <div>
                                <label className="label">WhatsApp Business Account (WABA) ID</label>
                                <input 
                                    className="input-premium"
                                    value={formData.waba_id}
                                    onChange={e => setFormData({...formData, waba_id: e.target.value})}
                                    placeholder="e.g. 105xxxxxxxxxx"
                                    required
                                />
                            </div>
                            <div>
                                <label className="label">Access Token</label>
                                <input 
                                    className="input-premium"
                                    value={formData.access_token}
                                    onChange={e => setFormData({...formData, access_token: e.target.value})}
                                    type="password"
                                    placeholder="EABz..."
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Connecting...' : 'Save & Connect'}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <div style={{ marginBottom: '24px', background: 'white', padding: '16px', display: 'inline-block', borderRadius: '12px', minHeight: '160px' }}>
                             {qrBlobUrl ? (
                                 <img src={qrBlobUrl} alt="Scan QR" style={{ width: '200px', height: '200px' }} />
                             ) : (
                                 <div style={{ width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black', flexDirection: 'column', gap: '10px' }}>
                                     {wahaStatus === 'STARTING' ? (
                                         <>
                                            <div className="spinner" style={{ border: '3px solid #f3f3f3', borderTop: '3px solid #3498db', borderRadius: '50%', width: '30px', height: '30px', animation: 'spin 1s linear infinite' }}></div>
                                            <span style={{fontSize: '0.8rem'}}>Starting Engine...</span>
                                         </>
                                     ) : 'Loading QR...'}
                                 </div>
                             )}
                        </div>
                        <h3>Scan Code with WhatsApp</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                            1. Open WhatsApp on your phone<br/>
                            2. Menu &gt; Linked Devices &gt; Link a Device<br/>
                            3. Point your phone at this screen
                        </p>
                        <div style={{ marginTop: '10px' }}>
                            Status: <span style={{ fontWeight: 'bold', color: wahaStatus === 'WORKING' ? 'var(--success)' : 'var(--accent-primary)' }}>{wahaStatus}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}
