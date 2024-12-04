const amqp = require('amqplib');

const VALIDATION_QUEUE = 'donationValidationQueue';
const PROCESSING_QUEUE = 'donationProcessingQueue';

async function startValidationWorker() {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        await channel.assertQueue(VALIDATION_QUEUE, { durable: true });
        
        console.log('Waiting for validation messages...');

        channel.consume(
            VALIDATION_QUEUE,
            (msg) => {
                const donation = JSON.parse(msg.content.toString());
                console.log('Validating donation:', donation);

                // Simple validation: check if amount > 0
                if (donation.amount <= 0) {
                    console.error('Invalid donation amount:', donation);
                    channel.nack(msg); // Reject the message and move on
                } else {
                    // If valid, forward it to the processing queue
                    channel.sendToQueue(
                        PROCESSING_QUEUE,
                        Buffer.from(JSON.stringify(donation)),
                        { persistent: true }
                    );
                    channel.ack(msg); // Acknowledge that the message has been processed
                }
            },
            { noAck: false }
        );
    } catch (err) {
        console.error('Validation Worker Error:', err);
    }
}

startValidationWorker();
