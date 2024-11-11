import express from 'express';
import { StockController } from '../controllers/stock.controller';

const router = express.Router();
const stockController = new StockController();

router.post('/check-ingredients', stockController.prepareIngredients);
router.get('/', stockController.getStock);

export default router;
