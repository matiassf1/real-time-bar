import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';

import purchaseRouter from './routes/purchase.routes';
import stockRouter from './routes/stock.routes';
import { AppDataSource } from './config/data-source';
import { requestLogger } from './middleware/logger';
import { globalSubscribers } from './messages/stock.messages';

const app = express();

const setupServer = async () => {
    try {
        // CORS configuration
        const corsOptions = {
            origin: "*",
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        };

        // Apply middlewares
        app.use(express.json());
        app.use(requestLogger);
        app.use(cors(corsOptions));

        app.use('/stock', stockRouter);
        app.use('/purchase', purchaseRouter);

        const PORT = process.env.PORT || 3002;

        // Initialize Data Source (DB)
        await AppDataSource.initialize();
        console.log("Data Source has been initialized!");

        const server = app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });

        // WebSocket server setup
        const wss = new WebSocketServer({ server });

        wss.on('connection', (ws) => {
            console.log('Client connected');
            globalSubscribers.add(ws);
            ws.on('message', (_message: string) => {
                try {
                    globalSubscribers.add(ws);
                    console.log('Client subscribed to all stock changes');
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
        console.log("###ERROR", error);
        console.error('Error setting up the server:', error);
    }
};

// Start the server
setupServer();
