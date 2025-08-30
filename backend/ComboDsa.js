const { byoTemplates } = require('./BYOTemplates');

class ComboDsa {
  constructor() {
    this.menuPatterns = {
      fast_food: [
        ['main', 'side', 'drink'],
        ['main', 'side'],
        ['main', 'drink'],
        ['main', 'side', 'dessert'],
        ['main', 'dessert'],
        ['main', 'sauce'],
        ['main', 'side', 'sauce'],
        ['main', 'sauce', 'drink'],
        ['main', 'main'],
        ['main'],
        ['drink']
      ]
    };
    this.previouslyGeneratedCombos = new Map(); 
    this.comboGenerationAttempts = new Map(); 
  }

  async generateCombos(restaurantName, menuItems, limits = {}) {
    const { targetCalories, comboCount = 3 } = limits;
    if (!targetCalories) {
      throw new Error('targetCalories must be provided');
    }
  
    if (menuItems.length === 0) return [];
  
    if (byoTemplates[restaurantName.toLowerCase()]) {
      return this.generateBYOCombos(restaurantName, { targetCalories, comboCount });
    }
  
    const restaurantItems = menuItems.filter(item => item.restaurant === restaurantName);
    
    const categoryMap = this.groupByCategory(restaurantItems);
    const combos = this.generateFastFoodCombos(restaurantName, categoryMap, { targetCalories, comboCount });
  
    return combos;
  }

  groupByCategory(menuItems) {
    const categoryMap = {};
    for (let i = 0; i < menuItems.length; i++) {
      const item = menuItems[i];
      const category = item.category || 'unknown';
      if (!categoryMap[category]) {
        categoryMap[category] = [];
      }
      
      const existingItem = categoryMap[category].find(existing => existing.name === item.name);
      if (!existingItem) {
        categoryMap[category].push({
          name: item.name,
          category: category,
          calories: item.calories || 0, 
          restaurant: item.restaurant 
        });
      }
    }
    return categoryMap;
  }

  removeDuplicateCombos(combos) {
    if (combos.length === 0) {
      return [];
    }
    const seenCombos = new Set();
    const uniqueCombos = [];

    for (let i = 0; i < combos.length; i++) {
      const combo = combos[i];
      const comboSignature = combo.items
        .map(item => `${item.name}|${item.category}`)
        .sort()
        .join('::');

      if (!seenCombos.has(comboSignature)) {
        seenCombos.add(comboSignature);
        uniqueCombos.push(combo);
      }
    }

    return uniqueCombos;
  }

  generateFastFoodCombos(restaurantName, categoryMap, limits) {
    const { targetCalories, comboCount = 5 } = limits;
    const allCombos = [];
    const patterns = this.menuPatterns.fast_food;
    const calorieLimit = targetCalories + 100;
    
    const cacheKey = `${restaurantName.toLowerCase()}_${targetCalories}`;
    const previousCombos = this.previouslyGeneratedCombos.get(cacheKey) || [];
    
    const filteredCategoryMap = {};
    Object.keys(categoryMap).forEach(category => {
      filteredCategoryMap[category] = categoryMap[category].filter(item => item.calories <= calorieLimit);
    });

    const availableItemsByCategory = {};
    Object.keys(filteredCategoryMap).forEach(category => {
      availableItemsByCategory[category] = [...filteredCategoryMap[category]];
    });

    const attemptKey = `${cacheKey}_a`;
    let generationAttempts = this.comboGenerationAttempts.get(attemptKey) || 0;
    generationAttempts++;
    this.comboGenerationAttempts.set(attemptKey, generationAttempts);

    let maxAttempts = 20;
    
    if (generationAttempts > 10) {
      maxAttempts = 10;
    }
    if (generationAttempts > 20) {
      maxAttempts = 5;
    }

    for (let i = 0; i < patterns.length; i++) {
      const pattern = patterns[i];
      let hasAllCategories = true;

      for (let j = 0; j < pattern.length; j++) {
        const category = pattern[j];
        if (!availableItemsByCategory[category] || availableItemsByCategory[category].length === 0) {
          hasAllCategories = false;
          break;
        }
      }

      if (!hasAllCategories) continue;

      for (let k = 0; k < maxAttempts; k++) {
        const comboItems = [];
        let isValid = true;
        
        const currentAvailableItems = {};
        Object.keys(availableItemsByCategory).forEach(category => {
          currentAvailableItems[category] = [...availableItemsByCategory[category]];
        });

        for (let l = 0; l < pattern.length; l++) {
          const category = pattern[l];
          const categoryItems = currentAvailableItems[category];
          
          if (categoryItems.length === 0) {
            isValid = false;
            break;
          }

          const currentCalories = comboItems.reduce((sum, item) => sum + item.calories, 0);
          const remainingCalories = calorieLimit - currentCalories;
          
          const affordableItems = categoryItems.filter(item => item.calories <= remainingCalories);
          
          if (affordableItems.length === 0) {
            isValid = false;
            break;
          }
          
          const randomIndex = Math.floor(Math.random() * affordableItems.length);
          const selectedItem = affordableItems[randomIndex];
          
          comboItems.push(selectedItem);
          
          const itemIndex = currentAvailableItems[category].findIndex(item => 
            item.name === selectedItem.name && item.calories === selectedItem.calories
          );
          if (itemIndex > -1) {
            currentAvailableItems[category].splice(itemIndex, 1);
          }
        }

        if (isValid && comboItems.length === pattern.length) {
          const totalCalories = comboItems.reduce((sum, item) => sum + item.calories, 0);
          
          if (totalCalories <= calorieLimit && totalCalories >= targetCalories * 0.7) {
            const newCombo = {
              items: comboItems.map(item => ({
                name: item.name,
                category: item.category,
                calories: item.calories
              })),
              totalCalories: totalCalories,
              itemCount: comboItems.length,
              calorieDifference: Math.abs(totalCalories - targetCalories)
            };
            
            allCombos.push(newCombo);
          }
        }
      }
    }

    const uniqueNewCombos = this.removeDuplicateCombos(allCombos);
    
    let finalCombos = [...uniqueNewCombos];
    
    if (finalCombos.length < comboCount && previousCombos.length > 0) {
      const unusedPreviousCombos = previousCombos.filter(prevCombo => 
        !finalCombos.some(newCombo => 
          newCombo.items.map(i => i.name).sort().join() === prevCombo.items.map(i => i.name).sort().join()
        )
      );
      
      unusedPreviousCombos.sort((a, b) => a.calorieDifference - b.calorieDifference);
      const neededCombos = comboCount - finalCombos.length;
      finalCombos = [...finalCombos, ...unusedPreviousCombos.slice(0, neededCombos)];
    }

    if (finalCombos.length < comboCount) {
      const fallbackCombos = this.generateFallbackCombos(filteredCategoryMap, targetCalories, comboCount - finalCombos.length);
      finalCombos = [...finalCombos, ...fallbackCombos];
    }

    if (uniqueNewCombos.length > 0) {
      const updatedPreviousCombos = [...previousCombos, ...uniqueNewCombos];
      if (updatedPreviousCombos.length > 20) {
        updatedPreviousCombos.splice(0, updatedPreviousCombos.length - 20);
      }
      this.previouslyGeneratedCombos.set(cacheKey, updatedPreviousCombos);
    }

    finalCombos.sort((a, b) => a.calorieDifference - b.calorieDifference);
    return finalCombos.slice(0, comboCount);
  }

  generateFallbackCombos(categoryMap, targetCalories, comboCount) {
    const fallbackCombos = [];
    const calorieLimit = targetCalories + 200;
    
   
    if (categoryMap.main && categoryMap.side) {
      for (let i = 0; i < Math.min(3, categoryMap.main.length); i++) {
        for (let j = 0; j < Math.min(3, categoryMap.side.length); j++) {
          const main = categoryMap.main[i];
          const side = categoryMap.side[j];
          const totalCalories = main.calories + side.calories;
          
          if (totalCalories <= calorieLimit) {
            fallbackCombos.push({
              items: [main, side],
              totalCalories: totalCalories,
              itemCount: 2,
              calorieDifference: Math.abs(totalCalories - targetCalories)
            });
            
            if (fallbackCombos.length >= comboCount * 2) break;
          }
        }
        if (fallbackCombos.length >= comboCount * 2) break;
      }
    }
    

    if (categoryMap.main && fallbackCombos.length < comboCount * 2) {
      for (let i = 0; i < Math.min(5, categoryMap.main.length); i++) {
        const main = categoryMap.main[i];
        if (main.calories <= calorieLimit) {
          fallbackCombos.push({
            items: [main],
            totalCalories: main.calories,
            itemCount: 1,
            calorieDifference: Math.abs(main.calories - targetCalories)
          });
          
          if (fallbackCombos.length >= comboCount * 2) break;
        }
      }
    }
    
    fallbackCombos.sort((a, b) => a.calorieDifference - b.calorieDifference);
    return this.removeDuplicateCombos(fallbackCombos).slice(0, comboCount);
  }

  generateBYOCombos(restaurantName, limits) {
    const { targetCalories, comboCount = 3 } = limits;
    const template = byoTemplates[restaurantName.toLowerCase()];
    if (!template) return [];


    const cacheKey = `byo_${restaurantName.toLowerCase()}_${targetCalories}`;
    const previousCombos = this.previouslyGeneratedCombos.get(cacheKey) || [];

    const allCombos = [];
    for (let i = 0; i < comboCount * 4; i++) {
      const combo = this.generateRandomBYOCombo(template, targetCalories);
      const actualCalories = combo.items.reduce((sum, item) => sum + item.calories, 0);
      
      if (actualCalories <= targetCalories + 100 && actualCalories >= targetCalories * 0.7) {
        combo.totalCalories = actualCalories;
        combo.calorieDifference = Math.abs(actualCalories - targetCalories);
        
      
        const comboSignature = combo.items.map(item => item.name).sort().join('::');
        const isUnique = !allCombos.some(existing => 
          existing.items.map(item => item.name).sort().join('::') === comboSignature
        );
        
        if (isUnique) {
          allCombos.push(combo);
        }
      }
    }

    let finalCombos = [...allCombos];
    if (finalCombos.length < comboCount && previousCombos.length > 0) {
      const unusedPrevious = previousCombos.filter(prev => 
        !finalCombos.some(newCombo => 
          newCombo.items.map(i => i.name).sort().join() === prev.items.map(i => i.name).sort().join()
        )
      );
      unusedPrevious.sort((a, b) => a.calorieDifference - b.calorieDifference);
      finalCombos = [...finalCombos, ...unusedPrevious.slice(0, comboCount - finalCombos.length)];
    }


    if (allCombos.length > 0) {
      const updatedPrevious = [...previousCombos, ...allCombos];
      if (updatedPrevious.length > 15) {
        updatedPrevious.splice(0, updatedPrevious.length - 15);
      }
      this.previouslyGeneratedCombos.set(cacheKey, updatedPrevious);
    }

    finalCombos.sort((a, b) => a.calorieDifference - b.calorieDifference);
    return finalCombos.slice(0, comboCount);
  }

  generateRandomBYOCombo(template, targetCalories) {
    const items = [];
    const calorieLimit = targetCalories + 100;


    if (template.categories.base && template.categories.base.length > 0) {
      const baseItems = template.categories.base;
      const randomBase = baseItems[Math.floor(Math.random() * baseItems.length)];
      items.push({...randomBase, category: 'base'});
    }


    if (template.categories.protein && template.categories.protein.length > 0) {
      const proteinItems = template.categories.protein;
      const randomProtein = proteinItems[Math.floor(Math.random() * proteinItems.length)];
      items.push({...randomProtein, category: 'protein'});
    }

    if (template.categories.topping && template.categories.topping.length > 0) {
      const toppingCount = Math.min(2, Math.floor(Math.random() * 3));
      const availableToppings = [...template.categories.topping];
      
      for (let i = 0; i < toppingCount && availableToppings.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * availableToppings.length);
        const topping = availableToppings[randomIndex];
        items.push({...topping, category: 'topping'});
        availableToppings.splice(randomIndex, 1);
      }
    }

   
    if (template.categories.dressing && template.categories.dressing.length > 0) {
      const addDressing = Math.random() > 0.5;
      if (addDressing) {
        const dressingItems = template.categories.dressing;
        const randomDressing = dressingItems[Math.floor(Math.random() * dressingItems.length)];
        items.push({...randomDressing, category: 'dressing'});
      }
    }

    const totalCalories = items.reduce((sum, item) => sum + item.calories, 0);
    return {
      items: items,
      totalCalories: totalCalories,
      itemCount: items.length
    };
  }

  getCategoryFromTemplate(itemName, template) {
    const categories = Object.keys(template.categories);
    
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      const items = template.categories[category];
      
      for (let j = 0; j < items.length; j++) {
        if (items[j].name === itemName) {
          return category;
        }
      }
    }
    
    return 'topping';
  }

  clearComboCache() {
    this.previouslyGeneratedCombos.clear();
    this.comboGenerationAttempts.clear();
  }
}

module.exports = new ComboDsa();