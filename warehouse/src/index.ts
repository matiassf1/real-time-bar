import express from 'express';
import https from 'https';
import cors from 'cors';
import { WebSocketServer } from 'ws';

import purchaseRouter from './routes/purchase.routes';
import stockRouter from './routes/stock.routes';
import { AppDataSource } from './config/data-source';
import { requestLogger } from './middleware/logger';
import { globalSubscribers } from './messages/stock.messages';

const app = express();

const sslFiles = async () => {
    const privateKeyResponse = await fetch('https://wprvfcfwmkpjvvatrsbm.supabase.co/storage/v1/object/public/ssl/warehouse/private-key.pem');
    const certificateResponse = await fetch('https://wprvfcfwmkpjvvatrsbm.supabase.co/storage/v1/object/public/ssl/warehouse/certificate.pem');

    // Ensure both responses are successful
    if (!privateKeyResponse.ok || !certificateResponse.ok) {
        throw new Error('Failed to fetch SSL certificates');
    }

    // Get the text content of the SSL files
    const privateKey = await privateKeyResponse.text();
    const certificate = await certificateResponse.text();

    return { key: privateKey, cert: certificate };
};

const setupServer = async () => {
    try {
        // Get SSL certificates
        const sslOptions = await sslFiles();

        // Create HTTPS server with the SSL certificates
        const server = https.createServer(sslOptions, app);

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

        server.listen(PORT, () => {
            console.log(`Server running on https://localhost:${PORT}`);
        });

        // Initialize Data Source (DB)
        await AppDataSource.initialize();
        console.log("Data Source has been initialized!");

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
        console.error('Error setting up the server:', error);
    }
};

// Start the server
setupServer();
