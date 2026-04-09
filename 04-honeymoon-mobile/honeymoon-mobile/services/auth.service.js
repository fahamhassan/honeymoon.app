import { api, TokenStore } from './api';

const AuthService = {

  // ── Login ───────────────────────────────────────────────────────────────
  loginEmail: async (email, password) => {
    const data = await api.post('/auth/user/login', { email, password }, false);
    await TokenStore.setTokens(data.accessToken, data.refreshToken, 'user');
    await require('@react-native-async-storage/async-storage')
      .default.setItem('userData', JSON.stringify(data.user));
    return data;
  },

  loginUAEPass: async () => {
    // Session 3: real UAE Pass OAuth
    // For now: mock successful login as user-1
    const data = await api.post('/auth/user/login', {
      email: 'user1@example.com', password: 'User@123'
    }, false);
    await TokenStore.setTokens(data.accessToken, data.refreshToken, 'user');
    return data;
  },

  loginMobile: async (phone, otp) => {
    // Session 3: real OTP verification
    // For now mock: if otp is 4+ digits, treat as verified
    const data = await api.post('/auth/user/login', {
      email: 'user1@example.com', password: 'User@123'
    }, false);
    await TokenStore.setTokens(data.accessToken, data.refreshToken, 'user');
    return data;
  },

  // ── Signup ──────────────────────────────────────────────────────────────
  signup: async (payload) => {
    const data = await api.post('/auth/user/signup', payload, false);
    await TokenStore.setTokens(data.accessToken, data.refreshToken, 'user');
    return data;
  },

  // ── Forgot / OTP / Reset ────────────────────────────────────────────────
  forgotPassword: async (email) =>
    api.post('/auth/forgot-password', { email, role: 'user' }, false),

  verifyOtp: async (email, otp) =>
    api.post('/auth/verify-otp', { email, otp }, false),

  resetPassword: async (email, newPassword, otp) =>
    api.post('/auth/reset-password', { email, newPassword, otp, role: 'user' }, false),

  // ── Logout ──────────────────────────────────────────────────────────────
  logout: async () => {
    const refreshToken = await TokenStore.getRefresh();
    try { await api.post('/auth/logout', { refreshToken }); } catch {}
    await TokenStore.clear();
  },

  // ── Get cached user ─────────────────────────────────────────────────────
  getCachedUser: async () => {
    const raw = await require('@react-native-async-storage/async-storage')
      .default.getItem('userData');
    return raw ? JSON.parse(raw) : null;
  },

  isLoggedIn: async () => {
    const token = await TokenStore.getAccess();
    return !!token;
  },
};

export default AuthService;
