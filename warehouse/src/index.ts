import express from 'express';
import https from 'https';
import cors from 'cors';
import { WebSocketServer } from 'ws';

import purchaseRouter from './routes/purchase.routes';
import stockRouter from './routes/stock.routes';
import { AppDataSource } from './config/data-source';
import { requestLogger } from './middleware/logger';
import { globalSubscribers } from './messages/stock.messages';
import { readFileSync } from 'fs';
import { join } from 'path';


const app = express();

const privateKeyPath = join(__dirname, '../private-key.pem');
const privateCertificatePath = join(__dirname, '../certificate.pem');
const sslOptions = {
    key: readFileSync(privateKeyPath),
    cert: readFileSync(privateCertificatePath),
};

const server = https.createServer(sslOptions, app);

const corsOptions = {
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(express.json());
app.use(requestLogger);
app.use(cors(corsOptions));

app.use('/stock', stockRouter);
app.use('/purchase', purchaseRouter);

const PORT = process.env.PORT || 3002;

server.listen(PORT);

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
    })
    .catch((error) => {
        console.error("Error during Data Source initialization", error);
    });

export const wss = new WebSocketServer({ server });

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