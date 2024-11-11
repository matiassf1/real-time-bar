import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { StockService } from '../services/stock.service';
import { PrepareRecipeDTO } from '../dtos/prepare-recipe.dto';
import { globalSubscribers } from '../messages/stock.messages';

export class StockController {
    private stockService: StockService;

    constructor() {
        this.stockService = new StockService();
        this.prepareIngredients = this.prepareIngredients.bind(this);
        this.getStock = this.getStock.bind(this);
    }

    public async prepareIngredients(req: Request, res: Response): Promise<void> {
        const prepareRecipeDto = Object.assign(new PrepareRecipeDTO(), req.body);

        const errors = await validate(prepareRecipeDto);
        if (errors.length > 0) {
            res.status(400).json({ errors: errors.map(e => e.toString()) });
            return
        }
        
        try {
            await this.stockService.getIngredientsForRecipe(prepareRecipeDto.recipeIngredients);
            res.status(200).json({ message: 'Ingredients ready for recipe preparation.' });
        } catch (error) {
            console.error('Error preparing recipe:', error);
            res.status(500).json({ error: 'Failed to prepare ingredients for recipe' });
        }
    }

    public async getStock(req: Request, res: Response): Promise<void> {
        try {
            const stock = await this.stockService.getStock();
            res.status(200).json({ stock });
        } catch (error) {
            console.error('Error getting stock of ingredients', error);
            res.status(500).json({ error: 'Failed to get ingredients in stock' });
        }
    }
}
