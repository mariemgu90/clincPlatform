'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, languages } from './translations';

const I18nContext = createContext();

export function I18nProvider({ children }) {
  const [locale, setLocale] = useState('en');
  const [dir, setDir] = useState('ltr');

  useEffect(() => {
    // Load saved language from localStorage
    const savedLocale = localStorage.getItem('locale') || 'en';
    setLocale(savedLocale);
    
    // Update document direction
    const language = languages.find(lang => lang.code === savedLocale);
    const direction = language?.dir || 'ltr';
    setDir(direction);
    document.documentElement.dir = direction;
    document.documentElement.lang = savedLocale;
  }, []);

  const changeLocale = (newLocale) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
    
    // Update document direction
    const language = languages.find(lang => lang.code === newLocale);
    const direction = language?.dir || 'ltr';
    setDir(direction);
    document.documentElement.dir = direction;
    document.documentElement.lang = newLocale;
  };

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[locale];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return (
    <I18nContext.Provider value={{ locale, changeLocale, t, dir, languages }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
