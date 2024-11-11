"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializer = exports.wss = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const ws_1 = require("ws");
const purchase_routes_1 = __importDefault(require("./routes/purchase.routes"));
const stock_routes_1 = __importDefault(require("./routes/stock.routes"));
const data_source_1 = require("./config/data-source");
const logger_1 = require("./middleware/logger");
const stock_messages_1 = require("./messages/stock.messages");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(logger_1.requestLogger);
app.use('/stock', stock_routes_1.default);
app.use('/purchase', purchase_routes_1.default);
const PORT = process.env.PORT || 3002;
server.listen(PORT);
data_source_1.AppDataSource.initialize()
    .then(() => {
    console.log("Data Source has been initialized!");
})
    .catch((error) => {
    console.error("Error during Data Source initialization", error);
});
exports.wss = new ws_1.WebSocketServer({ server });
exports.wss.on('connection', (ws) => {
    console.log('Client connected');
    exports.initializer = ws;
    ws.on('message', (_message) => {
        try {
            stock_messages_1.globalSubscribers.add(ws);
            console.log('Client subscribed to all stock changes');
        }
        catch (error) {
            console.error('Error handling WebSocket message:', error);
        }
    });
    ws.on('close', () => {
        stock_messages_1.globalSubscribers.delete(ws);
        console.log('Client disconnected');
    });
});
