"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { MessageSquare, Settings, CreditCard, LogOut, PlayCircle, FileText } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const navItems = [
    { name: 'FAQ Manager', href: '/dashboard/faq', icon: MessageSquare },
    { name: 'Simulator', href: '/dashboard/simulator', icon: PlayCircle },
    { name: 'Chat Logs', href: '/dashboard/logs', icon: FileText },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  ];

  return (
    <div className="flex" style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside className="glass" style={{ 
        width: '260px', 
        padding: '24px', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        zIndex: 10,
        borderRight: '1px solid var(--glass-border)',
        borderTop: 'none',
        borderBottom: 'none',
        borderLeft: 'none',
        borderRadius: 0
      }}>
        <div style={{ marginBottom: '40px', paddingLeft: '12px' }}>
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}>ChatEase<span style={{ color: 'var(--accent-primary)' }}>.AI</span></h2>
        </div>

        <nav style={{ flex: 1 }}>
          <ul style={{ listStyle: 'none' }}>
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <li key={item.href} style={{ marginBottom: '8px' }}>
                  <Link href={item.href} style={{ textDecoration: 'none' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      color: isActive ? 'white' : 'var(--text-secondary)',
                      background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                      border: isActive ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid transparent',
                      transition: 'all 0.2s',
                      cursor: 'pointer'
                    }}>
                      <item.icon size={20} style={{ marginRight: '12px', color: isActive ? 'var(--accent-primary)' : 'inherit' }} />
                      <span style={{ fontWeight: isActive ? 600 : 400 }}>{item.name}</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--glass-border)', paddingTop: '20px' }}>
           <Link href="/dashboard/account" style={{ textDecoration: 'none' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', padding: '0 8px', cursor: 'pointer' }}>
              <div style={{ 
                width: '36px', height: '36px', borderRadius: '50%', 
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', fontSize: '14px', color: 'white'
              }}>
                U
              </div>
              <div style={{ overflow: 'hidden' }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', color: 'white' }}>My Account</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Pro Member</p>
              </div>
           </div>
           </Link>

           <button onClick={handleLogout} className="btn" style={{ 
             width: '100%', 
             justifyContent: 'flex-start', 
             padding: '8px 12px',
             color: 'var(--error)',
             background: 'transparent',
             border: '1px solid rgba(239, 68, 68, 0.2)',
             fontSize: '0.9rem'
           }}>
             <LogOut size={16} style={{ marginRight: '8px' }} />
             Sign Out
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '40px', marginLeft: '260px' }}>
        {children}
      </main>
    </div>
  );
}
