import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;
import QuickPOS from '../components/QuickPOS';

const POS = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

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
      const response = await axios.get(`${API_URL}products/`, config);
      setProducts(response.data);
    } catch (error) {
      if (error.response?.status === 401) localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  }, [token, config]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Inside POS.jsx -> handleSaleComplete
const handleSaleComplete = async (cart) => {
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    // 1. STOCK VALIDATION: Pre-check before calling API
    for (const item of cart) {
      const product = products.find(p => p.id === item.id);
      if (product.stock < item.qty) {
        showNotify(`ASSET DEPLETED: ${item.name} has insufficient stock.`);
        return; // Halt transaction
      }
    }

    // 2. OPTIMIZED PROMISES
    const transactions = cart.map(item => {
      const product = products.find(p => p.id === item.id);
      return [
        axios.patch(`${API_URL}products/${item.id}/`, { stock: product.stock - item.qty }, config),
        axios.post(`${API_URL}sales/`, {
          product_name: item.name,
          quantity: item.qty,
          total_price: (item.price * item.qty).toFixed(2)
        }, config)
      ];
    }).flat();

    await Promise.all(transactions);
    
    fetchData();
    showNotify("TRANSACTION LOGGED & INVENTORY UPDATED");
  } catch (err) {
    console.error("Transaction failed:", err);
    showNotify("CRITICAL ERROR: Data not synced");
  }
};

  if (loading) return <div className="p-10 font-black text-primary animate-pulse text-center uppercase">Initializing Terminal...</div>;

  return (
    <div className="max-w-[1000px] mx-auto animate-in fade-in duration-500">
      {notification && (
        <div className="fixed bottom-10 right-10 bg-primary text-secondary px-6 py-3 rounded-xl shadow-2xl z-50 font-black text-[10px] uppercase">
          {notification}
        </div>
      )}
      <header className="mb-10">
        <h1 className="text-3xl font-black text-primary tracking-tighter uppercase italic">Sales Terminal</h1>
        <p className="text-primary/60 text-[10px] font-bold uppercase tracking-[0.3em]">Operational Transaction Flow</p>
      </header>

      <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-primary/5 shadow-2xl">
        <QuickPOS products={products} onSaleComplete={handleSaleComplete} />
      </div>
    </div>
  );
};

export default POS;