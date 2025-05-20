import express from 'express';
import 'reflect-metadata';
import cors from 'cors';

import recipeRoutes from './routes/recipe.routes';
import { requestLogger } from './middleware/logger';
import { AppDataSource } from './config/data-source';

const app = express();
app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use('/recipes', recipeRoutes);

const PORT = process.env.KITCHEN_PORT || 3001;

async function startServer() {
    try {
        await AppDataSource.initialize();
        console.log("Data Source has been initialized!");
        
        app.listen(PORT, () => {
            console.log(`Kitchen service running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Error during Data Source initialization", error);
        process.exit(1);
    }
}

startServer();
