const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel');
const User = require('../models/User');
const Food = require('../models/Food');
const Order = require('../models/Order');

// Get all hotels
router.get('/all', async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get foods by hotel ID
router.get('/:hotelId/foods', async (req, res) => {
  try {
    const { hotelId } = req.params;

    // Validate hotelId
    if (!hotelId) {
      return res.status(400).json({
        success: false,
        message: 'Hotel ID is required'
      });
    }

    // Find foods associated with the hotel
    const foods = await Food.find({ hotelId: hotelId });
    if (foods.length === 0) {
      return res.status(404).json({ message: 'No foods found for this hotel' });
    }

    res.json(foods);
  } catch (error) {
    console.error('Get foods by hotel ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving foods',
      error: error.message
    });
  }
});

// Get orders by hotel ID
router.get('/:hotelId/orders', async (req, res) => {
  try {
    const { hotelId } = req.params;

    // Validate hotelId
    if (!hotelId) {
      return res.status(400).json({
        success: false,
        message: 'Hotel ID is required'
      });
    }

    // Find orders associated with the hotel and populate user, food, and delivery information
    const orders = await Order.find({ hotelId: hotelId })
      .populate('userId', 'username phoneNumber') // Populate customer info
      .populate('foodId', 'name price') // Populate food details
      .populate('deliveryId', 'username phoneNumber'); // Populate delivery user info

    if (orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this hotel' });
    }

    res.json(orders);
  } catch (error) {
    console.error('Get orders by hotel ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving orders',
      error: error.message
    });
  }
});

// Get single hotel by ID
router.get('/find/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new hotel (cleaned up route)
router.post('/create', async (req, res) => {
  try {
    const newHotel = new Hotel({
      name: req.body.name,
      rating: req.body.rating,
      picture: req.body.picture,
      location: req.body.location
    });

    const savedHotel = await newHotel.save();
    res.status(201).json(savedHotel);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update user's hotelId
router.put('/:userId/:hotelId', async (req, res) => {
  try {
    const { userId, hotelId } = req.params;

    // Validate inputs
    if (!userId || !hotelId) {
      return res.status(400).json({
        success: false,
        message: 'User ID and Hotel ID are required'
      });
    }

    // Find user and verify they exist
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify user is restaurant or delivery role
    if (!['restaurant', 'delivery'].includes(user.role)) {
      return res.status(400).json({
        success: false,
        message: 'Only restaurant and delivery users can be assigned to hotels'
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

    // Update user's hotelId using findByIdAndUpdate for complete replacement
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { hotelId: hotelId },
      { 
        new: true,
        runValidators: true 
      }
    ).populate('hotelId', 'name location');

    res.json({
      success: true,
      message: 'Hotel assignment updated successfully',
      data: updatedUser
    });

  } catch (error) {
    console.error('Update hotel assignment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating hotel assignment',
      error: error.message
    });
  }
});



module.exports = router; 