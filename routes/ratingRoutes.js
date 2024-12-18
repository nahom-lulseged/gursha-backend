const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel');

// Get all ratings for a specific user
router.get('/ratings/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const hotels = await Hotel.find({
            'reviews.user': userId
        });

        // Format the response to only include hotelId and rating
        const ratings = hotels.map(hotel => {
            const userReview = hotel.reviews.find(review => 
                review.user.toString() === userId
            );
            return {
                hotelId: hotel._id,
                rating: userReview ? userReview.rating : 0
            };
        });

        res.json(ratings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching ratings', error: error.message });
    }
});

// Rate a hotel
router.post('/:hotelId/rate', async (req, res) => {
    try {
        const { hotelId } = req.params;
        const { userId, rating } = req.body;

        if (!rating || rating < 0 || rating > 5) {
            return res.status(400).json({ message: 'Invalid rating value' });
        }

        const hotel = await Hotel.findById(hotelId);
        
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        // Check if user has already rated this hotel
        const existingReviewIndex = hotel.reviews.findIndex(
            review => review.user.toString() === userId
        );

        if (existingReviewIndex !== -1) {
            // Update existing review
            hotel.reviews[existingReviewIndex].rating = rating;
        } else {
            // Add new review
            hotel.reviews.push({
                user: userId,
                rating
            });
        }

        // Calculate new average rating
        hotel.calculateAverageRating();
        await hotel.save();

        res.json({
            _id: hotel._id,
            rating: hotel.rating,
            message: 'Rating updated successfully'
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating rating', error: error.message });
    }
});

module.exports = router;
