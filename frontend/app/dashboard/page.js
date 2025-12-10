"use client";
import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { MessageSquare, Activity, Zap, ArrowRight, PlayCircle } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [stats, setStats] = useState({ total_messages: 0, today_messages: 0 });
  const [user, setUser] = useState({ email: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user info from local storage
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(storedUser);

        // Get stats
        const res = await api.get('/stats/summary');
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Welcome Banner */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
          Welcome back, <span className="gradient-text">{user.email?.split('@')[0] || 'User'}</span> 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Here's what's happening with your bot today.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '24px',
        marginBottom: '40px'
      }}>
        {/* Card 1: Total Messages */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ 
            width: '56px', height: '56px', borderRadius: '16px', 
            background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <MessageSquare size={28} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '4px', fontSize: '0.9rem' }}>Total Processed</p>
            <h3 style={{ fontSize: '1.8rem', margin: 0 }}>{stats.total_messages}</h3>
          </div>
        </div>

        {/* Card 2: Today's Activity */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ 
            width: '56px', height: '56px', borderRadius: '16px', 
            background: 'rgba(16, 185, 129, 0.1)', color: '#10b981',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Activity size={28} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '4px', fontSize: '0.9rem' }}>Messages Today</p>
            <h3 style={{ fontSize: '1.8rem', margin: 0 }}>{stats.today_messages}</h3>
          </div>
        </div>

        {/* Card 3: Plan Status */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ 
            width: '56px', height: '56px', borderRadius: '16px', 
            background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Zap size={28} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '4px', fontSize: '0.9rem' }}>Current Plan</p>
            <h3 style={{ fontSize: '1.4rem', margin: 0 }}>Free Trial</h3>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <h3 style={{ marginBottom: '20px' }}>Quick Actions</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
        <Link href="/dashboard/simulator" style={{ textDecoration: 'none' }}>
            <div className="glass-panel hover-card" style={{ padding: '24px', cursor: 'pointer', border: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <PlayCircle size={24} color="var(--accent-primary)" />
                        <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Test Simulator</h4>
                    </div>
                    <ArrowRight size={20} color="var(--text-secondary)" />
                </div>
                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem' }}>
                    Chat with your bot verify your FAQ and System Prompt logic.
                </p>
            </div>
        </Link>
        
        <Link href="/dashboard/faq" style={{ textDecoration: 'none' }}>
            <div className="glass-panel hover-card" style={{ padding: '24px', cursor: 'pointer', border: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <MessageSquare size={24} color="#10b981" />
                        <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Manage FAQs</h4>
                    </div>
                    <ArrowRight size={20} color="var(--text-secondary)" />
                </div>
                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem' }}>
                    Add or update questions to train your bot's knowledge base.
                </p>
            </div>
        </Link>

      </div>
    </div>
  );
}
