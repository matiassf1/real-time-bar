import express from 'express';
import http from 'http';
import cors from 'cors';
import { WebSocketServer } from 'ws';

import { AppDataSource } from './config/data-source';
import OrderRouter from './routes/order.routes';
import { requestLogger } from './middleware/logger';
import { globalSubscribers } from './messages/order.messages';

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3003;

app.use(express.json());
app.use(requestLogger);
app.use(cors());

app.use('/order', OrderRouter);

server.listen(PORT);

AppDataSource.initialize()
    .then(() => {
        console.log(`Order service running on http://localhost:${PORT}`);
    })
    .catch((error) => {
        console.error('Error during Data Source initialization:', error);
    });

export const wss = new WebSocketServer({ server });

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

