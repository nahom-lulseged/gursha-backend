import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiUrl } from '../utils/apiUrl';
import SideMenu from './SideMenu';

const HotelFoodsList = () => {
  const { hotelId } = useParams();
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/hotels/${hotelId}/foods`);
        if (!response.ok) {
          throw new Error('Failed to fetch foods');
        }
        const data = await response.json();
        setFoods(data);
      } catch (error) {
        console.error('Error fetching foods:', error);
      }
    };

    fetchFoods();
  }, [hotelId]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
        <SideMenu />
    <div className='flex-1 ml-[100px]'>
    <h1 className="text-2xl font-bold mb-4">Menu</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {foods.map(food => (
          <div key={food._id} className="p-4 bg-white shadow-md rounded-lg flex flex-col">
            <img 
              src={food.pictures[0]}
              alt={food.name}
              className="h-32 w-full object-cover rounded-lg mb-2"
            />
            <div className="flex-1">
              <h2 className="text-lg font-semibold">{food.name}</h2>
              <p className="text-gray-600">{food.description}</p>
              <p className="text-lg font-bold text-gray-800">${food.price.toFixed(2)}</p>
              <p className="text-sm text-gray-500">Type: {food.type}</p>
              <p className="text-sm text-gray-500">Rating: {food.rating} / 5</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default HotelFoodsList;
