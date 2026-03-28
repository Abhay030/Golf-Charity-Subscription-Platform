import { motion } from 'framer-motion';

const EmptyState = ({ icon: Icon, title, description, action, actionLabel }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="premium-card"
    style={{ textAlign: 'center', padding: '64px 32px' }}
  >
    {Icon && (
      <div style={{
        width: '56px', height: '56px', borderRadius: '50%',
        background: 'rgba(90,138,110,0.08)', border: '1px solid rgba(29,74,50,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 16px',
      }}>
        <Icon style={{ color: '#5a8a6e' }} size={24} />
      </div>
    )}
    <h4 style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'Outfit', color: '#f0f7f4', marginBottom: '6px' }}>
      {title}
    </h4>
    <p style={{ fontSize: '14px', color: '#5a8a6e', lineHeight: 1.6, maxWidth: '360px', margin: '0 auto' }}>
      {description}
    </p>
    {action && (
      <button onClick={action} className="btn-primary" style={{ marginTop: '24px', padding: '10px 24px' }}>
        {actionLabel || 'Get Started'}
      </button>
    )}
  </motion.div>
);

export default EmptyState;
