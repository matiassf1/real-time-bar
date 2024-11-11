"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("../controllers/order.controller");
const router = express_1.default.Router();
const orderController = new order_controller_1.OrderController();
router.post('/', orderController.createOrder.bind(orderController));
router.get('/', orderController.getAllOrders.bind(orderController));
router.get('/:id', orderController.getOrder.bind(orderController));
router.patch('/:id/status', orderController.updateOrderStatus.bind(orderController));
router.delete('/:id', orderController.deleteOrder.bind(orderController));
exports.default = router;
