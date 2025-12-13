'use client';

import { ThemeProvider } from 'next-themes';
import '../lib/i18n'; // Initialize i18n
import { I18nextProvider } from 'react-i18next';
import i18n from '../lib/i18n';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }) {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem>
        {children}
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'var(--card-bg)',
              color: 'var(--text-primary)',
              border: '1px solid var(--glass-border)',
            },
            success: {
              iconTheme: {
                primary: 'var(--success)',
                secondary: 'var(--bg-primary)',
              },
            },
            error: {
              iconTheme: {
                primary: 'var(--error)',
                secondary: 'var(--bg-primary)',
              },
            },
          }}
        />
      </ThemeProvider>
    </I18nextProvider>
  );
}
