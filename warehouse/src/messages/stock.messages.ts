import amqp, { Connection, Channel } from 'amqplib';
import { Stock } from 'src/models/stock.model';
import WebSocket from 'ws';

const RABBITMQ_URL = process.env.RABBITMQ_URL!;
console.log("###RABITMQ_URL", RABBITMQ_URL);

const EXCHANGE_NAME = 'stock_updates';
const QUEUE_NAME = 'stock_queue';

export let initializer: WebSocket;
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

export const subscribeToStockUpdates = async (): Promise<void> => {
    try {
        await initRabbitMq();

        const q = await rabbitMqChannel!.assertQueue(QUEUE_NAME, { exclusive: false });
        rabbitMqChannel!.bindQueue(q.queue, EXCHANGE_NAME, '');

        rabbitMqChannel!.consume(q.queue, (msg) => {
            if (msg) {
                const ingredient = JSON.parse(msg.content.toString());
                console.log("Message received from RabbitMQ:", ingredient);

                globalSubscribers.forEach((client: WebSocket) => {
                    try {
                        console.log("CLIENT", client);
                        client.send(JSON.stringify(ingredient));
                    } catch (error) {
                        console.error(`Error sending message to global subscriber:`, error);
                    }
                });
            } else {
                console.log("No message received from RabbitMQ");
            }
        }, { noAck: true });
    } catch (error) {
        console.error('Error subscribing to RabbitMQ:', error);
    }
};

export const publishStockUpdate = async (ingredient: Stock): Promise<void> => {
    try {
        await initRabbitMq();

        rabbitMqChannel!.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(ingredient)));
        console.log(`Message published for ingredient ${ingredient}: ${JSON.stringify(ingredient)}`);
    } catch (error) {
        console.error('Error publishing message to RabbitMQ:', error);
    }
};

subscribeToStockUpdates().catch(console.error);

