import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { RecipeService } from "../services/recipe.service";
import { CreateRecipeDto } from "../dtos/create-recipe.dto";

export class RecipeController {
    private recipeService: RecipeService;

    constructor() {
        this.recipeService = new RecipeService();
    }

    private async validateDto(dto: any, res: Response) {
        const errors = await validate(dto);
        if (errors.length > 0) {
            const messages = errors.map(err => Object.values(err.constraints || {}).join(", "));
            res.status(400).json({ message: "Validation failed", errors: messages });
            return false;
        }
        return true;
    }

    public async createOrder(req: Request, res: Response) {
        try {
            const result = await this.recipeService.createOrder(req.body.recipeId);
            res.status(200).json(result);
        } catch (error: any) {
            console.error("Error processing order:", error);
            res.status(500).json({ message: error.message });
        }
    }

    public async getOneRandomRecipe(req: Request, res: Response) {
        try {
            const recipe = await this.recipeService.getOneRandomRecipe();
            res.status(200).json(recipe);
        } catch (error) {
            console.error("Error fetching recipes:", error);
            res.status(500).json({ message: "Could not fetch recipes" });
        }
    }

    public async getAllRecipes(req: Request, res: Response) {
        try {
            const recipes = await this.recipeService.getAllRecipes();
            res.status(200).json(recipes);
        } catch (error) {
            console.error("Error fetching recipes:", error);
            res.status(500).json({ message: "Could not fetch recipes" });
        }
    }

    public async createRecipe(req: Request, res: Response) {
        const createRecipeDto: CreateRecipeDto = plainToInstance(CreateRecipeDto, req.body);

        if (!(await this.validateDto(createRecipeDto, res))) return;

        try {
            const newRecipe = await this.recipeService.createRecipe(createRecipeDto);
            res.status(201).json(newRecipe);
        } catch (error) {
            console.error("Error creating recipe:", error);
            res.status(500).json({ message: "Could not create recipe" });
        }
    }
}
