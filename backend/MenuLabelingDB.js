const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  calories: Number,
  servingSize: String,
  category: { 
    type: String,
    enum: [
      'main',
      'entree',
      'side',
      'drink',
      'dessert',
      'sauce',
      'protein',
      'base',
      'topping',
      'dressing',
      'platter'
    ],
    default: 'main'
  },
  restaurant: { 
    type: String, 
    required: true }
}, 
{ timestamps: true });

module.exports = mongoose.models.MenuItem || mongoose.model('MenuItem', menuItemSchema);
