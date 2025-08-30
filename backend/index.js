const path = require('path');
require('dotenv').config({ 
  path: path.resolve(__dirname, '.env'),
  debug: true 
});


const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');

const AiMenuFiltering  = require('./AiMenuFiltering'); 
const MenuItem = require('./MenuLabelingDB');
const ComboDsa = require('./ComboDsa');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


const usingRestaurants = {
  'mcdonalds': { name: "McDonalds" },
  'cava': { name: "Cava" },
  'burgerking': { name: "Burger King" },
  'wendys': { name: "Wendys" },
  'tacobell': { name: "Taco Bell" },
  'kfc': { name: "KFC" },
  'chickfila': { name: "Chick-fil-A" },
  'pizzahut': { name: "Pizza Hut" },
  'dominos': { name: "Dominos" },
  'chipotle': { name: "Chipotle" },
  'panda express': { name: "Panda Express "}
};

async function getMenuItemsByName(restaurantName) {
  const response = await axios.get('https://trackapi.nutritionix.com/v2/search/instant', {
    params: { query: restaurantName, branded: true, common: false },
    headers: {
      'x-app-id': process.env.NUTRITIONIX_APP_ID,
      'x-app-key': process.env.NUTRITIONIX_APP_KEY,
      'Content-Type': 'application/json'
    },
    timeout: 5000
  });

  console.log('nutritionix response for', restaurantName, response.data);


  if (!response.data.branded || response.data.branded.length === 0) {
    return [];
  }

  return response.data.branded.map(item => ({
    name: item.food_name,
    description: item.brand_name || '',
    calories: item.nf_calories,
    servingSize: `${item.serving_qty} ${item.serving_unit}`
  }));
}

//all of the gets and posts are getting information
app.get('/api/restaurants', (req, res) => {
  res.json({
    restaurants: Object.keys(usingRestaurants).map(key => ({
      id: key, name: usingRestaurants[key].name
    }))
  });
});

app.get('/api/menu/:restaurantKey', async (req, res) => {
  const restaurantKey = req.params.restaurantKey.toLowerCase();
  const restaurantName = usingRestaurants[restaurantKey]?.name;
  if (!restaurantName) {
    return res.status(404).json({ error: 'restaurant not supported or not found' });
  }

  try {
    const menuItems = await getMenuItemsByName(restaurantName);
    if (menuItems.length === 0) return res.status(404).json({ error: 'no menu items found for restaurant' });
    res.json(menuItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'menu was not gotten' });
  }
});

app.post('/api/classify-menu/:restaurantKey', async (req, res) => {
  const restaurantKey = req.params.restaurantKey.toLowerCase();
  const restaurantName = usingRestaurants[restaurantKey]?.name;
  if (!restaurantName){
     return res.status(404).json({ error: 'restaurant not in the system' });
  }

  const menuItems = await getMenuItemsByName(restaurantName);
  if (!menuItems.length){
     return res.status(404).json({ error: 'no menu items in the system' });
  }

  const existingItems = await MenuItem.find({ restaurant: restaurantName });
  if (existingItems.length === menuItems.length) {
    return res.json({ message: "menu already ai classify", items: existingItems });
  }

  const classifiedMenu = await AiMenuFiltering(menuItems, restaurantName);
  console.log('ai menu:', classifiedMenu);

  if (!Array.isArray(classifiedMenu) || classifiedMenu.length === 0) {
    return res.status(500).json({ 
      error: 'aI failed ',
    });
  }

  const savedItems = await Promise.all(classifiedMenu.map(item => {
    const original = menuItems.find(nutxItem => nutxItem.name === item.name) || {};
    return new MenuItem({
      name: item.name,
      description: original.description || '', 
      calories: original.calories || 0, 
      servingSize: original.servingSize || '',
      category: item.category, 
      restaurant: restaurantName
    }).save();
  }));

  res.json({ message: 'menu was labeled and saved in db', savedItems });
});

app.post('/api/generate-combos', async (req, res) => {
  const { restaurantKey, targetCalories, comboCount = 3 } = req.body;

  if (!restaurantKey) {
    return res.status(400).json({ error: 'restaurantKey required' });
  }
  if (!targetCalories || isNaN(targetCalories)){
     return res.status(400).json({ error: 'targetCalories must be  a number' });
  }

  let restaurantName;
  if (usingRestaurants[restaurantKey.toLowerCase()]) {
    restaurantName = usingRestaurants[restaurantKey.toLowerCase()].name;
  } else {
    return res.status(404).json({ error: 'restaurant not in api' });
  }
    if (!restaurantName) {
      return res.status(404).json({ error: 'restaurant not in coding systen' });
    }

  try {
    let menuItems = await MenuItem.find({ restaurant: restaurantName });

    const needsAI = menuItems.some(item => !item.category);
    if (needsAI) {
      const aiClassified = await AiMenuFiltering(menuItems, restaurantName);
      menuItems = menuItems.map(item => {
        const aiItem = aiClassified.find(a => a.name === item.name);
        let updatedItem;
        if (aiItem) {
          updatedItem = { ...item.toObject(), category: aiItem.category };
        } else {
          updatedItem = item;
        }
        return updatedItem;
              });

      await Promise.all(menuItems.map(item => MenuItem.updateOne(
        { _id: item._id },
        { category: item.category }
      )));
    }

    const adjustedMenu = menuItems.map(item => {
      if (item.category === 'entree') {
        return { ...item.toObject(), category: 'main' };
      }
      return item.toObject();
    });

    const combos = await ComboDsa.generateCombos(restaurantName, adjustedMenu, { targetCalories, comboCount });
    res.json({ combos });
  } catch (error) {
    console.error('combo was not generated:', error);
    res.status(500).json({ error: 'combo generation failed', details: error.message });
  }
});

app.get('/api/menu/:restaurantKey/filter', async (req, res) => {
  const restaurantKey = req.params.restaurantKey.toLowerCase();
  const restaurantName = usingRestaurants[restaurantKey]?.name;
  if (!restaurantName) {
    return res.status(404).json({ error: 'restaurant not found' });
  }

  const minCalories = parseInt(req.query.minCalories) || 0; //ensuring no neg number 
  const maxCalories = parseInt(req.query.maxCalories) || 2000;//health related cant be more then 2000 as advised 

  try {
    const menuItems = await MenuItem.find({
      restaurant: restaurantName,
      calories: { $gte: minCalories, $lte: maxCalories }
    });
    res.json({ items: menuItems });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'menu items were not fetched from the restaurant', details: err.message });
  }
});

app.get('/ping', (req, res) => res.send('pong'));

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
