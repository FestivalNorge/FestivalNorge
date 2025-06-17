import React, { createContext, useContext, useState } from 'react';
import i18n from '../config/i18n';

type Lang = 'no' | 'en';
interface LangCtx { language: Lang; setLanguage: (l: Lang) => void; }

const LC = createContext<LangCtx | undefined>(undefined);

export const LanguageProvider: React.FC<{children:React.ReactNode}> = ({children}) => {
  const [language,setLanguageState] = useState<Lang>(i18n.language as Lang);

  const setLanguage = (lng: Lang) => {
    i18n.changeLanguage(lng);
    setLanguageState(lng);
    localStorage.setItem('preferredLanguage', lng);
  };

  return <LC.Provider value={{language,setLanguage}}>{children}</LC.Provider>;
};

export const useLanguage = () => {
  const c = useContext(LC);
  if (!c) throw new Error('useLanguage must be inside LanguageProvider');
  return c;
};