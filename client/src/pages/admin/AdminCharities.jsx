import { useState, useEffect } from 'react';
import { getCharities, adminCreateCharity, adminUpdateCharity, adminDeleteCharity } from '../../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlus, HiPencil, HiTrash, HiX } from 'react-icons/hi';
import PageTransition from '../../components/common/PageTransition';
import { SkeletonCard } from '../../components/common/Skeleton';

const AdminCharities = () => {
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', image: '', category: '', featured: false });

  useEffect(() => { loadCharities(); }, []);

  const loadCharities = async () => {
    try { const { data } = await getCharities(); setCharities(data.charities || []); }
    catch { /* */ } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) { await adminUpdateCharity(editId, form); toast.success('Updated'); }
      else { await adminCreateCharity(form); toast.success('Created'); }
      setShowForm(false); setEditId(null);
      setForm({ name: '', description: '', image: '', category: '', featured: false });
      loadCharities();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id) => {
    // Optimistic delete
    const prev = [...charities];
    setCharities(cs => cs.filter(c => c._id !== id));
    try { await adminDeleteCharity(id); toast.success('Deleted'); }
    catch (err) { setCharities(prev); toast.error(err.response?.data?.message || 'Failed'); }
  };

  return (
    <PageTransition><div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'Outfit', color: '#f0f7f4' }}>Charity Management</h1>
          <p style={{ fontSize: '14px', color: '#5a8a6e', marginTop: '4px' }}>Add, edit, and manage charities</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm({ name: '', description: '', image: '', category: '', featured: false }); }}
          className="btn-primary" style={{ padding: '10px 20px' }}>
          <HiPlus size={16} /> Add Charity
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', padding: '16px' }}
            onClick={() => setShowForm(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
              className="premium-card" style={{ padding: '32px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}
              onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Outfit', color: '#f0f7f4' }}>{editId ? 'Edit' : 'New'} Charity</h3>
                <button onClick={() => setShowForm(false)} style={{ color: '#5a8a6e', background: 'none', border: 'none', cursor: 'pointer' }}><HiX size={20} /></button>
              </div>
              {form.image && (
                <img src={form.image} alt="Preview" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '10px', marginBottom: '16px', border: '1px solid #1d4a32' }} />
              )}
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '16px' }}><label className="form-label">Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="form-input" /></div>
                <div style={{ marginBottom: '16px' }}><label className="form-label">Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} required className="form-input" style={{ resize: 'none', minHeight: '80px' }} /></div>
                <div style={{ marginBottom: '16px' }}><label className="form-label">Image URL</label><input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="form-input" placeholder="https://..." /></div>
                <div style={{ marginBottom: '16px' }}><label className="form-label">Category</label><input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="form-input" /></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                  <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} style={{ accentColor: '#c9a84c' }} />
                  <label style={{ fontSize: '14px', color: '#8cc5a2' }}>Featured</label>
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px' }}>{editId ? 'Update' : 'Create'}</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px,1fr))', gap: '16px' }}>
          {[0,1,2].map(i => <SkeletonCard key={i} height="260px" />)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px,1fr))', gap: '16px' }}>
          <AnimatePresence>
            {charities.map(c => (
              <motion.div key={c._id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                className="premium-card" style={{ overflow: 'hidden' }}>
                {c.image && <img src={c.image} alt={c.name} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />}
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#c9a84c', letterSpacing: '0.05em' }}>{c.category}</span>
                      <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#f0f7f4', marginTop: '4px' }}>{c.name}</h4>
                    </div>
                    {c.featured && <span className="badge badge-warning">Featured</span>}
                  </div>
                  <p style={{ fontSize: '12px', color: '#5a8a6e', lineHeight: 1.6, marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{c.description}</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => { setEditId(c._id); setForm({ name: c.name, description: c.description, image: c.image, category: c.category, featured: c.featured }); setShowForm(true); }}
                      style={{ padding: '8px', borderRadius: '8px', color: '#5a8a6e', background: 'none', border: 'none', cursor: 'pointer' }}><HiPencil size={16} /></button>
                    <button onClick={() => handleDelete(c._id)}
                      style={{ padding: '8px', borderRadius: '8px', color: '#5a8a6e', background: 'none', border: 'none', cursor: 'pointer' }}><HiTrash size={16} /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div></PageTransition>
  );
};

export default AdminCharities;
