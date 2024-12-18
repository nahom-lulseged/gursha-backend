import React, { useEffect, useState } from 'react';
import { apiUrl } from '../utils/apiUrl';
import { message } from 'antd';

const DeliveryDashboard = () => {
    // State to hold pending and accepted orders
    const [pendingOrders, setPendingOrders] = useState([]);
    const [acceptedOrders, setAcceptedOrders] = useState([]);
    const user = JSON.parse(localStorage.getItem('user')); // Get logged-in user details

    // Fetch pending and accepted orders on component mount
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Fetch pending orders
                const pendingResponse = await fetch(`${apiUrl}/api/orders/pending-orders`);
                const pendingData = await pendingResponse.json();
                if (pendingData.success) {
                    setPendingOrders(pendingData.data);
                } else {
                    console.error('Error fetching pending orders:', pendingData.message);
                }

                // Fetch accepted orders for the logged-in delivery user
                const acceptedResponse = await fetch(`${apiUrl}/api/orders/user/${user.id}/accepted-orders`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}` // Include token if needed
                    }
                });
                const acceptedData = await acceptedResponse.json();
                if (acceptedData.success) {
                    setAcceptedOrders(acceptedData.data);
                } else {
                    console.error('Error fetching accepted orders:', acceptedData.message);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, [user.id]);

    // Function to accept an order
    const acceptOrder = async (orderId) => {
        try {
            const response = await fetch(`${apiUrl}/api/orders/accept/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Include token if needed
                },
                body: JSON.stringify({ deliveryId: user.id }) // Send deliveryId as the logged-in user's ID
            });

            const data = await response.json();
            if (data.success) {
                message.success('Order accepted successfully!');
                // Refresh the pending orders after accepting
                setPendingOrders(pendingOrders.filter(order => order._id !== orderId));
            } else {
                message.error(data.message);
            }
        } catch (error) {
            console.error('Error accepting order:', error);
            message.error('Failed to accept order');
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl text-center mb-4">Delivery Dashboard</h1>
            <h2 className="text-xl text-center mb-6">Pending Orders</h2>
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden mb-6">
                <thead>
                    <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                        <th className="py-3 px-6 text-left">Date</th>
                        <th className="py-3 px-6 text-left">Customer</th>
                        <th className="py-3 px-6 text-left">Status</th>
                        <th className="py-3 px-6 text-left">Food</th>
                        <th className="py-3 px-6 text-left">Action</th>
                    </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                    {pendingOrders.map(order => (
                        <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-100">
                            <td className="py-3 px-6">{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td className="py-3 px-6">{order.userId.username} (Phone: {order.userId.phoneNumber})</td>
                            <td className="py-3 px-6">{order.status}</td>
                            <td className="py-3 px-6">
                                {order.foodId.name} - ${order.foodId.price}
                                {order.foodId.pictures && order.foodId.pictures.length > 0 && (
                                    <img src={order.foodId.pictures[0]} alt={order.foodId.name} className="w-16 h-16" />
                                )}
                            </td>
                            <td className="py-3 px-6">
                                <button 
                                    onClick={() => acceptOrder(order._id)} 
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Accept
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2 className="text-xl text-center mb-6">Accepted Orders</h2>
            <table className="min-w-full bg-white shadow-md rounded-lg">
                <thead>
                    <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                        <th className="py-3 px-6 text-left">Date</th>
                        <th className="py-3 px-6 text-left">Customer</th>
                        <th className="py-3 px-6 text-left">Status</th>
                        <th className="py-3 px-6 text-left">Food</th>
                    </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                    {acceptedOrders.map(order => (
                        <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-100">
                            <td className="py-3 px-6">{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td className="py-3 px-6">{order.userId.username} (Phone: {order.userId.phoneNumber})</td>
                            <td className="py-3 px-6">{order.status}</td>
                            <td className="py-3 px-6">
                                {order.foodId.name} - ${order.foodId.price}
                                {order.foodId.pictures && order.foodId.pictures.length > 0 && (
                                    <img src={order.foodId.pictures[0]} alt={order.foodId.name} className="w-16 h-16" />
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DeliveryDashboard;
