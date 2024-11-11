"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const data_source_1 = require("../config/data-source");
const order_model_1 = require("../models/order.model");
class OrderService {
    constructor() {
        this.orderRepository = data_source_1.AppDataSource.getRepository(order_model_1.Order);
    }
    async createOrder(dishName) {
        try {
            const newOrder = this.orderRepository.create({
                dishName,
                status: 'Pending',
            });
            await this.orderRepository.save(newOrder);
            return newOrder;
        }
        catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }
    async updateOrderStatus(orderId, status) {
        const order = await this.orderRepository.findOneBy({ id: orderId });
        if (order) {
            order.status = status;
            await this.orderRepository.save(order);
            return order;
        }
        return null;
    }
    async getAllOrders(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        return await this.orderRepository.find({
            order: {
                createdAt: 'DESC',
            },
            skip: skip,
            take: limit,
        });
    }
    async getById(orderId) {
        return await this.orderRepository.findOneBy({ id: orderId });
    }
    async delete(orderId) {
        const result = await this.orderRepository.delete(orderId);
        return result.affected !== 0;
    }
}
exports.OrderService = OrderService;
