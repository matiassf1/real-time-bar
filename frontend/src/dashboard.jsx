import React, { useCallback, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { OrderStatus, IngredientsStock, RecipeCard } from './components';
import WebSocketConnection from './websocket.connection';

export const Dashboard = () => {
    const [ingredients, setIngredients] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [orderWsConnected, setOrderWsConnected] = useState(false);
    const [stockWsConnected, setStockWsConnected] = useState(false);
    const orderSocketRef = useRef(null);
    const stockSocketRef = useRef(null);

    const getRecipes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${process.env.REACT_APP_KITCHEN_URL}/recipes`);
            setRecipes(response.data);
        } catch (err) {

        }
    }, []);

    const getIngredients = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${process.env.REACT_APP_WAREHOUSE_URL}/stock`);
            setIngredients(response.data.stock);
        } catch (err) {
            setError('Failed to load ingredients');
        } finally {
            setLoading(false);
        }
    }, []);

    const getOrders = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${process.env.REACT_APP_ORDER_URL}/order`);
            setOrders(response.data.data);
        } catch (err) {
            setError('Failed to load orders');
        } finally {
            setLoading(false);
        }
    }, []);


    const handleOrderUpdate = (updatedOrder) => {
        setOrders((prevOrders) => {
            const orderIndex = prevOrders.findIndex(order => order.id === updatedOrder.id);
            if (orderIndex !== -1) {
                const updatedOrders = [...prevOrders];
                updatedOrders[orderIndex] = { ...updatedOrders[orderIndex], ...updatedOrder };
                return updatedOrders;
            } else {
                return [...prevOrders, { ...updatedOrder }];
            }
        });
    };

    const handleStockUpdate = (updatedIngredient) => {
        setIngredients((prevIngredients) => {
            return prevIngredients.map((ingredient) => {
                if (ingredient.id === updatedIngredient.id) {
                    const isIncrease = updatedIngredient.quantity >= ingredient.quantity;
                    
                    return {
                        ...ingredient,
                        quantity: updatedIngredient.quantity,
                        highlight: isIncrease ? 'increase' : 'decrease'
                    };
                }
                return ingredient;
            });
        });

        setTimeout(() => {
            setIngredients((prevIngredients) =>
                prevIngredients.map((ingredient) => ({
                    ...ingredient,
                    highlight: null,
                }))
            );
        }, 2000);
    };

    const handleOrderRequest = async () => {
        try {
            const { data: { order } } = await axios.post(`${process.env.REACT_APP_GATEWAY_URL}/api`);
            console.log('Sending order to WebSocket server', order);
            if (orderSocketRef.current && orderSocketRef.current.readyState === WebSocket.OPEN) {
                console.log('Sending order to WebSocket server', order);
                orderSocketRef.current.send(JSON.stringify({
                    orderId: order?.data?.id,
                }));
            } else {
                console.log('WebSocket is not open.');
                alert('No se pudo establecer la conexión en tiempo real. La orden se procesará en segundo plano.');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            
            if (error.code === 'ERR_NETWORK') {
                alert('Error de conexión. Por favor, verifica tu conexión a internet.');
            } else if (error.response) {
                alert(`Error del servidor: ${error.response.data.message || 'Error al procesar la orden'}`);
            } else {
                alert('Error al procesar la orden. Por favor, intenta nuevamente.');
            }
        }
    };

    useEffect(() => {
        getIngredients();
        getOrders();
        getRecipes()
    }, [getIngredients, getOrders, getRecipes]);

    useEffect(() => {
        const connectOrderWebSocket = () => {
            orderSocketRef.current = new WebSocket(process.env.REACT_APP_WS_ORDER_URL);

            orderSocketRef.current.onopen = () => {
                console.log('Connected to WebSocket server');
                setOrderWsConnected(true);
            };

            orderSocketRef.current.onmessage = (event) => {
                const data = JSON.parse(event.data);
                handleOrderUpdate(data);
            };

            orderSocketRef.current.onclose = () => {
                console.log('Disconnected from WebSocket server, reconnecting...');
                setOrderWsConnected(false);
                setTimeout(connectOrderWebSocket, 3000);
            };
        };

        connectOrderWebSocket();

        return () => {
            orderSocketRef.current.close();
        };
    }, []);

    useEffect(() => {
        const connectStockWebSocket = () => {
            stockSocketRef.current = new WebSocket(process.env.REACT_APP_WS_STOCK_URL);

            stockSocketRef.current.onopen = () => {
                console.log('Connected to WebSocket server');
                setStockWsConnected(true);
            };

            stockSocketRef.current.onmessage = (event) => {
                const data = JSON.parse(event.data);
                handleStockUpdate(data);
            };

            stockSocketRef.current.onclose = () => {
                console.log('Disconnected from WebSocket server, reconnecting...');
                setStockWsConnected(false);
                setTimeout(connectStockWebSocket, 3000);
            };
        };

        connectStockWebSocket();

        return () => {
            stockSocketRef.current.close();
        };
    }, []);

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="mb-6">
                <button
                    onClick={handleOrderRequest}
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
                >
                    Place Order
                </button>
            </div>
            <WebSocketConnection connected={orderWsConnected} content="Receiving Orders" />
            <WebSocketConnection connected={stockWsConnected} content="Receiving Stock" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <OrderStatus status="Receiving Orders" orders={orders} />
                <OrderStatus status="Orders in Preparation" orders={orders} />
                <OrderStatus status="Completed Order History" orders={orders} />
                <IngredientsStock ingredients={ingredients} loading={loading} error={error} />
                <div className='col-start-1 col-end-3'>
                    <h3 className="text-lg font-semibold mb-2">Available Recipes</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {recipes.map((recipe, index) => (
                            <RecipeCard key={index} recipe={recipe} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
