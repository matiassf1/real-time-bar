"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishOrderUpdate = exports.subscribeToOrderUpdates = exports.globalSubscribers = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const RABBITMQ_URL = 'amqp://localhost';
const EXCHANGE_NAME = 'order_updates';
const QUEUE_NAME = 'order_queue';
exports.globalSubscribers = new Set();
let rabbitMqConnection = null;
let rabbitMqChannel = null;
const initRabbitMq = async () => {
    if (!rabbitMqConnection || !rabbitMqChannel) {
        try {
            rabbitMqConnection = await amqplib_1.default.connect(RABBITMQ_URL);
            rabbitMqConnection.on('close', () => {
                console.error('Connection to RabbitMQ lost. Attempting to reconnect...');
                initRabbitMq();
            });
            if (!rabbitMqConnection)
                return;
            rabbitMqChannel = await rabbitMqConnection.createChannel();
            await rabbitMqChannel.assertExchange(EXCHANGE_NAME, 'direct', { durable: false });
            console.log('RabbitMQ connection established');
        }
        catch (error) {
            console.error('Error initializing RabbitMQ:', error);
            throw error;
        }
    }
};
const subscribeToOrderUpdates = async () => {
    try {
        await initRabbitMq();
        const q = await rabbitMqChannel.assertQueue(QUEUE_NAME, { exclusive: false });
        rabbitMqChannel.bindQueue(q.queue, EXCHANGE_NAME, '');
        rabbitMqChannel.consume(q.queue, (msg) => {
            if (msg) {
                const order = JSON.parse(msg.content.toString());
                console.log("Message received from RabbitMQ:", order);
                exports.globalSubscribers.forEach((client) => {
                    try {
                        client.send(JSON.stringify(order));
                    }
                    catch (error) {
                        console.error(`Error sending message to global subscriber:`, error);
                    }
                });
            }
            else {
                console.log("No message received from RabbitMQ");
            }
        }, { noAck: true });
        console.log('Subscribed to order updates');
    }
    catch (error) {
        console.error('Error subscribing to RabbitMQ:', error);
    }
};
exports.subscribeToOrderUpdates = subscribeToOrderUpdates;
const publishOrderUpdate = async (order) => {
    try {
        await initRabbitMq();
        rabbitMqChannel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(order)));
        console.log(`Message published for order ${order}: ${JSON.stringify(order)}`);
    }
    catch (error) {
        console.error('Error publishing message to RabbitMQ:', error);
    }
};
exports.publishOrderUpdate = publishOrderUpdate;
(0, exports.subscribeToOrderUpdates)().catch(console.error);
