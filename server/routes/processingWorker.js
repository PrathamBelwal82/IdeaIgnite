const amqp = require('amqplib');

const PROCESSING_QUEUE = 'donationProcessingQueue';
const NOTIFICATION_QUEUE = 'donationNotificationQueue';

async function startProcessingWorker() {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        await channel.assertQueue(PROCESSING_QUEUE, { durable: true });

        console.log('Waiting for donation processing messages...');

        channel.consume(
            PROCESSING_QUEUE,
            (msg) => {
                const donation = JSON.parse(msg.content.toString());
                console.log('Processing donation:', donation);

                // Simulate saving donation to the database (Replace with actual DB logic)
                console.log('Saving donation to the database...');

                // Once processed, forward to the notification queue
                channel.sendToQueue(
                    NOTIFICATION_QUEUE,
                    Buffer.from(JSON.stringify(donation)),
                    { persistent: true }
                );

                channel.ack(msg); // Acknowledge message after processing
            },
            { noAck: false }
        );
    } catch (err) {
        console.error('Processing Worker Error:', err);
    }
}

startProcessingWorker();
