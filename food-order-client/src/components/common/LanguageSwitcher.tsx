import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const currentLang = i18n.language?.startsWith('ar') ? 'ar' : 'en';

  useEffect(() => {
    const dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', currentLang);
  }, [currentLang]);

  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      id="language-switcher"
      onClick={toggleLanguage}
      className="lang-switcher"
      aria-label="Switch Language"
      title={t('nav.language')}
    >
      <span className="lang-icon">
        {currentLang === 'en' ? '🌍' : '🌐'}
      </span>
      <span className="lang-label">{t('nav.language')}</span>
    </button>
  );
}
