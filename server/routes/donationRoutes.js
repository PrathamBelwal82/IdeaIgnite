const express = require('express');
const amqp = require('amqplib');

const router = express.Router();
const VALIDATION_QUEUE = 'donationValidationQueue';
const PROCESSING_QUEUE = 'donationProcessingQueue';
const NOTIFICATION_QUEUE = 'donationNotificationQueue';

let channel;

// Connect to RabbitMQ
async function connectToRabbitMQ() {
    try {
        const connection = await amqp.connect('amqp://localhost');
        channel = await connection.createChannel();
        await channel.assertQueue(VALIDATION_QUEUE, { durable: true });
        await channel.assertQueue(PROCESSING_QUEUE, { durable: true });
        await channel.assertQueue(NOTIFICATION_QUEUE, { durable: true });
        console.log('Connected to RabbitMQ');
    } catch (err) {
        console.error('RabbitMQ Connection Error:', err);
    }
}
connectToRabbitMQ();

// Handle donation requests
router.post('/', async (req, res) => {
    const { amount, eventId } = req.body;

    if (!amount || !eventId) {
        return res.status(400).json({ error: 'Amount and Event ID are required' });
    }

    try {
        // Step 1: Enqueue for validation
        channel.sendToQueue(
            VALIDATION_QUEUE,
            Buffer.from(JSON.stringify({ amount, eventId })),
            { persistent: true }
        );

        res.status(200).json({ message: 'Donation request submitted and is being validated' });
    } catch (err) {
        console.error('Error pushing to queue:', err);
        res.status(500).json({ error: 'Failed to process donation' });
    }
});

module.exports = router;
