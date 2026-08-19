import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

const AdminLoginPage: React.FC = () => {
  const { isAdminAuthenticated, login, loginError } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAdminAuthenticated) {
      navigate('/admin/portal', { replace: true });
    }
  }, [isAdminAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email, password);
    if (success) navigate('/admin/portal', { replace: true });
  };

  return (
    <div className="max-w-sm mx-auto py-20 px-4 space-y-6">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-500/30 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-black text-[var(--color-text-primary)]">Admin Portal Access</h1>
        <p className="text-xs text-[var(--color-text-muted)]">Restricted to authorised Eudossier administrators only.</p>
      </div>

      {loginError && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800/50 rounded-xl px-3 py-2 flex items-center space-x-2 text-xs text-rose-700 dark:text-rose-300">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{loginError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Admin Email</label>
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
          <label className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full bg-[var(--color-bg-input)] text-sm text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-xl px-3 py-2.5 mt-1 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-[var(--color-text-muted)]"
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-lg shadow-blue-600/20">
          <ShieldCheck className="w-4 h-4" />
          <span>Sign In to Admin Portal</span>
        </button>
      </form>

      <p className="text-[10px] text-[var(--color-text-muted)] text-center">Protected under EU GDPR Regulation 2016/679</p>
    </div>
  );
};

export default AdminLoginPage;
