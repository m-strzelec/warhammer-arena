const { getChannel } = require('./connection');
const { v4: uuidv4 } = require('uuid');

async function sendRPCMessage(queue, message, timeout = 10000) {
    try {
        const channel = getChannel();
        const correlationId = uuidv4();
        const queueResult = await channel.assertQueue('', { exclusive: true });
        const replyQueue = queueResult.queue;
        return new Promise(async (resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error('RPC request timeout'));
            }, timeout);

            await channel.consume(replyQueue, (msg) => {
                if (msg.properties.correlationId === correlationId) {
                    clearTimeout(timer);
                    const response = JSON.parse(msg.content.toString());
                    resolve(response);
                }
            }, { noAck: true });

            await channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
                correlationId,
                replyTo: replyQueue
            });
        });
    } catch (error) {
        console.error('Error sending RPC message:', error);
        reject(error);
    }
}

module.exports = { sendRPCMessage };