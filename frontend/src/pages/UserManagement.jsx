import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;
import { UserCheck, UserX, Trash2, Mail, Calendar, ShieldCheck } from 'lucide-react';

const UserManagement = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = useCallback(async () => {
    setError('');
    try {
      const res = await axios.get(`${API_URL}users/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Fetch users error:', err);
      setError('Failed to fetch users');
      setLoading(false);
    }
  }, [token, setUsers, setLoading, setError]);

  useEffect(() => {
    let isMounted = true;
    if (token) {
      // Defer execution to avoid synchronous setState warnings in strict linters
      Promise.resolve().then(() => {
        if (isMounted) fetchUsers();
      });
    }
    return () => { isMounted = false; };
  }, [fetchUsers, token]);

  const handleToggleActive = async (user) => {
    try {
      const updatedStatus = !user.is_active;
      // When approving a user, also grant staff access. When revoking, remove it.
      await axios.patch(`${API_URL}users/${user.id}/`,
        { is_active: updatedStatus, is_staff: updatedStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(prevUsers => prevUsers.map(u => u.id === user.id ? { ...u, is_active: updatedStatus, is_staff: updatedStatus } : u));
    } catch (err) {
      console.error('Update status error:', err);
      alert('Failed to update user status');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      await axios.delete(`${API_URL}users/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(prevUsers => prevUsers.filter(u => u.id !== id));
    } catch (err) {
      console.error('Delete user error:', err);
      alert('Failed to delete user');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-primary italic uppercase tracking-tighter">
            Employee Net
          </h1>
          <p className="text-primary/60 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-1">
            Manage permissions and verify system identities
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-accent/10 p-4 rounded-2xl border border-accent/20 flex items-center gap-3 text-accent text-xs font-black uppercase">
          <UserX size={18} />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {users.map((user) => (
          <div 
            key={user.id} 
            className="bg-neutral/10 backdrop-blur-sm p-4 md:p-6 rounded-[2rem] border border-primary/5 hover:border-accent/20 transition-all group relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            {/* Subtle Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-accent/10 transition-colors" />

            <div className="flex items-center gap-4 relative z-10">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-sm transition-all ${
                user.is_active ? 'bg-primary text-secondary' : 'bg-neutral/40 text-primary/40'
              }`}>
                {user.username.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="font-black text-primary text-base uppercase tracking-tight">{user.username}</h3>
                <div className="flex flex-col gap-1 mt-1">
                  <p className="text-[10px] text-primary/60 font-bold flex items-center gap-2">
                    <Mail size={12} className="text-accent" /> {user.email}
                  </p>
                  <p className="text-[10px] text-primary/40 font-bold flex items-center gap-2">
                    <Calendar size={12} /> Registered: {new Date(user.date_joined).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap md:flex-nowrap items-center gap-4 relative z-10">
              <div className="flex flex-col md:items-end gap-2">
                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${
                    user.is_active ? 'bg-accent/20 text-primary' : 'bg-neutral/30 text-primary/60'
                  }`}>
                    <ShieldCheck size={12} className={user.is_active ? 'text-accent' : 'text-primary/40'} />
                    {user.is_active ? 'Verified' : 'Pending Review'}
                  </div>
                  <div className="px-3 py-1 bg-primary/5 rounded-full text-[10px] font-black uppercase tracking-widest text-primary/60">
                    {user.is_staff ? 'Staff Member' : 'Standard User'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-auto md:ml-4">
                <button
                  onClick={() => handleToggleActive(user)}
                  title={user.is_active ? 'Revoke Access' : 'Approve Access'}
                  className={`p-3 rounded-2xl transition-all ${
                    user.is_active 
                      ? 'bg-neutral/20 text-primary/40 hover:bg-accent/10 hover:text-accent border border-transparent hover:border-accent/20' 
                      : 'bg-primary text-secondary hover:bg-accent shadow-lg shadow-primary/20'
                  }`}
                >
                  {user.is_active ? <UserX size={18} /> : <UserCheck size={18} />}
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  title="Purge Identity"
                  className="p-3 bg-neutral/20 text-primary/40 hover:bg-red-500 hover:text-white rounded-2xl transition-all border border-transparent hover:border-red-500/20"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {users.length === 0 && (
          <div className="bg-neutral/10 rounded-[2.5rem] p-20 text-center border-2 border-dashed border-primary/10">
            <p className="text-primary/30 font-black text-xs uppercase tracking-widest">
              No digital identities found in the system
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
