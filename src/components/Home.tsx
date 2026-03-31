import React, { useState } from 'react';
import { FoodItem, foodData } from '../data/foodData';
import { UserPreferences } from '../utils/nlp';
import { 
  Search, 
  MapPin, 
  Mic, 
  Plus, 
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  preferences: UserPreferences;
  onOpenAssistant: () => void;
  onOpenProfile: () => void;
  onAddToCart: (item: FoodItem) => void;
}

const CATEGORIES = [
  { name: 'All', emoji: '🍽️' },
  { name: 'Breakfast', emoji: '🍳' },
  { name: 'Lunch', emoji: '🍱' },
  { name: 'Dinner', emoji: '🌙' },
  { name: 'Snacks', emoji: '🍔' },
  { name: 'Desserts', emoji: '🍦' },
];

const FoodCardItem: React.FC<{ item: FoodItem; onAdd: (item: FoodItem) => void }> = ({ item, onAdd }) => {
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAdd(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div 
      className="food-card"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="food-img-wrapper" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '160px', 
        background: 'linear-gradient(135deg, var(--primary-soft) 0%, rgba(255,200,150,0.1) 100%)', 
        borderRadius: '24px 24px 0 0', 
        position: 'relative', 
        overflow: 'hidden',
        fontSize: '4rem',
        userSelect: 'none'
      }}>
         <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.15))' }}
         >
           {item.emoji}
         </motion.span>
      </div>
      
      <div className="food-info">
        <div className="food-meta">
          <div className={`veg-indicator ${item.isVeg ? 'veg' : 'non-veg'}`}>
            <div className="veg-dot" />
          </div>
          <div className="rating-badge">
            <Star size={12} fill="currentColor" />
            <span>{item.rating}</span>
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-soft)' }}>• {item.deliveryTime}</span>
        </div>
        
        <h3 className="food-title">{item.name}</h3>
        <p className="food-description">{item.description}</p>
        
        <div className="food-footer">
          <span className="price-tag">₹{item.price}</span>
          <button 
            className={`add-button ${added ? 'added' : ''}`} 
            onClick={handleAdd}
            disabled={added}
          >
            {added ? 'ADDED' : <><Plus size={14} /> ADD</>}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export const Home: React.FC<Props> = ({ preferences, onOpenAssistant, onOpenProfile, onAddToCart }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = foodData
    .filter(item => activeCategory === 'All' || item.category === activeCategory)
    .filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    .filter(item => {
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      const isVegOnlyDay = (preferences.avoidNonVegDays || []).includes(today);
      if (isVegOnlyDay && !item.isVeg) return false;
      return true;
    });

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="header-top">
          <div className="location-chip" onClick={onOpenProfile}>
            <MapPin size={16} className="text-primary" />
            <span className="location-text">Deliver to: <strong>{preferences.deliveryAddress || 'Home'}</strong></span>
          </div>
          <div className="user-avatar" onClick={onOpenProfile}>
            {preferences.name.charAt(0)}
          </div>
        </div>
        
        <h1 className="home-greeting">What's on your <span className="text-primary">Meal Map</span> today?</h1>
        
        <div className="search-bar-wrapper">
          <div className="search-input-group">
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              placeholder="Search for dishes..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="voice-search-btn" onClick={onOpenAssistant}>
            <Mic size={20} color="white" />
          </button>
        </div>
      </header>
      
      <div className="category-scroll">
        {CATEGORIES.map(cat => (
          <button 
            key={cat.name}
            className={`cat-chip ${activeCategory === cat.name ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.name)}
          >
            <span className="cat-emoji">{cat.emoji}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>
      
      <main className="menu-section">
        <div className="section-header">
          <h2 className="section-title">Explore Dishes</h2>
          <span className="results-count">{filtered.length} items found</span>
        </div>
        
        <div className="food-grid">
          <AnimatePresence mode="popLayout">
            {filtered.map(item => (
              <FoodCardItem key={item.id} item={item} onAdd={onAddToCart} />
            ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};
