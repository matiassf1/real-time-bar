import express from 'express';
import { PurchaseController } from '../controllers/purchase.controller';

const router = express.Router();
const purchaseController = new PurchaseController();

router.post('/', purchaseController.getPurchases);

export default router;
