'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { tokenStore } from '../lib/api';
import { AuthService, VendorService } from '../lib/services/vendor.service';

const AuthContext = createContext(null);

export function VendorAuthProvider({ children }) {
  const [vendor,    setVendor]    = useState(null);
  const [isLoggedIn,setIsLoggedIn]= useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = localStorage.getItem('vendor_user');
        if (tokenStore.access && stored) {
          setVendor(JSON.parse(stored));
          setIsLoggedIn(true);
          try {
            const data = await VendorService.getProfile();
            setVendor(data.vendor);
            localStorage.setItem('vendor_user', JSON.stringify(data.vendor));
          } catch {}
        }
      } finally { setIsLoading(false); }
    })();
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await AuthService.login(email, password);
    tokenStore.set(data.accessToken, data.refreshToken);
    setVendor(data.vendor); setIsLoggedIn(true);
    localStorage.setItem('vendor_user', JSON.stringify(data.vendor));
    return data;
  }, []);

  const logout = useCallback(async () => {
    try { await AuthService.logout(tokenStore.refresh); } catch {}
    tokenStore.clear(); setVendor(null); setIsLoggedIn(false);
  }, []);

  const updateVendor = useCallback((updates) => {
    setVendor(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('vendor_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ vendor, isLoggedIn, isLoading, login, logout, updateVendor }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useVendorAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useVendorAuth must be inside VendorAuthProvider');
  return ctx;
};
export default AuthContext;
