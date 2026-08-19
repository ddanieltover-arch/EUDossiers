import React, { createContext, useContext, useState, ReactNode } from 'react';

const ADMIN_EMAIL = 'info@eudossier.eu';
const ADMIN_PASSWORD = 'EuD0ss!er@2026';

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

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
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
      setIsAdminAuthenticated(true);
      setLoginError(null);
      setIsLoginModalOpen(false);
      return true;
    }
    setLoginError('Invalid admin credentials. Access restricted to authorised personnel.');
    return false;
  };

  const logout = () => {
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
