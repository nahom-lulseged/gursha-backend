const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, 
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  picture: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true, 
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      required: true
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

// Add a method to calculate average rating
hotelSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) return 0;
  
  const sum = this.reviews.reduce((total, review) => total + review.rating, 0);
  this.rating = sum / this.reviews.length;
  return this.rating;
};

module.exports = mongoose.model('Hotel', hotelSchema); 