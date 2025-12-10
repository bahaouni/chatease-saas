"use client";
import React, { useEffect, useState } from 'react';
import { User, Shield, Key, CreditCard } from 'lucide-react';

export default function AccountPage() {
  const [user, setUser] = useState({});

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(storedUser);
  }, []);

  return (
    <div className="animate-slide-up">
      <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>My Account</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Manage your personal details and subscription.</p>

      {/* Profile Card */}
      <div className="glass-panel" style={{ padding: '32px', display: 'flex', gap: '32px', alignItems: 'flex-start', marginBottom: '24px' }}>
         <div style={{ 
            width: '80px', height: '80px', borderRadius: '50%', 
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '32px', fontWeight: 'bold', color: 'white',
            boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.4)'
         }}>
            {user.email ? user.email[0].toUpperCase() : 'U'}
         </div>
         
         <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{user.email?.split('@')[0] || 'User'}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>{user.email}</p>
            
            <div style={{ display: 'flex', gap: '12px' }}>
                <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem' }}>
                    Active
                </span>
                <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem' }}>
                    Free Plan
                </span>
            </div>
         </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        
        {/* Security Section */}
        <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Shield size={20} color="var(--accent-primary)" />
                <h3 style={{ margin: 0 }}>Security</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
                Your account is secured with a password and your API keys are encrypted in our database.
            </p>
            <button className="btn-secondary" style={{ width: '100%' }} disabled>
                Change Password (Coming Soon)
            </button>
        </div>

        {/* Subscription Section */}
        <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <CreditCard size={20} color="#f59e0b" />
                <h3 style={{ margin: 0 }}>Subscription</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
                You are currently on the Free Trial. Upgrade to Pro for unlimited messages.
            </p>
            <button className="btn-primary" style={{ width: '100%' }}>
                Upgrade to Pro
            </button>
        </div>
      </div>

    </div>
  );
}
