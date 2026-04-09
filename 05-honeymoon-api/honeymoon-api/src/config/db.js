'use strict';
const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');

const H = (pw) => bcrypt.hashSync(pw, 10);

/* ─────────────────────────────────────────────────────────────────────────
   IN-MEMORY DATABASE
   Replace collection arrays with real DB queries (PostgreSQL / MongoDB).
   Every collection exposes the same CRUD helpers at the bottom of this file.
───────────────────────────────────────────────────────────────────────────*/
const db = {

  /* ADMINS */
  admins: [
    {
      id: 'admin-1', firstName: 'Super', lastName: 'Admin',
      email: 'admin@honeymoon.ae', password: H('Admin@123'),
      phone: '+97141234567', role: 'super_admin',
      avatar: null, createdAt: '2024-01-01'
    }
  ],

  /* USERS */
  users: Array.from({ length: 20 }, (_, i) => ({
    id: `user-${i + 1}`,
    firstName: ['Sarah','Mohammed','Priya','James','Fatima','Aisha','Omar','Elena','Raj','Lena'][i % 10],
    lastName:  ['Johnson','Al-Rashid','Sharma','Wilson','Hassan','Al-Zaabi','Al-Mansoori','Garcia','Patel','Müller'][i % 10],
    email: `user${i + 1}@example.com`,
    password: H('User@123'),
    phone: `+9715${String(10000000 + i).slice(1)}`,
    gender: i % 2 === 0 ? 'Male' : 'Female',
    uaePass: `UAE${100000 + i}`,
    status: i % 7 === 0 ? 'Inactive' : 'Active',
    loyaltyPoints: Math.floor(Math.random() * 2000),
    referralCode: `REF${1000 + i}`,
    referredBy: i > 5 ? `REF${1000 + i - 6}` : null,
    avatar: null,
    createdAt: `2024-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')}`
  })),

  /* VENDORS */
  vendors: Array.from({ length: 15 }, (_, i) => ({
    id: `vendor-${i + 1}`,
    firstName: ['Ronan','Sarah','Ahmed','Maria','James','Fatima','Omar','Elena','Raj','Lena','Tom','Anna','Ali','Mia','Leo'][i],
    lastName:  ['Blackwood','Parker','Al-Mansoori','Garcia','Wilson','Hassan','Al-Zaabi','Müller','Patel','Schmidt','Albert','Novak','Khalil','Johansson','Rossi'][i],
    email: `vendor${i + 1}@example.com`,
    password: H('Vendor@123'),
    phone: `+9715${String(50000000 + i).slice(1)}`,
    companyName: [
      'Timeless Charm Chateau','Hearts Aligned','Royal Gardens','Pearl Promise','Velvet Vows',
      'The Wedding Atelier','Golden Moments','Luxe Events','Elite Venues','Premier Weddings',
      'Grand Celebration','Blissful Beginnings','Enchanting Events','Dream Weddings','Luxury Affairs'
    ][i],
    category: ['Venue','Photography','Catering','Beauty','Decoration','Music','Transport','Venue','Photography','Catering','Venue','Decoration','Beauty','Music','Photography'][i],
    location: ['Dubai','Abu Dhabi','Sharjah','Dubai','Dubai','Abu Dhabi','Sharjah','Dubai','Abu Dhabi','Dubai','Sharjah','Dubai','Abu Dhabi','Dubai','Sharjah'][i],
    address: `${i + 1} Sheikh Zayed Road, ${['Dubai','Abu Dhabi','Sharjah'][i % 3]}`,
    rating: parseFloat((4.2 + Math.random() * 0.8).toFixed(1)),
    reviewCount: Math.floor(50 + Math.random() * 500),
    status: ['Active','Active','Pending','Active','Active','Active','Inactive','Active','Active','Pending','Active','Active','Rejected','Active','Active'][i],
    subscriptionPlan: ['Basic','Standard','Premium','Basic','Standard'][i % 5],
    subscriptionExpiry: '2025-12-31',
    isVerified: i % 3 !== 2,
    commissionRate: 10,
    avatar: null,
    banner: null,
    tradeLicense: null,
    about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    createdAt: `2024-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')}`
  })),

  /* CATEGORIES */
  categories: [
    { id: 'cat-1', name: 'Venue',        icon: '🏛', status: 'Active',   vendorCount: 45 },
    { id: 'cat-2', name: 'Photography',  icon: '📸', status: 'Active',   vendorCount: 38 },
    { id: 'cat-3', name: 'Catering',     icon: '🍽', status: 'Active',   vendorCount: 29 },
    { id: 'cat-4', name: 'Beauty',       icon: '💄', status: 'Active',   vendorCount: 22 },
    { id: 'cat-5', name: 'Decoration',   icon: '🌸', status: 'Active',   vendorCount: 31 },
    { id: 'cat-6', name: 'Music',        icon: '🎵', status: 'Active',   vendorCount: 18 },
    { id: 'cat-7', name: 'Transport',    icon: '🚗', status: 'Inactive', vendorCount: 12 },
    { id: 'cat-8', name: 'Invitations',  icon: '✉️', status: 'Active',   vendorCount: 9  },
  ],

  /* SERVICES */
  services: Array.from({ length: 30 }, (_, i) => ({
    id: `svc-${i + 1}`,
    vendorId: `vendor-${(i % 15) + 1}`,
    name: ['Premium Venue Package','Standard Photography','Full Catering','Bridal Makeup','Floral Decoration','Live Band','Luxury Car','Custom Invitations','Honeymoon Suite','Garden Party'][i % 10],
    category: ['Venue','Photography','Catering','Beauty','Decoration','Music','Transport','Invitations','Venue','Decoration'][i % 10],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet.',
    pricingType: ['Per Guest','Per Hour','Package','Per Item','Per Guest'][i % 5],
    basePrice: [5000, 200, 15000, 500, 3000, 2000, 800, 100, 8000, 2500][i % 10],
    minGuests: 50, maxGuests: 500,
    depositPercent: 20,
    minHours: 2,
    location: ['Dubai','Abu Dhabi','Sharjah'][i % 3],
    rating: parseFloat((4.0 + Math.random()).toFixed(1)),
    reviewCount: Math.floor(10 + Math.random() * 200),
    status: i % 5 === 0 ? 'Inactive' : 'Active',
    images: [],
    packages: [{ name: 'Package ABC', description: 'Includes everything', price: 2000 }],
    policies: { depositRefundable: false, cancellationNotice: '14 Days' },
    createdAt: `2024-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')}`
  })),

  /* ADD-ONS */
  addons: Array.from({ length: 20 }, (_, i) => ({
    id: `addon-${i + 1}`,
    vendorId: `vendor-${(i % 15) + 1}`,
    title: ['Premium Floral Setup','Professional Lighting','Live Band','Custom Cake','Photo Booth','Extra Hour','Valet Parking','Sound System','Video Projection','Champagne Tower'][i % 10],
    category: ['Decoration','Venue','Music','Catering','Photography','Venue','Transport','Music','Venue','Catering'][i % 10],
    priceType: ['Per Guest','Per Hour','Package','Per Item','Package'][i % 5],
    price: [150, 200, 2000, 500, 800, 300, 100, 500, 700, 1000][i % 10],
    status: i % 4 === 0 ? 'Inactive' : 'Active',
  })),

  /* BOOKINGS */
  bookings: Array.from({ length: 40 }, (_, i) => ({
    id: `BK${String(i + 1).padStart(6, '0')}`,
    userId:    `user-${(i % 20) + 1}`,
    vendorId:  `vendor-${(i % 15) + 1}`,
    serviceId: `svc-${(i % 30) + 1}`,
    type: i % 4 === 0 ? 'custom' : 'standard',
    status: ['Pending','Upcoming','Completed','Rejected','Resolved'][i % 5],
    paymentStatus: ['Unpaid','Paid','Unpaid','Paid','Paid'][i % 5],
    eventDate: `2025-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')}`,
    eventTime: '10:00 - 18:00',
    guestCount: 100 + i * 10,
    quantity: 1,
    totalAmount: 5000 + i * 500,
    depositAmount: 1000 + i * 100,
    depositPaid: i % 3 === 0,
    addons: [`addon-${(i % 20) + 1}`],
    location: ['Dubai Marina','Downtown Dubai','Palm Jumeirah'][i % 3],
    additionalNote: 'Lorem ipsum dolor sit amet',
    inspirationalImages: [],
    loyaltyPointsUsed: i % 5 === 0 ? 500 : 0,
    rejectionReason: i % 5 === 3 ? 'Date not available for requested slot' : null,
    reportedAt: null,
    createdAt: `2024-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')}`
  })),

  /* CUSTOM QUOTATIONS */
  customQuotations: Array.from({ length: 20 }, (_, i) => ({
    id: `RQ${String(i + 1).padStart(6, '0')}`,
    userId: `user-${(i % 20) + 1}`,
    vendorId: i % 3 === 0 ? `vendor-${(i % 15) + 1}` : null,
    services: ['Venue', 'Photography', 'Catering'].slice(0, (i % 3) + 1),
    location: ['Dubai','Abu Dhabi','Sharjah'][i % 3],
    eventDate: `2025-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')}`,
    startTime: '10:00', endTime: '22:00',
    guestCount: 100 + i * 20,
    budgetMin: 5000 + i * 1000,
    budgetMax: 10000 + i * 1000,
    additionalNote: 'Lorem ipsum dolor sit amet',
    inspirationalImages: [],
    status: ['Requested','Pending','Upcoming','Completed','Rejected'][i % 5],
    quotationAmount: i % 5 === 0 ? null : 8000 + i * 500,
    depositPercent: 20,
    loyaltyPointsUsed: 0,
    aiRecommendedBudget: { min: 7000, max: 9000, average: 8000 },
    createdAt: `2024-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')}`
  })),

  /* PAYMENTS */
  payments: Array.from({ length: 35 }, (_, i) => ({
    id: `PAY${String(i + 1).padStart(6, '0')}`,
    bookingId: `BK${String((i % 40) + 1).padStart(6, '0')}`,
    userId:   `user-${(i % 20) + 1}`,
    vendorId: `vendor-${(i % 15) + 1}`,
    amount: 1000 + i * 300,
    type: i % 3 === 0 ? 'deposit' : 'final',
    method: ['card','apple_pay','bank_transfer'][i % 3],
    status: i % 5 === 4 ? 'failed' : 'completed',
    transactionId: `TXN${Date.now() + i}`,
    createdAt: `2024-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')}`
  })),

  /* REVIEWS */
  reviews: Array.from({ length: 25 }, (_, i) => ({
    id: `rev-${i + 1}`,
    userId:    `user-${(i % 20) + 1}`,
    vendorId:  `vendor-${(i % 15) + 1}`,
    serviceId: `svc-${(i % 30) + 1}`,
    bookingId: `BK${String((i % 40) + 1).padStart(6, '0')}`,
    rating: Math.floor(3 + Math.random() * 3),
    review: 'Seamless experience and great service! The team was incredibly professional and attentive.',
    vendorReply: i % 3 === 0 ? 'Thank you for your kind words! We look forward to serving you again.' : null,
    isHidden: i % 8 === 0,
    createdAt: `2024-0${(i % 9) + 1}-15`
  })),

  /* NOTIFICATIONS */
  notifications: Array.from({ length: 30 }, (_, i) => ({
    id: `notif-${i + 1}`,
    userId:   i % 4 === 0 ? null : `user-${(i % 20) + 1}`,
    vendorId: i % 4 === 0 ? `vendor-${(i % 15) + 1}` : null,
    type: ['booking_confirmed','payment_received','new_review','booking_cancelled','meeting_request'][i % 5],
    title: ['Booking Confirmed','Payment Received','New Review','Booking Cancelled','Meeting Requested'][i % 5],
    message: `You receive a payment of $780.1 from Justin Westervelt`,
    isRead: i % 3 === 0,
    createdAt: `2024-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')}`
  })),

  /* PUSH NOTIFICATIONS */
  pushNotifications: Array.from({ length: 10 }, (_, i) => ({
    id: `push-${i + 1}`,
    title: `Announcement #${i + 1}`,
    message: 'We are excited to announce our latest feature update. Check it out now!',
    audience: ['all','users','vendors'][i % 3],
    reach: Math.floor(1000 + Math.random() * 5000),
    opened: Math.floor(100 + Math.random() * 1000),
    status: 'Sent',
    sentAt: `2024-0${(i % 9) + 1}-15`
  })),

  /* MEETING REQUESTS */
  meetingRequests: Array.from({ length: 15 }, (_, i) => ({
    id: `MTG${String(i + 1).padStart(6, '0')}`,
    userId:   `user-${(i % 20) + 1}`,
    vendorId: `vendor-${(i % 15) + 1}`,
    name: 'User ABC', phone: '123456789', email: 'user@gmail.com',
    requestDate: `2025-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')}`,
    requestTime: `${10 + (i % 8)}:00`,
    reason: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    status: ['Pending','Contacted','Meeting Scheduled','Lost','Converted'][i % 5],
    createdAt: `2024-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')}`
  })),

  /* REPORTED BOOKINGS */
  reportedBookings: Array.from({ length: 10 }, (_, i) => ({
    id: `REP${String(i + 1).padStart(6, '0')}`,
    bookingId: `BK${String((i % 40) + 1).padStart(6, '0')}`,
    reportedBy: `user-${(i % 20) + 1}`,
    reasons: [['Service Not As Described','Poor Quality'],['No Show','Rude Behavior']][i % 2],
    details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    status: i % 2 === 0 ? 'Pending' : 'Resolved',
    adminNote: i % 2 !== 0 ? 'Issue has been investigated and resolved.' : null,
    createdAt: `2024-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')}`
  })),

  /* SUBSCRIPTION PLANS */
  subscriptionPlans: [
    { id: 'plan-basic',    name: 'Basic',    commissionDiscount: 10, profileFeaturing: false, bannerPromotion: 'none',     priceMonthly: 20, priceYearly: 200, modifiedAt: '2024-01-01' },
    { id: 'plan-standard', name: 'Standard', commissionDiscount: 15, profileFeaturing: true,  bannerPromotion: 'platform', priceMonthly: 40, priceYearly: 400, modifiedAt: '2024-01-01' },
    { id: 'plan-premium',  name: 'Premium',  commissionDiscount: 20, profileFeaturing: true,  bannerPromotion: 'both',     priceMonthly: 80, priceYearly: 800, modifiedAt: '2024-01-01' },
  ],

  /* SUBSCRIPTION LOGS */
  subscriptionLogs: Array.from({ length: 20 }, (_, i) => ({
    id: `sub-${i + 1}`,
    vendorId: `vendor-${(i % 15) + 1}`,
    planId:   ['plan-basic','plan-standard','plan-premium'][i % 3],
    planName: ['Basic','Standard','Premium'][i % 3],
    startDate: `2024-0${(i % 9) + 1}-01`,
    endDate:   `2025-0${(i % 9) + 1}-01`,
    amount: [20, 40, 80][i % 3],
    billing: i % 2 === 0 ? 'monthly' : 'yearly',
    status: i % 4 === 0 ? 'Expired' : 'Active',
    createdAt: `2024-0${(i % 9) + 1}-01`
  })),

  /* BUDGETS */
  budgets: Array.from({ length: 15 }, (_, i) => ({
    id: `budget-${i + 1}`,
    userId: `user-${(i % 20) + 1}`,
    name: ['Wedding Budget','Engagement Budget','Reception Budget','Honeymoon Budget'][i % 4],
    totalBudget: 20000 + i * 5000,
    allocations: { Venue: 8000, Photography: 3000, Catering: 5000, Beauty: 2000, Decoration: 2000 },
    spent:       { Venue: 6000, Photography: 2500, Catering: 0,    Beauty: 1500, Decoration: 800 },
    modifiedAt: `2024-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')}`,
    createdAt:  `2024-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')}`
  })),

  /* LOYALTY */
  loyaltyConfig: { baseAmount: 100, pointsPerBase: 1, pointValue: 0.1 },
  loyaltyLogs: Array.from({ length: 20 }, (_, i) => ({
    id: `llog-${i + 1}`,
    userId: `user-${(i % 20) + 1}`,
    type: i % 3 === 0 ? 'redeemed' : 'awarded',
    points: i % 3 === 0 ? -500 : 100,
    bookingId: `BK${String((i % 40) + 1).padStart(6, '0')}`,
    description: i % 3 === 0 ? 'Points redeemed on booking' : 'Points awarded for completed booking',
    createdAt: `2024-0${(i % 9) + 1}-15`
  })),

  /* REFERRAL */
  referralConfig: { referrerBonus: 200, refereeBonus: 100, minBookingAmount: 1000 },

  /* PAYOUTS */
  payouts: Array.from({ length: 20 }, (_, i) => ({
    id: `PO${String(i + 1).padStart(6, '0')}`,
    vendorId:  `vendor-${(i % 15) + 1}`,
    bookingId: `BK${String((i % 40) + 1).padStart(6, '0')}`,
    amount:     3000 + i * 500,
    commission: 300  + i * 50,
    netAmount:  2700 + i * 450,
    status: ['Pending','Approved','Paid'][i % 3],
    bankDetails: { bankName: 'Emirates NBD', iban: 'AE07 0331 2345 6789' },
    requestedAt: `2024-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')}`,
    paidAt: i % 3 === 2 ? `2024-0${(i % 9) + 1}-20` : null
  })),

  /* QUERIES */
  queries: Array.from({ length: 15 }, (_, i) => ({
    id: `QR${String(i + 1).padStart(6, '0')}`,
    userId: `user-${(i % 20) + 1}`,
    name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+97150123456',
    subject: ['Booking cancellation','Payment issue','Service complaint','General enquiry','Technical issue'][i % 5],
    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    status: ['Open','In Progress','Resolved'][i % 3],
    adminReply: i % 3 === 2 ? 'Thank you for contacting us. We have resolved your issue.' : null,
    createdAt: `2024-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')}`
  })),

  /* HOME CONTENT */
  homeContent: [
    { id: 'hero',         section: 'Hero Banner',   title: 'Luxury Emirati Weddings',    subtitle: 'Intelligently Curated — Powered By AI', imageUrl: '', isActive: true  },
    { id: 'features',     section: 'Features',      title: 'Core Features',              subtitle: 'Everything for your perfect wedding',     imageUrl: '', isActive: true  },
    { id: 'categories',   section: 'Categories',    title: 'Vendor Categories',          subtitle: 'Find your perfect vendor',                imageUrl: '', isActive: true  },
    { id: 'testimonials', section: 'Testimonials',  title: 'What Our Clients Say',       subtitle: '',                                        imageUrl: '', isActive: true  },
    { id: 'cta',          section: 'CTA Banner',    title: 'Start Planning Today',       subtitle: 'Join thousands of happy couples',          imageUrl: '', isActive: false },
  ],

  /* BANK DETAILS */
  bankDetails: Array.from({ length: 10 }, (_, i) => ({
    id: `bank-${i + 1}`,
    vendorId:      `vendor-${(i % 15) + 1}`,
    bankName:      ['Emirates NBD','Abu Dhabi Commercial Bank','Dubai Islamic Bank','Mashreq Bank'][i % 4],
    accountName:   'Tom Albert Events LLC',
    iban:          `AE07 0331 ${1000 + i * 1000} 6789 0123 456`,
    swift:         'EBILAEAD',
    routingNumber: `02100002${i}`,
    isPrimary:      i % 3 === 0,
  })),

  /* COMMISSION CONFIG */
  commissionConfig: { defaultRate: 10, premiumRate: 7, standardRate: 8.5 },

  /* SETTINGS */
  settings: {
    maintenanceMode: false,
    registrationOpen: true,
    vendorApprovalRequired: true,
    maxImagesPerService: 10,
    commissionRate: 10,
    platformCurrency: 'AED',
    supportEmail: 'support@honeymoon.ae',
    supportPhone: '+97141234567',
  },

  /* REFRESH TOKENS */
  refreshTokens: [],
};

/* ── CRUD Helpers ─────────────────────────────────────────────────────────── */
db.findById     = (col, id)     => db[col].find(r => r.id === id) || null;
db.findByEmail  = (col, email)  => db[col].find(r => r.email === email) || null;
db.findWhere    = (col, pred)   => db[col].filter(pred);
db.findOneWhere = (col, pred)   => db[col].find(pred) || null;

db.create = (col, data) => {
  const record = { ...data, id: data.id || uuid(), createdAt: new Date().toISOString() };
  db[col].push(record);
  return record;
};

db.update = (col, id, updates) => {
  const idx = db[col].findIndex(r => r.id === id);
  if (idx === -1) return null;
  db[col][idx] = { ...db[col][idx], ...updates, updatedAt: new Date().toISOString() };
  return db[col][idx];
};

db.delete = (col, id) => {
  const idx = db[col].findIndex(r => r.id === id);
  if (idx === -1) return false;
  db[col].splice(idx, 1);
  return true;
};

db.paginate = (items, page = 1, limit = 10, search = '', searchFields = []) => {
  let filtered = items;
  if (search && searchFields.length) {
    const q = search.toLowerCase();
    filtered = items.filter(item =>
      searchFields.some(f => item[f] && String(item[f]).toLowerCase().includes(q))
    );
  }
  const total = filtered.length;
  const start = (Number(page) - 1) * Number(limit);
  return {
    data: filtered.slice(start, start + Number(limit)),
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / Number(limit))
  };
};

module.exports = db;
