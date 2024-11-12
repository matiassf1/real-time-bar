import express from 'express';
import https from 'https';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { AppDataSource } from './config/data-source';
import OrderRouter from './routes/order.routes';
import { requestLogger } from './middleware/logger';
import { globalSubscribers } from './messages/order.messages';

const fetchSslFiles = async () => {
    const privateKeyResponse = await fetch('https://wprvfcfwmkpjvvatrsbm.supabase.co/storage/v1/object/public/ssl/order/service-private-key.pem');
    const certificateResponse = await fetch('https://wprvfcfwmkpjvvatrsbm.supabase.co/storage/v1/object/public/ssl/order/service-certificate.pem');

    if (!privateKeyResponse.ok || !certificateResponse.ok) {
        throw new Error('Failed to fetch SSL certificates');
    }

    const privateKey = await privateKeyResponse.text();
    const certificate = await certificateResponse.text();

    return { key: privateKey, cert: certificate };
};

const app = express();
const PORT = Number(process.env.PORT) || 3003;

const setupServer = async () => {
    try {
        const sslOptions = await fetchSslFiles();

        const server = https.createServer(sslOptions, app);

        const corsOptions = {
            origin: "*",
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        };

        app.use(express.json());
        app.use(requestLogger);
        app.use(cors(corsOptions));

        app.use('/order', OrderRouter);

        server.listen(PORT, () => {
            console.log(`Order service running on https://localhost:${PORT}`);
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
