import { useState, useEffect } from 'react';
import { adminGetUsers, adminUpdateUser } from '../../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { HiSearch, HiPencil, HiX } from 'react-icons/hi';
import PageTransition from '../../components/common/PageTransition';
import { SkeletonRow } from '../../components/common/Skeleton';
import useDebounce from '../../hooks/useDebounce';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState(null);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => { loadUsers(); }, [debouncedSearch]);

  const loadUsers = async () => {
    try {
      const params = {};
      if (debouncedSearch) params.search = debouncedSearch;
      const { data } = await adminGetUsers(params);
      setUsers(data.users || []);
    } catch { /* */ } finally { setLoading(false); }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await adminUpdateUser(editUser._id, editUser);
      toast.success('User updated');
      setEditUser(null);
      loadUsers();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const badge = (role) => {
    if (role === 'admin') return { background: 'rgba(239,68,68,0.1)', color: '#ef4444' };
    if (role === 'subscriber') return { background: 'rgba(34,197,94,0.1)', color: '#22c55e' };
    return { background: 'rgba(156,163,175,0.1)', color: '#9ca3af' };
  };

  return (
    <PageTransition><div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'Outfit', color: '#f0f7f4', marginBottom: '8px' }}>User Management</h1>
      <p style={{ fontSize: '14px', color: '#5a8a6e', marginBottom: '24px' }}>View and manage all users</p>

      <div style={{ position: 'relative', marginBottom: '24px' }}>
        <HiSearch style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#5a8a6e' }} size={18} />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..." className="form-input form-input-icon" />
      </div>

      <AnimatePresence>
        {editUser && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', padding: '16px' }}
            onClick={() => setEditUser(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
              className="premium-card" style={{ padding: '32px', width: '100%', maxWidth: '440px' }} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Outfit', color: '#f0f7f4' }}>Edit User</h3>
                <button onClick={() => setEditUser(null)} style={{ color: '#5a8a6e', background: 'none', border: 'none', cursor: 'pointer' }}><HiX size={20} /></button>
              </div>
              <form onSubmit={handleUpdate}>
                <div style={{ marginBottom: '16px' }}>
                  <label className="form-label">Name</label>
                  <input value={editUser.name} onChange={(e) => setEditUser({ ...editUser, name: e.target.value })} className="form-input" />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label className="form-label">Role</label>
                  <select value={editUser.role} onChange={(e) => setEditUser({ ...editUser, role: e.target.value })} className="form-input">
                    <option value="visitor">Visitor</option>
                    <option value="subscriber">Subscriber</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label className="form-label">Subscription</label>
                  <select value={editUser.subscriptionStatus} onChange={(e) => setEditUser({ ...editUser, subscriptionStatus: e.target.value })} className="form-input">
                    <option value="inactive">Inactive</option>
                    <option value="active">Active</option>
                    <option value="lapsed">Lapsed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px' }}>Save</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[0,1,2,3].map(i => <SkeletonRow key={i} />)}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {users.map((u, i) => (
            <motion.div key={u._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
              className="premium-card" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg,#1a7a45,#0d4f2b)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#f0f7f4' }}>{u.name?.[0]?.toUpperCase()}</span>
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: '#f0f7f4', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name}</p>
                  <p style={{ fontSize: '12px', color: '#5a8a6e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                <span style={{ ...badge(u.role), padding: '3px 10px', borderRadius: '999px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}>{u.role}</span>
                <button onClick={() => setEditUser({ ...u })} style={{ padding: '8px', borderRadius: '8px', color: '#5a8a6e', background: 'none', border: 'none', cursor: 'pointer' }}><HiPencil size={16} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div></PageTransition>
  );
};

export default AdminUsers;
