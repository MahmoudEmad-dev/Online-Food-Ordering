import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith('ar') ? 'ar' : 'en';
  const year = new Date().getFullYear();

  return (
    <footer className="footer" id="main-footer">
      <div className="footer-container container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo flex items-center gap-2">
              <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 15h18" />
                <path d="M3 15a9 9 0 0 1 18 0" fill="currentColor" fillOpacity="0.2" />
                <path d="M12 6V3" />
                <path d="M10 3h4" />
                <path d="M4 18h16" />
              </svg>
              <span className="footer-logo-text font-black tracking-tight text-lg text-white">
                {currentLang === 'en' ? (
                  <>Food<span className="text-primary">Hub</span></>
                ) : (
                  t('app.title')
                )}
              </span>
            </div>
            <p className="footer-tagline text-sm text-slate-400">{t('app.subtitle')}</p>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-heading text-xs font-bold tracking-wider text-slate-300 uppercase">{t('nav.menu')}</h4>
            <ul className="footer-links text-sm space-y-1">
              <li><a href="/menu?category=Burgers" className="hover:text-primary transition-colors">{t('menu.burgers')}</a></li>
              <li><a href="/menu?category=Pizza" className="hover:text-primary transition-colors">{t('menu.pizza')}</a></li>
              <li><a href="/menu?category=Drinks" className="hover:text-primary transition-colors">{t('menu.drinks')}</a></li>
              <li><a href="/menu?category=Desserts" className="hover:text-primary transition-colors">{t('menu.desserts')}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-section">
            <h4 className="footer-heading text-xs font-bold tracking-wider text-slate-300 uppercase">Contact</h4>
            <ul className="footer-links text-sm space-y-1 text-slate-400">
              <li>📍 123 Food Street, Cairo</li>
              <li>📞 +20 100 000 0000</li>
              <li>✉️ hello@foodhub.com</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 border-t border-slate-800/80 pt-4 mt-6">
          <p>© {year} {t('app.title')}. {t('footer.rights')}</p>
          <p className="footer-heart mt-1 md:mt-0">{t('footer.madeWith')}</p>
        </div>
      </div>
    </footer>
  );
}
