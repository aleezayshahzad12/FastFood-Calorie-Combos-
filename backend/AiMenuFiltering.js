const OpenAI = require("openai");
const aiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 30000 });

const AiMenuFiltering = async (filteringItems, restaurantName) => {
  const preprocessedMenu = filteringItems.map(item => {
    const name = item.name.toLowerCase();
    let trainingAI = '';

    if (restaurantName.toLowerCase().includes('panda express')) {
      if (['orange chicken', 'beijing beef', 'kung pao', 'grilled', 'chicken', 'beef', 'shrimp', 'entree', 'broccoli'].some(p => name.includes(p))) trainingAI = 'entree';
      else if (['rice', 'noodle', 'chow mein', 'fried rice', 'white rice', 'brown rice', 'side', 'super greens'].some(s => name.includes(s))) trainingAI = 'side';
      else if (['soda', 'drink', 'tea', 'beverage', 'water', 'cola', 'pepsi', 'coke', 'spirit'].some(d => name.includes(d))) trainingAI = 'ignore';
      else trainingAI = 'entree';
    } else {
      if (['burger', 'chicken', 'nugget', 'sandwich', 'wrap', 'muffin', 'big breakfast', 'mc', 'taco', 'burrito', 'quesadilla'].some(p => name.includes(p))) trainingAI = 'main';
      else if (['fries', 'hash browns', 'apple slices', 'side'].some(s => name.includes(s))) trainingAI = 'side';
      else if (['soda', 'cola', 'pepsi', 'coke', 'sprite', 'americano', 'coffee', 'drink'].some(d => name.includes(d))) trainingAI = 'drink';
      else if (['cake', 'hotcakes', 'dessert', 'cookie', 'pie'].some(d => name.includes(d))) trainingAI = 'dessert';
      else if (['ketchup', 'sauce', 'mayo', 'honey', 'dressing'].some(s => name.includes(s))) trainingAI = 'sauce';
      else trainingAI = 'main';
    }

    return `- ${item.name} (${trainingAI})`;
  }).join('\n');

  let prompt = '';
  if (restaurantName.toLowerCase().includes('panda express')) {
    prompt = `
Classify these Panda Express menu items into categories: entree, side.
IGNORE all drinks and beverages - do not include them in the classification.
Return ONLY a JSON array with keys: name, category.

Menu items:
${preprocessedMenu}
`;
  } else {
    prompt = `
Classify these fast-food menu items from ${restaurantName} into categories: main, side, drink, dessert, sauce.
Return ONLY a JSON array with keys: name, category.

Menu items:
${preprocessedMenu}
`;
  }

  try {
    const response = await aiClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an expert in classifying fast-food restaurant menu items. Return ONLY valid JSON arrays, no additional text or markdown." },
        { role: "user", content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });

    const textResponse = response.choices[0].message.content;
    console.log('Raw AI response:', textResponse);

    let parsedResponse = [];
    try {
      parsedResponse = JSON.parse(textResponse);
      if (Array.isArray(parsedResponse)) {
      } else if (parsedResponse && Array.isArray(parsedResponse.menuItems)) {
        parsedResponse = parsedResponse.menuItems;
      } else if (parsedResponse && Array.isArray(parsedResponse.items)) {
        parsedResponse = parsedResponse.items;
      }
      else {
        console.error('AI response is not in expected format:', parsedResponse);
        return [];
      }
    } catch (err) {
      const match = textResponse.match(/\[[\s\S]*\]/);
      if (match) {
        try {
          parsedResponse = JSON.parse(match[0]);
          if (Array.isArray(parsedResponse)) {
          } else if (parsedResponse && Array.isArray(parsedResponse.items)) {
            parsedResponse = parsedResponse.items;
          } else {
            console.error('Recovered AI response is not in expected format:', parsedResponse);
            return [];
          }

        } catch {
          console.error('AI response not valid JSON even after recovery.');
          return [];
        }
      } else {
        console.error('AI response not valid JSON.');
        return [];
      }
    }

    if (!Array.isArray(parsedResponse)) {
      console.error('AI response is not an array:', parsedResponse);
      return [];
    }

    // Filter valid items
    let filtered = parsedResponse.filter(item => item && item.name && item.category);

    // Remove Panda Express "ignore" and "drink" items
    if (restaurantName.toLowerCase().includes('panda express')) {
      filtered = filtered.filter(item => item.category !== 'ignore' && item.category !== 'drink');
    }

    console.log('Filtered result:', filtered);
    return filtered;

  } catch (err) {
    console.error('items not labeled correctly by ai', err.message);
    return [];
  }
};

module.exports = AiMenuFiltering;
