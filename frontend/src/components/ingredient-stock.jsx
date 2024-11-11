export const IngredientsStock = ({ ingredients }) => (
    <div className="p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">Stock</h3>
        <table className="w-full">
            <thead>
                <tr>
                    <th className="text-left">Ingredient</th>
                    <th className="text-left">Quantity</th>
                </tr>
            </thead>
            <tbody>
                {ingredients.map((ingredient, index) => (
                    <tr
                        key={index}
                        className={`border-b py-2 transition-colors duration-500 ${
                            ingredient.highlight === 'increase' ? 'bg-green-100' : ''
                        } ${ingredient.highlight === 'decrease' ? 'bg-red-100' : ''}`}
                    >
                        <td>{ingredient.name.charAt(0).toUpperCase() + ingredient.name.slice(1)}</td>
                        <td>{ingredient.quantity * 100}g</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);
