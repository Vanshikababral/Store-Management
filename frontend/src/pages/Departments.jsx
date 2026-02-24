import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;
import { Layers, Plus, Edit2, Trash2, Check, X } from 'lucide-react';

const Departments = ({ token }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [notification, setNotification] = useState(null);

  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const config = React.useMemo(() => ({
    headers: { Authorization: `Bearer ${token}` }
  }), [token]);

  const showNotify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchCategories = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API_URL}categories/`, config);
      setCategories(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('authToken');
        window.location.reload(); // Force re-auth
      }
      console.error("Failed to fetch categories", err);
    } finally {
      setLoading(false);
    }
  }, [token, config]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    try {
      await axios.post(`${API_URL}categories/`, { name: newCategory }, config);
      setNewCategory('');
      fetchCategories();
      showNotify("Department Registered");
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.name || "Action Denied";
      showNotify(errorMsg);
      if (err.response?.status === 401) {
        localStorage.removeItem('authToken');
        window.location.reload();
      }
    }
  };

  const handleUpdate = async (id) => {
    if (!editName.trim()) return;
    try {
      await axios.put(`${API_URL}categories/${id}/`, { name: editName }, config);
      setEditingId(null);
      fetchCategories();
      showNotify("Department Restructured");
    } catch (err) {
      showNotify("Update Failed");
      if (err.response?.status === 401) {
        localStorage.removeItem('authToken');
        window.location.reload();
      }
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to purge the ${name} department? This may affect linked products.`)) return;
    try {
      await axios.delete(`${API_URL}categories/${id}/`, config);
      fetchCategories();
      showNotify("Department Purged");
    } catch {
      showNotify("Purge Failed: Active links detected");
    }
  };

  if (loading) return <div className="p-10 font-black text-primary animate-pulse text-center uppercase">Mapping Asset Departments...</div>;

  return (
    <div className="max-w-[800px] mx-auto relative h-full">
      {notification && (
        <div className="fixed bottom-10 right-10 bg-primary text-secondary px-6 py-3 rounded-xl shadow-2xl z-50 font-black text-[10px] uppercase">
          {notification}
        </div>
      )}

      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tighter uppercase italic">Department Matrix</h1>
          <p className="text-primary/60 text-[10px] font-bold uppercase tracking-[0.3em]">Operational Departmental Hierarchy</p>
        </div>
      </header>

      <div className="space-y-8">
        {/* Creation Form */}
        {isAdmin && (
          <form onSubmit={handleAdd} className="bg-white p-6 rounded-[2rem] border border-primary/5 shadow-xl flex gap-3 animate-in fade-in duration-500">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
              <Layers size={20} />
            </div>
            <input 
              type="text" 
              placeholder="REGISTER NEW DEPARTMENT..." 
              className="flex-grow bg-neutral/10 rounded-xl px-6 text-[10px] font-black uppercase tracking-widest outline-none focus:border-accent/40 border border-transparent transition-all"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button type="submit" className="bg-primary text-secondary px-8 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-accent transition-all shadow-lg shadow-primary/10">
              Commit
            </button>
          </form>
        )}

        {/* Categories List */}
        <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] border border-primary/5 shadow-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] border-b border-primary/5">
                <th className="px-10 py-6">Identity</th>
                {isAdmin && <th className="px-10 py-6 text-right">Operational Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {categories.map((cat) => (
                <tr key={cat.id} className="group hover:bg-secondary/5 transition-colors">
                  <td className="px-10 py-6">
                    {editingId === cat.id ? (
                      <input 
                        className="bg-accent/10 border-b-2 border-accent text-xs font-black uppercase outline-none w-64"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        autoFocus
                      />
                    ) : (
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-accent opacity-40" />
                        <span className="text-xs font-black text-primary uppercase italic tracking-tight">{cat.name}</span>
                      </div>
                    )}
                  </td>
                  {isAdmin && (
                    <td className="px-10 py-6 text-right space-x-4">
                      {editingId === cat.id ? (
                        <>
                          <button onClick={() => handleUpdate(cat.id)} className="text-green-600 hover:scale-110 transition-transform"><Check size={18} /></button>
                          <button onClick={() => setEditingId(null)} className="text-gray-400 hover:scale-110 transition-transform"><X size={18} /></button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={() => { setEditingId(cat.id); setEditName(cat.name); }} 
                            className="text-primary/60 hover:text-primary transition-colors inline-flex items-center gap-2 text-[9px] font-black uppercase"
                          >
                            <Edit2 size={14} />
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity">Edit</span>
                          </button>
                          <button 
                            onClick={() => handleDelete(cat.id, cat.name)} 
                            className="text-accent/60 hover:text-accent transition-colors inline-flex items-center gap-2 text-[9px] font-black uppercase"
                          >
                            <Trash2 size={14} />
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity">Purge</span>
                          </button>
                        </>
                      )}
                    </td>
                  )}
                </tr>
              ))}
              {categories.length === 0 && !loading && (
                <tr>
                  <td colSpan="2" className="py-20 text-center">
                    <p className="text-[10px] font-black text-primary/20 uppercase tracking-[0.4em]">Matrix Hierarchy Undefined</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Departments;
