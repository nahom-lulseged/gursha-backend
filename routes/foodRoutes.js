const express = require('express');
const router = express.Router();
const Food = require('../models/Food');

// Get all food ratings for a specific user
router.get('/ratings/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const foods = await Food.find({
            'reviews.user': userId
        });

        // Format the response to only include foodId and rating
        const ratings = foods.map(food => {
            const userReview = food.reviews.find(review => 
                review.user.toString() === userId
            );
            return {
                foodId: food._id,
                rating: userReview ? userReview.rating : 0,
                comment: userReview ? userReview.comment : ''
            };
        });

        res.json(ratings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching food ratings', error: error.message });
    }
});

// Get ratings for a specific food item
router.get('/:foodId/ratings', async (req, res) => {
    try {
        const { foodId } = req.params;
        const food = await Food.findById(foodId).populate('reviews.user', 'name');
        
        if (!food) {
            return res.status(404).json({ message: 'Food item not found' });
        }

        res.json({
            averageRating: food.rating,
            totalReviews: food.reviews.length,
            reviews: food.reviews
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching food ratings', error: error.message });
    }
});

// Rate a food item
router.post('/:foodId/rate', async (req, res) => {
    try {
        const { foodId } = req.params;
        const { userId, rating, comment } = req.body;

        // Validate rating
        if (!rating || rating < 0 || rating > 5) {
            return res.status(400).json({ message: 'Invalid rating value' });
        }

        const food = await Food.findById(foodId);
        
        if (!food) {
            return res.status(404).json({ message: 'Food item not found' });
        }

        // Check if user has already rated this food
        const existingReviewIndex = food.reviews.findIndex(
            review => review.user.toString() === userId
        );

        if (existingReviewIndex !== -1) {
            // Update existing review
            food.reviews[existingReviewIndex].rating = rating;
            if (comment !== undefined) {
                food.reviews[existingReviewIndex].comment = comment;
            }
        } else {
            // Add new review
            food.reviews.push({
                user: userId,
                rating,
                comment
            });
        }

        // Calculate new average rating
        food.calculateAverageRating();
        await food.save();

        res.json({
            _id: food._id,
            rating: food.rating,
            message: 'Rating updated successfully'
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating rating', error: error.message });
    }
});

// Delete a rating
router.delete('/:foodId/rate/:userId', async (req, res) => {
    try {
        const { foodId, userId } = req.params;
        
        const food = await Food.findById(foodId);
        
        if (!food) {
            return res.status(404).json({ message: 'Food item not found' });
        }

        // Remove the review
        food.reviews = food.reviews.filter(
            review => review.user.toString() !== userId
        );

        // Recalculate average rating
        food.calculateAverageRating();
        await food.save();

        res.json({
            message: 'Rating removed successfully',
            newRating: food.rating
        });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting rating', error: error.message });
    }
});

module.exports = router;
