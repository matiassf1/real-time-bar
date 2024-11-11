import express from 'express';
import 'reflect-metadata';
import cors from 'cors';

import recipeRoutes from './routes/recipe.routes';
import { requestLogger } from './middleware/logger';
import { AppDataSource } from './config/data-source';

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
    })
    .catch((error) => {
        console.error("Error during Data Source initialization", error);
    });

const app = express();
app.use(express.json());
app.use(cors());
app.use(requestLogger);

app.use('/recipes', recipeRoutes);

const PORT = process.env.KITCHEN_PORT || 3001;
app.listen(PORT, () => {
    console.log(`Kitchen running on port ${PORT}`);
});