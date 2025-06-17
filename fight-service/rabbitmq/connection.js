const amqp = require('amqplib');

let connection;
let channel;

async function connectRabbitMQ() {
    connection = await amqp.connect(process.env.RABBITMQ_URI);
    channel = await connection.createChannel();
}

function getChannel() {
    if (!channel) {
        throw new Error('RabbitMQ channel not initialized!');
    }
    return channel;
}

module.exports = { connectRabbitMQ, getChannel };