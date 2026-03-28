import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getCurrentDraw, getScores, getMyVerifications } from '../../services/api';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiClock, HiStar, HiTicket, HiCurrencyDollar, HiArrowRight } from 'react-icons/hi';
import PageTransition from '../../components/common/PageTransition';
import { SkeletonStat, SkeletonCard } from '../../components/common/Skeleton';
import useCountUp from '../../hooks/useCountUp';

const StatCard = ({ icon: Icon, label, value, subtext, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="stat-card"
  >
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
      <span style={{ fontSize: '11px', color: '#5a8a6e', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      <Icon style={{ color }} size={20} />
    </div>
    <p style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'Outfit', color }}>{value}</p>
    {subtext && <p style={{ fontSize: '12px', color: '#5a8a6e', marginTop: '4px' }}>{subtext}</p>}
  </motion.div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [draw, setDraw] = useState(null);
  const [scores, setScores] = useState([]);
  const [winnings, setWinnings] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [drawRes, scoresRes, winRes] = await Promise.all([
          getCurrentDraw().catch(() => ({ data: {} })),
          getScores().catch(() => ({ data: { scores: [] } })),
          getMyVerifications().catch(() => ({ data: { verifications: [] } })),
        ]);
        setDraw(drawRes.data.draw);
        setScores(scoresRes.data.scores || []);
        setWinnings(winRes.data.verifications || []);
      } finally { setLoading(false); }
    };
    load();
  }, []);

  const daysLeft = user?.subscriptionExpiry
    ? Math.max(0, Math.ceil((new Date(user.subscriptionExpiry) - new Date()) / (1000 * 60 * 60 * 24)))
    : 0;

  const totalEarned = winnings.reduce((sum, w) => sum + (w.prizeAmount || 0), 0);
  const drawNumbers = scores.slice(-5).map(s => s.stablefordPoints);

  const daysDisplay = useCountUp(daysLeft, { duration: 800 });
  const earningsDisplay = useCountUp(totalEarned, { prefix: '£', decimals: 2, duration: 1000 });

  return (
    <PageTransition>
      <div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'Outfit', color: '#f0f7f4', marginBottom: '4px' }}>
            Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
          </h1>
          <p style={{ fontSize: '14px', color: '#5a8a6e', marginBottom: '32px' }}>Here's your overview</p>
        </motion.div>

        {/* Stats Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            {Array.from({ length: 4 }, (_, i) => <SkeletonStat key={i} />)}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            <StatCard icon={HiClock} label="Subscription" value={`${daysDisplay} days left`} subtext={user?.subscriptionTier || 'monthly'} color="#60a5fa" delay={0} />
            <StatCard icon={HiStar} label="My Scores" value={`${scores.length}/5`} subtext="Stableford scores" color="#22c55e" delay={0.08} />
            <StatCard icon={HiTicket} label="Draws Won" value={winnings.length} subtext="Total wins" color="#c9a84c" delay={0.16} />
            <StatCard icon={HiCurrencyDollar} label="Winnings" value={earningsDisplay} subtext="Total earned" color="#22c55e" delay={0.24} />
          </div>
        )}

        {/* Bottom — Draw Numbers + Recent Results */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <SkeletonCard height="200px" />
            <SkeletonCard height="200px" />
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {/* Draw Numbers */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="premium-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'Outfit', color: '#f0f7f4' }}>My Draw Numbers</h3>
                <Link to="/dashboard/scores" style={{ fontSize: '12px', color: '#c9a84c', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Manage <HiArrowRight size={12} />
                </Link>
              </div>
              {drawNumbers.length > 0 ? (
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {drawNumbers.map((num, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ delay: 0.35 + i * 0.08, type: 'spring', stiffness: 300 }}
                      whileHover={{ scale: 1.1, y: -4 }}
                      style={{
                        width: '56px', height: '56px', borderRadius: '14px',
                        background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'default', transition: 'box-shadow 0.2s',
                      }}
                    >
                      <span className="gradient-text" style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'Outfit' }}>{num}</span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '14px', color: '#5a8a6e' }}>Enter 5 scores to generate your draw numbers.</p>
              )}
            </motion.div>

            {/* Recent Draw Results */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="premium-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'Outfit', color: '#f0f7f4' }}>Recent Draw Results</h3>
                <Link to="/dashboard/draws" style={{ fontSize: '12px', color: '#c9a84c', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  View All <HiArrowRight size={12} />
                </Link>
              </div>
              {draw ? (
                <div>
                  <p style={{ fontSize: '12px', color: '#5a8a6e', marginBottom: '8px' }}>Month: {draw.month}</p>
                  {draw.winningNumbers?.length > 0 ? (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {draw.winningNumbers.map((n, i) => (
                        <div key={i} style={{
                          width: '48px', height: '48px', borderRadius: '12px',
                          background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <span style={{ fontSize: '16px', fontWeight: 700, color: '#22c55e' }}>{n}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: '14px', color: '#5a8a6e' }}>Draw not yet drawn. Stay tuned!</p>
                  )}
                </div>
              ) : (
                <p style={{ fontSize: '14px', color: '#5a8a6e' }}>No draw results yet. Stay tuned for the next draw!</p>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Dashboard;
