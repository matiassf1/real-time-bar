import amqp, { Connection, Channel } from 'amqplib';
import { Order } from 'models/order.model';
import WebSocket from 'ws';

const RABBITMQ_URL = process.env.RABBITMQ_URL!;
const EXCHANGE_NAME = 'order_updates';
const QUEUE_NAME = 'order_queue';

export const globalSubscribers = new Set<WebSocket>();

let rabbitMqConnection: Connection | null = null;
let rabbitMqChannel: Channel | null = null;

const initRabbitMq = async (): Promise<void> => {
    if (!rabbitMqConnection || !rabbitMqChannel) {
        try {
            rabbitMqConnection = await amqp.connect(RABBITMQ_URL);
            rabbitMqConnection.on('close', () => {
                console.error('Connection to RabbitMQ lost. Attempting to reconnect...');
                initRabbitMq();
            });
            if (!rabbitMqConnection) return;
            rabbitMqChannel = await rabbitMqConnection.createChannel();
            await rabbitMqChannel.assertExchange(EXCHANGE_NAME, 'direct', { durable: false });
            console.log('RabbitMQ connection established');
        } catch (error) {
            console.error('Error initializing RabbitMQ:', error);
            throw error;
        }
    }
};

export const subscribeToOrderUpdates = async (): Promise<void> => {
    try {
        await initRabbitMq();

        const q = await rabbitMqChannel!.assertQueue(QUEUE_NAME, { exclusive: false });
        rabbitMqChannel!.bindQueue(q.queue, EXCHANGE_NAME, '');

        rabbitMqChannel!.consume(q.queue, (msg) => {
            if (msg) {
                const order = JSON.parse(msg.content.toString());
                console.log("Message received from RabbitMQ:", order);                
                globalSubscribers.forEach((client: WebSocket) => {
                    try {
                        client.send(JSON.stringify(order));
                    } catch (error) {
                        console.error(`Error sending message to global subscriber:`, error);
                    }
                });
            } else {
                console.log("No message received from RabbitMQ");
            }
        }, { noAck: true });

        console.log('Subscribed to order updates');
    } catch (error) {
        console.error('Error subscribing to RabbitMQ:', error);
    }
};

export const publishOrderUpdate = async (order: Order): Promise<void> => {
    try {
        await initRabbitMq();

        rabbitMqChannel!.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(order)));
        console.log(`Message published for order ${order}: ${JSON.stringify(order)}`);
    } catch (error) {
        console.error('Error publishing message to RabbitMQ:', error);
    }
};

subscribeToOrderUpdates().catch(console.error);

