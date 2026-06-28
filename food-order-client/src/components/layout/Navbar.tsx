import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import LanguageSwitcher from '../common/LanguageSwitcher';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith('ar') ? 'ar' : 'en';
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinkClass = (path: string) =>
    `nav-link ${isActive(path) ? 'nav-link-active' : ''}`;

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <nav className="navbar glass-strong" id="main-navbar">
      <div className="navbar-container container">
        {/* Logo */}
        <Link to="/" className="navbar-logo flex items-center gap-2" onClick={closeMobile}>
          <svg className="w-7 h-7 text-primary transition-transform duration-300 hover:rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 15h18" />
            <path d="M3 15a9 9 0 0 1 18 0" fill="currentColor" fillOpacity="0.2" />
            <path d="M12 6V3" />
            <path d="M10 3h4" />
            <path d="M4 18h16" />
          </svg>
          <span className="logo-text font-black tracking-tight text-xl text-white">
            {currentLang === 'en' ? (
              <>Food<span className="text-primary">Hub</span></>
            ) : (
              t('app.title')
            )}
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="navbar-links">
          <Link to="/" className={navLinkClass('/')} id="nav-home">
            {t('nav.home')}
          </Link>
          <Link to="/menu" className={navLinkClass('/menu')} id="nav-menu">
            {t('nav.menu')}
          </Link>

          {isAuthenticated && (
            <Link to="/orders" className={navLinkClass('/orders')} id="nav-orders">
              {t('nav.orders')}
            </Link>
          )}

          {isAdmin && (
            <Link to="/admin" className={navLinkClass('/admin')} id="nav-admin">
              {t('nav.admin')}
            </Link>
          )}
        </div>

        {/* Right Actions */}
        <div className="navbar-actions">
          <LanguageSwitcher />

          <Link to="/cart" className="cart-button" id="nav-cart">
            <span className="cart-icon">🛒</span>
            {totalItems > 0 && (
              <span className="cart-badge">{totalItems}</span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="user-menu">
              <span className="user-greeting">
                {user?.fullName?.split(' ')[0]}
              </span>
              <button onClick={logout} className="btn-secondary logout-btn" id="nav-logout">
                {t('nav.logout')}
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-secondary" id="nav-login">
                {t('nav.login')}
              </Link>
              <Link to="/register" className="btn-primary" id="nav-register">
                {t('nav.register')}
              </Link>
            </div>
          )}

          {/* Mobile Toggle */}
          <button
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            id="mobile-menu-toggle"
          >
            <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'mobile-menu-open' : ''}`}>
        <Link to="/" className={navLinkClass('/')} onClick={closeMobile}>
          {t('nav.home')}
        </Link>
        <Link to="/menu" className={navLinkClass('/menu')} onClick={closeMobile}>
          {t('nav.menu')}
        </Link>
        <Link to="/cart" className={navLinkClass('/cart')} onClick={closeMobile}>
          {t('nav.cart')} {totalItems > 0 && `(${totalItems})`}
        </Link>

        {isAuthenticated && (
          <Link to="/orders" className={navLinkClass('/orders')} onClick={closeMobile}>
            {t('nav.orders')}
          </Link>
        )}

        {isAdmin && (
          <Link to="/admin" className={navLinkClass('/admin')} onClick={closeMobile}>
            {t('nav.admin')}
          </Link>
        )}

        {isAuthenticated ? (
          <button
            onClick={() => { logout(); closeMobile(); }}
            className="mobile-logout"
          >
            {t('nav.logout')}
          </button>
        ) : (
          <>
            <Link to="/login" className="mobile-auth-link" onClick={closeMobile}>
              {t('nav.login')}
            </Link>
            <Link to="/register" className="mobile-auth-link accent" onClick={closeMobile}>
              {t('nav.register')}
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
