"use client";
import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Users, Activity, MessageSquare, AlertTriangle } from 'lucide-react';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/api/admin/stats');
                setStats(res.data);
            } catch (err) {
                console.error("Admin stats failed", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div style={{padding: '40px'}}>Loading stats...</div>;

    return (
        <div className="animate-fade-in">
            <h1 style={{ marginBottom: '32px' }}>System Overview</h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                <StatCard 
                    icon={<Users size={24} color="#6366f1" />} 
                    label="Total Users" 
                    value={stats?.total_users || 0} 
                />
                <StatCard 
                    icon={<Activity size={24} color="#10b981" />} 
                    label="Active Bots" 
                    value={stats?.active_bots || 0} 
                />
                <StatCard 
                    icon={<MessageSquare size={24} color="#3b82f6" />} 
                    label="Messages (24h)" 
                    value={stats?.messages_24h || 0} 
                />
                <StatCard 
                    icon={<AlertTriangle size={24} color="#f59e0b" />} 
                    label="Pending Feedback" 
                    value={stats?.pending_feedback || 0} 
                />
            </div>

            {/* Quick Status */}
            <div className="glass-panel" style={{ padding: '24px' }}>
                <h3>System Health</h3>
                <div style={{ display: 'flex', gap: '20px', marginTop: '16px' }}>
                    <StatusBadge label="Bot API" status="online" />
                    <StatusBadge label="AI Provider" status="online" />
                    <StatusBadge label="Database" status="online" />
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value }) {
    return (
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px' }}>
                {icon}
            </div>
            <div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{label}</p>
                <h2 style={{ margin: 0, fontSize: '1.8rem' }}>{value}</h2>
            </div>
        </div>
    );
}

function StatusBadge({ label, status }) {
    const color = status === 'online' ? '#10b981' : '#ef4444';
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '20px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}` }}></div>
            <span style={{ fontSize: '0.9rem' }}>{label}: {status.toUpperCase()}</span>
        </div>
    );
}
