"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const gateway_routes_1 = __importDefault(require("./routes/gateway.routes"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = require("./middleware/logger");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(logger_1.requestLogger);
app.use('/api', gateway_routes_1.default);
const PORT = process.env.GATEWAY_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Gateway running on port ${PORT}`);
});
