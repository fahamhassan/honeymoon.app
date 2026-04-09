'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { tokenStore } from '../lib/api';
import { AuthService, AdminService } from '../lib/services/admin.service';

const AuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin,     setAdmin]     = useState(null);
  const [isLoggedIn,setIsLoggedIn]= useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Boot: check for stored token
  useEffect(() => {
    (async () => {
      try {
        const stored = localStorage.getItem('admin_user');
        const token  = tokenStore.access;
        if (token && stored) {
          setAdmin(JSON.parse(stored));
          setIsLoggedIn(true);
          // Refresh profile in background
          try {
            const data = await AdminService.getProfile();
            setAdmin(data.admin);
            localStorage.setItem('admin_user', JSON.stringify(data.admin));
          } catch {}
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await AuthService.login(email, password);
    tokenStore.set(data.accessToken, data.refreshToken);
    setAdmin(data.admin);
    setIsLoggedIn(true);
    localStorage.setItem('admin_user', JSON.stringify(data.admin));
    return data;
  }, []);

  const logout = useCallback(async () => {
    try { await AuthService.logout(tokenStore.refresh); } catch {}
    tokenStore.clear();
    setAdmin(null);
    setIsLoggedIn(false);
  }, []);

  return (
    <AuthContext.Provider value={{ admin, isLoggedIn, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAdminAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAdminAuth must be inside AdminAuthProvider');
  return ctx;
};

export default AuthContext;
