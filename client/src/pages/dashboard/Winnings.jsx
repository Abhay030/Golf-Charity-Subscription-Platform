import { useState, useEffect } from 'react';
import { getMyVerifications } from '../../services/api';
import { motion } from 'framer-motion';
import { HiCurrencyDollar, HiClock, HiCheck, HiX } from 'react-icons/hi';
import PageTransition from '../../components/common/PageTransition';
import EmptyState from '../../components/common/EmptyState';
import { SkeletonStat, SkeletonRow } from '../../components/common/Skeleton';
import useCountUp from '../../hooks/useCountUp';

const Winnings = () => {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getMyVerifications();
        setVerifications(data.verifications || []);
      } catch { /* */ } finally { setLoading(false); }
    };
    load();
  }, []);

  const totalEarned = verifications.reduce((s, v) => s + (v.prizeAmount || 0), 0);
  const pending = verifications.filter(v => v.status === 'pending').length;
  const approved = verifications.filter(v => v.status === 'approved').length;
  const totalDisp = useCountUp(totalEarned, { prefix: '£', decimals: 2 });
  const pendDisp = useCountUp(pending);
  const appDisp = useCountUp(approved);

  const stStyle = (s) => {
    if (s === 'approved') return { bg: 'rgba(34,197,94,0.1)', c: '#22c55e', I: HiCheck };
    if (s === 'rejected') return { bg: 'rgba(239,68,68,0.1)', c: '#ef4444', I: HiX };
    return { bg: 'rgba(234,179,8,0.1)', c: '#eab308', I: HiClock };
  };

  return (
    <PageTransition><div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'Outfit', color: '#f0f7f4', marginBottom: '8px' }}>Winnings</h1>
      <p style={{ fontSize: '14px', color: '#5a8a6e', marginBottom: '32px' }}>Track your prizes and verification status</p>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: '16px', marginBottom: '32px' }}>
          {[0,1,2].map(i => <SkeletonStat key={i} />)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: '16px', marginBottom: '32px' }}>
          {[
            { l: 'Total Earned', v: totalDisp, c: '#22c55e', I: HiCurrencyDollar, d: 0 },
            { l: 'Pending', v: pendDisp, c: '#eab308', I: HiClock, d: 0.08 },
            { l: 'Approved', v: appDisp, c: '#22c55e', I: HiCheck, d: 0.16 },
          ].map(s => (
            <motion.div key={s.l} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: s.d }} className="stat-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', color: '#5a8a6e', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.l}</span>
                <s.I style={{ color: s.c }} size={18} />
              </div>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'Outfit', color: s.c }}>{s.v}</p>
            </motion.div>
          ))}
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[0,1,2].map(i => <SkeletonRow key={i} />)}
        </div>
      ) : verifications.length === 0 ? (
        <EmptyState icon={HiCurrencyDollar} title="No winnings yet" description="Keep entering scores and playing draws! Your winnings will appear here." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {verifications.map((v, i) => {
            const st = stStyle(v.status);
            return (
              <motion.div key={v._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="premium-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0, background: st.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <st.I style={{ color: st.c }} size={18} />
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#f0f7f4' }}>{v.matchCount}-Number Match</p>
                    <p style={{ fontSize: '12px', color: '#5a8a6e' }}>Draw: {v.draw?.month || 'N/A'}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '16px', fontWeight: 700, color: '#22c55e' }}>£{v.prizeAmount?.toFixed(2)}</p>
                  <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', padding: '2px 8px', borderRadius: '999px', background: st.bg, color: st.c }}>{v.status}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div></PageTransition>
  );
};

export default Winnings;
