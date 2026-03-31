export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  emoji: string;
  category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks' | 'Desserts';
  isVeg: boolean;
  isNoOnionGarlic?: boolean;
  rating: number;
  deliveryTime: string;
}

export const foodData: FoodItem[] = [
  // Breakfast
  { id: 'br1', name: 'Idli', description: 'Soft and fluffy steamed rice cakes served with coconut chutney and tangy sambar', price: 60, emoji: '🍚', category: 'Breakfast', isVeg: true, rating: 4.5, deliveryTime: '20-25 mins' },
  { id: 'br2', name: 'Dosa', description: 'Crispy, golden-brown rice crepe served with an array of traditional chutneys', price: 80, emoji: '🥞', category: 'Breakfast', isVeg: true, rating: 4.6, deliveryTime: '25-30 mins' },
  { id: 'br3', name: 'Masala Dosa', description: 'Crispy rice crepe filled with a delicious, spiced potato masala', price: 120, emoji: '🌮', category: 'Breakfast', isVeg: true, rating: 4.7, deliveryTime: '25-30 mins' },
  { id: 'br4', name: 'Pongal', description: 'Comforting savory rice and lentil porridge tempered with ghee, ginger, and black pepper', price: 90, emoji: '🍲', category: 'Breakfast', isVeg: true, rating: 4.4, deliveryTime: '20-25 mins' },
  { id: 'br5', name: 'Poori Masala', description: 'Fluffy, deep-fried whole wheat bread served with a spiced potato curry', price: 100, emoji: '🥘', category: 'Breakfast', isVeg: true, rating: 4.5, deliveryTime: '25-30 mins' },
  { id: 'br6', name: 'Poori', description: 'Two pieces of golden, puffy deep-fried whole wheat bread', price: 80, emoji: '🥙', category: 'Breakfast', isVeg: true, rating: 4.3, deliveryTime: '25-30 mins' },
  { id: 'br7', name: 'Chapati', description: 'Two soft and healthy handmade whole wheat flatbreads', price: 60, emoji: '🌯', category: 'Breakfast', isVeg: true, rating: 4.4, deliveryTime: '20-25 mins' },
  { id: 'br8', name: 'Parotta with Salna', description: 'Flaky, layered Malabar parotta served with a spicy, aromatic veg gravy', price: 130, emoji: '🍛', category: 'Breakfast', isVeg: true, rating: 4.6, deliveryTime: '30-35 mins' },

  // Lunch
  { id: 'ln1', name: 'Veg Meals', description: 'Complete South Indian meal with rice, sambar, rasam, kootu, poriyal, and appalam', price: 180, emoji: '🍱', category: 'Lunch', isVeg: true, rating: 4.5, deliveryTime: '35-40 mins' },
  { id: 'ln2', name: 'Curd Rice', description: 'Cooling rice mixed with fresh yogurt and tempered with ginger, mustard, and curry leaves', price: 110, emoji: '🍚', category: 'Lunch', isVeg: true, rating: 4.4, deliveryTime: '20-25 mins' },
  { id: 'ln3', name: 'Sambar Rice', description: 'Warm rice cooked with lentils, mixed vegetables, and a signature spice blend', price: 120, emoji: '🍲', category: 'Lunch', isVeg: true, rating: 4.5, deliveryTime: '25-30 mins' },
  { id: 'ln4', name: 'Lemon Rice', description: 'Refreshing tangy rice flavored with lemon juice, turmeric, and crunchy peanuts', price: 110, emoji: '🍋', category: 'Lunch', isVeg: true, rating: 4.3, deliveryTime: '20-25 mins' },
  { id: 'ln5', name: 'Tomato Rice', description: 'Spicy rice preparation cooked with fresh tomatoes, onion, and herbs', price: 110, emoji: '🍅', category: 'Lunch', isVeg: true, rating: 4.4, deliveryTime: '20-25 mins' },
  { id: 'ln6', name: 'Fish Curry Meals', description: 'Steaming hot rice served with traditional, spicy, and tangy fish curry', price: 280, emoji: '🐟', category: 'Lunch', isVeg: false, rating: 4.7, deliveryTime: '40-45 mins' },
  { id: 'ln7', name: 'Paneer Butter Masala', description: 'Soft paneer cubes in a rich, velvety tomato and cream-based curry', price: 260, emoji: '🧀', category: 'Lunch', isVeg: true, rating: 4.6, deliveryTime: '35-40 mins' },
  { id: 'ln8', name: 'Egg Curry', description: 'Boiled eggs simmered in a spiced onion-tomato gravy with Indian herbs', price: 180, emoji: '🥚', category: 'Lunch', isVeg: false, rating: 4.5, deliveryTime: '30-35 mins' },

  // Dinner / Specialty
  { id: 'dn1', name: 'Chicken Biryani', description: 'Long-grain basmati rice cooked on dum with succulent, marinated chicken and spices', price: 320, emoji: '🍗', category: 'Dinner', isVeg: false, rating: 4.8, deliveryTime: '45-50 mins' },
  { id: 'dn2', name: 'Mutton Biryani', description: 'Aromatic basmati rice cooked with tender pieces of mutton and a signature spice blend', price: 420, emoji: '🥩', category: 'Dinner', isVeg: false, rating: 4.7, deliveryTime: '50-55 mins' },
  { id: 'dn3', name: 'Veg Biryani', description: 'Fragrant basmati rice cooked with a variety of fresh seasonal vegetables and dum spices', price: 260, emoji: '🌿', category: 'Dinner', isVeg: true, isNoOnionGarlic: true, rating: 4.6, deliveryTime: '40-45 mins' },
  { id: 'dn4', name: 'Chicken Fried Rice', description: 'Indo-Chinese style rice tossed with tender chicken, egg, and fresh spring vegetables', price: 240, emoji: '🍳', category: 'Dinner', isVeg: false, rating: 4.5, deliveryTime: '35-40 mins' },
  { id: 'dn5', name: 'Egg Fried Rice', description: 'Fluffy rice stir-fried with scrambled egg, crisp veggies, and soy sauce', price: 210, emoji: '🍳', category: 'Dinner', isVeg: false, rating: 4.4, deliveryTime: '35-40 mins' },
  { id: 'dn6', name: 'Veg Noodles', description: 'Sautéed noodles tossed with crisp vegetables and a blend of Asian sauces', price: 180, emoji: '🍜', category: 'Dinner', isVeg: true, rating: 4.4, deliveryTime: '30-35 mins' },
  { id: 'dn7', name: 'Chicken Noodles', description: 'Wholesome stir-fried noodles with spiced chicken strips and spring onions', price: 230, emoji: '🍝', category: 'Dinner', isVeg: false, rating: 4.5, deliveryTime: '35-40 mins' },
  { id: 'dn8', name: 'Gobi Manchurian', description: 'Crispy-fried cauliflower florets tossed in a spicy, tangy Indo-Chinese Manchurian sauce', price: 170, emoji: '🥦', category: 'Dinner', isVeg: true, rating: 4.6, deliveryTime: '30-35 mins' },
  { id: 'dn9', name: 'Chicken 65', description: 'Classic spicy and deep-fried South Indian chicken appetizer with a curry leaf tempering', price: 220, emoji: '🍖', category: 'Dinner', isVeg: false, rating: 4.7, deliveryTime: '30-35 mins' },
  { id: 'dn10', name: 'Grilled Chicken', description: 'Juicy, marinated chicken perfectly grilled to lock in flavors and moisture', price: 350, emoji: '🍗', category: 'Dinner', isVeg: false, rating: 4.8, deliveryTime: '40-45 mins' },
  { id: 'dn11', name: 'Fish Fry', description: 'Marinated fish pieces shallow fried with a spicy masala crust', price: 260, emoji: '🐠', category: 'Dinner', isVeg: false, rating: 4.7, deliveryTime: '35-40 mins' },

  // Snacks / Fast Food
  { id: 'sn1', name: 'Burger', description: 'Juicy vegetable patty served with fresh lettuce, tomato, and cheese in a soft bun', price: 150, emoji: '🍔', category: 'Snacks', isVeg: true, rating: 4.5, deliveryTime: '25-30 mins' },
  { id: 'sn2', name: 'Pizza', description: 'Traditional thin-crust pizza topped with rich tomato sauce and fresh mozzarella', price: 350, emoji: '🍕', category: 'Snacks', isVeg: true, rating: 4.6, deliveryTime: '35-40 mins' },
  { id: 'sn3', name: 'French Fries', description: 'Crispy and golden deep-fried potato sticks salted to perfection', price: 120, emoji: '🍟', category: 'Snacks', isVeg: true, rating: 4.4, deliveryTime: '20-25 mins' },

  // Desserts
  { id: 'ds1', name: 'Ice Cream', description: 'Two scoops of creamy vanilla or chocolate ice cream served cold', price: 90, emoji: '🍦', category: 'Desserts', isVeg: true, rating: 4.7, deliveryTime: '15-20 mins' },
  { id: 'ds2', name: 'Gulab Jamun', description: 'Traditional Indian sweet: two soft dumplings soaked in warm cardamom syrup', price: 70, emoji: '🍮', category: 'Desserts', isVeg: true, rating: 4.6, deliveryTime: '15-20 mins' }
];
