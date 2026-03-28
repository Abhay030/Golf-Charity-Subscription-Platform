import { useState, useEffect } from 'react';
import { adminGetWinners, adminVerifyWinner, adminMarkPaid } from '../../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { HiCheck, HiX, HiCurrencyDollar, HiShieldCheck } from 'react-icons/hi';
import PageTransition from '../../components/common/PageTransition';
import EmptyState from '../../components/common/EmptyState';
import { SkeletonRow } from '../../components/common/Skeleton';

const AdminWinners = () => {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => { loadWinners(); }, [filter]);

  const loadWinners = async () => {
    try {
      const params = {};
      if (filter) params.status = filter;
      const { data } = await adminGetWinners(params);
      setWinners(data.winners || []);
    } catch { /* */ } finally { setLoading(false); }
  };

  const handleVerify = async (id, status) => {
    // Optimistic update
    const prev = [...winners];
    setWinners(ws => ws.map(w => w._id === id ? { ...w, status } : w));
    try {
      await adminVerifyWinner(id, { status });
      toast.success(`Winner ${status}`);
    } catch (err) {
      setWinners(prev);
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handlePay = async (id) => {
    const prev = [...winners];
    setWinners(ws => ws.map(w => w._id === id ? { ...w, paymentStatus: 'paid' } : w));
    try {
      await adminMarkPaid(id);
      toast.success('Marked as paid');
    } catch (err) {
      setWinners(prev);
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const stBadge = (s) => {
    if (s === 'approved') return { bg: 'rgba(34,197,94,0.1)', c: '#22c55e' };
    if (s === 'rejected') return { bg: 'rgba(239,68,68,0.1)', c: '#ef4444' };
    return { bg: 'rgba(234,179,8,0.1)', c: '#eab308' };
  };

  return (
    <PageTransition><div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'Outfit', color: '#f0f7f4', marginBottom: '8px' }}>Winners Management</h1>
      <p style={{ fontSize: '14px', color: '#5a8a6e', marginBottom: '24px' }}>Verify submissions and manage payouts</p>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {['', 'pending', 'approved', 'rejected'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{
              padding: '8px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
              border: 'none', textTransform: 'capitalize', transition: 'all 0.2s',
              ...(filter === f
                ? { background: 'linear-gradient(135deg, #c9a84c, #a88a3a)', color: '#0b1a14' }
                : { background: '#0f2a1e', color: '#8cc5a2', border: '1px solid #1d4a32' })
            }}>
            {f || 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[0,1,2].map(i => <SkeletonRow key={i} />)}
        </div>
      ) : winners.length === 0 ? (
        <EmptyState icon={HiShieldCheck} title="No winners found" description="No winners match the current filter." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {winners.map((w, i) => {
            const st = stBadge(w.status);
            return (
              <motion.div key={w._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="premium-card" style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#f0f7f4' }}>{w.user?.name || 'Unknown'}</p>
                    <p style={{ fontSize: '12px', color: '#5a8a6e' }}>{w.user?.email}</p>
                    <p style={{ fontSize: '12px', color: '#5a8a6e', marginTop: '4px' }}>
                      Draw: {w.draw?.month} • {w.matchCount}-Match • £{w.prizeAmount?.toFixed(2)}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <motion.span key={w.status} initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                      style={{ padding: '3px 10px', borderRadius: '999px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', background: st.bg, color: st.c }}>{w.status}</motion.span>
                    <span style={{
                      padding: '3px 10px', borderRadius: '999px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
                      ...(w.paymentStatus === 'paid'
                        ? { background: 'rgba(34,197,94,0.1)', color: '#22c55e' }
                        : { background: 'rgba(201,168,76,0.1)', color: '#c9a84c' })
                    }}>{w.paymentStatus}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {w.status === 'pending' && (
                    <>
                      <button onClick={() => handleVerify(w._id, 'approved')}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                        <HiCheck size={14} /> Approve
                      </button>
                      <button onClick={() => handleVerify(w._id, 'rejected')}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                        <HiX size={14} /> Reject
                      </button>
                    </>
                  )}
                  {w.status === 'approved' && w.paymentStatus !== 'paid' && (
                    <button onClick={() => handlePay(w._id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', background: 'rgba(201,168,76,0.1)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.3)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                      <HiCurrencyDollar size={14} /> Mark Paid
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div></PageTransition>
  );
};

export default AdminWinners;
