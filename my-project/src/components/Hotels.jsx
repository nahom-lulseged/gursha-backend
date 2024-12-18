import React from 'react';
import { useState, useEffect } from 'react';
import { Card, Rate, Spin, Alert, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { apiUrl } from '../utils/apiUrl';
import SideMenu from './SideMenu';

const { Title } = Typography;

function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/hotels/all`);
        if (!response.ok) {
          throw new Error('Failed to fetch hotels');
        }
        const data = await response.json();
        setHotels(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  if (loading) return <Spin className="flex justify-center items-center min-h-screen" size="large" />;
  if (error) return <Alert message="Error" description={error} type="error" className="m-4" />;

  return (
    <div className="flex">
      <SideMenu />
      <div className='ml-[100px] flex-1 p-10'>
        {loading ? (
          <Spin className="flex justify-center items-center min-h-screen" size="large" />
        ) : error ? (
          <Alert message="Error" description={error} type="error" className="m-4" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel) => (
              <Link to={`/hotel/${hotel._id}`} key={hotel._id}>
                <Card
                  hoverable
                  cover={
                    <img 
                      src={hotel.picture} 
                      alt={hotel.name}
                      className="h-48 w-full object-cover"
                    />
                  }
                  className="shadow-lg"
                >
                  <Title level={4}>{hotel.name}</Title>
                  <Rate disabled defaultValue={hotel.rating} className="block mb-2" />
                  <p className="text-gray-600">
                    <span className="font-semibold">Location:</span> {hotel.location}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Hotels;
