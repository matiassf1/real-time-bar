import { StatusEnum } from "../dtos/order.dto";
import { AppDataSource } from "../config/data-source";
import { Order } from "../models/order.model";

export class OrderService {
    private orderRepository = AppDataSource.getRepository(Order);

    async createOrder(dishName: string): Promise<Order> {
        try {
            const newOrder = this.orderRepository.create({
                dishName,
                status: 'Pending',
            });
            
            await this.orderRepository.save(newOrder);
            return newOrder;
        } catch (error: any) {
            console.log(error);
            throw new Error(error)

        }
    }

    async updateOrderStatus(orderId: number, status: StatusEnum): Promise<Order | null> {
        const order = await this.orderRepository.findOneBy({ id: orderId });
        if (order) {
            order.status = status;
            await this.orderRepository.save(order);
            return order;
        }
        return null;
    }

    async getAllOrders(page = 1, limit = 10): Promise<Order[]> {
        const skip = (page - 1) * limit;
        return await this.orderRepository.find({
            order: {
                createdAt: 'DESC',
            },
            skip: skip,
            take: limit,
        });
    }

    async getById(orderId: number): Promise<Order | null> {
        return await this.orderRepository.findOneBy({ id: orderId });
    }

    async delete(orderId: number): Promise<boolean> {
        const result = await this.orderRepository.delete(orderId);
        return result.affected !== 0;
    }
}
