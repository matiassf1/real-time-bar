import React from 'react';

export const OrderStatus = ({ status, orders }) => {

    const filteredOrders = orders.filter(order => {   
        if (status === "Receiving Orders") return order.status === "Pending";
        if (status === "Orders in Preparation") return order.status === "In Kitchen";
        if (status === "Completed Order History") return order.status === "Completed";
        return false;
    });

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">{status}</h3>
            <ul>
                {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                        <li key={new Date().getTime() * Math.random()} className="border-b border-gray-200 py-2">
                            {order.dishName} - {new Date(order.createdAt).toLocaleDateString()}
                        </li>
                    ))
                ) : (
                    <li className="text-gray-500">No orders available</li>
                )}
            </ul>
        </div>
    );
};
