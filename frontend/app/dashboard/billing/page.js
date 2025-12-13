"use client";
import React, { useState } from 'react';
import api from '@/lib/api';
import { CreditCard, Check } from 'lucide-react';

export default function BillingPage() {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const res = await api.post('/billing/create-checkout-session');
      if (res.data.url) {
        window.location.href = res.data.url;
      } else {
        alert('Failed to start checkout');
      }
    } catch (err) {
      alert('Billing error: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '32px' }}>Billing</h1>

      <div className="glass-panel" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center', padding: '40px' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>$9<span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>/month</span></h2>
        <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          Pro Plan 
          <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>Coming Soon</span>
        </h3>
        
        <ul style={{ listStyle: 'none', textAlign: 'left', margin: '0 auto 30px', maxWidth: '300px' }}>
          <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}><Check size={18} color="var(--success)" style={{ marginRight: '10px' }} /> Unlimited AI Replies</li>
          <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}><Check size={18} color="var(--success)" style={{ marginRight: '10px' }} /> Priority Support</li>
          <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}><Check size={18} color="var(--success)" style={{ marginRight: '10px' }} /> Advanced Analytics</li>
        </ul>

        <button 
          className="btn" 
          style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.1)', cursor: 'not-allowed', color: 'var(--text-secondary)' }} 
          disabled={true}
        >
          Coming Soon
        </button>
        <p style={{ marginTop: '16px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>7-day free trial. Cancel anytime.</p>
      </div>
    </div>
  );
}
