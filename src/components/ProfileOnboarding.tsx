import React, { useState } from 'react';
import { UserPreferences } from '../utils/nlp';
import { ChefHat, MapPin, ChevronRight, X, User, Phone, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onComplete: (data: UserPreferences) => void;
  onClose?: () => void;
  initialData?: UserPreferences | null;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const ProfileOnboarding: React.FC<Props> = ({ onComplete, onClose, initialData }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<UserPreferences>({
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    deliveryAddress: initialData?.deliveryAddress || '',
    upiId: initialData?.upiId || '',
    foodType: initialData?.foodType || 'Veg',
    nonVegDays: initialData?.nonVegDays || [],
    avoidNonVegDays: initialData?.avoidNonVegDays || []
  });

  const isEditing = !!initialData;

  const handleNext = () => {
    if (step === 1 && formData.name && formData.phone && formData.deliveryAddress && formData.upiId) {
      setStep(2);
    } else if (step === 2) {
      if (formData.foodType === 'Veg') {
        onComplete(formData);
      } else {
        setStep(3);
      }
    } else if (step === 3) {
      onComplete(formData);
    }
  };

  const toggleDay = (day: string, field: 'nonVegDays' | 'avoidNonVegDays') => {
    const current = formData[field] || [];
    const updated = current.includes(day) 
      ? current.filter(d => d !== day)
      : [...current, day];
    setFormData({ ...formData, [field]: updated });
  };

  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <motion.div 
      className="onboarding-container" 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      style={{ 
        padding: '2.5rem 1.5rem', 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        background: 'var(--bg)',
        zIndex: 2000,
        position: 'relative',
        overflowY: 'auto'
      }}
    >
      {onClose && (
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: 20, right: 20, color: 'var(--text-soft)', padding: 8, background: 'var(--bg-elevated)', borderRadius: '12px' }}
        >
          <X size={24} />
        </button>
      )}

      <div style={{ textAlign: 'center', marginBottom: '2.5rem', marginTop: onClose ? '1rem' : '0' }}>
        <div style={{ 
          width: 72, height: 72, borderRadius: 24, background: 'var(--primary)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem',
          boxShadow: '0 12px 24px var(--primary-glow)' 
        }}>
          <ChefHat size={36} color="white" />
        </div>
        <h1 style={{ fontSize: '1.7rem', fontWeight: 800, marginBottom: '0.4rem', letterSpacing: '-0.5px' }}>
          {isEditing ? 'Profile Settings' : 'Create your Profile'}
        </h1>
        <p style={{ color: 'var(--text-soft)', fontSize: '0.85rem' }}>Set up your ordering details below</p>
      </div>

      <div style={{ flex: 1 }}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: 16, top: 16, color: 'var(--primary)' }} />
                  <input 
                    type="text" 
                    placeholder="e.g. Monisha"
                    className="search-input"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    style={{ background: 'var(--bg-card)', paddingLeft: 48 }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} style={{ position: 'absolute', left: 16, top: 16, color: 'var(--primary)' }} />
                  <input 
                    type="tel" 
                    placeholder="+91 98765 43210"
                    className="search-input"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    style={{ background: 'var(--bg-card)', paddingLeft: 48 }}
                  />
                </div>
              </div>
              
              <div style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Delivery Location</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={18} style={{ position: 'absolute', left: 16, top: 16, color: 'var(--primary)' }} />
                  <input 
                    type="text" 
                    placeholder="Enter your full address"
                    className="search-input"
                    value={formData.deliveryAddress}
                    onChange={e => setFormData({ ...formData, deliveryAddress: e.target.value })}
                    style={{ background: 'var(--bg-card)', paddingLeft: 48 }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>UPI ID for Payments</label>
                <div style={{ position: 'relative' }}>
                  <Wallet size={18} style={{ position: 'absolute', left: 16, top: 16, color: 'var(--primary)' }} />
                  <input 
                    type="text" 
                    placeholder="e.g. name@upi"
                    className="search-input"
                    value={formData.upiId}
                    onChange={e => setFormData({ ...formData, upiId: e.target.value })}
                    style={{ background: 'var(--bg-card)', paddingLeft: 48 }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 700 }}>Choose your default diet</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFormData({ ...formData, foodType: 'Veg' })}
                  style={{ 
                    padding: '1.5rem', borderRadius: '24px', 
                    background: formData.foodType === 'Veg' ? 'var(--primary)' : 'var(--bg-card)',
                    border: `1px solid ${formData.foodType === 'Veg' ? 'var(--primary)' : 'var(--border)'}`,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem',
                    boxShadow: formData.foodType === 'Veg' ? '0 12px 24px var(--primary-glow)' : 'none'
                  }}
                >
                  <span style={{ fontSize: '2rem' }}>🌿</span>
                  <span style={{ fontWeight: 700, color: formData.foodType === 'Veg' ? 'white' : 'var(--text)' }}>PURE VEG</span>
                </motion.button>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFormData({ ...formData, foodType: 'Non-Veg' })}
                  style={{ 
                    padding: '1.5rem', borderRadius: '24px', 
                    background: formData.foodType === 'Non-Veg' ? 'var(--primary)' : 'var(--bg-card)',
                    border: `1px solid ${formData.foodType === 'Non-Veg' ? 'var(--primary)' : 'var(--border)'}`,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem',
                    boxShadow: formData.foodType === 'Non-Veg' ? '0 12px 24px var(--primary-glow)' : 'none'
                  }}
                >
                  <span style={{ fontSize: '2rem' }}>🍖</span>
                  <span style={{ fontWeight: 700, color: formData.foodType === 'Non-Veg' ? 'white' : 'var(--text)' }}>NON-VEG</span>
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 style={{ marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 700 }}>Choose your "Veg Days"</h2>
              <p style={{ color: 'var(--text-soft)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>Select the days you prefer to avoid non-veg</p>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '2rem' }}>
                {DAYS.map(day => (
                  <motion.button 
                    key={day}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleDay(day, 'avoidNonVegDays')}
                    style={{ 
                      padding: '10px 18px', borderRadius: '16px', 
                      background: formData.avoidNonVegDays?.includes(day) ? 'var(--primary)' : 'var(--bg-elevated)',
                      border: `1px solid ${formData.avoidNonVegDays?.includes(day) ? 'var(--primary)' : 'var(--border)'}`,
                      color: formData.avoidNonVegDays?.includes(day) ? 'white' : 'var(--text)',
                      fontWeight: 600,
                      fontSize: '0.85rem'
                    }}
                  >
                    {day}
                    {day === currentDay && <span style={{ marginLeft: 6, opacity: 0.8, fontSize: '0.7rem' }}>• Today</span>}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.button 
        className="checkout-btn"
        onClick={handleNext}
        disabled={step === 1 && (!formData.name || !formData.phone || !formData.deliveryAddress || !formData.upiId)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{ marginTop: '1.5rem', flexShrink: 0 }}
      >
        {step === 3 || (step === 2 && formData.foodType === 'Veg') ? (isEditing ? 'Save Changes' : 'Confirm & Enjoy') : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>Next <ChevronRight size={18} /></div>}
      </motion.button>
    </motion.div>
  );
};
