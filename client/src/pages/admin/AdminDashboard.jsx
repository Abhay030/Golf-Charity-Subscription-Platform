import { useState, useEffect } from 'react';
import { adminGetAnalytics } from '../../services/api';
import { motion } from 'framer-motion';
import { HiUsers, HiCurrencyDollar, HiHeart, HiTicket, HiClock, HiShieldCheck } from 'react-icons/hi';
import PageTransition from '../../components/common/PageTransition';
import { SkeletonStat, SkeletonCard } from '../../components/common/Skeleton';
import useCountUp from '../../hooks/useCountUp';

const StatCard = ({ icon: Icon, label, rawValue, displayValue, color, delay }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="stat-card">
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
      <span style={{ fontSize: '11px', color: '#5a8a6e', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      <Icon style={{ color }} size={20} />
    </div>
    <p style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'Outfit', color }}>{displayValue}</p>
  </motion.div>
);

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { const { data } = await adminGetAnalytics(); setAnalytics(data.analytics); }
      catch { /* */ } finally { setLoading(false); }
    };
    load();
  }, []);

  const users = useCountUp(analytics?.totalUsers || 0, { duration: 800 });
  const subs = useCountUp(analytics?.activeSubscribers || 0, { duration: 800 });
  const pool = useCountUp(analytics?.totalPrizePool || 0, { prefix: '£', duration: 1000 });
  const draws = useCountUp(analytics?.totalDraws || 0, { duration: 600 });
  const chars = useCountUp(analytics?.totalCharities || 0, { duration: 600 });
  const pend = useCountUp(analytics?.pendingPayouts || 0, { duration: 600 });

  return (
    <PageTransition><div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'Outfit', color: '#f0f7f4', marginBottom: '8px' }}>Admin Dashboard</h1>
      <p style={{ fontSize: '14px', color: '#5a8a6e', marginBottom: '32px' }}>Platform overview and analytics</p>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: '16px', marginBottom: '32px' }}>
          {[0,1,2,3,4,5].map(i => <SkeletonStat key={i} />)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: '16px', marginBottom: '32px' }}>
          <StatCard icon={HiUsers} label="Total Users" displayValue={users} color="#60a5fa" delay={0} />
          <StatCard icon={HiShieldCheck} label="Active Subscribers" displayValue={subs} color="#22c55e" delay={0.06} />
          <StatCard icon={HiCurrencyDollar} label="Total Prize Pool" displayValue={pool} color="#eab308" delay={0.12} />
          <StatCard icon={HiTicket} label="Total Draws" displayValue={draws} color="#a78bfa" delay={0.18} />
          <StatCard icon={HiHeart} label="Charities" displayValue={chars} color="#f472b6" delay={0.24} />
          <StatCard icon={HiClock} label="Pending Payouts" displayValue={pend} color="#fb923c" delay={0.3} />
        </div>
      )}

      {loading ? <SkeletonCard height="200px" /> : analytics?.recentUsers && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="premium-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Outfit', color: '#f0f7f4', marginBottom: '16px' }}>Recent Users</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {analytics.recentUsers.map((u, i) => (
              <motion.div key={u._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + i * 0.05 }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: '10px', background: '#0b1a14', border: '1px solid #1d4a32' }}>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: '#f0f7f4' }}>{u.name}</p>
                  <p style={{ fontSize: '12px', color: '#5a8a6e' }}>{u.email}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'capitalize', color: u.role === 'admin' ? '#ef4444' : u.subscriptionStatus === 'active' ? '#22c55e' : '#5a8a6e' }}>
                    {u.role === 'admin' ? 'Admin' : u.subscriptionStatus}
                  </span>
                  <p style={{ fontSize: '10px', color: '#5a8a6e' }}>{new Date(u.createdAt).toLocaleDateString('en-GB')}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div></PageTransition>
  );
};

export default AdminDashboard;
