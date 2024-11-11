"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const order_service_1 = require("../services/order.service");
const order_messages_1 = require("../messages/order.messages");
const pagination_dto_1 = require("../dtos/pagination.dto");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const index_1 = require("index");
class OrderController {
    constructor() {
        this.orderService = new order_service_1.OrderService();
    }
    async createOrder(req, res) {
        try {
            const createOrderDto = req.body.item;
            const order = await this.orderService.createOrder(createOrderDto.name);
            order_messages_1.globalSubscribers.add(index_1.initializer);
            await (0, order_messages_1.publishOrderUpdate)(order);
            res.status(201).json({ success: true, data: order });
        }
        catch (error) {
            console.error("Error creating order:", error);
            res.status(500).json({ success: false, message: 'Error creating order' });
        }
    }
    async getAllOrders(req, res) {
        try {
            const queryParams = (0, class_transformer_1.plainToClass)(pagination_dto_1.PaginationDto, req.query);
            const errors = await (0, class_validator_1.validate)(queryParams);
            if (errors.length > 0) {
                res.status(400).json({
                    message: 'Invalid query parameters',
                    errors,
                });
                return;
            }
            const { page, limit } = queryParams;
            const orders = await this.orderService.getAllOrders(page, limit);
            res.json({ success: true, data: orders });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching orders' });
        }
    }
    async getOrder(req, res) {
        try {
            const orderId = Number(req.params.id);
            const order = await this.orderService.getById(orderId);
            if (!order) {
                res.status(404).json({ success: false, message: 'Order not found' });
                return;
            }
            res.status(200).json({ success: true, data: order });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching order' });
        }
    }
    // Handle order status update
    async updateOrderStatus(req, res) {
        try {
            const orderId = Number(req.params.id);
            const updateOrderStatusDto = req.body;
            const updatedOrder = await this.orderService.updateOrderStatus(orderId, updateOrderStatusDto.status);
            if (!updatedOrder) {
                res.status(404).json({ success: false, message: 'Order not found' });
                return;
            }
            await (0, order_messages_1.publishOrderUpdate)(updatedOrder);
            res.json({ success: true, data: updatedOrder });
        }
        catch (error) {
            console.error('Error updating order status:', error);
            res.status(500).json({ success: false, message: 'Error updating order status' });
        }
    }
    // Handle order deletion
    async deleteOrder(req, res) {
        try {
            const orderId = Number(req.params.id);
            const result = await this.orderService.delete(orderId);
            if (!result) {
                res.status(404).json({ success: false, message: 'Order not found' });
                return;
            }
            res.json({ success: true, message: 'Order deleted' });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Error deleting order' });
        }
    }
}
exports.OrderController = OrderController;
