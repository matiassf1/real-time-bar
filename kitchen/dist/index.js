"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("reflect-metadata");
const cors_1 = __importDefault(require("cors"));
const recipe_routes_1 = __importDefault(require("./routes/recipe.routes"));
const logger_1 = require("./middleware/logger");
const data_source_1 = require("./config/data-source");
data_source_1.AppDataSource.initialize()
    .then(() => {
    console.log("Data Source has been initialized!");
})
    .catch((error) => {
    console.error("Error during Data Source initialization", error);
});
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(logger_1.requestLogger);
app.use('/recipes', recipe_routes_1.default);
const PORT = process.env.KITCHEN_PORT || 3001;
app.listen(PORT, () => {
    console.log(`Kitchen running on port ${PORT}`);
});
