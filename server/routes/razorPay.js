// Import Razorpay
const Razorpay = require('razorpay');
const express = require('express');
const router = express.Router();

// Initialize Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Endpoint to create an order
router.post('/create-order', async (req, res) => {
  const { amount, currency, receipt } = req.body;

  try {
    const options = {
      amount: amount * 100, // Amount in smallest currency unit (e.g., paise)
      currency: currency,
      receipt: receipt,
      payment_capture: 1 // Auto-capture payments
    };

    const order = await razorpayInstance.orders.create(options);
    res.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to create Razorpay order' });
  }
});

module.exports = router;
