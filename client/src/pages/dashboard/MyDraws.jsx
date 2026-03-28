import { useState, useEffect } from 'react';
import { getDrawHistory, getMyDrawResults } from '../../services/api';
import { motion } from 'framer-motion';
import { HiTicket, HiCalendar } from 'react-icons/hi';
import PageTransition from '../../components/common/PageTransition';
import EmptyState from '../../components/common/EmptyState';
import { SkeletonCard } from '../../components/common/Skeleton';

const MyDraws = () => {
  const [draws, setDraws] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [drawRes, resultRes] = await Promise.all([
          getDrawHistory().catch(() => ({ data: { draws: [] } })),
          getMyDrawResults().catch(() => ({ data: { results: [] } })),
        ]);
        setDraws(drawRes.data.draws || []);
        setResults(resultRes.data.results || []);
      } finally { setLoading(false); }
    };
    load();
  }, []);

  const getStatusStyle = (status) => {
    if (status === 'published') return { background: 'rgba(34,197,94,0.1)', color: '#22c55e' };
    if (status === 'simulated') return { background: 'rgba(234,179,8,0.1)', color: '#eab308' };
    return { background: 'rgba(96,165,250,0.1)', color: '#60a5fa' };
  };

  return (
    <PageTransition>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'Outfit', color: '#f0f7f4', marginBottom: '8px' }}>My Draws</h1>
        <p style={{ fontSize: '14px', color: '#5a8a6e', marginBottom: '32px' }}>View your draw participation and results</p>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {Array.from({ length: 2 }, (_, i) => <SkeletonCard key={i} height="160px" />)}
          </div>
        ) : draws.length === 0 && results.length === 0 ? (
          <EmptyState icon={HiTicket} title="No draws yet" description="Draws are held monthly. Enter your scores to participate in the next draw!" />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Current / past draws */}
            {draws.map((draw, i) => (
              <motion.div
                key={draw._id}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="premium-card" style={{ padding: '24px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <HiCalendar style={{ color: '#c9a84c' }} size={18} />
                    <h3 style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'Outfit', color: '#f0f7f4' }}>{draw.month}</h3>
                  </div>
                  <span style={{ ...getStatusStyle(draw.status), padding: '4px 12px', borderRadius: '999px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}>{draw.status}</span>
                </div>

                {draw.winningNumbers?.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <p style={{ fontSize: '11px', color: '#5a8a6e', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Winning Numbers</p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {draw.winningNumbers.map((n, j) => (
                        <motion.div
                          key={j}
                          initial={{ scale: 0 }} animate={{ scale: 1 }}
                          transition={{ delay: 0.2 + j * 0.1, type: 'spring' }}
                          style={{
                            width: '48px', height: '48px', borderRadius: '12px',
                            background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.25)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          <span className="gradient-text" style={{ fontSize: '18px', fontWeight: 700 }}>{n}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* My results for this draw */}
                {results.filter(r => r.draw?._id === draw._id || r.draw === draw._id).map((r, ri) => (
                  <motion.div
                    key={ri}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    style={{
                      marginTop: '12px', padding: '14px', borderRadius: '12px',
                      background: '#0b1a14', border: '1px solid #1d4a32',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#f0f7f4' }}>
                        🎉 {r.matchCount}-Number Match!
                      </p>
                      <p style={{ fontSize: '12px', color: '#5a8a6e' }}>Matched: {r.matchedNumbers?.join(', ')}</p>
                    </div>
                    <span style={{ fontSize: '18px', fontWeight: 700, color: '#22c55e' }}>£{r.prizeAmount?.toFixed(2)}</span>
                  </motion.div>
                ))}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default MyDraws;
