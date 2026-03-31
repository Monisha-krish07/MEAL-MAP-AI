import React from 'react';
import { FoodItem } from '../data/foodData';

interface Props {
  item: FoodItem;
  onAdd: (item: FoodItem) => void;
}

export const FoodCard: React.FC<Props> = ({ item, onAdd }) => {
  return (
    <div style={{ 
      background: '#fff', borderRadius: '24px', overflow: 'hidden', 
      boxShadow: 'var(--shadow-subtle)', marginBottom: '1rem',
      display: 'flex', position: 'relative',
      minHeight: '140px',
      border: '1px solid var(--border)'
    }}>
      {/* Left: Info */}
      <div style={{ flex: 1, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <div style={{ 
            width: '14px', height: '14px', border: `1.5px solid ${item.isVeg ? '#60b246' : '#e63946'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '3px'
          }}>
            <div style={{ 
              width: '6px', height: '6px', backgroundColor: item.isVeg ? '#60b246' : '#e63946', borderRadius: '50%'
            }} />
          </div>
          {item.isNoOnionGarlic && (
            <span style={{ fontSize: '10px', color: '#6ab04c', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pure Veg</span>
          )}
        </div>
        
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>{item.name}</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-soft)', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {item.description}
        </p>
        
        <div style={{ marginTop: 'auto', fontWeight: 800, color: 'var(--text-main)', fontSize: '1rem' }}>
          ₹{item.price}
        </div>
      </div>
      
      {/* Right: Food Emoji Illustration */}
      <div style={{ width: '140px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div style={{ 
          width: '100px', height: '100px',
          background: 'linear-gradient(135deg, var(--primary-soft) 0%, rgba(255,200,150,0.25) 100%)',
          borderRadius: '24px', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          border: '1px solid var(--primary-glow)',
          fontSize: '3rem',
          userSelect: 'none',
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
        }}>
          {item.emoji}
        </div>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onAdd(item);
          }}
          style={{ 
            marginTop: '-12px',
            background: 'white', color: 'var(--primary)', fontWeight: 800, padding: '8px 24px',
            borderRadius: '12px', boxShadow: '0 4px 12px rgba(242, 140, 99, 0.2)', 
            border: '1px solid var(--primary-soft)',
            fontSize: '0.85rem', cursor: 'pointer',
            transition: 'all 0.2s',
            zIndex: 10
          }}
        >
          ADD
        </button>
      </div>
    </div>
  );
};
