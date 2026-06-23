import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="footer" id="main-footer">
      <div className="footer-container container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-icon">🍔</span>
              <span className="gradient-text footer-logo-text">{t('app.title')}</span>
            </div>
            <p className="footer-tagline">{t('app.subtitle')}</p>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-heading">{t('nav.menu')}</h4>
            <ul className="footer-links">
              <li><a href="/menu?category=Burgers">{t('menu.burgers')}</a></li>
              <li><a href="/menu?category=Pizza">{t('menu.pizza')}</a></li>
              <li><a href="/menu?category=Drinks">{t('menu.drinks')}</a></li>
              <li><a href="/menu?category=Desserts">{t('menu.desserts')}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-section">
            <h4 className="footer-heading">Contact</h4>
            <ul className="footer-links">
              <li>📍 123 Food Street, Cairo</li>
              <li>📞 +20 100 000 0000</li>
              <li>✉️ hello@foodhub.com</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>© {year} {t('app.title')}. {t('footer.rights')}</p>
          <p className="footer-heart">{t('footer.madeWith')}</p>
        </div>
      </div>
    </footer>
  );
}
