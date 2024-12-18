const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    unique: true
  },
  wallet: {
    type: Number,
    default: 0,
    min: 0
  },
  coin: {
    type: Number,
    default: 0,
    min: 0
  },
  phoneNumber: {
    type: Number,
    required: true,
    unique: true,
    trim: true
  },
  role: {
    type: String, 
    enum: ['customer', 'restaurant', 'delivery', 'admin'],
    default: 'customer'
  },
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel', 
  },
  deliveryUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    validate: {
      validator: async function(userId) {
        const user = await mongoose.model('User').findById(userId);
        return user && user.role === 'delivery';
      },
      message: 'Referenced user must have a delivery role'
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema); 