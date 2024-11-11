import { AppDataSource } from '../config/data-source';
import { Purchase } from '../models/purchase.model';
import { Stock } from '../models/stock.model';
import { PurchaseService } from './purchase.service';
import { publishStockUpdate } from '../messages/stock.messages';

export class StockService {
    private purchaseService = new PurchaseService();

    private ingredientRepository = AppDataSource.getRepository(Stock);
    private purchaseRepository = AppDataSource.getRepository(Purchase);

    public async getStock() {
        return this.ingredientRepository.find();
    }

    public async getIngredientsForRecipe(recipeIngredients: {
        quantity: number,
        ingredient: { name: string },
    }[]): Promise<void> {
        for (const { ingredient: receivedIngredient, quantity } of recipeIngredients) {
            let ingredient = await this.findOrCreateIngredient(receivedIngredient.name);

            while (!ingredient.hasStock(quantity)) {
                const restockedIngredient = await this.replenishStock(ingredient);
                if (restockedIngredient !== null) {
                    await publishStockUpdate(restockedIngredient);
                }
            }

            const consumedIngredient = await this.consumeIngredientStock(ingredient, quantity);
            await publishStockUpdate(consumedIngredient);
        }
    }

    private async findOrCreateIngredient(name: string): Promise<Stock> {
        let ingredient = await this.ingredientRepository.findOneBy({ name });
        if (!ingredient) {
            ingredient = new Stock();
            ingredient.name = name;
            ingredient.quantity = 5;
            await this.ingredientRepository.save(ingredient);
        }
        return ingredient;
    }

    private async replenishStock(ingredient: Stock): Promise<Stock | null> {
        const purchasedQuantity = await this.purchaseService.purchaseIngredients(ingredient.name);

        if (purchasedQuantity === 0) {
            console.log(`Failed to purchase ${ingredient.name}. Not enough stock in the market.`);
            return null;
        }

        console.log(`Purchased ${purchasedQuantity} units of ${ingredient.name} from the market.`);
        ingredient.restock(purchasedQuantity);
        const restockedIngredient = await this.ingredientRepository.save(ingredient);

        const purchase = new Purchase();
        purchase.ingredientName = ingredient.name;
        purchase.quantityPurchased = purchasedQuantity;
        await this.purchaseRepository.save(purchase);

        return restockedIngredient;
    }


    private async consumeIngredientStock(ingredient: Stock, quantity: number): Promise<Stock> {
        if (ingredient.hasStock(quantity)) {
            ingredient.quantity -= quantity;
            const consumedIngredient = await this.ingredientRepository.save(ingredient);
            console.log(`Consumed ${quantity} units of ${ingredient.name}. Remaining stock: ${ingredient.quantity}`);
            return consumedIngredient
        } else {
            console.error(`Insufficient stock for ${ingredient.name}. Required: ${quantity}, Available: ${ingredient.quantity}`);
            throw new Error(`Insufficient stock for ${ingredient.name}`);
        }
    }
}
