import React, { useState, useEffect } from 'react';
import { apiUrl } from '../utils/apiUrl';
import HotelSidemenu from './HotelSidemenu';

const HotelDashboard = () => { 
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [foods, setFoods] = useState([]);

    useEffect(() => {
        // Get user data from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUserData(JSON.parse(storedUser));
        }  
    }, []);

    useEffect(() => {
        // Fetch foods when userData is available
        const fetchFoods = async () => {
            if (userData && userData.hotelId) {
                try {
                    const response = await fetch(`${apiUrl}/api/hotels/${userData.hotelId}/foods`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch foods');
                    }
                    const data = await response.json();
                    setFoods(data);
                } catch (error) {
                    console.error('Error fetching foods:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchFoods();
    }, [userData]);

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <HotelSidemenu />
            <div className="flex-1 ml-4">
                <h2 className="text-3xl font-bold mb-6 text-center">Hotel Dashboard</h2>
                
                {userData && (
                    <div className="shadow-lg mb-6 p-4 border rounded bg-white">
                        <h3 className="text-xl font-semibold">User Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <strong>Username:</strong> {userData.username}
                            </div>
                            <div>
                                <strong>Role:</strong> {userData.role}
                            </div>
                            <div>
                                <strong>Phone:</strong> {userData.phoneNumber}
                            </div>
                            {userData.hotelId && (
                                <div>
                                    <strong>Hotel:</strong> {userData.hotelId}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {loading ? (
                    <p className="text-center">Loading foods...</p>
                ) : (
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Foods Available</h3>
                        {foods.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {foods.map(food => (
                                    <div key={food._id} className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
                                        <h4 className="text-lg font-bold">{food.name}</h4>
                                        <p className="text-gray-600">Price: ${food.price}</p>
                                        <p className="text-gray-500">{food.description}</p>
                                        <p className="text-sm italic">Type: {food.type}</p>
                                        <div className="flex space-x-2 mt-2">
                                            {food.pictures.map((picture, index) => (
                                                <img key={index} src={picture} alt={food.name} className="w-24 h-24 object-cover rounded" />
                                            ))}
                                        </div>
                                        <button 
                                            className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600 transition-colors duration-300"
                                            onClick={() => {window.location.href = `/edit-food/${food._id}`}}
                                        >
                                            Edit
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No foods available for this hotel.</p>
                        )}
                    </div>
                )}
                
                <button 
                    className="bg-blue-500 text-white py-2 px-4 rounded mb-6 hover:bg-blue-600 transition-colors duration-300"
                    onClick={() => {window.location.href = "/create-food"}}
                >
                    Add Menu Item
                </button> 
            </div>
        </div>
    );
};

export default HotelDashboard;