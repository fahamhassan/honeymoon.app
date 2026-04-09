'use client';
import api from '../api';

const V = '/vendor';

export const VendorService = {
  getDashboard:        ()          => api.get(`${V}/dashboard`),

  // Profile
  getProfile:          ()          => api.get(`${V}/profile`),
  updateProfile:       (data)      => api.put(`${V}/profile`, data),
  changePassword:      (data)      => api.post(`${V}/profile/change-password`, data),

  // Services
  getServices:         (params)    => api.getQ(`${V}/services`, params),
  getService:          (id)        => api.get(`${V}/services/${id}`),
  createService:       (data)      => api.post(`${V}/services`, data),
  updateService:       (id, data)  => api.put(`${V}/services/${id}`, data),
  toggleServiceStatus: (id)        => api.patch(`${V}/services/${id}/toggle-status`, {}),
  deleteService:       (id)        => api.del(`${V}/services/${id}`),

  // Add-ons
  getAddons:           ()          => api.get(`${V}/addons`),
  createAddon:         (data)      => api.post(`${V}/addons`, data),
  updateAddon:         (id, data)  => api.put(`${V}/addons/${id}`, data),
  deleteAddon:         (id)        => api.del(`${V}/addons/${id}`),

  // Bookings
  getBookings:         (params)    => api.getQ(`${V}/bookings`, params),
  getBookingRequests:  (params)    => api.getQ(`${V}/bookings/requests`, params),
  getBooking:          (id)        => api.get(`${V}/bookings/${id}`),
  approveBooking:      (id)        => api.post(`${V}/bookings/${id}/approve`, {}),
  rejectBooking:       (id, reason)=> api.post(`${V}/bookings/${id}/reject`, { reason }),
  completeBooking:     (id)        => api.post(`${V}/bookings/${id}/complete`, {}),

  // Custom Quotations
  getCustomQuotations: (params)    => api.getQ(`${V}/custom-quotations`, params),
  getCustomQuotation:  (id)        => api.get(`${V}/custom-quotations/${id}`),
  sendQuotation:       (id, amount)=> api.post(`${V}/custom-quotations/${id}/send`, { quotationAmount: amount }),
  rejectQuotation:     (id, reason)=> api.post(`${V}/custom-quotations/${id}/reject`, { reason }),

  // Reported Bookings
  getReportedBookings: (params)    => api.getQ(`${V}/reported-bookings`, params),
  getReportedBooking:  (id)        => api.get(`${V}/reported-bookings/${id}`),

  // Meeting Requests
  getMeetingRequests:  (params)    => api.getQ(`${V}/meeting-requests`, params),
  getMeetingRequest:   (id)        => api.get(`${V}/meeting-requests/${id}`),
  updateMeetingStatus: (id, status)=> api.patch(`${V}/meeting-requests/${id}/status`, { status }),

  // Reviews
  getReviews:          (params)    => api.getQ(`${V}/reviews`, params),
  replyToReview:       (id, reply) => api.post(`${V}/reviews/${id}/reply`, { reply }),

  // Payments + Earnings
  getPaymentLogs:      (params)    => api.getQ(`${V}/payment-logs`, params),
  getEarnings:         (period)    => api.getQ(`${V}/earnings`, { period }),

  // Subscription
  getSubscription:     ()          => api.get(`${V}/subscription`),
  getSubscriptionLogs: (params)    => api.getQ(`${V}/subscription-logs`, params),
  changeSubscription:  (data)      => api.post(`${V}/subscription/change`, data),

  // Bank Details
  getBankDetails:      ()          => api.get(`${V}/bank-details`),
  addBankDetail:       (data)      => api.post(`${V}/bank-details`, data),
  updateBankDetail:    (id, data)  => api.put(`${V}/bank-details/${id}`, data),
  deleteBankDetail:    (id)        => api.del(`${V}/bank-details/${id}`),

  // Notifications
  getNotifications:    (params)    => api.getQ(`${V}/notifications`, params),
  markRead:            (id)        => api.patch(`${V}/notifications/${id}/read`, {}),
  markAllRead:         ()          => api.post(`${V}/notifications/mark-all-read`, {}),
};

export const AuthService = {
  login:   (email, password) => api.post('/auth/vendor/login', { email, password }),
  signup:  (data)            => api.post('/auth/vendor/signup', data),
  logout:  (refreshToken)    => api.post('/auth/logout', { refreshToken }),
  forgot:  (email)           => api.post('/auth/forgot-password', { email, role: 'vendor' }),
  verifyOtp: (email, otp)    => api.post('/auth/verify-otp', { email, otp }),
  resetPw: (email, pw, otp)       => api.post('/auth/reset-password', { email, newPassword: pw, otp, role: 'vendor' }),
};

export default VendorService;
