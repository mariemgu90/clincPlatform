'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/i18nContext';

export default function LanguageSwitcher() {
  const { locale, changeLocale, languages } = useI18n();

  return (
    <div className="relative">
      <label htmlFor="language-select" className="sr-only">
        Select Language
      </label>
      <select
        id="language-select"
        value={locale}
        onChange={(e) => changeLocale(e.target.value)}
        className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
        aria-label="Select language"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}
