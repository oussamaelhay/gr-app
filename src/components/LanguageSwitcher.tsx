import React from 'react';
import { useI18n, Language } from '../hooks/useI18n';

export function LanguageSwitcher() {
  const { lang, setLang } = useI18n();

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية', flag: '🇲🇦' },
  ];

  return (
    <div className="flex items-center gap-1 rounded-lg border border-gray-200 p-1 bg-white">
      {languages.map(({ code, label, flag }) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all
            ${lang === code
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
            }
          `}
          title={label}
        >
          <span>{flag}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
