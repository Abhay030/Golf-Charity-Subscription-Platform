import { useState } from 'react';
import { adminConfigureDraw, adminSimulateDraw, adminPublishDraw } from '../../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { HiCog, HiPlay, HiUpload, HiCheck } from 'react-icons/hi';
import PageTransition from '../../components/common/PageTransition';

const steps = [
  { key: 'configure', label: 'Configure', icon: HiCog, color: '#60a5fa' },
  { key: 'simulate', label: 'Simulate', icon: HiPlay, color: '#eab308' },
  { key: 'publish', label: 'Publish', icon: HiUpload, color: '#22c55e' },
];

const AdminDraws = () => {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [drawType, setDrawType] = useState('random');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState('');
  const [completedSteps, setCompletedSteps] = useState([]);

  const actions = {
    configure: async () => {
      const { data } = await adminConfigureDraw({ month, drawType });
      setCompletedSteps(['configure']);
      return data.draw;
    },
    simulate: async () => {
      const { data } = await adminSimulateDraw({ month });
      setCompletedSteps(['configure', 'simulate']);
      return data.draw;
    },
    publish: async () => {
      if (!confirm('Publish results? This will notify all winners.')) return null;
      const { data } = await adminPublishDraw({ month });
      setCompletedSteps(['configure', 'simulate', 'publish']);
      return data.draw;
    },
  };

  const handleAction = async (key) => {
    setLoading(key);
    try {
      const draw = await actions[key]();
      if (draw) { setResult(draw); toast.success(`Draw ${key}d!`); }
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(''); }
  };

  return (
    <PageTransition><div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'Outfit', color: '#f0f7f4', marginBottom: '8px' }}>Draw Management</h1>
      <p style={{ fontSize: '14px', color: '#5a8a6e', marginBottom: '32px' }}>Configure, simulate, and publish monthly draws</p>

      {/* Workflow indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '32px' }}>
        {steps.map((s, i) => (
          <div key={s.key} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <motion.div
              animate={completedSteps.includes(s.key) ? { scale: [1, 1.15, 1] } : {}}
              style={{
                width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.3s',
                ...(completedSteps.includes(s.key)
                  ? { background: s.color, color: '#0b1a14' }
                  : { background: '#0b1a14', border: '1px solid #1d4a32', color: '#5a8a6e' })
              }}>
              {completedSteps.includes(s.key) ? <HiCheck size={16} /> : <s.icon size={16} />}
            </motion.div>
            <span style={{ fontSize: '11px', fontWeight: 600, marginLeft: '8px', color: completedSteps.includes(s.key) ? s.color : '#5a8a6e' }}>{s.label}</span>
            {i < 2 && (
              <div style={{ flex: 1, height: '2px', margin: '0 12px', background: '#1d4a32', borderRadius: '1px', position: 'relative', overflow: 'hidden' }}>
                <motion.div animate={{ width: completedSteps.includes(steps[i + 1]?.key) || (completedSteps.includes(s.key) && i < completedSteps.length) ? '100%' : '0%' }}
                  style={{ position: 'absolute', inset: 0, background: s.color, borderRadius: '1px' }} transition={{ duration: 0.4 }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Config form */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="premium-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Outfit', color: '#f0f7f4', marginBottom: '20px' }}>Configure Draw</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label className="form-label">Month</label>
            <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="form-input" />
          </div>
          <div>
            <label className="form-label">Draw Type</label>
            <select value={drawType} onChange={(e) => setDrawType(e.target.value)} className="form-input">
              <option value="random">Random (Lottery-style)</option>
              <option value="algorithmic">Algorithmic (Weighted)</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {steps.map(s => (
            <button key={s.key} onClick={() => handleAction(s.key)} disabled={loading === s.key}
              className={loading === s.key ? 'btn-loading' : ''}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '10px',
                background: `${s.color}15`, color: s.color, border: `1px solid ${s.color}50`,
                fontSize: '13px', fontWeight: 600, cursor: 'pointer', opacity: loading === s.key ? 0.5 : 1,
              }}>
              <s.icon size={16} /> {loading === s.key ? `${s.label}ing...` : s.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Result */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="premium-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Outfit', color: '#f0f7f4', marginBottom: '16px' }}>Draw Result — {result.month}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <span className="badge badge-success" style={{ textTransform: 'uppercase' }}>{result.status}</span>
            <span style={{ fontSize: '12px', color: '#5a8a6e' }}>Type: {result.drawType}</span>
            <span style={{ fontSize: '12px', color: '#5a8a6e' }}>Participants: {result.totalParticipants}</span>
          </div>
          {result.winningNumbers?.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '11px', color: '#5a8a6e', marginBottom: '8px' }}>Winning Numbers:</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                {result.winningNumbers.map((n, i) => (
                  <motion.div key={i} initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: i * 0.12, type: 'spring', stiffness: 200 }}
                    style={{
                      width: '52px', height: '52px', borderRadius: '14px',
                      background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                    <span className="gradient-text" style={{ fontSize: '20px', fontWeight: 700 }}>{n}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          {result.results?.length > 0 && (
            <div>
              <p style={{ fontSize: '12px', color: '#5a8a6e', marginBottom: '8px' }}>Winners ({result.results.length}):</p>
              {result.results.map((r, i) => (
                <div key={i} style={{ padding: '12px', borderRadius: '10px', background: '#0b1a14', border: '1px solid #1d4a32', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: '#f0f7f4' }}>{r.matchCount}-Match</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#22c55e' }}>£{r.prize?.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div></PageTransition>
  );
};

export default AdminDraws;
