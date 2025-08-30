const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testMcDonalds() {
  try {
    console.log('api wporking?');
    const menuRes = await axios.get(`${BASE_URL}/api/menu/tacobell`);
    const menuItems = menuRes.data;
    console.log(`${menuItems.length}`);
    console.log(menuItems.slice(0, 5));

    console.log('ai working?');
    const classifyRes = await axios.post(`${BASE_URL}`);
    
    const savedItems = classifyRes.data.savedItems || [];
    console.log('menu?');
    console.log(savedItems.slice(0, 5));

    console.log('combo?');
    const comboRes = await axios.post(`${BASE_URL}`, {
      restaurantKey: 'tacobell',
      targetCalories: 800,
      comboCount: 3
    });

    const combos = comboRes.data.combos || [];
    combos.forEach((combo, i) => {
      console.log(` ${i + 1}: ${combo.totalCalories}`);
      combo.items.forEach(item => {
        console.log(`${item.name} (${item.category}, ${item.calories})`);
      });
    });

  } catch (err) {
  }
}

testMcDonalds();