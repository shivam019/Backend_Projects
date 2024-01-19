const amqp = require("amqplib")


const publishToQueue = async(message) => {

    const connection = await amqp.connect('amqp://localhost:5672');

    const channel = await connection.createChannel();

    const queue = 'otpQueue';

    await channel.assertQueue(queue, {durable: true});

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });

    await channel.close();
   
    await connection.close();

}

module.exports = {
    publishToQueue, }
