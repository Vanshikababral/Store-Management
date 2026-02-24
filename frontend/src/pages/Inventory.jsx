import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;
import InventoryList from '../components/InventoryList';
import FilterToolbar from '../components/FilterToolbar';
import AddProductForm from '../components/AddProductForm';
import Pagination from '../components/Pagination';

const Inventory = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false); // New state for toggle
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const config = React.useMemo(() => ({ 
    headers: { Authorization: `Bearer ${token}` } 
  }), [token]);

  const showNotify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchData = useCallback(async () => {
    if (!token) return;
    try {
      const [prodRes, catRes] = await Promise.all([
        axios.get(`${API_URL}products/`, config),
        axios.get(`${API_URL}categories/`, config)
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (error) {
      if (error.response?.status === 401) localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  }, [token, config]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleQuickUpdate = (id, change) => {
    const product = products.find(p => p.id === id);
    const newStock = Math.max(0, product.stock + change);
    axios.patch(`${API_URL}products/${id}/`, { stock: newStock }, config)
      .then(() => { fetchData(); showNotify("Stock Updated"); });
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || p.category.toString() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const currentItems = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return <div className="p-10 font-black text-primary animate-pulse text-center">ACCESSING MATRIX...</div>;

  return (
    <div className="max-w-[1400px] mx-auto relative">
      {notification && (
        <div className="fixed bottom-10 right-10 bg-primary text-secondary px-6 py-3 rounded-xl shadow-2xl z-50 font-black text-[10px] uppercase">
          {notification}
        </div>
      )}

      {/* Header Section */}
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-primary tracking-tighter uppercase italic">Inventory Matrix</h1>
          <p className="text-primary/60 text-[10px] font-bold uppercase tracking-[0.3em]">Master Asset Ledger</p>
        </div>
        
        {/* Toggle Button: Only visible to Admins */}
        {isAdmin && (
          <button 
            onClick={() => setShowForm(!showForm)}
            className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg ${
              showForm ? 'bg-accent text-white shadow-accent/20' : 'bg-primary text-secondary shadow-primary/20 hover:bg-accent'
            }`}
          >
            {showForm ? 'Close Editor' : '+ Add New Product'}
          </button>
        )}
      </header>

      <div className="flex flex-col gap-8">
        {/* Animated Form Panel */}
        {showForm && isAdmin && (
          <div className="bg-white p-8 rounded-3xl border border-primary/10 shadow-xl animate-slideDown">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-black text-primary uppercase tracking-widest">Register New Asset</h3>
              <span className="text-[10px] text-gray-400 italic">Fill all required fields to update global matrix</span>
            </div>
            <div className="max-w-4xl mx-auto">
              <AddProductForm 
                onProductAdded={() => { fetchData(); setShowForm(false); showNotify("Product Registered"); }} 
                categories={categories} 
                token={token} 
              />
            </div>
          </div>
        )}

        {/* Main Data View */}
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-primary/5 shadow-2xl transition-all">
          <div className="mb-8">
            <FilterToolbar 
              searchTerm={searchTerm} setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
              categories={categories}
            />
          </div>
          
          <InventoryList 
            products={currentItems}
            onEdit={(p) => { setEditingId(p.id); setEditFormData(p); }}
            onDelete={(id, name) => { if(window.confirm(`Purge ${name}?`)) axios.delete(`${API_URL}products/${id}/`, config).then(fetchData); }}
            onQuickUpdate={handleQuickUpdate}
            editingId={editingId}
            editFormData={editFormData}
            setEditFormData={setEditFormData}
            onSave={(id) => {
              const { image: _Image, category_name: _CatName, ...dataToSend } = editFormData;
              axios.put(`${API_URL}products/${id}/`, dataToSend, config).then(() => {setEditingId(null); fetchData(); showNotify("Asset Updated");}).catch(err => console.error("Update failed:", err.response?.data));
            }}
            onCancel={() => setEditingId(null)}
          />
          
          <div className="mt-8 border-t border-primary/5 pt-6">
            <Pagination totalItems={filteredProducts.length} itemsPerPage={itemsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;