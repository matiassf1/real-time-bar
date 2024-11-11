import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { PurchaseService } from '../services/purchase.service';
import { PaginationDto } from '../dtos/pagination.dto';

export class PurchaseController {
    private purchaseService: PurchaseService;

    constructor() {
        this.purchaseService = new PurchaseService();
        this.getPurchases = this.getPurchases.bind(this);
    }

    public async getPurchases(req: Request, res: Response): Promise<void> {
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

            const purchases = await this.purchaseService.getPurchases(page, limit);
            res.status(200).json({ purchases });
        } catch (error) {
            console.error('Error preparing recipe:', error);
            res.status(500).json({ error: 'Failed to prepare ingredients for recipe' });
        }
    }
}
