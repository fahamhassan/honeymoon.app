'use strict';
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { ok, created, fail, notFound, serverError } = require('../utils/response');

const strip = (u) => { const { password, ...s } = u; return s; };

/* ─── HOME / PUBLIC ─────────────────────────────────────────────────────── */
exports.getHome = (req, res) => {
  try {
    const featuredVendors = db.vendors
      .filter(v => v.status === 'Active')
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6)
      .map(strip);

    const categories = db.categories.filter(c => c.status === 'Active');
    const content    = db.homeContent.filter(c => c.isActive);

    return ok(res, { featuredVendors, categories, content });
  } catch (e) { return serverError(res, e); }
};

/* ─── PROFILE ───────────────────────────────────────────────────────────── */
exports.getProfile = (req, res) => {
  try {
    const user = db.findById('users', req.user.id);
    if (!user) return notFound(res, 'User not found');
    return ok(res, { user: strip(user) });
  } catch (e) { return serverError(res, e); }
};

exports.updateProfile = (req, res) => {
  try {
    const user = db.findById('users', req.user.id);
    if (!user) return notFound(res, 'User not found');
    const { password, role, status, ...updates } = req.body;
    const updated = db.update('users', user.id, updates);
    return ok(res, { user: strip(updated) }, 'Profile updated');
  } catch (e) { return serverError(res, e); }
};

exports.changePassword = (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = db.findById('users', req.user.id);
    if (!user) return notFound(res, 'User not found');
    if (!bcrypt.compareSync(currentPassword, user.password))
      return fail(res, 'Current password is incorrect');
    db.update('users', user.id, { password: bcrypt.hashSync(newPassword, 10) });
    return ok(res, {}, 'Password changed successfully');
  } catch (e) { return serverError(res, e); }
};

/* ─── VENDORS (PUBLIC) ──────────────────────────────────────────────────── */
exports.getVendors = (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', category, location } = req.query;
    let vendors = db.vendors.filter(v => v.status === 'Active').map(strip);
    if (category) vendors = vendors.filter(v => v.category === category);
    if (location) vendors = vendors.filter(v => v.location?.toLowerCase().includes(location.toLowerCase()));
    return ok(res, db.paginate(vendors, page, limit, search, ['companyName','firstName','lastName','location']));
  } catch (e) { return serverError(res, e); }
};

exports.getVendor = (req, res) => {
  try {
    const vendor = db.findById('vendors', req.params.id);
    if (!vendor || vendor.status !== 'Active') return notFound(res, 'Vendor not found');
    const services = db.findWhere('services', s => s.vendorId === vendor.id && s.status === 'Active');
    const reviews  = db.findWhere('reviews',  r => r.vendorId === vendor.id && !r.isHidden);
    return ok(res, { vendor: strip(vendor), services, reviews });
  } catch (e) { return serverError(res, e); }
};

/* ─── SERVICES (PUBLIC) ─────────────────────────────────────────────────── */
exports.getServices = (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', category, location, vendorId } = req.query;
    let services = db.services.filter(s => s.status === 'Active');
    if (category) services = services.filter(s => s.category === category);
    if (location) services = services.filter(s => s.location?.toLowerCase().includes(location.toLowerCase()));
    if (vendorId) services = services.filter(s => s.vendorId === vendorId);
    return ok(res, db.paginate(services, page, limit, search, ['name','category']));
  } catch (e) { return serverError(res, e); }
};

exports.getService = (req, res) => {
  try {
    const svc = db.findById('services', req.params.id);
    if (!svc || svc.status !== 'Active') return notFound(res, 'Service not found');
    const vendor  = db.findById('vendors', svc.vendorId);
    const addons  = db.findWhere('addons', a => a.vendorId === svc.vendorId && a.status === 'Active');
    const reviews = db.findWhere('reviews', r => r.serviceId === svc.id && !r.isHidden);
    return ok(res, { service: svc, vendor: vendor ? strip(vendor) : null, addons, reviews });
  } catch (e) { return serverError(res, e); }
};

/* ─── CATEGORIES (PUBLIC) ───────────────────────────────────────────────── */
exports.getCategories = (req, res) => {
  try {
    const categories = db.categories.filter(c => c.status === 'Active');
    return ok(res, { categories });
  } catch (e) { return serverError(res, e); }
};

/* ─── BOOKINGS ──────────────────────────────────────────────────────────── */
exports.getMyBookings = (req, res) => {
  try {
    const { page = 1, limit = 10, status, type } = req.query;
    let bookings = db.findWhere('bookings', b => b.userId === req.user.id);
    if (status) bookings = bookings.filter(b => b.status === status);
    if (type)   bookings = bookings.filter(b => b.type === type);
    return ok(res, db.paginate(bookings, page, limit));
  } catch (e) { return serverError(res, e); }
};

exports.getMyBooking = (req, res) => {
  try {
    const booking = db.findById('bookings', req.params.id);
    if (!booking || booking.userId !== req.user.id) return notFound(res, 'Booking not found');
    const vendor  = db.findById('vendors', booking.vendorId);
    const service = db.findById('services', booking.serviceId);
    return ok(res, { booking, vendor: vendor ? strip(vendor) : null, service });
  } catch (e) { return serverError(res, e); }
};

exports.createBooking = (req, res) => {
  try {
    const { serviceId, vendorId, eventDate, eventTime, guestCount, quantity, addons, location, additionalNote, inspirationalImages, loyaltyPointsToUse = 0 } = req.body;
    if (!serviceId || !vendorId || !eventDate) return fail(res, 'Service, vendor and event date are required');

    const service = db.findById('services', serviceId);
    if (!service) return notFound(res, 'Service not found');

    const user = db.findById('users', req.user.id);

    // Loyalty points validation
    let loyaltyDiscount = 0;
    if (loyaltyPointsToUse > 0) {
      if (loyaltyPointsToUse > user.loyaltyPoints) return fail(res, 'Insufficient loyalty points');
      loyaltyDiscount = loyaltyPointsToUse * db.loyaltyConfig.pointValue;
    }

    const baseAmount   = service.basePrice * (guestCount || quantity || 1);
    const totalAmount  = Math.max(0, baseAmount - loyaltyDiscount);
    const depositAmount = totalAmount * (service.depositPercent / 100);

    const booking = db.create('bookings', {
      userId: req.user.id, vendorId, serviceId, type: 'standard',
      status: 'Pending', paymentStatus: 'Unpaid',
      eventDate, eventTime, guestCount, quantity: quantity || 1,
      addons: addons || [], location, additionalNote,
      inspirationalImages: inspirationalImages || [],
      totalAmount, depositAmount, depositPaid: false,
      loyaltyPointsUsed: loyaltyPointsToUse,
    });

    // Deduct loyalty points
    if (loyaltyPointsToUse > 0) {
      db.update('users', user.id, { loyaltyPoints: user.loyaltyPoints - loyaltyPointsToUse });
      db.create('loyaltyLogs', {
        userId: user.id, type: 'redeemed',
        points: -loyaltyPointsToUse, bookingId: booking.id,
        description: 'Points redeemed on booking',
      });
    }

    return created(res, { booking }, 'Booking created successfully');
  } catch (e) { return serverError(res, e); }
};

exports.cancelBooking = (req, res) => {
  try {
    const booking = db.findById('bookings', req.params.id);
    if (!booking || booking.userId !== req.user.id) return notFound(res, 'Booking not found');
    if (!['Pending'].includes(booking.status))
      return fail(res, 'Only pending bookings can be cancelled');
    const updated = db.update('bookings', booking.id, { status: 'Rejected', rejectionReason: 'Cancelled by user' });
    return ok(res, { booking: updated }, 'Booking cancelled');
  } catch (e) { return serverError(res, e); }
};

exports.rateBooking = (req, res) => {
  try {
    const { rating, review } = req.body;
    if (!rating || rating < 1 || rating > 5) return fail(res, 'Rating must be between 1 and 5');
    const booking = db.findById('bookings', req.params.id);
    if (!booking || booking.userId !== req.user.id) return notFound(res, 'Booking not found');
    if (booking.status !== 'Completed') return fail(res, 'Can only rate completed bookings');

    const rev = db.create('reviews', {
      userId: req.user.id, vendorId: booking.vendorId,
      serviceId: booking.serviceId, bookingId: booking.id,
      rating, review, isHidden: false,
    });

    // Award loyalty points for review
    const user = db.findById('users', req.user.id);
    db.update('users', user.id, { loyaltyPoints: user.loyaltyPoints + 50 });
    db.create('loyaltyLogs', {
      userId: user.id, type: 'awarded', points: 50, bookingId: booking.id,
      description: 'Points awarded for leaving a review',
    });

    return created(res, { review: rev }, 'Review submitted successfully');
  } catch (e) { return serverError(res, e); }
};

exports.reportBooking = (req, res) => {
  try {
    const { reasons, details } = req.body;
    if (!reasons || !details) return fail(res, 'Reasons and details are required');
    const booking = db.findById('bookings', req.params.id);
    if (!booking || booking.userId !== req.user.id) return notFound(res, 'Booking not found');
    const report = db.create('reportedBookings', {
      bookingId: booking.id, reportedBy: req.user.id,
      reasons, details, status: 'Pending',
    });
    return created(res, { report }, 'Report submitted');
  } catch (e) { return serverError(res, e); }
};

/* ─── CUSTOM QUOTATIONS ─────────────────────────────────────────────────── */
exports.getMyCustomQuotations = (req, res) => {
  try {
    const { page = 1, limit = 10, status, subTab = 'requests' } = req.query;
    let quotations = db.findWhere('customQuotations', q => q.userId === req.user.id);
    if (status) quotations = quotations.filter(q => q.status === status);
    return ok(res, db.paginate(quotations, page, limit));
  } catch (e) { return serverError(res, e); }
};

exports.getMyCustomQuotation = (req, res) => {
  try {
    const quotation = db.findById('customQuotations', req.params.id);
    if (!quotation || quotation.userId !== req.user.id) return notFound(res, 'Quotation not found');
    const vendor = quotation.vendorId ? db.findById('vendors', quotation.vendorId) : null;
    return ok(res, { quotation, vendor: vendor ? strip(vendor) : null });
  } catch (e) { return serverError(res, e); }
};

exports.requestCustomQuotation = (req, res) => {
  try {
    const { services, location, eventDate, startTime, endTime, guestCount, budgetMin, budgetMax, additionalNote, inspirationalImages } = req.body;
    if (!services || !location || !eventDate) return fail(res, 'Services, location and event date are required');

    const aiRecommended = { min: budgetMin * 1.2, max: budgetMax * 1.5, average: (budgetMin + budgetMax) / 2 * 1.3 };

    const quotation = db.create('customQuotations', {
      userId: req.user.id, vendorId: null,
      services, location, eventDate, startTime, endTime, guestCount,
      budgetMin, budgetMax, additionalNote,
      inspirationalImages: inspirationalImages || [],
      status: 'Requested',
      quotationAmount: null,
      depositPercent: 20,
      loyaltyPointsUsed: 0,
      aiRecommendedBudget: aiRecommended,
    });

    return created(res, { quotation }, 'Custom quotation request submitted');
  } catch (e) { return serverError(res, e); }
};

exports.confirmQuotation = (req, res) => {
  try {
    const quotation = db.findById('customQuotations', req.params.id);
    if (!quotation || quotation.userId !== req.user.id) return notFound(res, 'Quotation not found');
    if (quotation.status !== 'Pending') return fail(res, 'Quotation is not in pending state');
    const updated = db.update('customQuotations', quotation.id, { status: 'Upcoming' });
    return ok(res, { quotation: updated }, 'Quotation confirmed');
  } catch (e) { return serverError(res, e); }
};

/* ─── PAYMENTS ──────────────────────────────────────────────────────────── */
exports.processPayment = (req, res) => {
  try {
    const { bookingId, amount, method = 'card' } = req.body;
    if (!bookingId || !amount) return fail(res, 'Booking ID and amount are required');
    const booking = db.findById('bookings', bookingId);
    if (!booking) return notFound(res, 'Booking not found');

    const payment = db.create('payments', {
      bookingId, userId: req.user.id, vendorId: booking.vendorId,
      amount, type: booking.depositPaid ? 'final' : 'deposit',
      method, status: 'completed', transactionId: `TXN${Date.now()}`,
    });

    // Update booking payment status
    db.update('bookings', booking.id, {
      depositPaid: true,
      paymentStatus: booking.totalAmount <= amount ? 'Paid' : 'Partially Paid',
    });

    // Award loyalty points for payment
    const user = db.findById('users', req.user.id);
    const pointsEarned = Math.floor(amount / db.loyaltyConfig.baseAmount) * db.loyaltyConfig.pointsPerBase;
    if (pointsEarned > 0) {
      db.update('users', user.id, { loyaltyPoints: user.loyaltyPoints + pointsEarned });
      db.create('loyaltyLogs', {
        userId: user.id, type: 'awarded', points: pointsEarned, bookingId,
        description: `Points earned on payment of AED ${amount}`,
      });
    }

    return created(res, { payment, pointsEarned }, 'Payment processed successfully');
  } catch (e) { return serverError(res, e); }
};

exports.getMyPayments = (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const payments = db.findWhere('payments', p => p.userId === req.user.id);
    return ok(res, db.paginate(payments, page, limit));
  } catch (e) { return serverError(res, e); }
};

/* ─── MEETING REQUESTS ──────────────────────────────────────────────────── */
exports.getMyMeetingRequests = (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    let meetings = db.findWhere('meetingRequests', m => m.userId === req.user.id);
    if (status) meetings = meetings.filter(m => m.status === status);
    return ok(res, db.paginate(meetings, page, limit));
  } catch (e) { return serverError(res, e); }
};

exports.requestMeeting = (req, res) => {
  try {
    const { vendorId, name, phone, email, reason } = req.body;
    if (!vendorId || !reason) return fail(res, 'Vendor and reason are required');
    const vendor = db.findById('vendors', vendorId);
    if (!vendor) return notFound(res, 'Vendor not found');
    const meeting = db.create('meetingRequests', {
      userId: req.user.id, vendorId, name, phone, email, reason,
      requestDate: new Date().toISOString().split('T')[0],
      requestTime: new Date().toISOString().split('T')[1].slice(0, 5),
      status: 'Pending',
    });
    return created(res, { meeting }, 'Meeting request sent');
  } catch (e) { return serverError(res, e); }
};

/* ─── REPORTED BOOKINGS ─────────────────────────────────────────────────── */
exports.getMyReportedBookings = (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const reports = db.findWhere('reportedBookings', r => r.reportedBy === req.user.id);
    return ok(res, db.paginate(reports, page, limit));
  } catch (e) { return serverError(res, e); }
};

/* ─── BUDGETS ───────────────────────────────────────────────────────────── */
exports.getMyBudgets = (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const budgets = db.findWhere('budgets', b => b.userId === req.user.id);
    return ok(res, db.paginate(budgets, page, limit, search, ['name']));
  } catch (e) { return serverError(res, e); }
};

exports.getMyBudget = (req, res) => {
  try {
    const budget = db.findById('budgets', req.params.id);
    if (!budget || budget.userId !== req.user.id) return notFound(res, 'Budget not found');
    return ok(res, { budget });
  } catch (e) { return serverError(res, e); }
};

exports.createBudget = (req, res) => {
  try {
    const { name, totalBudget, allocations } = req.body;
    if (!name || !totalBudget) return fail(res, 'Name and total budget are required');
    const budget = db.create('budgets', {
      userId: req.user.id, name, totalBudget,
      allocations: allocations || {},
      spent: Object.fromEntries(Object.keys(allocations || {}).map(k => [k, 0])),
      modifiedAt: new Date().toISOString(),
    });
    return created(res, { budget }, 'Budget created');
  } catch (e) { return serverError(res, e); }
};

exports.updateBudget = (req, res) => {
  try {
    const budget = db.findById('budgets', req.params.id);
    if (!budget || budget.userId !== req.user.id) return notFound(res, 'Budget not found');
    const updated = db.update('budgets', budget.id, { ...req.body, modifiedAt: new Date().toISOString() });
    return ok(res, { budget: updated }, 'Budget updated');
  } catch (e) { return serverError(res, e); }
};

exports.deleteBudget = (req, res) => {
  try {
    const budget = db.findById('budgets', req.params.id);
    if (!budget || budget.userId !== req.user.id) return notFound(res, 'Budget not found');
    db.delete('budgets', budget.id);
    return ok(res, {}, 'Budget deleted');
  } catch (e) { return serverError(res, e); }
};

exports.estimateBudget = (req, res) => {
  try {
    const { location, guestCount } = req.body;
    if (!location || !guestCount) return fail(res, 'Location and guest count are required');
    // AI mock estimation
    const basePerGuest = { Dubai: 250, 'Abu Dhabi': 220, Sharjah: 180 }[location] || 200;
    const estimated = guestCount * basePerGuest;
    return ok(res, {
      location, guestCount,
      estimatedBudget: estimated,
      range: { min: estimated * 0.8, max: estimated * 1.3 },
      breakdown: {
        Venue: Math.round(estimated * 0.35),
        Catering: Math.round(estimated * 0.30),
        Photography: Math.round(estimated * 0.12),
        Decoration: Math.round(estimated * 0.10),
        Beauty: Math.round(estimated * 0.08),
        Music: Math.round(estimated * 0.05),
      },
      aiMessage: `Most couples in ${location} with ${guestCount} guests spend between AED ${Math.round(estimated * 0.8).toLocaleString()} - AED ${Math.round(estimated * 1.3).toLocaleString()} on average.`
    });
  } catch (e) { return serverError(res, e); }
};

/* ─── LOYALTY ───────────────────────────────────────────────────────────── */
exports.getLoyalty = (req, res) => {
  try {
    const user = db.findById('users', req.user.id);
    if (!user) return notFound(res, 'User not found');
    const logs = db.findWhere('loyaltyLogs', l => l.userId === req.user.id);
    const pointValue = db.loyaltyConfig.pointValue;
    return ok(res, {
      points: user.loyaltyPoints,
      pointsValue: (user.loyaltyPoints * pointValue).toFixed(2),
      referralCode: user.referralCode,
      logs,
      config: db.loyaltyConfig,
    });
  } catch (e) { return serverError(res, e); }
};

/* ─── NOTIFICATIONS ─────────────────────────────────────────────────────── */
exports.getNotifications = (req, res) => {
  try {
    const { page = 1, limit = 10, isRead } = req.query;
    let notifs = db.findWhere('notifications', n => n.userId === req.user.id);
    if (isRead !== undefined) notifs = notifs.filter(n => n.isRead === (isRead === 'true'));
    return ok(res, db.paginate(notifs, page, limit));
  } catch (e) { return serverError(res, e); }
};

exports.markNotificationRead = (req, res) => {
  try {
    const notif = db.findById('notifications', req.params.id);
    if (!notif || notif.userId !== req.user.id) return notFound(res, 'Notification not found');
    const updated = db.update('notifications', notif.id, { isRead: true });
    return ok(res, { notification: updated });
  } catch (e) { return serverError(res, e); }
};

exports.markAllRead = (req, res) => {
  try {
    db.findWhere('notifications', n => n.userId === req.user.id).forEach(n => { n.isRead = true; });
    return ok(res, {}, 'All notifications marked as read');
  } catch (e) { return serverError(res, e); }
};

/* ─── WISHLIST (in-memory per-user) ─────────────────────────────────────── */
const wishlists = {};
exports.getWishlist = (req, res) => {
  try {
    const ids = wishlists[req.user.id] || [];
    const vendors = ids.map(id => db.findById('vendors', id)).filter(Boolean).map(strip);
    return ok(res, { wishlist: vendors });
  } catch (e) { return serverError(res, e); }
};

exports.toggleWishlist = (req, res) => {
  try {
    const { vendorId } = req.body;
    if (!wishlists[req.user.id]) wishlists[req.user.id] = [];
    const idx = wishlists[req.user.id].indexOf(vendorId);
    let action;
    if (idx > -1) { wishlists[req.user.id].splice(idx, 1); action = 'removed'; }
    else          { wishlists[req.user.id].push(vendorId);   action = 'added'; }
    return ok(res, { action, wishlist: wishlists[req.user.id] }, `Vendor ${action} to wishlist`);
  } catch (e) { return serverError(res, e); }
};

/* ─── CONTACT US ────────────────────────────────────────────────────────── */
exports.contactUs = (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!subject || !message) return fail(res, 'Subject and message are required');
    const query = db.create('queries', {
      userId: req.user?.id || null, name, email, phone, subject, message, status: 'Open',
    });
    return created(res, { query }, 'Message sent. We will get back to you soon.');
  } catch (e) { return serverError(res, e); }
};
