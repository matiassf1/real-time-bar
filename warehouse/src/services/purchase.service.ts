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
            const response = await axios.get(`${process.env.PURCHASE_URL}/buy?ingredient=${ingredientName}`);
            return response.data.quantitySold;
        } catch (error: any) {
            console.error(`Error purchasing ${ingredientName}: ${error?.message}`);
            return 0;
        }
    }
}
