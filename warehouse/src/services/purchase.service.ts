import axios from 'axios';
import { AppDataSource } from '../config/data-source';
import { Purchase } from '../models/purchase.model';

export class PurchaseService {
    private purchaseRepository = AppDataSource.getRepository(Purchase);

    public async getPurchases(page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;

            const purchases = await this.purchaseRepository.find({
                order: {
                    purchaseDate: 'DESC',
                },
                skip: skip,
                take: limit,
            });

            return purchases;
        } catch (error: any) {
            console.error(`Error getting purchases list: ${error?.message}`);
            return []; 
        }
    }

    public async purchaseIngredients(ingredientName: string): Promise<number> {
        try {
            await new Promise(resolve => setTimeout(resolve, 300));

            if (Math.random() < 0.3) {
                console.log(`Market is out of stock for ${ingredientName}`);
                return 0;
            }

            const quantity = Math.floor(Math.random() * 50) + 1;
            console.log(`Market simulation for ${ingredientName}: ${quantity} units available`);

            return quantity;
        } catch (error: any) {
            console.error(`Error purchasing ${ingredientName}: ${error?.message}`);
            return 0;
        }
    }
}
