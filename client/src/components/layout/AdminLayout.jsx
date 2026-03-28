import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HiChartBar, HiUsers, HiTicket, HiHeart, HiShieldCheck, HiLogout, HiArrowLeft } from 'react-icons/hi';

const adminLinks = [
  { to: '/admin', icon: HiChartBar, label: 'Analytics', end: true },
  { to: '/admin/users', icon: HiUsers, label: 'Users' },
  { to: '/admin/draws', icon: HiTicket, label: 'Draws' },
  { to: '/admin/charities', icon: HiHeart, label: 'Charities' },
  { to: '/admin/winners', icon: HiShieldCheck, label: 'Winners' },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0b1a14' }}>
      {/* Sidebar */}
      <aside className="hidden lg:flex" style={{
        flexDirection: 'column', width: '260px', borderRight: '1px solid #1d4a32',
        background: '#0f2a1e', padding: '24px', flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <HiShieldCheck style={{ color: 'white' }} size={16} />
          </div>
          <span style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Outfit', color: '#f0f7f4' }}>Admin Panel</span>
        </div>

        <button onClick={() => navigate('/dashboard')} style={{
          display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#5a8a6e',
          background: 'none', border: 'none', cursor: 'pointer', marginBottom: '28px', padding: 0
        }}>
          <HiArrowLeft size={14} /> Back to Dashboard
        </button>

        <div style={{ marginBottom: '24px', padding: '14px', borderRadius: '12px', background: '#0b1a14', border: '1px solid rgba(239,68,68,0.2)' }}>
          <p style={{ fontSize: '14px', fontWeight: 600, color: '#f0f7f4' }}>{user?.name}</p>
          <p style={{ fontSize: '12px', color: '#ef4444', fontWeight: 500, marginTop: '4px' }}>Administrator</p>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {adminLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px',
                borderRadius: '10px', fontSize: '14px', fontWeight: 500, textDecoration: 'none',
                ...(isActive
                  ? { background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }
                  : { color: '#8cc5a2', border: '1px solid transparent' })
              })}>
              <link.icon size={18} /> {link.label}
            </NavLink>
          ))}
        </nav>

        <button onClick={() => { logout(); navigate('/'); }} style={{
          display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px',
          borderRadius: '10px', fontSize: '14px', fontWeight: 500, color: '#5a8a6e',
          background: 'none', border: 'none', cursor: 'pointer', marginTop: '16px', width: '100%'
        }}>
          <HiLogout size={18} /> Logout
        </button>
      </aside>

      {/* Mobile bar */}
      <div className="lg:hidden" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40,
        background: 'rgba(15,42,30,0.9)', backdropFilter: 'blur(16px)',
        padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid rgba(239,68,68,0.2)'
      }}>
        <span style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'Outfit', color: '#ef4444' }}>Admin Panel</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {adminLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end}
              style={({ isActive }) => ({
                padding: '8px', borderRadius: '8px', textDecoration: 'none',
                color: isActive ? '#ef4444' : '#5a8a6e',
                background: isActive ? 'rgba(239,68,68,0.08)' : 'transparent'
              })}>
              <link.icon size={18} />
            </NavLink>
          ))}
        </div>
      </div>

      <main style={{ flex: 1, padding: '32px', paddingTop: '64px', overflow: 'auto' }} className="lg:!pt-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
