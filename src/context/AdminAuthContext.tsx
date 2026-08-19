import React, { createContext, useContext, useState, ReactNode } from 'react';

const ADMIN_EMAIL = 'info@eudossier.eu';
const ADMIN_PASSWORD = 'EuD0ss!er@2026';
const ADMIN_SESSION_KEY = 'eudossier-admin-session';
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

interface AdminSession {
  v: 1;
  exp: number;
}

interface AdminAuthContextType {
  isAdminAuthenticated: boolean;
  isLoginModalOpen: boolean;
  loginError: string | null;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

function readStoredSession(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as AdminSession;
    if (parsed?.v === 1 && typeof parsed.exp === 'number' && parsed.exp > Date.now()) {
      return true;
    }
    localStorage.removeItem(ADMIN_SESSION_KEY);
  } catch {
    localStorage.removeItem(ADMIN_SESSION_KEY);
  }
  return false;
}

function persistSession(): void {
  const session: AdminSession = { v: 1, exp: Date.now() + SESSION_TTL_MS };
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
}

function clearSession(): void {
  localStorage.removeItem(ADMIN_SESSION_KEY);
}

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(readStoredSession);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const openLoginModal = () => {
    setLoginError(null);
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setLoginError(null);
    setIsLoginModalOpen(false);
  };

  const login = (email: string, password: string): boolean => {
    if (email.toLowerCase().trim() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      persistSession();
      setIsAdminAuthenticated(true);
      setLoginError(null);
      setIsLoginModalOpen(false);
      return true;
    }
    setLoginError('Invalid admin credentials. Access restricted to authorised personnel.');
    return false;
  };

  const logout = () => {
    clearSession();
    setIsAdminAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isAdminAuthenticated, isLoginModalOpen, loginError, openLoginModal, closeLoginModal, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export function useAdminAuth(): AdminAuthContextType {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
