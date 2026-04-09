'use strict';
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { ok, created, fail, notFound, serverError } = require('../utils/response');

const strip = (u) => { const { password, ...s } = u; return s; };

/* ─── DASHBOARD ─────────────────────────────────────────────────────────── */
exports.getDashboard = (req, res) => {
  try {
    const vendorId = req.user.id;
    const myBookings   = db.findWhere('bookings', b => b.vendorId === vendorId);
    const myServices   = db.findWhere('services', s => s.vendorId === vendorId);
    const myReviews    = db.findWhere('reviews',  r => r.vendorId === vendorId);
    const myPayouts    = db.findWhere('payouts',   p => p.vendorId === vendorId);

    const totalRevenue = myPayouts.filter(p => p.status === 'Paid').reduce((s, p) => s + p.netAmount, 0);
    const avgRating    = myReviews.length
      ? (myReviews.reduce((s, r) => s + r.rating, 0) / myReviews.length).toFixed(1)
      : 0;

    return ok(res, {
      stats: {
        totalBookings:   myBookings.length,
        pendingBookings: myBookings.filter(b => b.status === 'Pending').length,
        totalServices:   myServices.length,
        totalRevenue,
        avgRating,
        totalReviews: myReviews.length,
      },
      recentBookings: myBookings.slice(-5).reverse(),
    });
  } catch (e) { return serverError(res, e); }
};

/* ─── PROFILE ───────────────────────────────────────────────────────────── */
exports.getProfile = (req, res) => {
  try {
    const vendor = db.findById('vendors', req.user.id);
    if (!vendor) return notFound(res, 'Vendor not found');
    return ok(res, { vendor: strip(vendor) });
  } catch (e) { return serverError(res, e); }
};

exports.updateProfile = (req, res) => {
  try {
    const vendor = db.findById('vendors', req.user.id);
    if (!vendor) return notFound(res, 'Vendor not found');
    const { password, role, status, isVerified, ...updates } = req.body;
    const updated = db.update('vendors', vendor.id, updates);
    return ok(res, { vendor: strip(updated) }, 'Profile updated');
  } catch (e) { return serverError(res, e); }
};

exports.changePassword = (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const vendor = db.findById('vendors', req.user.id);
    if (!vendor) return notFound(res, 'Vendor not found');
    if (!bcrypt.compareSync(currentPassword, vendor.password))
      return fail(res, 'Current password is incorrect');
    db.update('vendors', vendor.id, { password: bcrypt.hashSync(newPassword, 10) });
    return ok(res, {}, 'Password changed successfully');
  } catch (e) { return serverError(res, e); }
};

/* ─── SERVICES ──────────────────────────────────────────────────────────── */
exports.getServices = (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status } = req.query;
    let services = db.findWhere('services', s => s.vendorId === req.user.id);
    if (status) services = services.filter(s => s.status === status);
    return ok(res, db.paginate(services, page, limit, search, ['name','category']));
  } catch (e) { return serverError(res, e); }
};

exports.getService = (req, res) => {
  try {
    const svc = db.findById('services', req.params.id);
    if (!svc || svc.vendorId !== req.user.id) return notFound(res, 'Service not found');
    return ok(res, { service: svc });
  } catch (e) { return serverError(res, e); }
};

exports.createService = (req, res) => {
  try {
    const { name, category, description, pricingType, basePrice, minGuests, maxGuests, depositPercent, minHours, location, packages, policies } = req.body;
    if (!name || !category || !basePrice) return fail(res, 'Name, category and base price are required');
    const svc = db.create('services', {
      vendorId: req.user.id, name, category, description,
      pricingType, basePrice, minGuests, maxGuests, depositPercent, minHours,
      location, packages: packages || [], policies: policies || {},
      status: 'Active', rating: 0, reviewCount: 0, images: [],
    });
    return created(res, { service: svc }, 'Service created successfully');
  } catch (e) { return serverError(res, e); }
};

exports.updateService = (req, res) => {
  try {
    const svc = db.findById('services', req.params.id);
    if (!svc || svc.vendorId !== req.user.id) return notFound(res, 'Service not found');
    const updated = db.update('services', svc.id, req.body);
    return ok(res, { service: updated }, 'Service updated');
  } catch (e) { return serverError(res, e); }
};

exports.toggleServiceStatus = (req, res) => {
  try {
    const svc = db.findById('services', req.params.id);
    if (!svc || svc.vendorId !== req.user.id) return notFound(res, 'Service not found');
    const updated = db.update('services', svc.id, { status: svc.status === 'Active' ? 'Inactive' : 'Active' });
    return ok(res, { service: updated }, 'Service status toggled');
  } catch (e) { return serverError(res, e); }
};

exports.deleteService = (req, res) => {
  try {
    const svc = db.findById('services', req.params.id);
    if (!svc || svc.vendorId !== req.user.id) return notFound(res, 'Service not found');
    db.delete('services', svc.id);
    return ok(res, {}, 'Service deleted');
  } catch (e) { return serverError(res, e); }
};

/* ─── ADD-ONS ───────────────────────────────────────────────────────────── */
exports.getAddons = (req, res) => {
  try {
    const addons = db.findWhere('addons', a => a.vendorId === req.user.id);
    return ok(res, { addons });
  } catch (e) { return serverError(res, e); }
};

exports.createAddon = (req, res) => {
  try {
    const { title, category, priceType, price, status = 'Active' } = req.body;
    if (!title || !priceType || !price) return fail(res, 'Title, price type and price are required');
    const addon = db.create('addons', { vendorId: req.user.id, title, category, priceType, price, status });
    return created(res, { addon }, 'Add-on created');
  } catch (e) { return serverError(res, e); }
};

exports.updateAddon = (req, res) => {
  try {
    const addon = db.findById('addons', req.params.id);
    if (!addon || addon.vendorId !== req.user.id) return notFound(res, 'Add-on not found');
    const updated = db.update('addons', addon.id, req.body);
    return ok(res, { addon: updated }, 'Add-on updated');
  } catch (e) { return serverError(res, e); }
};

exports.deleteAddon = (req, res) => {
  try {
    const addon = db.findById('addons', req.params.id);
    if (!addon || addon.vendorId !== req.user.id) return notFound(res, 'Add-on not found');
    db.delete('addons', addon.id);
    return ok(res, {}, 'Add-on deleted');
  } catch (e) { return serverError(res, e); }
};

/* ─── BOOKINGS ──────────────────────────────────────────────────────────── */
exports.getBookings = (req, res) => {
  try {
    const { page = 1, limit = 10, status, type } = req.query;
    let bookings = db.findWhere('bookings', b => b.vendorId === req.user.id);
    if (status) bookings = bookings.filter(b => b.status === status);
    if (type)   bookings = bookings.filter(b => b.type === type);
    return ok(res, db.paginate(bookings, page, limit));
  } catch (e) { return serverError(res, e); }
};

exports.getBookingRequests = (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const requests = db.findWhere('bookings', b => b.vendorId === req.user.id && b.status === 'Pending');
    return ok(res, db.paginate(requests, page, limit));
  } catch (e) { return serverError(res, e); }
};

exports.getBooking = (req, res) => {
  try {
    const booking = db.findById('bookings', req.params.id);
    if (!booking || booking.vendorId !== req.user.id) return notFound(res, 'Booking not found');
    const user = db.findById('users', booking.userId);
    return ok(res, { booking, user: user ? strip(user) : null });
  } catch (e) { return serverError(res, e); }
};

exports.approveBooking = (req, res) => {
  try {
    const booking = db.findById('bookings', req.params.id);
    if (!booking || booking.vendorId !== req.user.id) return notFound(res, 'Booking not found');
    const updated = db.update('bookings', booking.id, { status: 'Upcoming' });
    return ok(res, { booking: updated }, 'Booking approved');
  } catch (e) { return serverError(res, e); }
};

exports.rejectBooking = (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason) return fail(res, 'Rejection reason is required');
    const booking = db.findById('bookings', req.params.id);
    if (!booking || booking.vendorId !== req.user.id) return notFound(res, 'Booking not found');
    const updated = db.update('bookings', booking.id, { status: 'Rejected', rejectionReason: reason });
    return ok(res, { booking: updated }, 'Booking rejected');
  } catch (e) { return serverError(res, e); }
};

exports.completeBooking = (req, res) => {
  try {
    const booking = db.findById('bookings', req.params.id);
    if (!booking || booking.vendorId !== req.user.id) return notFound(res, 'Booking not found');
    const updated = db.update('bookings', booking.id, { status: 'Completed' });
    return ok(res, { booking: updated }, 'Booking marked as completed');
  } catch (e) { return serverError(res, e); }
};

/* ─── CUSTOM QUOTATIONS ─────────────────────────────────────────────────── */
exports.getCustomQuotations = (req, res) => {
  try {
    const { page = 1, limit = 10, status, subTab = 'requests' } = req.query;
    let quotations = db.findWhere('customQuotations', q => q.vendorId === req.user.id || q.vendorId === null);
    if (status) quotations = quotations.filter(q => q.status === status);
    if (subTab === 'requests') quotations = quotations.filter(q => q.status === 'Requested');
    else quotations = quotations.filter(q => q.status !== 'Requested');
    return ok(res, db.paginate(quotations, page, limit));
  } catch (e) { return serverError(res, e); }
};

exports.getCustomQuotation = (req, res) => {
  try {
    const quotation = db.findById('customQuotations', req.params.id);
    if (!quotation) return notFound(res, 'Quotation not found');
    const user = db.findById('users', quotation.userId);
    return ok(res, { quotation, user: user ? strip(user) : null });
  } catch (e) { return serverError(res, e); }
};

exports.sendQuotation = (req, res) => {
  try {
    const { quotationAmount } = req.body;
    if (!quotationAmount) return fail(res, 'Quotation amount is required');
    const quotation = db.findById('customQuotations', req.params.id);
    if (!quotation) return notFound(res, 'Quotation not found');
    const updated = db.update('customQuotations', quotation.id, {
      vendorId: req.user.id,
      quotationAmount,
      status: 'Pending',
    });
    return ok(res, { quotation: updated }, 'Quotation sent to customer');
  } catch (e) { return serverError(res, e); }
};

exports.rejectQuotationRequest = (req, res) => {
  try {
    const { reason } = req.body;
    const quotation = db.findById('customQuotations', req.params.id);
    if (!quotation) return notFound(res, 'Quotation not found');
    const updated = db.update('customQuotations', quotation.id, {
      status: 'Rejected', rejectionReason: reason
    });
    return ok(res, { quotation: updated }, 'Quotation request rejected');
  } catch (e) { return serverError(res, e); }
};

/* ─── REPORTED BOOKINGS ─────────────────────────────────────────────────── */
exports.getReportedBookings = (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const vendorBookingIds = db.findWhere('bookings', b => b.vendorId === req.user.id).map(b => b.id);
    const reports = db.findWhere('reportedBookings', r => vendorBookingIds.includes(r.bookingId));
    return ok(res, db.paginate(reports, page, limit));
  } catch (e) { return serverError(res, e); }
};

exports.getReportedBooking = (req, res) => {
  try {
    const report = db.findById('reportedBookings', req.params.id);
    if (!report) return notFound(res, 'Report not found');
    return ok(res, { report });
  } catch (e) { return serverError(res, e); }
};

/* ─── MEETING REQUESTS ──────────────────────────────────────────────────── */
exports.getMeetingRequests = (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    let meetings = db.findWhere('meetingRequests', m => m.vendorId === req.user.id);
    if (status) meetings = meetings.filter(m => m.status === status);
    return ok(res, db.paginate(meetings, page, limit));
  } catch (e) { return serverError(res, e); }
};

exports.getMeetingRequest = (req, res) => {
  try {
    const meeting = db.findById('meetingRequests', req.params.id);
    if (!meeting || meeting.vendorId !== req.user.id) return notFound(res, 'Meeting request not found');
    return ok(res, { meeting });
  } catch (e) { return serverError(res, e); }
};

exports.updateMeetingStatus = (req, res) => {
  try {
    const { status } = req.body;
    const valid = ['Pending','Contacted','Meeting Scheduled','Lost','Converted'];
    if (!valid.includes(status)) return fail(res, 'Invalid status');
    const meeting = db.findById('meetingRequests', req.params.id);
    if (!meeting || meeting.vendorId !== req.user.id) return notFound(res, 'Meeting not found');
    const updated = db.update('meetingRequests', meeting.id, { status });
    return ok(res, { meeting: updated }, 'Meeting status updated');
  } catch (e) { return serverError(res, e); }
};

/* ─── REVIEWS ───────────────────────────────────────────────────────────── */
exports.getReviews = (req, res) => {
  try {
    const { page = 1, limit = 10, rating } = req.query;
    let reviews = db.findWhere('reviews', r => r.vendorId === req.user.id);
    if (rating) reviews = reviews.filter(r => r.rating === Number(rating));
    return ok(res, db.paginate(reviews, page, limit));
  } catch (e) { return serverError(res, e); }
};

exports.replyToReview = (req, res) => {
  try {
    const { reply } = req.body;
    const review = db.findById('reviews', req.params.id);
    if (!review || review.vendorId !== req.user.id) return notFound(res, 'Review not found');
    const updated = db.update('reviews', review.id, { vendorReply: reply });
    return ok(res, { review: updated }, 'Reply posted');
  } catch (e) { return serverError(res, e); }
};

/* ─── PAYMENT LOGS ──────────────────────────────────────────────────────── */
exports.getPaymentLogs = (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const payments = db.findWhere('payments', p => p.vendorId === req.user.id);
    return ok(res, db.paginate(payments, page, limit));
  } catch (e) { return serverError(res, e); }
};

/* ─── SUBSCRIPTION ──────────────────────────────────────────────────────── */
exports.getSubscription = (req, res) => {
  try {
    const vendor = db.findById('vendors', req.user.id);
    const plans  = db.subscriptionPlans;
    const logs   = db.findWhere('subscriptionLogs', l => l.vendorId === req.user.id);
    return ok(res, { currentPlan: vendor.subscriptionPlan, plans, logs });
  } catch (e) { return serverError(res, e); }
};

exports.getSubscriptionLogs = (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const logs = db.findWhere('subscriptionLogs', l => l.vendorId === req.user.id);
    return ok(res, db.paginate(logs, page, limit));
  } catch (e) { return serverError(res, e); }
};

exports.changeSubscription = (req, res) => {
  try {
    const { planId, billing = 'monthly' } = req.body;
    const plan = db.findById('subscriptionPlans', planId);
    if (!plan) return notFound(res, 'Plan not found');
    const vendor = db.findById('vendors', req.user.id);
    db.update('vendors', vendor.id, { subscriptionPlan: plan.name });
    const log = db.create('subscriptionLogs', {
      vendorId: vendor.id, planId: plan.id, planName: plan.name,
      startDate: new Date().toISOString().split('T')[0],
      endDate:   new Date(Date.now() + (billing === 'yearly' ? 365 : 30) * 864e5).toISOString().split('T')[0],
      amount: billing === 'yearly' ? plan.priceYearly : plan.priceMonthly,
      billing, status: 'Active',
    });
    return ok(res, { subscription: log }, 'Subscription changed');
  } catch (e) { return serverError(res, e); }
};

/* ─── BANK DETAILS ──────────────────────────────────────────────────────── */
exports.getBankDetails = (req, res) => {
  try {
    const banks = db.findWhere('bankDetails', b => b.vendorId === req.user.id);
    return ok(res, { bankDetails: banks });
  } catch (e) { return serverError(res, e); }
};

exports.addBankDetail = (req, res) => {
  try {
    const { bankName, accountName, iban, swift, routingNumber, isPrimary = false } = req.body;
    if (!bankName || !iban) return fail(res, 'Bank name and IBAN are required');
    if (isPrimary) {
      db.findWhere('bankDetails', b => b.vendorId === req.user.id)
        .forEach(b => db.update('bankDetails', b.id, { isPrimary: false }));
    }
    const bank = db.create('bankDetails', { vendorId: req.user.id, bankName, accountName, iban, swift, routingNumber, isPrimary });
    return created(res, { bank }, 'Bank account added');
  } catch (e) { return serverError(res, e); }
};

exports.updateBankDetail = (req, res) => {
  try {
    const bank = db.findById('bankDetails', req.params.id);
    if (!bank || bank.vendorId !== req.user.id) return notFound(res, 'Bank detail not found');
    const updated = db.update('bankDetails', bank.id, req.body);
    return ok(res, { bank: updated }, 'Bank detail updated');
  } catch (e) { return serverError(res, e); }
};

exports.deleteBankDetail = (req, res) => {
  try {
    const bank = db.findById('bankDetails', req.params.id);
    if (!bank || bank.vendorId !== req.user.id) return notFound(res, 'Bank detail not found');
    db.delete('bankDetails', bank.id);
    return ok(res, {}, 'Bank detail deleted');
  } catch (e) { return serverError(res, e); }
};

/* ─── NOTIFICATIONS ─────────────────────────────────────────────────────── */
exports.getNotifications = (req, res) => {
  try {
    const { page = 1, limit = 10, isRead } = req.query;
    let notifs = db.findWhere('notifications', n => n.vendorId === req.user.id);
    if (isRead !== undefined) notifs = notifs.filter(n => n.isRead === (isRead === 'true'));
    return ok(res, db.paginate(notifs, page, limit));
  } catch (e) { return serverError(res, e); }
};

exports.markNotificationRead = (req, res) => {
  try {
    const notif = db.findById('notifications', req.params.id);
    if (!notif) return notFound(res, 'Notification not found');
    const updated = db.update('notifications', notif.id, { isRead: true });
    return ok(res, { notification: updated });
  } catch (e) { return serverError(res, e); }
};

exports.markAllRead = (req, res) => {
  try {
    db.findWhere('notifications', n => n.vendorId === req.user.id)
      .forEach(n => { n.isRead = true; });
    return ok(res, {}, 'All notifications marked as read');
  } catch (e) { return serverError(res, e); }
};
