"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { MessageSquare, Settings, CreditCard, LogOut, PlayCircle, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSwitcher from '../components/LanguageSwitcher';
import i18n from '@/lib/i18n';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const navItems = [
    { name: t('dashboard') || 'Dashboard', href: '/dashboard/faq', icon: MessageSquare }, // Using generic dashboard/FAQ generic
    { name: 'Simulator', href: '/dashboard/simulator', icon: PlayCircle },
    { name: 'Chat Logs', href: '/dashboard/logs', icon: FileText },
    { name: t('settings'), href: '/dashboard/settings', icon: Settings },
    { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  ];

  const isRTL = i18n.dir() === 'rtl';

  return (
    <div className="flex" style={{ display: 'flex', minHeight: '100vh', direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* Sidebar */}
      <aside className="glass" style={{ 
        width: '260px', 
        padding: '24px', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        zIndex: 10,
        [isRTL ? 'left' : 'right']: 'auto',
        [isRTL ? 'right' : 'left']: 0,
        [isRTL ? 'borderLeft' : 'borderRight']: '1px solid var(--glass-border)',
        [isRTL ? 'borderRight' : 'borderLeft']: 'none',
        borderTop: 'none',
        borderBottom: 'none',
        borderRadius: 0
      }}>
        <div style={{ marginBottom: '40px', paddingLeft: isRTL ? 0 : '12px', paddingRight: isRTL ? '12px' : 0 }}>
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}>ChatEase<span style={{ color: 'var(--accent-primary)' }}>.AI</span></h2>
        </div>

        <nav style={{ flex: 1 }}>
          <ul style={{ listStyle: 'none', padding: 0 }}>
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
                      color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                      background: isActive ? 'var(--accent-glow)' : 'transparent',
                      border: isActive ? '1px solid var(--accent-primary)' : '1px solid transparent',
                      transition: 'all 0.2s',
                      cursor: 'pointer'
                    }}>
                      <item.icon size={20} style={{ marginLeft: isRTL ? '12px' : 0, marginRight: isRTL ? 0 : '12px', color: isActive ? 'var(--accent-primary)' : 'inherit' }} />
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
                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>My Account</p>
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
             <LogOut size={16} style={{ marginLeft: isRTL ? '8px' : 0, marginRight: isRTL ? 0 : '8px' }} />
             {t('logout') || 'Sign Out'}
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: isRTL ? 0 : '260px', marginRight: isRTL ? '260px' : 0, transition: 'margin 0.3s ease' }}>
        <header style={{
          padding: '20px 40px',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '16px',
          position: 'sticky',
          top: 0,
          zIndex: 5,
          backdropFilter: 'blur(8px)'
        }}>
          <LanguageSwitcher />
          <ThemeToggle />
        </header>
        <div style={{ padding: '0 40px 40px 40px' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
