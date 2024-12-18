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
  }
}, { timestamps: true });

module.exports = mongoose.model('Hotel', hotelSchema); 