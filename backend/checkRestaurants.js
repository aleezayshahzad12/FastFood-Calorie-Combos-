const mongoose = require('mongoose');
const MenuItem = require('./MenuLabelingDB');

async function checkRestaurants() {
  await mongoose.connect('mongodb://localhost:27017/calorieDB');
  const items = await MenuItem.find({}).distinct('restaurant');
  console.log(items);
  mongoose.disconnect();
}

checkRestaurants();
