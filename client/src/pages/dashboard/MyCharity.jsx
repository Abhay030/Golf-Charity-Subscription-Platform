import { useState, useEffect } from 'react';
import { getCharities, updateCharity } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { HiHeart, HiCheck } from 'react-icons/hi';
import PageTransition from '../../components/common/PageTransition';
import { SkeletonCard } from '../../components/common/Skeleton';

const MyCharity = () => {
  const { user, updateUser } = useAuth();
  const [charities, setCharities] = useState([]);
  const [selected, setSelected] = useState(user?.selectedCharity?._id || user?.selectedCharity || '');
  const [percentage, setPercentage] = useState(user?.charityPercentage || 10);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getCharities();
        setCharities(data.charities || []);
      } catch { /* */ } finally { setLoading(false); }
    };
    load();
  }, []);

  const handleSelect = async (id) => {
    // Optimistic selection
    const prev = selected;
    setSelected(id);
    try {
      const { data } = await updateCharity({ selectedCharity: id, charityPercentage: percentage });
      updateUser(data.user);
      toast.success('Charity selected');
    } catch (err) {
      setSelected(prev);
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handlePercentage = async (val) => {
    setPercentage(val);
    setSaving(true);
    try {
      const { data } = await updateCharity({ selectedCharity: selected, charityPercentage: val });
      updateUser(data.user);
    } catch { /* silently fail */ } finally {
      setSaving(false);
    }
  };

  const selectedCharity = charities.find(c => c._id === selected);

  return (
    <PageTransition>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'Outfit', color: '#f0f7f4', marginBottom: '8px' }}>My Charity</h1>
        <p style={{ fontSize: '14px', color: '#5a8a6e', marginBottom: '32px' }}>Choose a charity and set your contribution percentage</p>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <SkeletonCard height="100px" />
            <SkeletonCard height="80px" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {Array.from({ length: 4 }, (_, i) => <SkeletonCard key={i} height="70px" />)}
            </div>
          </div>
        ) : (
          <>
            {/* Current selection */}
            {selectedCharity && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                className="premium-card animate-gradient-border" style={{ padding: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}
              >
                <img src={selectedCharity.image || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=100'} alt={selectedCharity.name}
                  style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover', flexShrink: 0 }} />
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#c9a84c', letterSpacing: '0.05em' }}>{selectedCharity.category}</span>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'Outfit', color: '#f0f7f4', marginTop: '2px' }}>{selectedCharity.name}</h3>
                  <p style={{ fontSize: '13px', color: '#5a8a6e', marginTop: '4px', lineHeight: 1.5 }}>{selectedCharity.description}</p>
                </div>
              </motion.div>
            )}

            {/* Contribution slider */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
              className="premium-card" style={{ padding: '20px', marginBottom: '24px' }}
            >
              <p style={{ fontSize: '11px', fontWeight: 600, color: '#5a8a6e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Contribution Percentage</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <input type="range" min="10" max="100" value={percentage}
                  onChange={(e) => handlePercentage(Number(e.target.value))}
                  style={{ flex: 1, accentColor: '#c9a84c' }} />
                <motion.span
                  key={percentage}
                  initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                  className="gradient-text" style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Outfit', minWidth: '64px', textAlign: 'right' }}
                >
                  {percentage}%
                </motion.span>
              </div>
              <p style={{ fontSize: '12px', color: '#5a8a6e', marginTop: '8px' }}>
                Minimum contribution is 10% of your subscription fee
                {saving && <span style={{ marginLeft: '8px', color: '#c9a84c' }}>Saving...</span>}
              </p>
            </motion.div>

            {/* Charity grid */}
            <div>
              <p style={{ fontSize: '11px', fontWeight: 600, color: '#5a8a6e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Select a Charity</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                {charities.map((charity, i) => {
                  const isSelected = selected === charity._id;
                  return (
                    <motion.button
                      key={charity._id}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelect(charity._id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '14px', padding: '14px',
                        borderRadius: '14px', cursor: 'pointer', textAlign: 'left', width: '100%',
                        background: isSelected ? 'rgba(201,168,76,0.06)' : 'linear-gradient(145deg, rgba(15,42,30,0.95), rgba(10,59,32,0.7))',
                        border: isSelected ? '1.5px solid rgba(201,168,76,0.5)' : '1px solid rgba(29,74,50,0.5)',
                        transition: 'border-color 0.2s, background 0.2s',
                      }}
                    >
                      <img src={charity.image || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=80'} alt={charity.name}
                        style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#f0f7f4' }}>{charity.name}</p>
                        <p style={{ fontSize: '12px', color: '#5a8a6e' }}>{charity.category}</p>
                      </div>
                      {isSelected && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                          style={{
                            width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                            background: 'linear-gradient(135deg, #c9a84c, #a88a3a)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          <HiCheck style={{ color: '#0b1a14' }} size={14} />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </PageTransition>
  );
};

export default MyCharity;
