import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiUrl } from '../utils/apiUrl';

const EditFood = () => {
    const { foodId } = useParams();
    const [food, setFood] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        type: '',
        pictures: []
    });

    useEffect(() => {
        const fetchFood = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/foods/find/${foodId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch food details');
                }
                const data = await response.json();
                setFood(data);
                setFormData({
                    name: data.name,
                    price: data.price,
                    description: data.description,
                    type: data.type,
                    pictures: data.pictures
                });
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFood();
    }, [foodId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${apiUrl}/api/foods/update/${foodId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error('Failed to update food');
            }
            alert('Food updated successfully!');
        } catch (error) {
            setError(error.message);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-3xl font-bold mb-6 text-center">Edit Food</h2>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-4 rounded shadow">
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="border rounded w-full p-2"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="border rounded w-full p-2"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="border rounded w-full p-2"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <input
                        type="text"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="border rounded w-full p-2"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Pictures (comma-separated URLs)</label>
                    <input
                        type="text"
                        name="pictures"
                        value={formData.pictures.join(', ')}
                        onChange={(e) => setFormData({ ...formData, pictures: e.target.value.split(', ') })}
                        className="border rounded w-full p-2"
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-300">
                    Update Food
                </button>
            </form>
        </div>
    );
};

export default EditFood; 