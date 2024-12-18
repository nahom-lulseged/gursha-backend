import { Modal, Button, List, InputNumber } from 'antd';
import { ShoppingCartOutlined, DeleteOutlined } from '@ant-design/icons';

function CartModal({ 
  isVisible, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  calculateTotal,
  onCheckout,
  user,
  foods 
}) {
  const renderEmptyCart = () => (
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
      <ShoppingCartOutlined className="text-4xl text-gray-300" />
      <p className="text-gray-500 text-base">Your cart is empty</p>
    </div>
  );

  const renderCartItem = (item) => (
    <List.Item key={item.name} className="hover:bg-gray-50 transition-colors duration-150 border-b last:border-b-0">
      <div className="flex items-center w-full">
        <div className="flex items-center space-x-4 flex-1">
          <div className="w-16 h-16 flex-shrink-0">
            <img
              src={item.pictures?.[0]}
              alt={item.name}
              className="w-full h-full object-cover rounded-md shadow-sm"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-base font-medium text-gray-800 truncate">{item.name}</h4>
            <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
          </div>
          <div className="flex items-center space-x-4">
            <InputNumber
              min={0}
              value={item.quantity}
              onChange={(value) => onUpdateQuantity(item.name, value)}
              className="w-20"
            />
            <span className="text-gray-600 font-medium min-w-[80px] text-right">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => onRemoveItem(item.name)}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            />
          </div>
        </div>
      </div>
    </List.Item>
  );

  const renderCartSummary = () => (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <p className="text-gray-500">Subtotal</p>
          <p className="text-lg font-semibold text-gray-800">
            ${calculateTotal().toFixed(2)}
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {cartItems.reduce((total, item) => total + item.quantity, 0)} items
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-500">Doesn't include delivery fees.</p>
    </div>
  );

  return (
    <Modal
      title={<h3 className="text-lg font-semibold text-gray-800 mb-0">Shopping Cart</h3>}
      open={isVisible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose} className="hover:bg-gray-100">
          Close
        </Button>,
        <Button
          key="checkout"
          type="primary"
          disabled={cartItems.length === 0}
          onClick={() => onCheckout(cartItems, foods, user)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Checkout (${calculateTotal().toFixed(2)})
        </Button>
      ]}
      width={600}
      className="top-8"
    >
      {cartItems.length === 0 ? (
        renderEmptyCart()
      ) : (
        <div className="max-h-[60vh] overflow-y-auto">
          <List
            dataSource={cartItems}
            renderItem={renderCartItem}
          />
          {renderCartSummary()}
        </div>
      )}
    </Modal>
  );
}

export default CartModal; 