import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto py-12 px-4 text-center max-w-4xl animate-fade-in-up">
      <div className="mb-8 animate-float">
        <span className="text-8xl">🍔</span>
      </div>
      <h1 className="text-5xl font-black mb-6 tracking-tight">
        {t('hero.title')}
      </h1>
      <p className="text-xl text-muted mb-10 max-w-2xl mx-auto">
        {t('hero.subtitle')}
      </p>
      <div className="flex gap-4 justify-center">
        <Link to="/menu" className="btn-primary text-lg px-8 py-3">
          {t('hero.cta')}
        </Link>
      </div>
    </div>
  );
}
