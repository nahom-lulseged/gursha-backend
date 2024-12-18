const express = require('express');
const router = express.Router();
const User = require('../models/User'); 

router.get('/all', async (req, res) => {
    try {
      const users = await User.find()
        .populate('hotelId', 'name location')
        .select('-password'); // Exclude password from the response
  
      res.json({
        success: true,
        message: 'Users retrieved successfully',
        data: users
      });
    } catch (error) {
      console.error('Get all users error:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving users',
        error: error.message
      });
    }
  });

module.exports = router;
