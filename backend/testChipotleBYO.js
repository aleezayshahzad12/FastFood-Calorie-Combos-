const AiMenuFiltering = require('./AiMenuFiltering');

(async () => {
  const menuItems = [
    { name: "Fried Rice", calories: 620 },
    { name: "Orange Chicken", calories: 510 },
    { name: "Sprite, Large", calories: 470 },
    { name: "Chow Fun", calories: 410 }
  ];

  const classifiedMenu = await AiMenuFiltering(menuItems, "Panda Express");

  //console.log("start");
  classifiedMenu.forEach(item => {
    //console.log(`${item.name} => ${item.category} (${item.calories})`);
  });
})();
