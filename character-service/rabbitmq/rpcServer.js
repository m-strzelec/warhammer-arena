const { getChannel } = require('./connection');

async function startRPCServer(queue, handler) {
    try {
        const channel = getChannel();
        await channel.assertQueue(queue, { durable: false });
        channel.consume(queue, async (msg) => {
            const request = JSON.parse(msg.content.toString());
            const response = await handler(request);
            channel.sendToQueue(
                msg.properties.replyTo,
                Buffer.from(JSON.stringify(response)),
                { correlationId: msg.properties.correlationId }
            );
            channel.ack(msg);
        });
    } catch (error) {
        console.error('RPC server error:', error);
    }
}

module.exports = { startRPCServer };