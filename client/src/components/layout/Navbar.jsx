import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="glass" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #c9a84c, #a88a3a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <span style={{ color: '#0b1a14', fontWeight: 800, fontSize: '13px', fontFamily: 'Outfit' }}>DH</span>
            </div>
            <span style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Outfit', letterSpacing: '-0.02em' }}>
              <span style={{ color: '#f0f7f4' }}>Digital</span>
              <span className="gradient-text" style={{ marginLeft: '5px' }}>Heroes</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: '28px' }}>
            {[
              { to: '/', label: 'Home' },
              { to: '/charities', label: 'Charities' },
              { to: '/how-it-works', label: 'How It Works' },
            ].map(link => (
              <Link key={link.to} to={link.to} style={{ fontSize: '14px', color: '#8cc5a2', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#c9a84c'}
                onMouseLeave={e => e.target.style.color = '#8cc5a2'}>
                {link.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {user?.role === 'admin' && (
                  <Link to="/admin" style={{ fontSize: '14px', color: '#c9a84c', textDecoration: 'none', fontWeight: 600 }}>Admin</Link>
                )}
                <Link to="/dashboard" style={{ fontSize: '14px', color: '#8cc5a2', textDecoration: 'none' }}>Dashboard</Link>
                <button onClick={handleLogout} className="btn-outline" style={{ padding: '8px 16px', fontSize: '13px' }}>
                  Logout
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Link to="/login" style={{ fontSize: '14px', color: '#8cc5a2', textDecoration: 'none' }}>Log In</Link>
                <Link to="/register" className="btn-primary" style={{ padding: '8px 20px', fontSize: '13px' }}>
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden" style={{ color: '#f0f7f4', padding: '8px', background: 'none', border: 'none', cursor: 'pointer' }}>
            {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
            style={{ borderTop: '1px solid #1d4a32', background: 'rgba(15,42,30,0.95)', padding: '16px 24px' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link to="/" onClick={() => setIsOpen(false)} style={{ fontSize: '14px', color: '#8cc5a2', textDecoration: 'none', padding: '8px 0' }}>Home</Link>
              <Link to="/charities" onClick={() => setIsOpen(false)} style={{ fontSize: '14px', color: '#8cc5a2', textDecoration: 'none', padding: '8px 0' }}>Charities</Link>
              <Link to="/how-it-works" onClick={() => setIsOpen(false)} style={{ fontSize: '14px', color: '#8cc5a2', textDecoration: 'none', padding: '8px 0' }}>How It Works</Link>
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsOpen(false)} style={{ fontSize: '14px', color: '#8cc5a2', textDecoration: 'none', padding: '8px 0' }}>Dashboard</Link>
                  {user?.role === 'admin' && <Link to="/admin" onClick={() => setIsOpen(false)} style={{ fontSize: '14px', color: '#c9a84c', textDecoration: 'none', padding: '8px 0' }}>Admin Panel</Link>}
                  <button onClick={() => { handleLogout(); setIsOpen(false); }} style={{ fontSize: '14px', textAlign: 'left', color: '#ef4444', padding: '8px 0', background: 'none', border: 'none', cursor: 'pointer' }}>Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)} style={{ fontSize: '14px', color: '#8cc5a2', textDecoration: 'none', padding: '8px 0' }}>Log In</Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="btn-primary" style={{ textAlign: 'center', marginTop: '4px' }}>Get Started</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
