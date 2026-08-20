import React, { useState } from 'react';
import { X, Lock, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useTranslation } from 'react-i18next';

export const AdminLoginModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, login, loginError } = useAdminAuth();
  const { t } = useTranslation('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-bg-overlay)] backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-2xl max-w-sm w-full p-6 shadow-2xl relative">

        <button
          onClick={closeLoginModal}
          className="absolute top-4 right-4 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] p-1 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-3 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-500/30 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black text-[var(--color-text-primary)]">{t('loginTitle')}</h3>
          <p className="text-xs text-[var(--color-text-muted)]">
            {t('loginSubtitle')}
          </p>
        </div>

        {loginError && (
          <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800/50 rounded-xl px-3 py-2 mb-4 flex items-center space-x-2 text-xs text-rose-700 dark:text-rose-300">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{t(loginError)}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">{t('email')}</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="info@eudossier.eu"
              className="w-full bg-[var(--color-bg-input)] text-sm text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-xl px-3 py-2.5 mt-1 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-[var(--color-text-muted)]"
            />
          </div>

          <div>
            <label className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">{t('password')}</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-[var(--color-bg-input)] text-sm text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-xl px-3 py-2.5 mt-1 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-[var(--color-text-muted)]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-lg shadow-blue-600/20"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{t('signIn')}</span>
          </button>
        </form>

        <p className="text-[10px] text-[var(--color-text-muted)] text-center mt-4">
          {t('protected')}
        </p>
      </div>
    </div>
  );
};
