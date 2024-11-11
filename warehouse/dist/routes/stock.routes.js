"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const stock_controller_1 = require("../controllers/stock.controller");
const router = express_1.default.Router();
const stockController = new stock_controller_1.StockController();
router.post('/check-ingredients', stockController.prepareIngredients);
router.get('/', stockController.getStock);
exports.default = router;
