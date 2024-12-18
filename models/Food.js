const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    
  },
  type: {
    type: String,
    required: true,
    enum: ['breakfast', 'lunch', 'dinner', 'hotdrink', 'alcohol', 'beverage']
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  pictures: [{
    type: String,
    required: true
  }]
}, { timestamps: true });

// Method to calculate average rating
foodSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.rating = 0;
    return 0;
  }
  
  const sum = this.reviews.reduce((total, review) => total + review.rating, 0);
  this.rating = sum / this.reviews.length;
  return this.rating;
};

module.exports = mongoose.model('Food', foodSchema); 