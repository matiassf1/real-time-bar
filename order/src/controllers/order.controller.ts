import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';
import { CreateOrderDto, StatusEnum, UpdateOrderStatusDto } from '../dtos/order.dto';
import { globalSubscribers, publishOrderUpdate } from '../messages/order.messages';
import { PaginationDto } from '../dtos/pagination.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

export class OrderController {
    private orderService: OrderService;

    constructor() {
        this.orderService = new OrderService();
    }

    public async createOrder(req: Request, res: Response): Promise<void> {
        try {
            const createOrderDto: CreateOrderDto = req.body.item;
            const order = await this.orderService.createOrder(createOrderDto.name);

            await publishOrderUpdate(order);

            res.status(201).json({ success: true, data: order });
        } catch (error) {
            console.error("Error creating order:", error);
            res.status(500).json({ success: false, message: 'Error creating order' });
        }
    }

    public async getAllOrders(req: Request, res: Response): Promise<void> {
        try {
            const queryParams = plainToClass(PaginationDto, req.query);

            const errors = await validate(queryParams);
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
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching orders' });
        }
    }

    public async getOrder(req: Request, res: Response): Promise<void> {
        try {
            const orderId = Number(req.params.id);
            const order = await this.orderService.getById(orderId);

            if (!order) {
                res.status(404).json({ success: false, message: 'Order not found' });
                return;
            }

            res.status(200).json({ success: true, data: order });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching order' });
        }
    }

    // Handle order status update
    public async updateOrderStatus(req: Request, res: Response): Promise<void> {
        try {
            const orderId = Number(req.params.id);
            const updateOrderStatusDto: UpdateOrderStatusDto = req.body;

            const updatedOrder = await this.orderService.updateOrderStatus(orderId, updateOrderStatusDto.status as StatusEnum);

            if (!updatedOrder) {
                res.status(404).json({ success: false, message: 'Order not found' });
                return;
            }

            await publishOrderUpdate(updatedOrder);


            res.json({ success: true, data: updatedOrder });
        } catch (error) {
            console.error('Error updating order status:', error);
            res.status(500).json({ success: false, message: 'Error updating order status' });
        }
    }

    // Handle order deletion
    public async deleteOrder(req: Request, res: Response): Promise<void> {
        try {
            const orderId = Number(req.params.id);
            const result = await this.orderService.delete(orderId);

            if (!result) {
                res.status(404).json({ success: false, message: 'Order not found' });
                return;
            }

            res.json({ success: true, message: 'Order deleted' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error deleting order' });
        }
    }
}
