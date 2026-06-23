import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import authApi from '../api/authApi';

export default function RegisterPage() {
  const { t } = useTranslation();
  const { login, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validations
    if (!fullName || !email || !password || !confirmPassword) {
      setError(t('common.error'));
      return;
    }

    if (password.length < 6) {
      setError(t('auth.password') + ' must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await authApi.register({ fullName, email, password });
      login(response.token, response.user);
      showToast(t('auth.registerSuccess'), 'success');
      navigate('/', { replace: true });
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || t('auth.registerError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-16 px-4 max-w-md animate-fade-in">
      <div className="card p-8 glass-strong">
        <h1 className="text-3xl font-black mb-2 text-center gradient-text">
          {t('auth.register')}
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
              {t('auth.fullName')}
            </label>
            <input
              type="text"
              className="input-field"
              placeholder={t('auth.fullNamePlaceholder')}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

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

          <div>
            <label className="block text-sm font-semibold mb-1 text-slate-300">
              {t('auth.confirmPassword')}
            </label>
            <input
              type="password"
              className="input-field"
              placeholder={t('auth.confirmPasswordPlaceholder')}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full mt-6 py-3 text-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? t('common.loading') : t('auth.registerButton')}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          {t('auth.hasAccount')}{' '}
          <Link to="/login" className="text-primary hover:underline font-semibold">
            {t('auth.loginLink')}
          </Link>
        </div>
      </div>
    </div>
  );
}
