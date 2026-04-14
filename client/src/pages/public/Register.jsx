import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, getCharities } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { HiUser, HiMail, HiLockClosed, HiEye, HiEyeOff, HiHeart, HiCheck, HiArrowRight, HiArrowLeft } from 'react-icons/hi';
import PageTransition from '../../components/common/PageTransition';

const getPasswordStrength = (pw) => {
  if (!pw) return { score: 0, label: '', color: 'transparent' };
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const levels = [
    { label: 'Very Weak', color: '#ef4444' },
    { label: 'Weak', color: '#f97316' },
    { label: 'Fair', color: '#eab308' },
    { label: 'Good', color: '#84cc16' },
    { label: 'Strong', color: '#22c55e' },
  ];
  const idx = Math.min(score, 5) - 1;
  return idx >= 0 ? { score, ...levels[idx] } : { score: 0, label: '', color: 'transparent' };
};

const stepVariants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

const Register = () => {
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    selectedCharity: '', charityPercentage: 10,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const { login } = useAuth();
  const navigate = useNavigate();

  const pwStrength = useMemo(() => getPasswordStrength(form.password), [form.password]);
  const passwordsMatch = form.password && form.confirmPassword && form.password === form.confirmPassword;

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getCharities();
        setCharities(data.charities || []);
      } catch { /* silently fail */ }
    };
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Guard: if still on step 1 (e.g. Enter key pressed), move to step 2 instead
    if (step === 1) {
      if (canProceed) setStep(2);
      return;
    }
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (!canProceed) return toast.error('Please complete all required fields');
    setLoading(true);
    try {
      const { data } = await registerUser({
        name: form.name, email: form.email, password: form.password,
        selectedCharity: form.selectedCharity || undefined, charityPercentage: form.charityPercentage,
      });
      login(data.token, data.user);
      toast.success('Account created! Welcome to Digital Heroes!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const canProceed = form.name && form.email && form.password && form.password === form.confirmPassword && form.password.length >= 6;

  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 16px 40px' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div className="float-animate" style={{ position: 'absolute', top: '80px', left: '80px', width: '300px', height: '300px', background: 'rgba(201,168,76,0.04)', borderRadius: '50%', filter: 'blur(120px)' }} />
          <div className="float-animate" style={{ position: 'absolute', bottom: '80px', right: '80px', width: '400px', height: '400px', background: 'rgba(26,122,69,0.04)', borderRadius: '50%', filter: 'blur(150px)', animationDelay: '3s' }} />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
          <div className="premium-card" style={{ padding: '40px' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, #c9a84c, #a88a3a)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px', boxShadow: '0 4px 20px rgba(201,168,76,0.2)',
                }}
              >
                <span style={{ color: '#0b1a14', fontWeight: 800, fontSize: '18px', fontFamily: 'Outfit' }}>DH</span>
              </motion.div>
              <h1 style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'Outfit', color: '#f0f7f4' }}>Create Your Account</h1>
              <p style={{ fontSize: '14px', color: '#5a8a6e', marginTop: '8px' }}>Join the community of golfers making a difference</p>
            </div>

            {/* Animated step indicator with progress bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
              {[
                { num: 1, label: 'Account' },
                { num: 2, label: 'Charity' },
              ].map((s, i) => (
                <div key={s.num} style={{ display: 'flex', flex: 1, alignItems: 'center', gap: '8px' }}>
                  <motion.div
                    animate={step >= s.num ? { scale: [1, 1.15, 1] } : {}}
                    transition={{ duration: 0.3 }}
                    style={{
                      width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', fontWeight: 700, transition: 'all 0.3s',
                      ...(step >= s.num
                        ? { background: 'linear-gradient(135deg, #c9a84c, #a88a3a)', color: '#0b1a14' }
                        : { background: '#0b1a14', color: '#5a8a6e', border: '1px solid #1d4a32' })
                    }}
                  >
                    {step > s.num ? <HiCheck size={14} /> : s.num}
                  </motion.div>
                  {i < 1 && (
                    <div style={{ flex: 1, height: '2px', background: '#1d4a32', borderRadius: '1px', position: 'relative', overflow: 'hidden' }}>
                      <motion.div
                        animate={{ width: step > 1 ? '100%' : '0%' }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, #c9a84c, #dfc06e)', borderRadius: '1px' }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="step1" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                    <div style={{ marginBottom: '16px' }}>
                      <label className="form-label">Full Name</label>
                      <div style={{ position: 'relative' }}>
                        <HiUser style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#5a8a6e' }} size={18} />
                        <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="John Doe" required className="form-input" style={{ paddingLeft: '40px' }} autoComplete="name" />
                        {form.name.length >= 2 && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)' }}>
                            <HiCheck style={{ color: '#22c55e' }} size={16} />
                          </motion.div>
                        )}
                      </div>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <label className="form-label">Email</label>
                      <div style={{ position: 'relative' }}>
                        <HiMail style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#5a8a6e' }} size={18} />
                        <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="you@example.com" required className="form-input" style={{ paddingLeft: '40px' }} autoComplete="email" />
                        {form.email.includes('@') && form.email.includes('.') && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)' }}>
                            <HiCheck style={{ color: '#22c55e' }} size={16} />
                          </motion.div>
                        )}
                      </div>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <label className="form-label">Password</label>
                      <div className="password-wrapper">
                        <HiLockClosed style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#5a8a6e' }} size={18} />
                        <input type={showPassword ? 'text' : 'password'} value={form.password}
                          onChange={(e) => setForm({ ...form, password: e.target.value })}
                          placeholder="Min. 6 characters" required minLength={6}
                          className="form-input" style={{ paddingLeft: '40px', paddingRight: '48px' }} autoComplete="new-password" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle" aria-label="Toggle password">
                          {showPassword ? <HiEyeOff size={18} /> : <HiEye size={18} />}
                        </button>
                      </div>
                      {/* Password strength bar */}
                      {form.password && (
                        <div style={{ marginTop: '8px' }}>
                          <div style={{ height: '3px', background: '#1d4a32', borderRadius: '2px', overflow: 'hidden' }}>
                            <motion.div
                              animate={{ width: `${(pwStrength.score / 5) * 100}%` }}
                              style={{ height: '100%', background: pwStrength.color, borderRadius: '2px' }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                          <p style={{ fontSize: '11px', color: pwStrength.color, marginTop: '4px', fontWeight: 500 }}>{pwStrength.label}</p>
                        </div>
                      )}
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                      <label className="form-label">Confirm Password</label>
                      <div style={{ position: 'relative' }}>
                        <HiLockClosed style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#5a8a6e' }} size={18} />
                        <input type="password" value={form.confirmPassword}
                          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                          placeholder="Re-enter password" required className="form-input" style={{ paddingLeft: '40px' }} autoComplete="new-password" />
                        {passwordsMatch && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)' }}>
                            <HiCheck style={{ color: '#22c55e' }} size={16} />
                          </motion.div>
                        )}
                      </div>
                      {form.confirmPassword && !passwordsMatch && (
                        <p style={{ fontSize: '11px', color: '#ef4444', marginTop: '4px' }}>Passwords don't match</p>
                      )}
                    </div>

                    <button type="button" disabled={!canProceed}
                      onClick={() => setStep(2)}
                      className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '15px' }}
                    >
                      Continue <HiArrowRight size={16} />
                    </button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="step2" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                    <div style={{ marginBottom: '20px' }}>
                      <label className="form-label">
                        <HiHeart style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle', color: '#c9a84c' }} size={14} />
                        Select a Charity (Optional)
                      </label>
                      <select value={form.selectedCharity} onChange={(e) => setForm({ ...form, selectedCharity: e.target.value })} className="form-input">
                        <option value="">Choose later</option>
                        {charities.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                      </select>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                      <label className="form-label">
                        Charity Contribution: <span className="gradient-text">{form.charityPercentage}%</span>
                      </label>
                      <input type="range" min="10" max="100" value={form.charityPercentage}
                        onChange={(e) => setForm({ ...form, charityPercentage: Number(e.target.value) })}
                        style={{ width: '100%', accentColor: '#c9a84c' }} />
                      <p style={{ fontSize: '12px', color: '#5a8a6e', marginTop: '6px' }}>Minimum 10% of your subscription goes to charity</p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button type="button" onClick={() => setStep(1)} className="btn-outline" style={{ flex: 1, padding: '14px' }}>
                        <HiArrowLeft size={16} /> Back
                      </button>
                      <button type="submit" disabled={loading}
                        className={`btn-primary ${loading ? 'btn-loading' : ''}`}
                        style={{ flex: 1, padding: '14px' }}
                      >
                        {loading ? 'Creating...' : 'Create Account'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            <p style={{ textAlign: 'center', fontSize: '14px', color: '#5a8a6e', marginTop: '24px' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#c9a84c', fontWeight: 600, textDecoration: 'none' }}>Log In</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Register;
