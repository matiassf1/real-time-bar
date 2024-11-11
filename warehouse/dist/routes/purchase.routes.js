"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const purchase_controller_1 = require("../controllers/purchase.controller");
const router = express_1.default.Router();
const purchaseController = new purchase_controller_1.PurchaseController();
router.post('/', purchaseController.getPurchases);
exports.default = router;
