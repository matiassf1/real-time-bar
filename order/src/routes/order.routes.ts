import express from 'express';
import { OrderController } from '../controllers/order.controller';

const router = express.Router();
const orderController = new OrderController();

router.post('/', orderController.createOrder.bind(orderController));
router.get('/', orderController.getAllOrders.bind(orderController));
router.get('/:id', orderController.getOrder.bind(orderController));
router.patch('/:id/status', orderController.updateOrderStatus.bind(orderController));
router.delete('/:id', orderController.deleteOrder.bind(orderController));

export default router;
