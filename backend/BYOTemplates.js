// BYOTemplates.js - Manual templates for restaurants with incomplete Nutritionix data
const byoTemplates = {
    chipotle: {
      name: "Chipotle",
      categories: {
        base: [
          { name: "White Rice", calories: 210, price: 0 },
          { name: "Brown Rice", calories: 210, price: 0 },
          { name: "Black Beans", calories: 130, price: 0 },
          { name: "Pinto Beans", calories: 130, price: 0 },
          { name: "Lettuce", calories: 5, price: 0 }
        ],
        protein: [
          { name: "Chicken", calories: 180, price: 8.50 },
          { name: "Steak", calories: 200, price: 9.50 },
          { name: "Barbacoa", calories: 170, price: 9.00 },
          { name: "Carnitas", calories: 210, price: 8.50 },
          { name: "Sofritas", calories: 150, price: 8.00 }
        ],
        topping: [
          { name: "Fresh Tomato Salsa", calories: 20, price: 0 },
          { name: "Roasted Chili-Corn Salsa", calories: 80, price: 0 },
          { name: "Tomatillo-Green Chili Salsa", calories: 15, price: 0 },
          { name: "Tomatillo-Red Chili Salsa", calories: 30, price: 0 },
          { name: "Sour Cream", calories: 110, price: 0 },
          { name: "Cheese", calories: 110, price: 0 },
          { name: "Guacamole", calories: 230, price: 2.50 },
          { name: "Lettuce", calories: 5, price: 0 },
          { name: "Fajita Vegetables", calories: 20, price: 0 }
        ],
        dressing: [
          { name: "Chipotle-Honey Vinaigrette", calories: 220, price: 0 },
          { name: "Chipotle Aioli", calories: 80, price: 0 }
        ],
        side: [
          { name: "Chips", calories: 540, price: 1.95 },
          { name: "Chips & Guacamole", calories: 770, price: 4.45 },
          { name: "Chips & Queso", calories: 780, price: 4.45 }
        ],
        drink: [
          { name: "Chipotle Iced Tea, 22 fl oz", calories: 10, price: 2.65 },
          { name: "Chipotle Sweet Iced Tea, 22 fl oz", calories: 150, price: 2.65 },
          { name: "Bottled Water", calories: 0, price: 2.50 },
          { name: "Coca-Cola", calories: 140, price: 2.65 }
        ]
      },
      rules: {
        minItems: 3,
        maxItems: 8,
        required: ["base", "protein", "topping"],
        maxToppings: 10,
        maxDressings: 1
      }
    },

    cava: {
      name: "Cava",
      categories: {
        base: [
          { name: "Saffron Basamati Rice", calories: 150, price: 0 },
          { name: "Brown Rice", calories: 150, price: 0 },
          { name: "Arugula", calories: 10, price: 0 },
          { name: "SuperGreens", calories: 20, price: 0 },
          { name: "Romaine", calories: 10, price: 0 },
          { name: "SplendidGreens", calories: 10, price: 0 }
        ],
        protein: [
          { name: "Harissa Honey Chicken", calories: 260, price: 1.55 },
          { name: "Grilled Steak", calories: 170, price: 3.50 },
          { name: "Grilled Chicken", calories: 250, price: 0 },
          { name: "Falafel", calories: 350, price: 0 },
          { name: "Spicy Lamb Meatballs", calories: 300, price: 2.45 },
          { name: "Braised Lamb", calories: 210, price: 3.75 },
          { name: "Roasted Vegetables", calories: 100, price: 0 }
        ],
        topping: [
          { name: "Fiery Broccoli", calories: 35, price: 0 },
          { name: "Fire Roasted Corn", calories: 45, price: 0 },
          { name: "Avocado", calories: 110, price: 2.75 },
          { name: "Pickled Onions", calories: 20, price: 0 },
          { name: "Salt-Brined Pickles", calories: 5, price: 0 },
          { name: "Tomato + Onion", calories: 20, price: 0 },
          { name: "Tomato + Cucumber", calories: 5, price: 2.50 },
          { name: "Cabbage Slaw", calories: 35, price: 0 },
          { name: "Kalamata Olives", calories: 35, price: 0 },
          { name: "Persian Cucumber", calories: 15, price: 0 }, 
          { name: "Shredded Romaine", calories: 5, price: 0 }, 
          { name: "Crumbled Feta", calories: 35, price: 0 }, 
          { name: "Pita Crisps", calories: 70, price: 0 }
        ],
        dressing: [
          { name: "Balsamic Date Vinaigrette", calories: 60, price: 0 },
          { name: "Greek Vinaigrette", calories: 130, price: 0 },
          { name: "Garlic Dressing", calories: 130, price: 0 }, 
          { name: "Yogurt Dill", calories: 180, price: 0 }, 
          { name: "Lemon Herb Tahini", calories: 70, price: 0 }, 
          { name: "Crazy Feta", calories: 70, price: 0 }, 
          { name: "Harissa", calories: 70, price: 0 }, 
          { name: "Red Pepper Hummus", calories: 40, price: 0 }, 
          { name: "Skhug", calories: 80, price: 0 }, 
          { name: "Tahini Caesar", calories: 90, price: 0 }
        ],
        side: [
          { name: "Free Side Pita", calories: 80, price: 1.95 },
          { name: "Hot Harissa Pita", calories: 270, price: 2.65 },
          { name: "Classic Pita Chips", calories: 270, price: 2.65 }, 
          { name: "Side Hummus", calories: 135, price: 3.45 },
          { name: "Side Tzatziki", calories: 105, price: 3.45 }
        ],
        drink: [
          { name: "Strawberry Citrus", calories: 190, price: 3.55 },
          { name: "Blueberry Lavender", calories: 190, price: 3.55 },
          { name: "Cucumber Mint Lime", calories: 240, price: 3.55 },
          { name: "Jasmine Green Tea", calories: 0, price: 3.55 }
        ]
      },
      rules: {
        minItems: 3,
        maxItems: 8,
        required: ["base", "protein", "topping", "side"], // Changed from "sides" to "side"
        maxToppings: 10,
        maxDressings: 5
      }
    }
  };
  
  module.exports = { byoTemplates };