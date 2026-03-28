import { useState, useEffect, useCallback } from 'react';
import { getScores, addScore, updateScore, deleteScore } from '../../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlus, HiPencil, HiTrash, HiX, HiStar } from 'react-icons/hi';
import PageTransition from '../../components/common/PageTransition';
import EmptyState from '../../components/common/EmptyState';
import { SkeletonRow } from '../../components/common/Skeleton';

const Scores = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ courseName: '', stablefordPoints: '', datePlayed: '' });
  const [saving, setSaving] = useState(false);

  const loadScores = useCallback(async () => {
    try {
      const { data } = await getScores();
      setScores(data.scores || []);
    } catch { /* */ } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadScores(); }, [loadScores]);

  const drawNumbers = scores.slice(-5).map(s => s.stablefordPoints);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await updateScore(editId, form);
        toast.success('Score updated');
      } else {
        // Optimistic add
        const tempId = `temp-${Date.now()}`;
        const optimisticScore = { _id: tempId, ...form, stablefordPoints: Number(form.stablefordPoints) };
        setScores(prev => [...prev, optimisticScore]);
        setShowModal(false);

        try {
          await addScore(form);
          toast.success('Score added');
          loadScores(); // Refresh with real data
        } catch (err) {
          setScores(prev => prev.filter(s => s._id !== tempId));
          toast.error(err.response?.data?.message || 'Failed');
          return;
        }
        setSaving(false);
        return;
      }
      setShowModal(false);
      loadScores();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    // Optimistic remove
    const prevScores = [...scores];
    setScores(prev => prev.filter(s => s._id !== id));
    try {
      await deleteScore(id);
      toast.success('Score deleted');
    } catch (err) {
      setScores(prevScores);
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const openEdit = (score) => {
    setEditId(score._id);
    setForm({
      courseName: score.courseName,
      stablefordPoints: score.stablefordPoints,
      datePlayed: score.datePlayed?.slice(0, 10) || '',
    });
    setShowModal(true);
  };

  const openAdd = () => {
    setEditId(null);
    setForm({ courseName: '', stablefordPoints: '', datePlayed: '' });
    setShowModal(true);
  };

  return (
    <PageTransition>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '12px' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'Outfit', color: '#f0f7f4' }}>My Scores</h1>
          {scores.length < 5 && (
            <button onClick={openAdd} className="btn-primary" style={{ padding: '10px 20px' }}>
              <HiPlus size={16} /> Add Score
            </button>
          )}
        </div>
        <p style={{ fontSize: '14px', color: '#5a8a6e', marginBottom: '24px' }}>Enter your Stableford scores to generate draw numbers ({scores.length}/5)</p>

        {/* Draw numbers preview */}
        {drawNumbers.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="premium-card" style={{ padding: '20px', marginBottom: '24px' }}>
            <p style={{ fontSize: '11px', color: '#5a8a6e', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Your Draw Numbers</p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {drawNumbers.map((num, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ delay: i * 0.08, type: 'spring', stiffness: 300 }}
                  style={{
                    width: '52px', height: '52px', borderRadius: '14px',
                    background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <span className="gradient-text" style={{ fontSize: '18px', fontWeight: 700 }}>{num}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Score list */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {Array.from({ length: 3 }, (_, i) => <SkeletonRow key={i} />)}
          </div>
        ) : scores.length === 0 ? (
          <EmptyState icon={HiStar} title="No scores yet" description="Add your Stableford golf scores to generate your unique draw numbers." action={openAdd} actionLabel="Add First Score" />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <AnimatePresence>
              {scores.map((score, i) => (
                <motion.div
                  key={score._id}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="premium-card"
                  style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '12px',
                      background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <span className="gradient-text" style={{ fontSize: '16px', fontWeight: 700 }}>{score.stablefordPoints}</span>
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#f0f7f4' }}>{score.courseName}</p>
                      <p style={{ fontSize: '12px', color: '#5a8a6e' }}>
                        {score.datePlayed ? new Date(score.datePlayed).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No date'}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button onClick={() => openEdit(score)} style={{ padding: '8px', borderRadius: '8px', color: '#5a8a6e', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }} aria-label="Edit">
                      <HiPencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(score._id)} style={{ padding: '8px', borderRadius: '8px', color: '#5a8a6e', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }} aria-label="Delete">
                      <HiTrash size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{
                position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', padding: '16px',
              }}
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
                className="premium-card" style={{ padding: '32px', width: '100%', maxWidth: '440px' }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Outfit', color: '#f0f7f4' }}>{editId ? 'Edit Score' : 'Add Score'}</h3>
                  <button onClick={() => setShowModal(false)} style={{ color: '#5a8a6e', background: 'none', border: 'none', cursor: 'pointer' }}><HiX size={20} /></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: '16px' }}>
                    <label className="form-label">Course Name</label>
                    <input value={form.courseName} onChange={(e) => setForm({ ...form, courseName: e.target.value })} required className="form-input" placeholder="e.g. St Andrews" />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label className="form-label">Stableford Points</label>
                    <input type="number" min="0" max="50" value={form.stablefordPoints} onChange={(e) => setForm({ ...form, stablefordPoints: e.target.value })} required className="form-input" placeholder="e.g. 32" />
                  </div>
                  <div style={{ marginBottom: '24px' }}>
                    <label className="form-label">Date Played</label>
                    <input type="date" value={form.datePlayed} onChange={(e) => setForm({ ...form, datePlayed: e.target.value })} className="form-input" />
                  </div>
                  <button type="submit" disabled={saving}
                    className={`btn-primary ${saving ? 'btn-loading' : ''}`}
                    style={{ width: '100%', padding: '12px' }}
                  >
                    {saving ? 'Saving...' : editId ? 'Update Score' : 'Add Score'}
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export default Scores;
