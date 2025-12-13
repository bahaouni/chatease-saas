"use client";
import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, MessageSquare, AlertCircle, Settings, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }) {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
            {/* Sidebar */}
            <div className="glass-panel" style={{ width: '250px', margin: '20px', padding: '20px', display: 'flex', flexDirection: 'column', borderRadius: '16px' }}>
                <div style={{ marginBottom: '40px', paddingLeft: '10px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>
                        <span className="gradient-text">Admin</span> Panel
                    </h2>
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <NavItem href="/admin/dashboard" icon={<LayoutDashboard size={20}/>} label="Overview" />
                    <NavItem href="/admin/users" icon={<Users size={20}/>} label="Users" />
                    <NavItem href="/admin/feedback" icon={<AlertCircle size={20}/>} label="Feedback" />
                    {/* <NavItem href="/admin/settings" icon={<Settings size={20}/>} label="System" /> */}
                </nav>

                <div style={{ marginTop: 'auto' }}>
                    <button 
                        onClick={handleLogout}
                        className="glass-panel hover-card"
                        style={{ width: '100%', padding: '12px', display: 'flex', alignItems: 'center', gap: '10px', color: '#ef4444', cursor: 'pointer', border: 'none', background: 'rgba(239, 68, 68, 0.1)' }}
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '40px 40px 40px 0', overflowY: 'auto' }}>
                {children}
            </main>
        </div>
    );
}

function NavItem({ href, icon, label }) {
    return (
        <Link href={href} style={{ textDecoration: 'none' }}>
            <div className="glass-panel hover-card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', cursor: 'pointer', borderRadius: '8px' }}>
                {icon}
                <span style={{ fontWeight: '500' }}>{label}</span>
            </div>
        </Link>
    );
}
