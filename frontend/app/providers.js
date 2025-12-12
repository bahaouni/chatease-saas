'use client';

import { ThemeProvider } from 'next-themes';
import '../lib/i18n'; // Initialize i18n
import { I18nextProvider } from 'react-i18next';
import i18n from '../lib/i18n';

export function Providers({ children }) {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem>
        {children}
      </ThemeProvider>
    </I18nextProvider>
  );
}
