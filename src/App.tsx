import { useState } from 'react';
import { useProfile } from './hooks/useProfile';
import { ProfileOnboarding } from './components/ProfileOnboarding';
import { Home } from './components/Home';
import { VoiceAssistant } from './components/VoiceAssistant';
import { OrderSuccess } from './components/OrderSuccess';
import { FoodItem } from './data/foodData';
import { X, ChevronRight, ShoppingCart, Trash2, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const { profile, saveProfile, loading } = useProfile();
  const [showAssistant, setShowAssistant] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [cart, setCart] = useState<FoodItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font)' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
        🍽️
      </motion.div>
    </div>
  );

  if (!profile) {
    return (
      <div className="app-container">
        <ProfileOnboarding onComplete={saveProfile} />
      </div>
    );
  }

  const addToCart = (item: FoodItem) => setCart(prev => [...prev, item]);
  const removeFromCart = (idx: number) => setCart(prev => prev.filter((_, i) => i !== idx));
  const handleCheckout = () => { setShowCart(false); setShowOrderSuccess(true); setCart([]); };
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  const handleUpdateProfile = (data: any) => {
    saveProfile(data);
    setShowProfile(false);
  };

  return (
    <div className="app-container">
      <Home
        preferences={profile}
        onOpenAssistant={() => setShowAssistant(true)}
        onOpenProfile={() => setShowProfile(true)}
        onAddToCart={addToCart}
      />

      <AnimatePresence>
        {showAssistant && (
          <VoiceAssistant
            preferences={profile}
            onAddToCart={addToCart}
            onClose={() => setShowAssistant(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProfile && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 2000, maxWidth: 480, margin: '0 auto' }}>
            <ProfileOnboarding 
              initialData={profile} 
              onComplete={handleUpdateProfile} 
              onClose={() => setShowProfile(false)} 
            />
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showOrderSuccess && (
          <OrderSuccess
            address={profile.deliveryAddress}
            onDone={() => setShowOrderSuccess(false)}
          />
        )}
      </AnimatePresence>

      {/* Modern Cart Strip */}
      <AnimatePresence>
        {cart.length > 0 && !showAssistant && !showOrderSuccess && !showCart && !showProfile && (
          <motion.div 
            className="cart-strip"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
          >
            <motion.button 
              className="cart-bar" 
              onClick={() => setShowCart(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: 8 }}>{cart.length}</span>
                <span style={{ fontSize: '0.9rem' }}>{cart.length === 1 ? 'item' : 'items'} • ₹{totalPrice}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                VIEW CART <ChevronRight size={18} />
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Cart Screen/Drawer */}
      <AnimatePresence>
        {showCart && (
          <motion.div 
            className="cart-overlay" 
            onClick={() => setShowCart(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="cart-drawer glass" 
              onClick={e => e.stopPropagation()}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="cart-handle" />
              <div className="cart-header">
                <h2 className="cart-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <ShoppingCart size={22} className="text-primary" /> Your Basket
                </h2>
                <button
                  onClick={() => setShowCart(false)}
                  style={{ color: 'var(--text-soft)', padding: 8, background: 'var(--bg-elevated)', borderRadius: 12 }}
                >
                  <X size={22} />
                </button>
              </div>

              <div className="cart-items">
                {cart.map((item, idx) => (
                  <motion.div 
                    key={idx} 
                    className="cart-item"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className={`veg-indicator ${item.isVeg ? 'veg' : 'non-veg'}`}>
                        <div className="veg-dot" />
                      </div>
                      <span className="cart-item-name">{item.name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <span className="cart-item-price">₹{item.price}</span>
                      <button 
                        onClick={() => removeFromCart(idx)} 
                        style={{ color: 'var(--text-soft)' }}
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="cart-total" style={{ marginTop: 20, borderTop: '2px dashed var(--border)' }}>
                <span className="cart-total-label">Subtotal</span>
                <span className="cart-total-value">₹{totalPrice}</span>
              </div>
              
              <div style={{ marginBottom: 24, fontSize: '0.75rem', color: 'var(--text-soft)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Star size={12} fill="var(--rating)" color="var(--rating)" /> 
                Congrats! You've matched with the best flavors today. 😋
              </div>

              <motion.button 
                className="checkout-btn" 
                onClick={handleCheckout}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                PROCEED TO CHECKOUT 🎉
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
