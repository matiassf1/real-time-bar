"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseController = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const purchase_service_1 = require("../services/purchase.service");
const pagination_dto_1 = require("../dtos/pagination.dto");
class PurchaseController {
    constructor() {
        this.purchaseService = new purchase_service_1.PurchaseService();
        this.getPurchases = this.getPurchases.bind(this);
    }
    async getPurchases(req, res) {
        try {
            const queryParams = (0, class_transformer_1.plainToClass)(pagination_dto_1.PaginationDto, req.query);
            const errors = await (0, class_validator_1.validate)(queryParams);
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
        }
        catch (error) {
            console.error('Error preparing recipe:', error);
            res.status(500).json({ error: 'Failed to prepare ingredients for recipe' });
        }
    }
}
exports.PurchaseController = PurchaseController;
