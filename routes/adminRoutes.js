const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Hotel = require('../models/Hotel');

 
// Get all users
router.get('/getUsers', async (req, res) => {
  try {
    const users = await User.find()
      .select('-password') // Exclude password from the response
      .populate('hotelId', 'name'); // Populate hotel information if user is restaurant owner
    
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Get all hotels
router.get('/getHotels', async (req, res) => {
  try {
    const hotels = await Hotel.find()
      .populate('reviews.user', 'username'); // Populate user information in reviews
    
    res.status(200).json(hotels);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching hotels', error: error.message });
  }
});

// Update user
router.put('/updateUser/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, phoneNumber, role, hotelId } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, phoneNumber, role, hotelId },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
});

// Delete user
router.delete('/removeUser/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

module.exports = router; 