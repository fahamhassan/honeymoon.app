'use strict';

/**
 * Stores rawBody on req for webhook signature verification.
 * Must be used BEFORE express.json() on webhook routes.
 *
 * Usage in server.js:
 *   app.post('/api/v1/payments/callback', rawBody, paymentController.handleWebhook);
 */
const rawBody = (req, res, buf, encoding) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
};

module.exports = rawBody;
