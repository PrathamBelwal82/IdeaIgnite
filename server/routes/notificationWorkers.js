const amqp = require('amqplib');

const NOTIFICATION_QUEUE = 'donationNotificationQueue';

async function startNotificationWorker() {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        await channel.assertQueue(NOTIFICATION_QUEUE, { durable: true });

        console.log('Waiting for notification messages...');

        channel.consume(
            NOTIFICATION_QUEUE,
            (msg) => {
                const donation = JSON.parse(msg.content.toString());
                console.log('Sending notification for donation:', donation);

                // Simulate sending a notification (replace with actual logic)
                console.log('Sending email/SMS notification...');
                
                // After notification, acknowledge the message
                channel.ack(msg);
            },
            { noAck: false }
        );
    } catch (err) {
        console.error('Notification Worker Error:', err);
    }
}

startNotificationWorker();
