import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { AppDataSource } from './config/data-source';
import OrderRouter from './routes/order.routes';
import { requestLogger } from './middleware/logger';
import { globalSubscribers } from './messages/order.messages';

const app = express();
const PORT = Number(process.env.PORT) || 3003;

const setupServer = async () => {
    try {
        const corsOptions = {
            origin: "*",
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        };

        app.use(express.json());
        app.use(requestLogger);
        app.use(cors(corsOptions));

        app.use('/order', OrderRouter);

        const server = app.listen(PORT, () => {
            console.log(`Order service running on http://localhost:${PORT}`);
        });

        await AppDataSource.initialize();
        console.log("Data Source has been initialized!");

        const wss = new WebSocketServer({ server });

        wss.on('connection', (ws) => {
            console.log('Client connected');
            globalSubscribers.add(ws);
            ws.on('message', (message: string) => {
                try {
                    const { orderId } = JSON.parse(message);
                    console.log(`Message received from client: ${JSON.stringify({ orderId })}`);
                    globalSubscribers.add(ws);
                    console.log('Client subscribed to all orders');
                } catch (error) {
                    console.error('Error handling WebSocket message:', error);
                }
            });

            ws.on('close', () => {
                globalSubscribers.delete(ws);
                console.log('Client disconnected');
            });
        });
    } catch (error) {
        console.error('Error setting up the server:', error);
    }
};

setupServer();
