const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Food = require('../models/Food');
const User = require('../models/User');
const Hotel = require('../models/Hotel');


// Get all pending orders
router.get('/pending-orders', async (req, res) => {
  try {
    const pendingOrders = await Order.find({ status: 'pending' })
      .populate('foodId', 'name price pictures')
      .populate('hotelId', 'name location')
      .populate('userId', 'username phoneNumber')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: pendingOrders
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pending orders',
      error: error.message
    });
  }
});

// Get user's orders
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .populate('foodId', 'name price pictures')
      .populate('hotelId', 'name location')
      .populate('deliveryId', 'username phoneNumber')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
});

// Get accepted orders for a delivery user
router.get('/user/:userId/accepted-orders', async (req, res) => {
  try {
    const { userId } = req.params;

    // Find accepted orders for the delivery user
    const acceptedOrders = await Order.find({ deliveryId: userId, status: 'accepted' })
      .populate('foodId', 'name price pictures')
      .populate('hotelId', 'name location')
      .populate('userId', 'username phoneNumber') // Populate user details for the customer
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: acceptedOrders
    });

  } catch (error) {
    console.error('Error fetching accepted orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching accepted orders',
      error: error.message
    });
  }
});

// Create a new order
router.post('/create', async (req, res) => {
  try {
    const { foodId, quantity, userId, hotelId } = req.body;
    console.log(req.body);

    // Input validation
    if (!foodId || !quantity || !userId || !hotelId || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid foodId, userId, hotelId and quantity'
      });
    }

    // Find the food item and verify it exists
    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found'
      });
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify hotel exists
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    // Verify food belongs to the specified hotel
    if (food.hotelId.toString() !== hotelId) {
      return res.status(400).json({
        success: false,
        message: 'Food item does not belong to the specified hotel'
      });
    }

    console.log("food.price * quantity", food.price * quantity);

    // Create the order
    const order = new Order({
      userId,
      foodId,
      hotelId,
      quantity,
      price: food.price,
      totalAmount: food.price * quantity, 
    });

    await order.save();

    // Populate the order with food and hotel details for the response
    const populatedOrder = await Order.findById(order._id)
      .populate('foodId', 'name price pictures')
      .populate('hotelId', 'name location')
      .populate('userId', 'username phoneNumber');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: populatedOrder
    });

  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
});

// Update order status to rejected
router.put('/reject/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find the order by ID and update its status
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: 'rejected' },
      { new: true } // Return the updated document
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order status updated to rejected',
      data: updatedOrder
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
});

// Accept order and store delivery user ID
router.put('/accept/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    // Expecting deliveryId in the request body
    const { deliveryId } = req.body; 

    // Find the order by ID
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if the order is already accepted
    if (order.status === 'accepted') {
      return res.status(400).json({
        success: false,
        message: 'Order is already accepted'
      });
    }

    // Update the order status to accepted and set the deliveryId
    order.status = 'accepted';
    order.deliveryId = deliveryId; // Store the delivery user ID
    await order.save();

    res.json({
      success: true,
      message: 'Order status updated to accepted',
      data: order
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
});





module.exports = router; 