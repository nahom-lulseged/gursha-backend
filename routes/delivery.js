const express = require('express');
const router = express.Router();
const User = require('../models/User'); 


// Get all delivery users
router.get('/delivery-users', async (req, res) => {
    try {
        const deliveryUsers = await User.find({ role: 'delivery' })
            .populate('hotelId', 'name location')
            .select('-password'); // Exclude password from the response

        res.json({
            success: true,
            message: 'Delivery users retrieved successfully',
            data: deliveryUsers
        });
    } catch (error) {
        console.error('Get delivery users error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving delivery users',
            error: error.message
        });
    }
});




module.exports = router;
