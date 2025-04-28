const { getChannel } = require('./connection');
const { v4: uuidv4 } = require('uuid');

async function sendRpcMessage(queue, message, timeout = 5000) {
    try {
        const channel = getChannel();
        const correlationId = uuidv4();
        const { queue: replyQueue } = await channel.assertQueue('', { exclusive: true });
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error('RPC request timeout'));
            }, timeout);

            channel.consume(replyQueue, (msg) => {
                if (msg.properties.correlationId === correlationId) {
                    clearTimeout(timer);
                    const response = JSON.parse(msg.content.toString());
                    resolve(response);
                }
            }, { noAck: true });

            channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
                correlationId,
                replyTo: replyQueue
            });
        });
    } catch (error) {
        console.error('Error sending RPC message:', error);
    }
}

module.exports = { sendRpcMessage };