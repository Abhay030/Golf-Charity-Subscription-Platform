import { motion } from 'framer-motion';

const Loader = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minHeight: '100vh', background: '#0b1a14',
  }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      {/* Animated logo */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: '56px', height: '56px', borderRadius: '14px',
          background: 'linear-gradient(135deg, #c9a84c, #a88a3a)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 40px rgba(201,168,76,0.2)',
        }}
      >
        <span style={{ color: '#0b1a14', fontWeight: 800, fontSize: '18px', fontFamily: 'Outfit' }}>DH</span>
      </motion.div>

      {/* Spinner ring */}
      <div style={{ position: 'relative', width: '32px', height: '32px' }}>
        <div style={{
          width: '100%', height: '100%',
          border: '2px solid rgba(29,74,50,0.5)',
          borderTopColor: '#c9a84c',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
      </div>

      <p style={{ fontSize: '13px', color: '#5a8a6e', fontWeight: 500, letterSpacing: '0.04em' }}>Loading...</p>
    </div>
  </div>
);

export default Loader;
