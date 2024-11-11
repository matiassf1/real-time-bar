import axios from "axios";

export class OrderService {
    private baseURL: string;

    constructor() {
        this.baseURL = process.env.STORE_URL || "http://localhost:3003";
    }

    async create(dishRecipe: any) {
        try {
            const response = await axios.post(`${this.baseURL}/order`, { item: dishRecipe },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error creating dish order:", error);
            throw new Error("Could not create dish order ### APIGATEWAY");
        }
    }

    async updateStatus(id: number, status: string) {
        try {
            const response = await axios.patch(`${this.baseURL}/order/${id}/status`, {
                status
            },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error updating dish order status:", error);
            throw new Error("Could not update dish order status ### APIGATEWAY");
        }
    }
}
