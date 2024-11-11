import axios from "axios";

export class KitchenService {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.KITCHEN_URL || "http://localhost:3001";
  }

  async prepareDishOrder(dishOrderDto: any) {
    console.log("### dishOrderDto", dishOrderDto);

    try {
      const response = await axios.post(`${this.baseURL}/recipes/orders`, {
        ...dishOrderDto
      },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error preparing dish order:", error);
      throw new Error("Could not preparing dish order ##APIGATEWAY");
    }
  }

  async getDishRecipe() {
    try {
      const response = await axios.get(`${this.baseURL}/recipes/random`);
      return response.data;
    } catch (error) {
      console.error("Error getting dish recipe:", error);
      throw new Error("Could not get dish recipe ##APIGATEWAY");
    }
  }
}
