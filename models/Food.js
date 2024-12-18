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

module.exports = mongoose.model('Food', foodSchema); 