import express, { Request, Response } from 'express';
import { KitchenService } from '../services/kitchen.service';
import { OrderService } from '../services/order.service';
import { WarehouseService } from '../services/warehouse.service';

const router = express.Router();

const kitchenService = new KitchenService();
const orderService = new OrderService();
const warehouseService = new WarehouseService();

router.post('/', async (_req: Request, res: Response) => {
    try {
        const { ingredients, ...restDishRecipe } = await kitchenService.getDishRecipe();

        let orderCreated;
        try {
            orderCreated = await orderService.create(restDishRecipe);
        } catch (error) {
            console.error("Error creating order:", error);
            res.status(502).json({ success: false, message: "Failed to create order at Order Service" });
            return;
        }

        try {
            await warehouseService.getIngredients(ingredients);
        } catch (error) {
            console.error("Error fetching ingredients:", error);
            res.status(502).json({ success: false, message: "Failed to retrieve ingredients at Warehouse Service" });
            return;
        }

        let dishOrder;
        try {
            dishOrder = await kitchenService.prepareDishOrder({ recipeId: restDishRecipe.id });
            if (!dishOrder.success) {
                res.status(500).json({ success: false, message: "Failed to prepare dish in Kitchen Service" });
                return;
            }
        } catch (error) {
            console.error("Error preparing dish:", error);
            res.status(502).json({ success: false, message: "Failed to prepare dish at Kitchen Service" });
            return;
        }

        try {
            await orderService.updateStatus(orderCreated.data.id, "In Kitchen");
        } catch (error) {
            console.error("Error updating order status to 'In Kitchen':", error);
            res.status(502).json({ success: false, message: "Failed to update order status at Order Service" });
            return;
        }

        try {
            setTimeout(async () => {
                await orderService.updateStatus(orderCreated.data.id, "Completed");
            }, 2000);
        } catch (error) {
            console.error("Error updating order status to 'Completed':", error);
            res.status(502).json({ success: false, message: "Failed to complete order at Order Service" });
            return;
        }
        res.json({ success: true });
    } catch (error) {
        console.error("Unexpected error processing order:", error);
        res.status(500).json({ success: false, message: "Unexpected error processing order" });
    }
});

export default router;
