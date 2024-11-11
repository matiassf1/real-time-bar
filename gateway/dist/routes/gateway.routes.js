"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const kitchen_service_1 = require("../services/kitchen.service");
const order_service_1 = require("../services/order.service");
const warehouse_service_1 = require("../services/warehouse.service");
const router = express_1.default.Router();
const kitchenService = new kitchen_service_1.KitchenService();
const orderService = new order_service_1.OrderService();
const warehouseService = new warehouse_service_1.WarehouseService();
router.post('/', async (_req, res) => {
    try {
        const { ingredients, ...restDishRecipe } = await kitchenService.getDishRecipe();
        let orderCreated;
        try {
            orderCreated = await orderService.create(restDishRecipe);
            res.json({ success: true, order: orderCreated });
        }
        catch (error) {
            console.error("Error creating order:", error);
            res.status(502).json({ success: false, message: "Failed to create order at Order Service" });
            return;
        }
        try {
            await warehouseService.getIngredients(ingredients);
        }
        catch (error) {
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
        }
        catch (error) {
            console.error("Error preparing dish:", error);
            res.status(502).json({ success: false, message: "Failed to prepare dish at Kitchen Service" });
            return;
        }
        try {
            await orderService.updateStatus(orderCreated.data.id, "In Kitchen");
        }
        catch (error) {
            console.error("Error updating order status to 'In Kitchen':", error);
            res.status(502).json({ success: false, message: "Failed to update order status at Order Service" });
            return;
        }
        try {
            setTimeout(async () => {
                await orderService.updateStatus(orderCreated.data.id, "Completed");
            }, 2000);
        }
        catch (error) {
            console.error("Error updating order status to 'Completed':", error);
            res.status(502).json({ success: false, message: "Failed to complete order at Order Service" });
            return;
        }
    }
    catch (error) {
        console.error("Unexpected error processing order:", error);
        res.status(500).json({ success: false, message: "Unexpected error processing order" });
    }
});
exports.default = router;
