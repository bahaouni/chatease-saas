'use client';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageProvider({ children }) {
  const { i18n } = useTranslation();

  useEffect(() => {
    const handleLanguageChange = (lng) => {
      const dir = i18n.dir(lng);
      document.documentElement.dir = dir;
      document.documentElement.lang = lng;
    };

    // Initialize on mount
    handleLanguageChange(i18n.language);

    // Listen for changes
    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  return <>{children}</>;
}
