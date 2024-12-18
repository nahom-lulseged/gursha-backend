import { Card, Rate, Typography, Tag, Button, message } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const TYPE_COLORS = {
  breakfast: 'orange',
  lunch: 'green',
  dinner: 'blue',
  hotdrink: 'red',
  alcohol: 'purple',
  beverage: 'teal'
};

function FoodImage({ picture, type }) {
  return (
    <div className="relative h-48">
      <img alt="food" src={picture} className="h-full w-full object-cover" />
      <Tag 
        color={TYPE_COLORS[type] || 'default'} 
        className="absolute top-2 right-2 m-0"
      >
        {type}
      </Tag>
    </div>
  );
}

function Food({ food, onCartUpdate }) {
  const { name, price, description, pictures, type, rating } = food;

  const handleAddToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = existingCart.findIndex(item => item.name === name);
    
    if (existingItemIndex !== -1) {
      existingCart[existingItemIndex].quantity += 1;
      message.success(`Added another ${name} to cart`);
    } else {
      existingCart.push({ ...food, quantity: 1 });
      message.success(`${name} added to cart`);
    }
    
    localStorage.setItem('cart', JSON.stringify(existingCart));
    onCartUpdate();
  };

  return (
    <Card
      hoverable
      className="w-full transition-transform duration-300 hover:scale-105"
      cover={pictures?.[0] && <FoodImage picture={pictures[0]} type={type} />}
      styles={{ body: { padding: '16px' } }}
    >
      <div className="space-y-3">
        <Title level={4} className="m-0 text-lg">{name}</Title>
        <Paragraph 
          className="text-gray-600 h-12 overflow-hidden text-sm"
          ellipsis={{ rows: 2 }}
        >
          {description}
        </Paragraph>

        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-blue-600">
            ${price?.toFixed(2)}
          </span>
          <Rate disabled defaultValue={rating} className="text-sm" />
        </div>

        <Button
          type="primary"
          icon={<ShoppingCartOutlined />}
          onClick={handleAddToCart}
          className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center"
        >
          Add to Cart
        </Button>
      </div>
    </Card>
  );
}

export default Food;
