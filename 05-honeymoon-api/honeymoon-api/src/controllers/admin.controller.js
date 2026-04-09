'use strict';
const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');
const db = require('../config/db');
const { ok, created, fail, notFound, serverError } = require('../utils/response');

const strip = (u) => { const { password, ...s } = u; return s; };

/* ─── DASHBOARD ─────────────────────────────────────────────────────────── */
exports.getDashboard = (req, res) => {
  try {
    const totalUsers     = db.users.length;
    const totalVendors   = db.vendors.length;
    const totalBookings  = db.bookings.length;
    const totalRevenue   = db.payments.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0);
    const pendingVendors = db.vendors.filter(v => v.status === 'Pending').length;
    const pendingBookings= db.bookings.filter(b => b.status === 'Pending').length;

    // Month-over-month mock growth
    // Active counts
    const activeVendors = db.vendors.filter(v => v.status === 'Active').length;
    const activeUsers   = db.users.filter(u => u.status !== 'Inactive').length;
    
    const stats = {
      // Short keys (matches frontend)
      users:    totalUsers,
      vendors:  totalVendors,
      bookings: totalBookings,
      earning:  `AED ${totalRevenue.toLocaleString()}`,
      // Extended
      totalUsers, totalVendors, totalBookings, totalRevenue,
      activeVendors, activeUsers,
      pendingVendors, pendingBookings,
      commissionRate: db.commissionConfig?.defaultRate || 10,
      revenueGrowth: 12.5, // Would come from date-based query in production
    };
    const recentBookings = db.bookings.slice(-5).reverse();
    const recentUsers    = db.users.slice(-5).reverse().map(strip);

    return ok(res, { stats, recentBookings, recentUsers });
  } catch (e) { return serverError(res, e); }
};

/* ─── USERS ─────────────────────────────────────────────────────────────── */
exports.getUsers = (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status } = req.query;
    let users = db.users.map(strip);
    if (status) users = users.filter(u => u.status === status);
    return ok(res, db.paginate(users, page, limit, search, ['firstName','lastName','email','phone']));
  } catch (e) { return serverError(res, e); }
};

exports.getUser = (req, res) => {
  try {
    const user = db.findById('users', req.params.id);
    if (!user) return notFound(res, 'User not found');
    const bookings = db.findWhere('bookings', b => b.userId === user.id);
    return ok(res, { user: strip(user), bookings });
  } catch (e) { return serverError(res, e); }
};

exports.updateUserStatus = (req, res) => {
  try {
    const { status } = req.body;
    const user = db.findById('users', req.params.id);
    if (!user) return notFound(res, 'User not found');
    const updated = db.update('users', user.id, { status });
    return ok(res, { user: strip(updated) }, 'User status updated');
  } catch (e) { return serverError(res, e); }
};

/* ─── VENDORS ───────────────────────────────────────────────────────────── */
exports.getVendors = (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status, category } = req.query;
    let vendors = db.vendors.map(strip);
    if (status)   vendors = vendors.filter(v => v.status === status);
    if (category) vendors = vendors.filter(v => v.category === category);
    return ok(res, db.paginate(vendors, page, limit, search, ['companyName','firstName','lastName','email','location']));
  } catch (e) { return serverError(res, e); }
};

exports.getVendor = (req, res) => {
  try {
    const vendor = db.findById('vendors', req.params.id);
    if (!vendor) return notFound(res, 'Vendor not found');
    const services = db.findWhere('services', s => s.vendorId === vendor.id);
    const bookings = db.findWhere('bookings', b => b.vendorId === vendor.id);
    return ok(res, { vendor: strip(vendor), services, bookings });
  } catch (e) { return serverError(res, e); }
};

exports.getVendorRequests = (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pending = db.vendors.filter(v => v.status === 'Pending').map(strip);
    return ok(res, db.paginate(pending, page, limit));
  } catch (e) { return serverError(res, e); }
};

exports.approveVendor = (req, res) => {
  try {
    const vendor = db.findById('vendors', req.params.id);
    if (!vendor) return notFound(res, 'Vendor not found');
    const updated = db.update('vendors', vendor.id, { status: 'Active', isVerified: true });
    return ok(res, { vendor: strip(updated) }, 'Vendor approved successfully');
  } catch (e) { return serverError(res, e); }
};

exports.rejectVendor = (req, res) => {
  try {
    const { reason } = req.body;
    const vendor = db.findById('vendors', req.params.id);
    if (!vendor) return notFound(res, 'Vendor not found');
    const updated = db.update('vendors', vendor.id, { status: 'Rejected', rejectionReason: reason });
    return ok(res, { vendor: strip(updated) }, 'Vendor rejected');
  } catch (e) { return serverError(res, e); }
};

exports.toggleVendorStatus = (req, res) => {
  try {
    const vendor = db.findById('vendors', req.params.id);
    if (!vendor) return notFound(res, 'Vendor not found');
    const newStatus = vendor.status === 'Active' ? 'Inactive' : 'Active';
    const updated = db.update('vendors', vendor.id, { status: newStatus });
    return ok(res, { vendor: strip(updated) }, `Vendor ${newStatus.toLowerCase()}`);
  } catch (e) { return serverError(res, e); }
};

exports.updateCommission = (req, res) => {
  try {
    const { commissionRate } = req.body;
    const vendor = db.findById('vendors', req.params.id);
    if (!vendor) return notFound(res, 'Vendor not found');
    const updated = db.update('vendors', vendor.id, { commissionRate });
    return ok(res, { vendor: strip(updated) }, 'Commission rate updated');
  } catch (e) { return serverError(res, e); }
};

/* ─── CATEGORIES ────────────────────────────────────────────────────────── */
exports.getCategories = (req, res) => {
  try {
    return ok(res, { categories: db.categories });
  } catch (e) { return serverError(res, e); }
};

exports.getCategory = (req, res) => {
  try {
    const cat = db.findById('categories', req.params.id);
    if (!cat) return notFound(res, 'Category not found');
    return ok(res, { category: cat });
  } catch (e) { return serverError(res, e); }
};

exports.createCategory = (req, res) => {
  try {
    const { name, icon, description } = req.body;
    if (!name) return fail(res, 'Category name is required');
    const category = db.create('categories', { name, icon: icon || '📌', description, status: 'Active', vendorCount: 0 });
    return created(res, { category }, 'Category created');
  } catch (e) { return serverError(res, e); }
};

exports.updateCategory = (req, res) => {
  try {
    const cat = db.findById('categories', req.params.id);
    if (!cat) return notFound(res, 'Category not found');
    const updated = db.update('categories', cat.id, req.body);
    return ok(res, { category: updated }, 'Category updated');
  } catch (e) { return serverError(res, e); }
};

exports.deleteCategory = (req, res) => {
  try {
    if (!db.delete('categories', req.params.id)) return notFound(res, 'Category not found');
    return ok(res, {}, 'Category deleted');
  } catch (e) { return serverError(res, e); }
};

/* ─── BOOKINGS ──────────────────────────────────────────────────────────── */
exports.getBookings = (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status, type } = req.query;
    let bookings = db.bookings;
    if (status) bookings = bookings.filter(b => b.status === status);
    if (type)   bookings = bookings.filter(b => b.type === type);
    return ok(res, db.paginate(bookings, page, limit, search, ['id','userId','vendorId']));
  } catch (e) { return serverError(res, e); }
};

exports.getBooking = (req, res) => {
  try {
    const booking = db.findById('bookings', req.params.id) || db.findById('customQuotations', req.params.id);
    if (!booking) return notFound(res, 'Booking not found');
    const user   = db.findById('users',   booking.userId);
    const vendor = db.findById('vendors', booking.vendorId);
    return ok(res, { booking, user: user ? strip(user) : null, vendor: vendor ? strip(vendor) : null });
  } catch (e) { return serverError(res, e); }
};

exports.exportBookings = (req, res) => {
  try {
    const { format = 'json', type } = req.query;
    let bookings = db.bookings;
    if (type) bookings = bookings.filter(b => b.type === type);
    // In production: generate real Excel/PDF
    return ok(res, { exportUrl: `/exports/bookings-${Date.now()}.${format}`, count: bookings.length }, 'Export ready');
  } catch (e) { return serverError(res, e); }
};

/* ─── REPORTED BOOKINGS ─────────────────────────────────────────────────── */
exports.getReportedBookings = (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    let reports = db.reportedBookings;
    if (status) reports = reports.filter(r => r.status === status);
    return ok(res, db.paginate(reports, page, limit));
  } catch (e) { return serverError(res, e); }
};

exports.resolveReport = (req, res) => {
  try {
    const { adminNote } = req.body;
    const report = db.findById('reportedBookings', req.params.id);
    if (!report) return notFound(res, 'Report not found');
    const updated = db.update('reportedBookings', report.id, { status: 'Resolved', adminNote });
    return ok(res, { report: updated }, 'Report resolved');
  } catch (e) { return serverError(res, e); }
};

/* ─── MEETING REQUESTS ──────────────────────────────────────────────────── */
exports.getMeetingRequests = (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    let meetings = db.meetingRequests;
    if (status) meetings = meetings.filter(m => m.status === status);
    return ok(res, db.paginate(meetings, page, limit));
  } catch (e) { return serverError(res, e); }
};

exports.getMeetingRequest = (req, res) => {
  try {
    const meeting = db.findById('meetingRequests', req.params.id);
    if (!meeting) return notFound(res, 'Meeting request not found');
    return ok(res, { meeting });
  } catch (e) { return serverError(res, e); }
};

/* ─── SUBSCRIPTIONS ─────────────────────────────────────────────────────── */
exports.getSubscriptionPlans = (req, res) => {
  try {
    return ok(res, { plans: db.subscriptionPlans });
  } catch (e) { return serverError(res, e); }
};

exports.getSubscriptionPlan = (req, res) => {
  try {
    const plan = db.findById('subscriptionPlans', req.params.id);
    if (!plan) return notFound(res, 'Subscription plan not found');
    return ok(res, { plan });
  } catch (e) { return serverError(res, e); }
};

exports.createSubscriptionPlan = (req, res) => {
  try {
    const plan = db.create('subscriptionPlans', req.body);
    return created(res, { plan }, 'Subscription plan created');
  } catch (e) { return serverError(res, e); }
};

exports.updateSubscriptionPlan = (req, res) => {
  try {
    const plan = db.findById('subscriptionPlans', req.params.id);
    if (!plan) return notFound(res, 'Plan not found');
    const updated = db.update('subscriptionPlans', plan.id, req.body);
    return ok(res, { plan: updated }, 'Plan updated');
  } catch (e) { return serverError(res, e); }
};

exports.deleteSubscriptionPlan = (req, res) => {
  try {
    if (!db.delete('subscriptionPlans', req.params.id)) return notFound(res, 'Plan not found');
    return ok(res, {}, 'Plan deleted');
  } catch (e) { return serverError(res, e); }
};

exports.getSubscriptionLogs = (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    return ok(res, db.paginate(db.subscriptionLogs, page, limit));
  } catch (e) { return serverError(res, e); }
};

/* ─── COMMISSION ────────────────────────────────────────────────────────── */
exports.getCommissionConfig = (req, res) => {
  try {
    return ok(res, { commission: db.commissionConfig });
  } catch (e) { return serverError(res, e); }
};

exports.updateCommissionConfig = (req, res) => {
  try {
    Object.assign(db.commissionConfig, req.body);
    return ok(res, { commission: db.commissionConfig }, 'Commission config updated');
  } catch (e) { return serverError(res, e); }
};

/* ─── LOYALTY ───────────────────────────────────────────────────────────── */
exports.getLoyaltyConfig = (req, res) => {
  try {
    return ok(res, { config: db.loyaltyConfig, logs: db.loyaltyLogs });
  } catch (e) { return serverError(res, e); }
};

exports.updateLoyaltyConfig = (req, res) => {
  try {
    Object.assign(db.loyaltyConfig, req.body);
    return ok(res, { config: db.loyaltyConfig }, 'Loyalty config updated');
  } catch (e) { return serverError(res, e); }
};

exports.getLoyaltyLogs = (req, res) => {
  try {
    const { page = 1, limit = 10, type } = req.query;
    let logs = db.loyaltyLogs;
    if (type) logs = logs.filter(l => l.type === type);
    return ok(res, db.paginate(logs, page, limit));
  } catch (e) { return serverError(res, e); }
};

/* ─── REFERRAL ──────────────────────────────────────────────────────────── */
exports.getReferralConfig = (req, res) => {
  try {
    return ok(res, { config: db.referralConfig });
  } catch (e) { return serverError(res, e); }
};

exports.updateReferralConfig = (req, res) => {
  try {
    Object.assign(db.referralConfig, req.body);
    return ok(res, { config: db.referralConfig }, 'Referral config updated');
  } catch (e) { return serverError(res, e); }
};

/* ─── PAYOUTS ───────────────────────────────────────────────────────────── */
exports.getPayouts = (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    let payouts = db.payouts;
    if (status) payouts = payouts.filter(p => p.status === status);
    return ok(res, db.paginate(payouts, page, limit));
  } catch (e) { return serverError(res, e); }
};

exports.getPayout = (req, res) => {
  try {
    const payout = db.findById('payouts', req.params.id);
    if (!payout) return notFound(res, 'Payout not found');
    return ok(res, { payout });
  } catch (e) { return serverError(res, e); }
};

exports.approvePayout = (req, res) => {
  try {
    const payout = db.findById('payouts', req.params.id);
    if (!payout) return notFound(res, 'Payout not found');
    const updated = db.update('payouts', payout.id, { status: 'Approved', approvedAt: new Date().toISOString() });
    return ok(res, { payout: updated }, 'Payout approved');
  } catch (e) { return serverError(res, e); }
};

exports.processPayout = (req, res) => {
  try {
    const payout = db.findById('payouts', req.params.id);
    if (!payout) return notFound(res, 'Payout not found');
    const updated = db.update('payouts', payout.id, { status: 'Paid', paidAt: new Date().toISOString() });
    return ok(res, { payout: updated }, 'Payout processed');
  } catch (e) { return serverError(res, e); }
};

/* ─── PAYMENT LOGS ──────────────────────────────────────────────────────── */
exports.getPaymentLogs = (req, res) => {
  try {
    const { page = 1, limit = 10, status, method } = req.query;
    let payments = db.payments;
    if (status) payments = payments.filter(p => p.status === status);
    if (method) payments = payments.filter(p => p.method === method);
    return ok(res, db.paginate(payments, page, limit));
  } catch (e) { return serverError(res, e); }
};

exports.getPaymentLog = (req, res) => {
  try {
    const payment = db.findById('payments', req.params.id);
    if (!payment) return notFound(res, 'Payment not found');
    return ok(res, { payment });
  } catch (e) { return serverError(res, e); }
};

/* ─── PUSH NOTIFICATIONS ────────────────────────────────────────────────── */
exports.getPushNotifications = (req, res) => {
  try {
    return ok(res, { notifications: db.pushNotifications });
  } catch (e) { return serverError(res, e); }
};

exports.getPushNotification = (req, res) => {
  try {
    const notif = db.findById('pushNotifications', req.params.id);
    if (!notif) return notFound(res, 'Notification not found');
    return ok(res, { notification: notif });
  } catch (e) { return serverError(res, e); }
};

exports.sendPushNotification = (req, res) => {
  try {
    const { title, message, audience = 'all' } = req.body;
    if (!title || !message) return fail(res, 'Title and message required');
    const notif = db.create('pushNotifications', {
      title, message, audience,
      reach: audience === 'all' ? db.users.length + db.vendors.length : db.users.length,
      opened: 0, status: 'Sent', sentAt: new Date().toISOString()
    });
    return created(res, { notification: notif }, 'Push notification sent');
  } catch (e) { return serverError(res, e); }
};

/* ─── RATINGS ───────────────────────────────────────────────────────────── */
exports.getRatings = (req, res) => {
  try {
    const { page = 1, limit = 10, isHidden } = req.query;
    let reviews = db.reviews;
    if (isHidden !== undefined) reviews = reviews.filter(r => r.isHidden === (isHidden === 'true'));
    return ok(res, db.paginate(reviews, page, limit));
  } catch (e) { return serverError(res, e); }
};

exports.toggleReviewVisibility = (req, res) => {
  try {
    const review = db.findById('reviews', req.params.id);
    if (!review) return notFound(res, 'Review not found');
    const updated = db.update('reviews', review.id, { isHidden: !review.isHidden });
    return ok(res, { review: updated }, 'Review visibility toggled');
  } catch (e) { return serverError(res, e); }
};

/* ─── HOME CONTENT ──────────────────────────────────────────────────────── */
exports.getHomeContent = (req, res) => {
  try {
    return ok(res, { content: db.homeContent });
  } catch (e) { return serverError(res, e); }
};

exports.updateHomeContent = (req, res) => {
  try {
    const item = db.findById('homeContent', req.params.id);
    if (!item) return notFound(res, 'Content not found');
    const updated = db.update('homeContent', item.id, req.body);
    return ok(res, { content: updated }, 'Content updated');
  } catch (e) { return serverError(res, e); }
};

/* ─── QUERIES ───────────────────────────────────────────────────────────── */
exports.getQueries = (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    let queries = db.queries;
    if (status) queries = queries.filter(q => q.status === status);
    return ok(res, db.paginate(queries, page, limit));
  } catch (e) { return serverError(res, e); }
};

exports.getQuery = (req, res) => {
  try {
    const query = db.findById('queries', req.params.id);
    if (!query) return notFound(res, 'Query not found');
    return ok(res, { query });
  } catch (e) { return serverError(res, e); }
};

exports.replyToQuery = (req, res) => {
  try {
    const { reply } = req.body;
    const query = db.findById('queries', req.params.id);
    if (!query) return notFound(res, 'Query not found');
    const updated = db.update('queries', query.id, { adminReply: reply, status: 'Resolved' });
    return ok(res, { query: updated }, 'Reply sent');
  } catch (e) { return serverError(res, e); }
};

/* ─── REPORTS ───────────────────────────────────────────────────────────── */
exports.getReports = (req, res) => {
  try {
    const { period = 'monthly' } = req.query;
    return ok(res, {
      period,
      revenue:  { total: 245000, growth: 12.5, chart: Array.from({ length: 12 }, (_, i) => ({ month: i + 1, amount: 15000 + i * 2000 })) },
      bookings: { total: 380, growth: 8.2,     chart: Array.from({ length: 12 }, (_, i) => ({ month: i + 1, count:  25 + i * 3 })) },
      users:    { total: db.users.length,    newThisMonth: 24 },
      vendors:  { total: db.vendors.length,  newThisMonth: 5 },
      topCategories: db.categories.slice(0, 5),
    });
  } catch (e) { return serverError(res, e); }
};

/* ─── SETTINGS ──────────────────────────────────────────────────────────── */
exports.getSettings = (req, res) => {
  try {
    return ok(res, { settings: db.settings });
  } catch (e) { return serverError(res, e); }
};

exports.updateSettings = (req, res) => {
  try {
    Object.assign(db.settings, req.body);
    return ok(res, { settings: db.settings }, 'Settings updated');
  } catch (e) { return serverError(res, e); }
};

/* ─── ADMIN PROFILE ─────────────────────────────────────────────────────── */
exports.getProfile = (req, res) => {
  try {
    const admin = db.findById('admins', req.user.id);
    if (!admin) return notFound(res, 'Admin not found');
    return ok(res, { admin: strip(admin) });
  } catch (e) { return serverError(res, e); }
};

exports.updateProfile = (req, res) => {
  try {
    const admin = db.findById('admins', req.user.id);
    if (!admin) return notFound(res, 'Admin not found');
    const { password, role, ...updates } = req.body;
    const updated = db.update('admins', admin.id, updates);
    return ok(res, { admin: strip(updated) }, 'Profile updated');
  } catch (e) { return serverError(res, e); }
};

exports.changePassword = (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = db.findById('admins', req.user.id);
    if (!admin) return notFound(res, 'Admin not found');
    if (!bcrypt.compareSync(currentPassword, admin.password))
      return fail(res, 'Current password is incorrect');
    db.update('admins', admin.id, { password: bcrypt.hashSync(newPassword, 10) });
    return ok(res, {}, 'Password changed successfully');
  } catch (e) { return serverError(res, e); }
};

/* ─── NOTIFICATIONS ─────────────────────────────────────────────────────── */
exports.getNotifications = (req, res) => {
  try {
    const { page = 1, limit = 10, isRead } = req.query;
    let notifs = db.notifications;
    if (isRead !== undefined) notifs = notifs.filter(n => n.isRead === (isRead === 'true'));
    return ok(res, db.paginate(notifs, page, limit));
  } catch (e) { return serverError(res, e); }
};

exports.markNotificationRead = (req, res) => {
  try {
    const notif = db.findById('notifications', req.params.id);
    if (!notif) return notFound(res, 'Notification not found');
    const updated = db.update('notifications', notif.id, { isRead: true });
    return ok(res, { notification: updated }, 'Marked as read');
  } catch (e) { return serverError(res, e); }
};

exports.markAllNotificationsRead = (req, res) => {
  try {
    db.notifications.forEach(n => { n.isRead = true; });
    return ok(res, {}, 'All notifications marked as read');
  } catch (e) { return serverError(res, e); }
};
