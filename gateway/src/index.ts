import express from 'express';
import cors from 'cors';
import gatewayRoutes from './routes/gateway.routes';
import dotenv from 'dotenv';
import { requestLogger } from './middleware/logger';

dotenv.config();

const app = express();

const corsOptions = {
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(express.json());
app.use(requestLogger);
app.use(cors(corsOptions));

app.use('/api', gatewayRoutes);

const PORT = process.env.GATEWAY_PORT || 3000;
app.listen(PORT, () => {
    console.log("###ENVS", process.env)
    console.log(`Gateway running on port ${PORT}`);
});
