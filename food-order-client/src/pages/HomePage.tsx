import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-4xl mx-auto py-16 px-4 text-center animate-fade-in-up">
      <div className="mb-8 animate-float flex justify-center">
        <div className="bg-primary/10 p-6 rounded-full border border-primary/20 shadow-glow">
          <svg className="w-20 h-20 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 15h18" />
            <path d="M3 15a9 9 0 0 1 18 0" fill="currentColor" fillOpacity="0.15" />
            <path d="M12 6V3" />
            <path d="M10 3h4" />
            <path d="M4 18h16" />
          </svg>
        </div>
      </div>
      <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
        <span className="gradient-text">{t('hero.title')}</span>
      </h1>
      <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
        {t('hero.subtitle')}
      </p>
      <div className="flex gap-4 justify-center">
        <Link to="/menu" className="btn-primary text-lg px-8 py-3.5 shadow-glow">
          {t('hero.cta')}
        </Link>
      </div>
    </div>
  );
}
