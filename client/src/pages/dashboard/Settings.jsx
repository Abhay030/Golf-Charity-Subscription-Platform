import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getProfile, updateProfile, subscribe, cancelSubscription } from '../../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { HiUser, HiShieldCheck, HiCheck, HiX, HiCreditCard, HiLockClosed, HiStar } from 'react-icons/hi';
import PageTransition from '../../components/common/PageTransition';
import { SkeletonCard } from '../../components/common/Skeleton';

const plans = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: '£9.99',
    period: '/month',
    desc: 'Perfect for casual golfers',
    features: ['5 Stableford scores', 'Monthly draw entry', 'Charity contribution', 'Winner verification'],
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: '£89.99',
    period: '/year',
    desc: 'Best value — save 25%',
    badge: 'Best Value',
    features: ['Everything in Monthly', '12 months of draws', 'Priority support', '2 months free'],
  },
];

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Subscription
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [showPayment, setShowPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState('form'); // form | processing | success
  const [cardForm, setCardForm] = useState({ number: '', expiry: '', cvc: '', name: '' });
  const [subLoading, setSubLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getProfile();
        setProfile({ name: data.user.name, email: data.user.email });
      } catch { /* */ } finally { setLoading(false); }
    };
    load();
  }, []);

  const handleProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await updateProfile(profile);
      updateUser(data.user);
      setSaved(true);
      toast.success('Profile updated');
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setSaving(false); }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setPaymentStep('processing');

    // Simulate payment processing
    await new Promise(r => setTimeout(r, 2000));

    try {
      const { data } = await subscribe({ plan: selectedPlan });
      updateUser(data.user);
      setPaymentStep('success');

      // Auto-close after success
      setTimeout(() => {
        setShowPayment(false);
        setPaymentStep('form');
        setCardForm({ number: '', expiry: '', cvc: '', name: '' });
        toast.success(`Subscribed to ${selectedPlan} plan!`);
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
      setPaymentStep('form');
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel your subscription?')) return;
    setSubLoading(true);
    try {
      const { data } = await cancelSubscription();
      updateUser(data.user);
      toast.success('Subscription cancelled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setSubLoading(false); }
  };

  // Format card number with spaces
  const formatCard = (val) => {
    const v = val.replace(/\D/g, '').slice(0, 16);
    return v.replace(/(.{4})/g, '$1 ').trim();
  };
  const formatExpiry = (val) => {
    const v = val.replace(/\D/g, '').slice(0, 4);
    if (v.length >= 3) return v.slice(0, 2) + '/' + v.slice(2);
    return v;
  };

  const isActive = user?.subscriptionStatus === 'active';

  return (
    <PageTransition><div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'Outfit', color: '#f0f7f4', marginBottom: '8px' }}>Settings</h1>
      <p style={{ fontSize: '14px', color: '#5a8a6e', marginBottom: '32px' }}>Manage your profile and subscription</p>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <SkeletonCard height="200px" />
          <SkeletonCard height="300px" />
        </div>
      ) : (
        <>
          {/* Profile Card */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="premium-card" style={{ padding: '28px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <HiUser style={{ color: '#c9a84c' }} size={20} />
              <h3 style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'Outfit', color: '#f0f7f4' }}>Profile</h3>
            </div>
            <form onSubmit={handleProfile}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label className="form-label">Name</label>
                  <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input value={profile.email} disabled className="form-input" />
                </div>
              </div>
              <button type="submit" disabled={saving}
                className={`btn-primary ${saving ? 'btn-loading' : ''} ${saved ? 'btn-success' : ''}`}
                style={{ padding: '12px 28px' }}>
                {saved ? <><HiCheck size={16} /> Saved</> : saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </motion.div>

          {/* Subscription Card */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="premium-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <HiShieldCheck style={{ color: isActive ? '#22c55e' : '#5a8a6e' }} size={20} />
                <h3 style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'Outfit', color: '#f0f7f4' }}>Subscription</h3>
              </div>
              <span style={{
                fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', padding: '3px 10px', borderRadius: '999px',
                ...(isActive ? { background: 'rgba(34,197,94,0.1)', color: '#22c55e' } : { background: 'rgba(239,68,68,0.1)', color: '#ef4444' })
              }}>{user?.subscriptionStatus || 'inactive'}</span>
            </div>

            {/* Current subscription info (if active) */}
            {isActive && (
              <div style={{ padding: '16px', borderRadius: '12px', background: '#0b1a14', border: '1px solid #1d4a32', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', color: '#8cc5a2' }}>Plan</span>
                  <span style={{ fontSize: '14px', color: '#f0f7f4', fontWeight: 600, textTransform: 'capitalize' }}>{user?.subscriptionPlan}</span>
                </div>
                {user?.subscriptionEnd && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '14px', color: '#8cc5a2' }}>Renews</span>
                    <span style={{ fontSize: '14px', color: '#f0f7f4' }}>{new Date(user.subscriptionEnd).toLocaleDateString('en-GB')}</span>
                  </div>
                )}
              </div>
            )}

            {/* Plan selection (if not active) */}
            {!isActive && (
              <>
                <p style={{ fontSize: '13px', color: '#5a8a6e', marginBottom: '16px' }}>Choose a plan to unlock all features</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                  {plans.map((plan) => (
                    <motion.button
                      key={plan.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedPlan(plan.id)}
                      style={{
                        textAlign: 'left', padding: '20px', borderRadius: '14px', cursor: 'pointer',
                        background: selectedPlan === plan.id ? 'rgba(201,168,76,0.06)' : '#0b1a14',
                        border: selectedPlan === plan.id ? '1.5px solid rgba(201,168,76,0.5)' : '1px solid #1d4a32',
                        transition: 'all 0.2s', position: 'relative', overflow: 'hidden',
                      }}
                    >
                      {plan.badge && (
                        <span style={{
                          position: 'absolute', top: '12px', right: '12px',
                          fontSize: '9px', fontWeight: 700, textTransform: 'uppercase',
                          padding: '3px 8px', borderRadius: '999px',
                          background: 'linear-gradient(135deg, #c9a84c, #a88a3a)', color: '#0b1a14',
                        }}>{plan.badge}</span>
                      )}
                      <p style={{ fontSize: '14px', fontWeight: 700, color: '#f0f7f4', marginBottom: '4px' }}>{plan.name}</p>
                      <div style={{ marginBottom: '8px' }}>
                        <span className="gradient-text" style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Outfit' }}>{plan.price}</span>
                        <span style={{ fontSize: '13px', color: '#5a8a6e' }}>{plan.period}</span>
                      </div>
                      <p style={{ fontSize: '12px', color: '#5a8a6e', marginBottom: '12px' }}>{plan.desc}</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {plan.features.map((f, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <HiCheck style={{ color: '#22c55e', flexShrink: 0 }} size={12} />
                            <span style={{ fontSize: '12px', color: '#8cc5a2' }}>{f}</span>
                          </div>
                        ))}
                      </div>
                      {selectedPlan === plan.id && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                          style={{
                            position: 'absolute', top: '20px', left: '20px',
                            width: '20px', height: '20px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #c9a84c, #a88a3a)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                          <HiCheck style={{ color: '#0b1a14' }} size={12} />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </>
            )}

            {/* Action button */}
            {isActive ? (
              <button onClick={handleCancel} disabled={subLoading} className="btn-outline" style={{ width: '100%', padding: '12px' }}>
                {subLoading ? 'Cancelling...' : 'Cancel Subscription'}
              </button>
            ) : (
              <button onClick={() => { setShowPayment(true); setPaymentStep('form'); }}
                className="btn-primary btn-glow" style={{ width: '100%', padding: '14px', fontSize: '15px' }}>
                <HiCreditCard size={18} /> Subscribe Now — {plans.find(p => p.id === selectedPlan)?.price}{plans.find(p => p.id === selectedPlan)?.period}
              </button>
            )}
          </motion.div>
        </>
      )}

      {/* Payment Modal */}
      <AnimatePresence>
        {showPayment && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)', padding: '16px',
            }}
            onClick={() => paymentStep === 'form' && setShowPayment(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="premium-card" style={{ padding: '32px', width: '100%', maxWidth: '440px' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Processing state */}
              {paymentStep === 'processing' && (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ position: 'relative', width: '48px', height: '48px', margin: '0 auto 20px' }}>
                    <div style={{
                      width: '100%', height: '100%',
                      border: '3px solid rgba(29,74,50,0.5)', borderTopColor: '#c9a84c',
                      borderRadius: '50%', animation: 'spin 0.8s linear infinite',
                    }} />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Outfit', color: '#f0f7f4', marginBottom: '8px' }}>
                    Processing Payment
                  </h3>
                  <p style={{ fontSize: '14px', color: '#5a8a6e' }}>Verifying your card details...</p>
                </div>
              )}

              {/* Success state */}
              {paymentStep === 'success' && (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  style={{ textAlign: 'center', padding: '40px 0' }}>
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
                    style={{
                      width: '64px', height: '64px', borderRadius: '50%',
                      background: 'rgba(34,197,94,0.1)', border: '2px solid rgba(34,197,94,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 20px',
                    }}>
                    <HiCheck style={{ color: '#22c55e' }} size={32} />
                  </motion.div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Outfit', color: '#f0f7f4', marginBottom: '8px' }}>
                    Payment Successful! 🎉
                  </h3>
                  <p style={{ fontSize: '14px', color: '#5a8a6e' }}>You're now a Digital Heroes subscriber</p>
                </motion.div>
              )}

              {/* Payment form */}
              {paymentStep === 'form' && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Outfit', color: '#f0f7f4' }}>Complete Payment</h3>
                      <p style={{ fontSize: '13px', color: '#5a8a6e', marginTop: '4px' }}>
                        {plans.find(p => p.id === selectedPlan)?.name} Plan — {plans.find(p => p.id === selectedPlan)?.price}{plans.find(p => p.id === selectedPlan)?.period}
                      </p>
                    </div>
                    <button onClick={() => setShowPayment(false)} style={{ color: '#5a8a6e', background: 'none', border: 'none', cursor: 'pointer' }}>
                      <HiX size={20} />
                    </button>
                  </div>

                  {/* Secure badge */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px',
                    borderRadius: '10px', background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.15)',
                    marginBottom: '20px',
                  }}>
                    <HiLockClosed style={{ color: '#22c55e' }} size={14} />
                    <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: 500 }}>Secured with 256-bit SSL encryption</span>
                  </div>

                  <form onSubmit={handlePayment}>
                    <div style={{ marginBottom: '16px' }}>
                      <label className="form-label">Cardholder Name</label>
                      <input value={cardForm.name} required
                        onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })}
                        placeholder="John Doe" className="form-input" />
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <label className="form-label">Card Number</label>
                      <div style={{ position: 'relative' }}>
                        <HiCreditCard style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#5a8a6e' }} size={18} />
                        <input value={cardForm.number} required
                          onChange={(e) => setCardForm({ ...cardForm, number: formatCard(e.target.value) })}
                          placeholder="4242 4242 4242 4242"
                          className="form-input" style={{ paddingLeft: '40px' }} maxLength={19} />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                      <div>
                        <label className="form-label">Expiry</label>
                        <input value={cardForm.expiry} required
                          onChange={(e) => setCardForm({ ...cardForm, expiry: formatExpiry(e.target.value) })}
                          placeholder="MM/YY" className="form-input" maxLength={5} />
                      </div>
                      <div>
                        <label className="form-label">CVC</label>
                        <input value={cardForm.cvc} required
                          onChange={(e) => setCardForm({ ...cardForm, cvc: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                          placeholder="123" className="form-input" maxLength={3} type="password" />
                      </div>
                    </div>

                    <button type="submit" className="btn-primary btn-glow" style={{ width: '100%', padding: '14px', fontSize: '15px' }}>
                      <HiLockClosed size={16} /> Pay {plans.find(p => p.id === selectedPlan)?.price}
                    </button>

                    <p style={{ fontSize: '11px', color: '#5a8a6e', textAlign: 'center', marginTop: '12px', lineHeight: 1.5 }}>
                      This is a simulated payment. No real charges will be made.
                    </p>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div></PageTransition>
  );
};

export default Settings;
