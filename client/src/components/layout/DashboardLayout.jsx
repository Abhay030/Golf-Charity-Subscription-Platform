import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HiHome, HiStar, HiTicket, HiHeart, HiCurrencyDollar, HiCog, HiLogout } from 'react-icons/hi';

const sidebarLinks = [
  { to: '/dashboard', icon: HiHome, label: 'Overview', end: true },
  { to: '/dashboard/scores', icon: HiStar, label: 'My Scores' },
  { to: '/dashboard/draws', icon: HiTicket, label: 'My Draws' },
  { to: '/dashboard/charity', icon: HiHeart, label: 'My Charity' },
  { to: '/dashboard/winnings', icon: HiCurrencyDollar, label: 'Winnings' },
  { to: '/dashboard/settings', icon: HiCog, label: 'Settings' },
];

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0b1a14' }}>
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex" style={{
        flexDirection: 'column', width: '260px', borderRight: '1px solid #1d4a32',
        background: '#0f2a1e', padding: '24px', flexShrink: 0
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #c9a84c, #a88a3a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <span style={{ color: '#0b1a14', fontWeight: 800, fontSize: '13px' }}>DH</span>
          </div>
          <span style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Outfit' }}>
            <span style={{ color: '#f0f7f4' }}>Digital</span>
            <span className="gradient-text" style={{ marginLeft: '5px' }}>Heroes</span>
          </span>
        </div>

        {/* User card */}
        <div style={{
          marginBottom: '28px', padding: '14px', borderRadius: '12px',
          background: '#0b1a14', border: '1px solid #1d4a32'
        }}>
          <p style={{ fontSize: '14px', fontWeight: 600, color: '#f0f7f4', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</p>
          <p style={{ fontSize: '12px', color: '#5a8a6e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: user?.subscriptionStatus === 'active' ? '#22c55e' : '#ef4444' }}></div>
            <span style={{ fontSize: '12px', color: '#8cc5a2', textTransform: 'capitalize' }}>{user?.subscriptionStatus || 'Inactive'}</span>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {sidebarLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px',
                borderRadius: '10px', fontSize: '14px', fontWeight: 500, textDecoration: 'none',
                transition: 'all 0.2s',
                ...(isActive
                  ? { background: 'rgba(201,168,76,0.08)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.2)' }
                  : { color: '#8cc5a2', border: '1px solid transparent' })
              })}>
              <link.icon size={18} />
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <button onClick={handleLogout} style={{
          display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px',
          borderRadius: '10px', fontSize: '14px', fontWeight: 500, color: '#5a8a6e',
          background: 'none', border: 'none', cursor: 'pointer', marginTop: '16px', width: '100%'
        }}>
          <HiLogout size={18} /> Logout
        </button>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40,
        background: 'rgba(15,42,30,0.9)', backdropFilter: 'blur(16px)',
        padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid #1d4a32'
      }}>
        <span className="gradient-text" style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'Outfit' }}>Digital Heroes</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', overflowX: 'auto' }}>
          {sidebarLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end}
              style={({ isActive }) => ({
                padding: '8px', borderRadius: '8px', textDecoration: 'none',
                color: isActive ? '#c9a84c' : '#5a8a6e',
                background: isActive ? 'rgba(201,168,76,0.08)' : 'transparent'
              })}>
              <link.icon size={18} />
            </NavLink>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main style={{ flex: 1, padding: '32px', paddingTop: '64px', overflow: 'auto' }} className="lg:!pt-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
