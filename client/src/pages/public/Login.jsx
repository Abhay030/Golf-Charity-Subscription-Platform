import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { HiMail, HiLockClosed, HiEye, HiEyeOff, HiArrowRight } from 'react-icons/hi';
import PageTransition from '../../components/common/PageTransition';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shakeError, setShakeError] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const triggerShake = () => {
    setShakeError(true);
    setTimeout(() => setShakeError(false), 600);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginUser(form);
      login(data.token, data.user);
      toast.success('Welcome back!');
      navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 16px 40px' }}>
        {/* Background effects */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div className="float-animate" style={{ position: 'absolute', top: '80px', right: '80px', width: '300px', height: '300px', background: 'rgba(201,168,76,0.04)', borderRadius: '50%', filter: 'blur(120px)' }} />
          <div className="float-animate" style={{ position: 'absolute', bottom: '80px', left: '80px', width: '400px', height: '400px', background: 'rgba(26,122,69,0.04)', borderRadius: '50%', filter: 'blur(150px)', animationDelay: '3s' }} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className={shakeError ? 'animate-shake' : ''}
          style={{ position: 'relative', width: '100%', maxWidth: '440px' }}
        >
          <div className="premium-card" style={{ padding: '40px' }}>
            {/* Logo */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, #c9a84c, #a88a3a)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px', boxShadow: '0 4px 20px rgba(201,168,76,0.2)',
                }}
              >
                <span style={{ color: '#0b1a14', fontWeight: 800, fontSize: '18px', fontFamily: 'Outfit' }}>DH</span>
              </motion.div>
              <h1 style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'Outfit', color: '#f0f7f4' }}>Welcome Back</h1>
              <p style={{ fontSize: '14px', color: '#5a8a6e', marginTop: '8px' }}>Log in to your account</p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div style={{ marginBottom: '20px' }}>
                <label className="form-label">Email</label>
                <div style={{ position: 'relative' }}>
                  <HiMail style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#5a8a6e', transition: 'color 0.2s' }} size={18} />
                  <input
                    type="email" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com" required
                    className="form-input form-input-icon"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: '24px' }}>
                <label className="form-label">Password</label>
                <div className="password-wrapper">
                  <HiLockClosed style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#5a8a6e' }} size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••" required
                    className="form-input"
                    style={{ paddingLeft: '40px', paddingRight: '48px' }}
                    autoComplete="current-password"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle" aria-label="Toggle password visibility">
                    {showPassword ? <HiEyeOff size={18} /> : <HiEye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit" disabled={loading}
                className={`btn-primary ${loading ? 'btn-loading' : ''}`}
                style={{ width: '100%', padding: '14px', fontSize: '15px' }}
              >
                {loading ? 'Logging in...' : <>Log In <HiArrowRight size={16} /></>}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
              <div style={{ flex: 1, height: '1px', background: '#1d4a32' }} />
              <span style={{ fontSize: '12px', color: '#5a8a6e' }}>New here?</span>
              <div style={{ flex: 1, height: '1px', background: '#1d4a32' }} />
            </div>

            <Link to="/register" className="btn-outline" style={{ width: '100%', padding: '12px', fontSize: '14px', display: 'flex' }}>
              Create an Account
            </Link>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Login;
