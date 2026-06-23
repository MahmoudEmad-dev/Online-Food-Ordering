import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto py-24 px-4 text-center animate-fade-in">
      <h1 className="text-6xl font-black mb-4 gradient-text">404</h1>
      <h2 className="text-2xl font-bold mb-4">{t('common.notFound')}</h2>
      <p className="text-muted mb-8">{t('common.notFoundMessage')}</p>
      <Link to="/" className="btn-primary">
        {t('common.goHome')}
      </Link>
    </div>
  );
}
