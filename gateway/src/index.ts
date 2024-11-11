import express from 'express';
import cors from 'cors';
import gatewayRoutes from './routes/gateway.routes';
import dotenv from 'dotenv';
import { requestLogger } from './middleware/logger';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(requestLogger);

app.use('/api', gatewayRoutes);

const PORT = process.env.GATEWAY_PORT || 3000;
app.listen(PORT, () => {
    console.log("###ENVS", process.env)
    console.log(`Gateway running on port ${PORT}`);
});
