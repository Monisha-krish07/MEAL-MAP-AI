import { foodData, FoodItem } from '../data/foodData';

export type Intent = 'SEARCH' | 'ORDER' | 'ADD_TO_CART' | 'FILTER' | 'UNKNOWN';

export interface UserPreferences {
  name: string;
  phone: string;
  deliveryAddress: string;
  upiId: string;
  foodType: 'Veg' | 'Non-Veg';
  nonVegDays?: string[];
  avoidNonVegDays?: string[];
}

export const processIntent = (text: string, preferences: UserPreferences): {
  intent: Intent;
  items: FoodItem[];
  message: string;
} => {
  const input = text.toLowerCase().trim();
  let intent: Intent = 'UNKNOWN';

  // 0. Irrelevant / alcohol queries
  const irrelevantKeywords = ['beer', 'wine', 'alcohol', 'liquor', 'vodka', 'whiskey', 'rum', 'tequila', 'gin', 'brandy', 'cocktail', 'smoke', 'cigarette'];
  if (irrelevantKeywords.some(w => input.includes(w))) {
    return {
      intent: 'UNKNOWN', items: [],
      message: "I'm a food ordering AI — I don't handle alcohol or non-food items. What food can I get you?",
    };
  }

  // 1. Determine if today is a restricted Veg Day
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const isVegDay = preferences.foodType === 'Veg' || (preferences.avoidNonVegDays?.includes(today) ?? false);

  // 2. Detection of explicit dietary preference in query
  const wantsVegExplicit = input.includes('veg') && !input.includes('non-veg') && !input.includes('nonveg');
  const wantsNonVegExplicit = input.includes('non-veg') || input.includes('nonveg') || input.includes('chicken') || input.includes('mutton') || input.includes('fish') || input.includes('egg') || input.includes('meat');

  // 3. Handle explicit Non-Veg request on a Veg Day
  if (wantsNonVegExplicit && isVegDay) {
    return {
      intent: 'FILTER',
      items: [],
      message: `I'm sorry, but today is a designated Veg Day for you. 🌿 Can I suggest some delicious vegetarian options instead?`
    };
  }

  // 4. Start filtering
  let filteredItems = [...foodData];

  // Apply general Veg Day restriction (if not implicitly handled already)
  if (isVegDay) {
    filteredItems = filteredItems.filter(item => item.isVeg);
  }

  // Apply explicit intent filters
  if (wantsVegExplicit) {
    filteredItems = filteredItems.filter(item => item.isVeg);
  } else if (wantsNonVegExplicit && !isVegDay) {
    filteredItems = filteredItems.filter(item => !item.isVeg);
  }

  // 5. Smart Biryani Logic
  const isBiryaniQuery = input.includes('biryani') || input.includes('biriyani');
  if (isBiryaniQuery) {
    intent = 'SEARCH';
    
    const hasVegExplicit = input.includes('veg');
    const hasMeatExplicit = input.includes('chicken') || input.includes('mutton');

    if (hasVegExplicit) {
      filteredItems = filteredItems.filter(item => (item.name.toLowerCase().includes('biryani') || item.name.toLowerCase().includes('biriyani')) && item.isVeg);
    } else if (hasMeatExplicit && !isVegDay) {
      filteredItems = filteredItems.filter(item => (item.name.toLowerCase().includes('biryani') || item.name.toLowerCase().includes('biriyani')) && !item.isVeg);
    } else {
      // Default "Biryani" behavior
      if (isVegDay) {
        filteredItems = filteredItems.filter(item => (item.name.toLowerCase().includes('biryani') || item.name.toLowerCase().includes('biriyani')) && item.isVeg);
      } else {
        // Show meat biryanis on non-veg days by default
        filteredItems = filteredItems.filter(item => (item.name.toLowerCase().includes('biryani') || item.name.toLowerCase().includes('biriyani')) && !item.isVeg);
      }
    }

    if (filteredItems.length > 0) {
      const msg = isVegDay ? `It's a veg day! Here's some delightful veg biryani 🌿` : 
                  wantsVegExplicit ? `Here are the veg biryanis you asked for!` :
                  `Found some aromatic non-veg biryanis for you! 🔥`;
      return { intent, items: filteredItems.slice(0, 6), message: msg };
    }
  }

  // 6. Keywords Search
  const stopWords = new Set(['the', 'for', 'and', 'with', 'some', 'want', 'show', 'get', 'me', 'can', 'you', 'please', 'order', 'need', 'have', 'give', 'items', 'dishes', 'foods']);
  const searchKeywords = input.split(' ').filter(w => w.length > 2 && !stopWords.has(w) && w !== 'veg' && w !== 'non-veg' && w !== 'nonveg');

  if (searchKeywords.length > 0) {
    let specific = filteredItems.filter(item =>
      searchKeywords.some(word => item.name.toLowerCase().includes(word) || item.description.toLowerCase().includes(word))
    );
    if (specific.length > 0) {
      filteredItems = specific;
      intent = 'SEARCH';
    }
  }

  // 7. Category Fallback
  const categories = ['breakfast', 'lunch', 'dinner', 'snacks', 'desserts'];
  const matchedCategory = categories.find(cat => input.includes(cat));
  if (matchedCategory && intent !== 'SEARCH') {
    filteredItems = filteredItems.filter(item => item.category.toLowerCase() === matchedCategory);
    intent = 'SEARCH';
  }

  // Final Response Building
  if (intent === 'SEARCH' || wantsVegExplicit || wantsNonVegExplicit) {
    if (filteredItems.length === 0) {
      return {
        intent: 'SEARCH', items: [],
        message: `I couldn't find any ${isVegDay ? 'veg ' : ''}items matching that. Want to try something else?`
      };
    }
    const names = filteredItems.slice(0, 2).map(i => i.name).join(' and ');
    return {
      intent: 'SEARCH',
      items: filteredItems.slice(0, 6),
      message: `I found ${names}${filteredItems.length > 2 ? ' and more' : ''} for you! 🛒`
    };
  }

  return {
    intent: 'UNKNOWN',
    items: [],
    message: `Hey ${preferences.name.split(' ')[0]}! How can I help you? Try "Veg Biryani" or "I want Chicken".`
  };
};
