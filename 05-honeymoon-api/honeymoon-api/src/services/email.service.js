'use strict';

/* ── SendGrid (lazy init) ───────────────────────────────────────────────────── */
let sgMail = null;
function getSG() {
  if (!sgMail) {
    try {
      sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    } catch {
      console.warn('[Email] @sendgrid/mail not installed — emails disabled');
    }
  }
  return sgMail;
}

const FROM = {
  email: process.env.SENDGRID_FROM_EMAIL || 'noreply@honeymoon.ae',
  name:  'Honeymoon',
};

/* ── Brand colours (matching Figma) ────────────────────────────────────────── */
const BRAND = { primary: '#174a37', gold: '#b89b6b', bg: '#f4ebd0', white: '#ffffff' };

/* ── Base HTML shell ────────────────────────────────────────────────────────── */
function baseTemplate(title, bodyHtml) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title></head>
<body style="margin:0;padding:0;background-color:${BRAND.bg};font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0">
  <tr><td align="center" style="padding:32px 16px;">
    <table width="600" cellpadding="0" cellspacing="0" style="background:${BRAND.white};border-radius:16px;overflow:hidden;max-width:600px;">
      <!-- Header -->
      <tr><td style="background:${BRAND.primary};padding:28px 36px;text-align:center;">
        <h1 style="margin:0;color:${BRAND.gold};font-size:26px;letter-spacing:3px;font-weight:900;">HONEYMOON</h1>
        <p style="margin:4px 0 0;color:rgba(255,255,255,0.7);font-size:12px;">Luxury Emirati Weddings</p>
      </td></tr>
      <!-- Body -->
      <tr><td style="padding:36px;">${bodyHtml}</td></tr>
      <!-- Footer -->
      <tr><td style="background:#f9f6ef;padding:20px 36px;text-align:center;border-top:1px solid #e5e0d4;">
        <p style="margin:0;color:#9ca3af;font-size:12px;">© 2026 Honeymoon. All rights reserved.</p>
        <p style="margin:6px 0 0;color:#9ca3af;font-size:12px;">support@honeymoon.ae | +971 4 123 4567</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

/* ── Send helper ────────────────────────────────────────────────────────────── */
async function send(to, subject, htmlContent, textContent = '') {
  const sg = getSG();
  if (!sg) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`\n[Email] DEV MODE — would send to ${to}\nSubject: ${subject}\n`);
    }
    return { success: true, dev: true };
  }

  try {
    await sg.send({
      to,
      from: FROM,
      subject,
      html: htmlContent,
      text: textContent || subject,
    });
    return { success: true };
  } catch (err) {
    console.error('[Email] SendGrid error:', err?.response?.body || err.message);
    throw new Error('Email delivery failed');
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   TEMPLATES
─────────────────────────────────────────────────────────────────────────────*/

/* 1. Welcome email (user + vendor) */
async function sendWelcome(to, firstName, role = 'user') {
  const isVendor = role === 'vendor';
  const body = `
    <h2 style="color:${BRAND.primary};margin:0 0 16px;">Welcome to Honeymoon, ${firstName}! 🎉</h2>
    <p style="color:#374151;line-height:1.7;">We're thrilled to have you join the UAE's premier wedding planning platform.</p>
    ${isVendor ? `
    <div style="background:#f0fdf4;border-radius:12px;padding:16px;margin:16px 0;border-left:4px solid ${BRAND.primary};">
      <p style="margin:0;color:#065f46;font-weight:600;">Your account is under review.</p>
      <p style="margin:8px 0 0;color:#065f46;font-size:14px;">Our team will verify your trade license and approve your profile within 24–48 hours.</p>
    </div>` : `
    <p style="color:#374151;line-height:1.7;">Start planning your perfect wedding by browsing our curated selection of vendors or using our AI budget estimator.</p>`}
    <div style="text-align:center;margin:28px 0;">
      <a href="${process.env.FRONTEND_URL || 'https://app.honeymoon.ae'}" style="background:${BRAND.gold};color:${BRAND.white};padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:700;font-size:15px;">
        ${isVendor ? 'View Dashboard' : 'Start Planning'}
      </a>
    </div>`;

  return send(to, `Welcome to Honeymoon, ${firstName}!`, baseTemplate('Welcome', body));
}

/* 2. OTP email */
async function sendOtpEmail(to, code, purpose = 'verification') {
  const purposeLabels = {
    forgot_password: 'Reset Your Password',
    email_verify:    'Verify Your Email',
    phone_verify:    'Verify Your Phone',
  };
  const title = purposeLabels[purpose] || 'Your OTP Code';

  const body = `
    <h2 style="color:${BRAND.primary};margin:0 0 16px;">${title}</h2>
    <p style="color:#374151;line-height:1.7;">Use the code below to complete your request. This code expires in <strong>10 minutes</strong>.</p>
    <div style="text-align:center;margin:28px 0;">
      <div style="display:inline-block;background:${BRAND.primary};color:${BRAND.white};padding:16px 40px;border-radius:12px;font-size:36px;font-weight:900;letter-spacing:12px;">${code}</div>
    </div>
    <p style="color:#9ca3af;font-size:13px;text-align:center;">If you didn't request this, please ignore this email.</p>`;

  return send(to, `Your Honeymoon OTP: ${code}`, baseTemplate(title, body));
}

/* 3. Booking confirmation */
async function sendBookingConfirmation(to, firstName, booking) {
  const body = `
    <h2 style="color:${BRAND.primary};margin:0 0 16px;">Booking Confirmed! 🎊</h2>
    <p style="color:#374151;">Hi ${firstName}, your booking has been received and is pending vendor confirmation.</p>
    <div style="background:#f9f6ef;border-radius:12px;padding:20px;margin:20px 0;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${[
          ['Booking ID', `#${booking.id}`],
          ['Event Date', new Date(booking.eventDate).toLocaleDateString('en-AE', { weekday:'long', year:'numeric', month:'long', day:'numeric' })],
          ['Location',   booking.location],
          ['Total Amount', `AED ${booking.totalAmount?.toLocaleString()}`],
          ['Deposit Due', `AED ${booking.depositAmount?.toLocaleString()}`],
        ].map(([l, v]) => `
        <tr>
          <td style="padding:6px 0;color:#6b7280;font-size:14px;">${l}</td>
          <td style="padding:6px 0;color:#111827;font-weight:600;font-size:14px;text-align:right;">${v}</td>
        </tr>`).join('')}
      </table>
    </div>
    <p style="color:#374151;font-size:14px;">You'll receive another notification once the vendor confirms your booking.</p>
    <div style="text-align:center;margin:24px 0;">
      <a href="${process.env.FRONTEND_URL || 'https://app.honeymoon.ae'}/my-bookings/${booking.id}" style="background:${BRAND.gold};color:${BRAND.white};padding:12px 28px;border-radius:50px;text-decoration:none;font-weight:700;">View Booking</a>
    </div>`;

  return send(to, `Booking Confirmed — #${booking.id}`, baseTemplate('Booking Confirmed', body));
}

/* 4. Booking approved (by vendor) */
async function sendBookingApproved(to, firstName, booking) {
  const body = `
    <h2 style="color:${BRAND.primary};margin:0 0 16px;">Your Booking is Approved! ✅</h2>
    <p style="color:#374151;">Great news, ${firstName}! The vendor has approved your booking.</p>
    <div style="background:#f0fdf4;border-radius:12px;padding:16px;margin:16px 0;border-left:4px solid #16a34a;">
      <p style="margin:0;color:#065f46;font-weight:600;">Booking #${booking.id} is now Upcoming</p>
      <p style="margin:8px 0 0;color:#065f46;font-size:14px;">Please complete your deposit payment of <strong>AED ${booking.depositAmount?.toLocaleString()}</strong> to secure your date.</p>
    </div>
    <div style="text-align:center;margin:24px 0;">
      <a href="${process.env.FRONTEND_URL || 'https://app.honeymoon.ae'}/my-bookings/${booking.id}" style="background:${BRAND.gold};color:${BRAND.white};padding:12px 28px;border-radius:50px;text-decoration:none;font-weight:700;">Pay Deposit</a>
    </div>`;

  return send(to, `Booking Approved — #${booking.id}`, baseTemplate('Booking Approved', body));
}

/* 5. Booking rejected */
async function sendBookingRejected(to, firstName, booking) {
  const body = `
    <h2 style="color:#dc2626;margin:0 0 16px;">Booking Update</h2>
    <p style="color:#374151;">Hi ${firstName}, unfortunately the vendor was unable to accommodate your booking.</p>
    <div style="background:#fef2f2;border-radius:12px;padding:16px;margin:16px 0;border-left:4px solid #dc2626;">
      <p style="margin:0;color:#991b1b;font-weight:600;">Booking #${booking.id} — Rejected</p>
      ${booking.rejectionReason ? `<p style="margin:8px 0 0;color:#991b1b;font-size:14px;">Reason: ${booking.rejectionReason}</p>` : ''}
    </div>
    <p style="color:#374151;font-size:14px;">We encourage you to explore other vendors on our platform.</p>
    <div style="text-align:center;margin:24px 0;">
      <a href="${process.env.FRONTEND_URL || 'https://app.honeymoon.ae'}/vendors" style="background:${BRAND.primary};color:${BRAND.white};padding:12px 28px;border-radius:50px;text-decoration:none;font-weight:700;">Browse Vendors</a>
    </div>`;

  return send(to, `Booking Update — #${booking.id}`, baseTemplate('Booking Update', body));
}

/* 6. Payment receipt */
async function sendPaymentReceipt(to, firstName, payment) {
  const body = `
    <h2 style="color:${BRAND.primary};margin:0 0 16px;">Payment Receipt 💳</h2>
    <p style="color:#374151;">Hi ${firstName}, here's your payment confirmation.</p>
    <div style="background:#f9f6ef;border-radius:12px;padding:20px;margin:20px 0;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${[
          ['Payment ID', `#${payment.id}`],
          ['Booking ID', `#${payment.bookingId}`],
          ['Amount',     `AED ${payment.amount?.toLocaleString()}`],
          ['Method',     payment.method?.replace('_', ' ').toUpperCase()],
          ['Date',       new Date().toLocaleDateString('en-AE')],
          ['Status',     'Completed ✅'],
        ].map(([l, v]) => `
        <tr>
          <td style="padding:6px 0;color:#6b7280;font-size:14px;">${l}</td>
          <td style="padding:6px 0;color:#111827;font-weight:600;font-size:14px;text-align:right;">${v}</td>
        </tr>`).join('')}
      </table>
    </div>`;

  return send(to, `Payment Receipt — AED ${payment.amount?.toLocaleString()}`, baseTemplate('Payment Receipt', body));
}

/* 7. Vendor approved */
async function sendVendorApproved(to, companyName) {
  const body = `
    <h2 style="color:${BRAND.primary};margin:0 0 16px;">Your Account is Approved! 🎉</h2>
    <p style="color:#374151;">Congratulations! <strong>${companyName}</strong> has been approved and is now live on the Honeymoon platform.</p>
    <div style="background:#f0fdf4;border-radius:12px;padding:16px;margin:16px 0;">
      <p style="margin:0;color:#065f46;font-weight:600;">Your profile is now visible to thousands of couples.</p>
      <p style="margin:8px 0 0;color:#065f46;font-size:14px;">Add your services, set your pricing, and start accepting bookings today.</p>
    </div>
    <div style="text-align:center;margin:24px 0;">
      <a href="${process.env.VENDOR_URL || 'https://vendor.honeymoon.ae'}/dashboard" style="background:${BRAND.gold};color:${BRAND.white};padding:12px 28px;border-radius:50px;text-decoration:none;font-weight:700;">Go to Dashboard</a>
    </div>`;

  return send(to, 'Your Vendor Account is Approved!', baseTemplate('Account Approved', body));
}

/* 8. New booking request to vendor */
async function sendNewBookingRequest(to, companyName, booking) {
  const body = `
    <h2 style="color:${BRAND.primary};margin:0 0 16px;">New Booking Request 📥</h2>
    <p style="color:#374151;">Hi ${companyName}, you have a new booking request.</p>
    <div style="background:#f9f6ef;border-radius:12px;padding:20px;margin:20px 0;">
      <table width="100%">
        ${[
          ['Booking ID', `#${booking.id}`],
          ['Event Date', new Date(booking.eventDate).toLocaleDateString('en-AE')],
          ['Guests',     booking.guestCount],
          ['Location',   booking.location],
          ['Amount',     `AED ${booking.totalAmount?.toLocaleString()}`],
        ].map(([l, v]) => `<tr><td style="padding:6px 0;color:#6b7280;font-size:14px;">${l}</td><td style="text-align:right;font-weight:600;font-size:14px;color:#111827;">${v}</td></tr>`).join('')}
      </table>
    </div>
    <p style="color:#374151;font-size:14px;">Please approve or reject this request within 48 hours.</p>
    <div style="text-align:center;margin:24px 0;">
      <a href="${process.env.VENDOR_URL || 'https://vendor.honeymoon.ae'}/dashboard/bookings/${booking.id}" style="background:${BRAND.primary};color:${BRAND.white};padding:12px 28px;border-radius:50px;text-decoration:none;font-weight:700;">Review Request</a>
    </div>`;

  return send(to, `New Booking Request — #${booking.id}`, baseTemplate('New Booking Request', body));
}

/* 9. Password reset success */
async function sendPasswordResetSuccess(to, firstName) {
  const body = `
    <h2 style="color:${BRAND.primary};margin:0 0 16px;">Password Changed ✅</h2>
    <p style="color:#374151;">Hi ${firstName}, your Honeymoon password has been successfully changed.</p>
    <p style="color:#374151;">If you didn't make this change, please contact our support team immediately.</p>
    <div style="text-align:center;margin:24px 0;">
      <a href="mailto:support@honeymoon.ae" style="background:${BRAND.gold};color:${BRAND.white};padding:12px 28px;border-radius:50px;text-decoration:none;font-weight:700;">Contact Support</a>
    </div>`;

  return send(to, 'Your Password Has Been Changed', baseTemplate('Password Changed', body));
}

/* 10. Quotation received */
async function sendQuotationReceived(to, firstName, quotation) {
  const body = `
    <h2 style="color:${BRAND.primary};margin:0 0 16px;">Quotation Received! 📋</h2>
    <p style="color:#374151;">Hi ${firstName}, a vendor has responded to your custom quotation request.</p>
    <div style="background:#f0fdf4;border-radius:12px;padding:16px;margin:16px 0;border-left:4px solid ${BRAND.primary};">
      <p style="margin:0;color:#065f46;font-weight:600;">Quotation Amount: AED ${quotation.quotationAmount?.toLocaleString()}</p>
      <p style="margin:8px 0 0;color:#065f46;font-size:14px;">Please review and accept or decline this quotation.</p>
    </div>
    <div style="text-align:center;margin:24px 0;">
      <a href="${process.env.FRONTEND_URL || 'https://app.honeymoon.ae'}/my-bookings/custom/${quotation.id}" style="background:${BRAND.gold};color:${BRAND.white};padding:12px 28px;border-radius:50px;text-decoration:none;font-weight:700;">Review Quotation</a>
    </div>`;

  return send(to, 'You Have a New Quotation!', baseTemplate('Quotation Received', body));
}

module.exports = {
  send,
  sendWelcome,
  sendOtpEmail,
  sendBookingConfirmation,
  sendBookingApproved,
  sendBookingRejected,
  sendPaymentReceipt,
  sendVendorApproved,
  sendNewBookingRequest,
  sendPasswordResetSuccess,
  sendQuotationReceived,
};
