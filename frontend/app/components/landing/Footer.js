'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="py-12 bg-[var(--bg-primary)] border-t border-[var(--glass-border)]">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
           <h2 className="text-xl font-bold">ChatEase<span className="text-[var(--accent-primary)]">.AI</span></h2>
           <p className="text-sm text-[var(--text-secondary)] mt-1">
             AI Auto-Replies for WhatsApp Business.
           </p>
        </div>

        <div className="flex gap-8 text-sm text-[var(--text-secondary)]">
          <Link href="/contact" className="hover:text-[var(--text-primary)] transition-colors">{t('footer.contact') || "Contact"}</Link>
          <Link href="/privacy" className="hover:text-[var(--text-primary)] transition-colors">{t('footer.privacy') || "Privacy"}</Link>
          <Link href="/terms" className="hover:text-[var(--text-primary)] transition-colors">{t('footer.terms') || "Terms"}</Link>
        </div>
        
        <div className="text-xs text-[var(--text-secondary)]">
          © {new Date().getFullYear()} ChatEase AI.
        </div>
      </div>
    </footer>
  );
}
