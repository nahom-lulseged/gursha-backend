const express = require('express');
const router = express.Router();
const Food = require('../models/Food');

// Get all food items
router.get('/all', async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get food item by ID
router.get('/find/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (food) {
      res.json(food);
    } else {
      res.status(404).json({ message: 'Food item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new food item
router.post('/create', async (req, res) => {
    try {
      const food = new Food({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        type: req.body.type,
        rating: req.body.rating,
        hotelId: req.body.hotelId,
        pictures: req.body.pictures
      });
  
      const savedFood = await food.save();
      res.status(201).json(savedFood);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

// Update food item by ID
router.put('/update/:id', async (req, res) => {
  try {
    const { name, price, description, type, pictures } = req.body;

    // Find the food item by ID and update it
    const updatedFood = await Food.findByIdAndUpdate(
      req.params.id,
      { name, price, description, type, pictures },
      { new: true, runValidators: true } // Options to return the updated document and run validators
    );

    if (!updatedFood) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    res.json(updatedFood);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 