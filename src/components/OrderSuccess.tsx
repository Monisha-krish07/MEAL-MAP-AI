import { CheckCircle, MapPin, Truck } from 'lucide-react';

interface Props {
  address: string;
  onDone: () => void;
}

export const OrderSuccess = ({ address, onDone }: Props) => {
  return (
    <div style={{ 
      position: 'fixed', inset: 0, background: '#fff', zIndex: 2000,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', textAlign: 'center'
    }}>
      <div style={{ 
        width: '80px', height: '80px', borderRadius: '50%', background: '#f6ffed',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem',
        color: 'var(--success)', border: '2px solid #b7eb8f'
      }}>
        <CheckCircle size={48} />
      </div>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Order Placed!</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Yummy food is on its way to your location
      </p>

      <div style={{ 
        width: '100%', background: '#f8f9fb', borderRadius: '16px', padding: '1.5rem',
        marginBottom: '2rem', textAlign: 'left'
      }}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem' }}>
          <Truck size={20} color="var(--primary)" />
          <div>
            <h4 style={{ fontSize: '0.9rem' }}>Restaurant Assigned</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Spice Kitchen - 2.5km away</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <MapPin size={20} color="var(--primary)" />
          <div>
            <h4 style={{ fontSize: '0.9rem' }}>Delivery to</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{address}</p>
          </div>
        </div>
      </div>

      <button 
        onClick={onDone}
        style={{ 
          width: '100%', padding: '1rem', borderRadius: '8px', background: 'var(--primary)', 
          color: '#fff', fontWeight: 700, fontSize: '1rem'
        }}
      >
        Track Order
      </button>
    </div>
  );
};
