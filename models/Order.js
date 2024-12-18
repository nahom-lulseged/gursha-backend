const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  foodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food',
    required: true
  },
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  deliveryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    comment: 'Price per item at the time of order'
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
    comment: 'Total amount (price * quantity)'
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    default: 'pending'
  }
}, { timestamps: true });

// Create a compound index for efficient querying
orderSchema.index({ userId: 1, status: 1 });
orderSchema.index({ hotelId: 1, status: 1 });

// Pre-save middleware to calculate totalAmount
orderSchema.pre('save', function(next) {
  this.totalAmount = this.price * this.quantity;
  next();
});

module.exports = mongoose.model('Order', orderSchema);
