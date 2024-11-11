import axios from "axios";

export class WarehouseService {
    private baseURL: string;

    constructor() {
        this.baseURL = process.env.STORE_URL || "http://localhost:3002";
    }

    async getIngredients(recipeIngredients: any) {
        console.log("### Required Recipes", recipeIngredients);

        try {
            const response = await axios.post(`${this.baseURL}/stock/check-ingredients`, {
                recipeIngredients
            },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log("### WAREHOUSE REQUEST INGREDIENTS RESPONSE", response.data);

            return response.data;
        } catch (error) {
            console.error("Error sending ingredients for dish order:", error);
            throw new Error("Could not send ingredients for dish order");
        }
    }
}
