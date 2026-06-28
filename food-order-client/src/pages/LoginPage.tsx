import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import authApi from '../api/authApi';

export default function LoginPage() {
  const { t } = useTranslation();
  const { login, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  const from = (location.state as any)?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError(t('auth.loginError'));
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await authApi.login({ email, password });
      login(response.token, response.user);
      showToast(t('auth.loginSuccess'), 'success');
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || t('auth.loginError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page-container animate-fade-in">
      <div className="card p-8 glass-strong">
        <h1 className="text-3xl font-black mb-2 text-center gradient-text">
          {t('auth.login')}
        </h1>
        <p className="text-center text-muted mb-6">
          {t('app.subtitle')}
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-3 rounded-lg text-sm mb-4 animate-pulse-glow">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-slate-300">
              {t('auth.email')}
            </label>
            <input
              type="email"
              className="input-field"
              placeholder={t('auth.emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-slate-300">
              {t('auth.password')}
            </label>
            <input
              type="password"
              className="input-field"
              placeholder={t('auth.passwordPlaceholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full mt-6 py-3 text-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? t('common.loading') : t('auth.loginButton')}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="text-primary hover:underline font-semibold">
            {t('auth.registerLink')}
          </Link>
        </div>
      </div>
    </div>
  );
}
