const { getChannel } = require('./connection');

async function startRPCServer(queue, handler) {
    try {
        const channel = getChannel();
        await channel.assertQueue(queue, { durable: false });
        await channel.prefetch(1);
        await channel.consume(queue, async (msg) => {
            try {
                const request = JSON.parse(msg.content.toString());
                const response = await handler(request);
                channel.sendToQueue(
                    msg.properties.replyTo,
                    Buffer.from(JSON.stringify(response)),
                    { correlationId: msg.properties.correlationId }
                );
                channel.ack(msg);
            } catch (error) {
                console.error('Error processing RPC request:', error.message);
                channel.nack(msg, false, false);
            }
        }, 
        { noAck: false });
    } catch (error) {
        console.error('Error setting up RPC server:', error.message);
    }
}

module.exports = { startRPCServer };