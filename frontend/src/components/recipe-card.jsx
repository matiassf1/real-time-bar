export const RecipeCard = ({ recipe }) => (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold">{recipe.name}</h3>
      <ul>
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index} className="text-sm text-gray-700">
            {ingredient.name}: {ingredient.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
  