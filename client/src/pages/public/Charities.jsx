import { useState, useEffect } from 'react';
import { getCharities } from '../../services/api';
import { motion } from 'framer-motion';
import { HiSearch, HiHeart } from 'react-icons/hi';

const Charities = () => {
  const [charities, setCharities] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadCharities(); }, [search, category]);

  const loadCharities = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      const { data } = await getCharities(params);
      setCharities(data.charities || []);
    } catch { /* */ } finally { setLoading(false); }
  };

  const categories = ['Youth Development', 'Environment', 'Healthcare', 'Sports', 'Education'];

  return (
    <div style={{ minHeight: '100vh', paddingTop: '96px', paddingBottom: '64px' }}>
      <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-header">
          <h2>Our <span className="gradient-text">Charities</span></h2>
          <p>Every subscriber contributes to these amazing organizations. Choose yours when you sign up.</p>
        </motion.div>

        {/* Filters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
          <div style={{ position: 'relative' }}>
            <HiSearch style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#5a8a6e' }} size={18} />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search charities..." className="form-input form-input-icon" />
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={() => setCategory('')}
              style={{
                padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', border: 'none',
                ...((!category) ? { background: '#c9a84c', color: '#0b1a14' } : { background: '#0f2a1e', color: '#8cc5a2', border: '1px solid #1d4a32' })
              }}>All</button>
            {categories.map((cat) => (
              <button key={cat} onClick={() => setCategory(cat)}
                style={{
                  padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', border: 'none',
                  ...((category === cat) ? { background: '#c9a84c', color: '#0b1a14' } : { background: '#0f2a1e', color: '#8cc5a2', border: '1px solid #1d4a32' })
                }}>{cat}</button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <div style={{ width: '32px', height: '32px', border: '2px solid #c9a84c', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          </div>
        ) : charities.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <HiHeart style={{ color: '#5a8a6e', marginBottom: '16px' }} size={48} />
            <p style={{ color: '#5a8a6e' }}>No charities found</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {charities.map((charity, i) => (
              <motion.div key={charity._id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="premium-card" style={{ overflow: 'hidden' }}>
                <div style={{ height: '200px', overflow: 'hidden' }}>
                  <img src={charity.image || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400'} alt={charity.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} />
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#c9a84c', letterSpacing: '0.05em' }}>{charity.category}</span>
                    {charity.featured && <span className="badge badge-warning">Featured</span>}
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Outfit', color: '#f0f7f4', marginTop: '8px', marginBottom: '8px' }}>{charity.name}</h3>
                  <p style={{ fontSize: '14px', color: '#5a8a6e', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{charity.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Charities;
