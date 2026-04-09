'use strict';
const prisma = require('../config/prisma');
const emailService = require('./email.service');

/* ─────────────────────────────────────────────────────────────────────────────
   PROCESS SINGLE PAYOUT
   In production: integrate with your banking API (e.g. Mashreq API, ADCB API,
   or a payment aggregator like Stripe Payouts / Tabby / HyperPay)
─────────────────────────────────────────────────────────────────────────────*/
async function processPayout(payoutId, adminId) {
  const payout = await prisma.payout.findUnique({
    where: { id: payoutId },
    include: {
      vendor: {
        select: { id:true, firstName:true, lastName:true, email:true, companyName:true }
      }
    }
  });

  if (!payout) throw new Error('Payout not found');
  if (payout.status === 'Paid') throw new Error('Payout already processed');
  if (payout.status !== 'Approved') throw new Error('Payout must be approved before processing');

  // Get vendor bank details
  const bankDetail = await prisma.bankDetail.findFirst({
    where: { vendorId: payout.vendorId, isPrimary: true }
  });

  if (!bankDetail) throw new Error('Vendor has no primary bank account configured');

  // ── Bank transfer API call (placeholder) ───────────────────────────────────
  // In production, call your bank's API here:
  // e.g. Mashreq API: POST /v1/payments/wire-transfer
  // e.g. Stripe:      await stripe.transfers.create(...)
  const transferRef = await executeBankTransfer({
    amount:     payout.netAmount,
    currency:   'AED',
    bankName:   bankDetail.bankName,
    iban:       bankDetail.iban,
    swift:      bankDetail.swift,
    accountName:bankDetail.accountName,
    reference:  `HM-PAYOUT-${payoutId}`,
    description:`Honeymoon payout for booking ${payout.bookingId}`,
  });

  // Update payout record
  const updated = await prisma.payout.update({
    where: { id: payoutId },
    data: {
      status:  'Paid',
      paidAt:  new Date(),
      notes:   `Transfer ref: ${transferRef}`,
    }
  });

  // Notify vendor via email
  await emailService.send(
    payout.vendor.email,
    `Payout Processed — AED ${payout.netAmount.toFixed(2)}`,
    `<p>Hi ${payout.vendor.companyName},</p><p>Your payout of <strong>AED ${payout.netAmount.toFixed(2)}</strong> has been processed and should arrive in 1-3 business days.</p><p>Transfer Reference: ${transferRef}</p>`
  ).catch(() => {});

  // Create notification
  await prisma.notification.create({
    data: {
      vendorId: payout.vendorId,
      type:     'payout_processed',
      title:    'Payout Processed',
      message:  `Your payout of AED ${payout.netAmount.toFixed(2)} has been processed.`,
      data:     { payoutId, transferRef },
    }
  });

  return updated;
}

/* ─────────────────────────────────────────────────────────────────────────────
   BULK PROCESS PAYOUTS (admin action)
─────────────────────────────────────────────────────────────────────────────*/
async function bulkProcessPayouts(payoutIds, adminId) {
  const results = { success: [], failed: [] };

  for (const id of payoutIds) {
    try {
      const payout = await processPayout(id, adminId);
      results.success.push({ id, netAmount: payout.netAmount });
    } catch (err) {
      results.failed.push({ id, reason: err.message });
    }
  }

  return {
    total:   payoutIds.length,
    success: results.success.length,
    failed:  results.failed.length,
    details: results,
  };
}

/* ─────────────────────────────────────────────────────────────────────────────
   CALCULATE VENDOR EARNINGS (for dashboard analytics)
─────────────────────────────────────────────────────────────────────────────*/
async function getVendorEarnings(vendorId, period = 'monthly') {
  const now   = new Date();
  const start = period === 'monthly'
    ? new Date(now.getFullYear(), now.getMonth(), 1)
    : new Date(now.getFullYear(), 0, 1); // yearly

  const payouts = await prisma.payout.findMany({
    where: { vendorId, requestedAt: { gte: start } },
    orderBy: { requestedAt: 'desc' },
  });

  const totalGross  = payouts.reduce((s, p) => s + p.amount, 0);
  const totalCommission = payouts.reduce((s, p) => s + p.commission, 0);
  const totalNet    = payouts.reduce((s, p) => s + p.netAmount, 0);
  const totalPaid   = payouts.filter(p => p.status === 'Paid').reduce((s, p) => s + p.netAmount, 0);
  const totalPending= payouts.filter(p => p.status !== 'Paid').reduce((s, p) => s + p.netAmount, 0);

  return { period, totalGross, totalCommission, totalNet, totalPaid, totalPending, payoutCount: payouts.length };
}

/* ─────────────────────────────────────────────────────────────────────────────
   BANK TRANSFER EXECUTOR (placeholder for real banking API)
─────────────────────────────────────────────────────────────────────────────*/
async function executeBankTransfer(params) {
  // DEV MODE — simulate transfer
  if (process.env.NODE_ENV !== 'production' || !process.env.BANK_API_KEY) {
    console.log(`\n[Payout] DEV MODE — mock transfer AED ${params.amount} to IBAN ${params.iban}\n`);
    return `TRF-DEV-${Date.now()}`;
  }

  // Production: implement your bank API here
  // Example with Mashreq Bank API:
  // const response = await fetch('https://api.mashreq.com/v1/payments/wire', {
  //   method: 'POST',
  //   headers: { 'Authorization': `Bearer ${process.env.BANK_API_KEY}`, 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ amount: params.amount, currency: params.currency, beneficiary: { iban: params.iban, ... } })
  // });
  // const result = await response.json();
  // return result.referenceId;

  throw new Error('Bank API not configured — set BANK_API_KEY in .env');
}

/* ─────────────────────────────────────────────────────────────────────────────
   AUTO-APPROVE ELIGIBLE PAYOUTS (cron job helper)
   Approves payouts for completed+paid bookings older than 7 days
─────────────────────────────────────────────────────────────────────────────*/
async function autoApprovePendingPayouts() {
  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

  const eligible = await prisma.payout.findMany({
    where: {
      status:      'Pending',
      requestedAt: { lte: cutoff },
      booking: { status: 'Completed', paymentStatus: 'Paid' }
    },
    include: { booking: true }
  });

  const updated = await prisma.payout.updateMany({
    where: { id: { in: eligible.map(p => p.id) } },
    data:  { status: 'Approved', approvedAt: new Date(), notes: 'Auto-approved after 7-day holding period' }
  });

  console.log(`[Payout] Auto-approved ${updated.count} payouts`);
  return updated.count;
}

module.exports = {
  processPayout,
  bulkProcessPayouts,
  getVendorEarnings,
  autoApprovePendingPayouts,
};
