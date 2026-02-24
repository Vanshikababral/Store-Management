import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;
import { LayoutDashboard, Database, ShieldCheck, Plus } from 'lucide-react';

// Components
import StatsGrid from '../components/StatsGrid';
import SupplyAlerts from '../components/SupplyAlerts';
import CategoryBreakdown from '../components/CategoryBreakdown';
import SalesChart from '../components/SalesChart';
import QuickSaleModal from '../components/QuickSaleModal';

const Dashboard = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    if (!token) return;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const [prodRes, catRes, saleRes] = await Promise.all([
        axios.get(`${API_URL}products/`, config),
        axios.get(`${API_URL}categories/`, config),
        axios.get(`${API_URL}sales/`, config)
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
      setSales(saleRes.data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken');
        window.location.reload();
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const intel = useMemo(() => {
    const revenue = sales.reduce((acc, sale) => acc + parseFloat(sale.total_price || 0), 0);
    const lowStock = products.filter(p => p.stock < 10).length;
    return {
      totalRevenue: revenue,
      lowStockCount: lowStock,
      assetVolume: products.reduce((acc, p) => acc + (p.stock || 0), 0),
      transactionCount: sales.length
    };
  }, [sales, products]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-4">
      <div className="w-12 h-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
      <p className="text-[10px] font-black text-primary animate-pulse uppercase tracking-widest">Loading_Dashboard_Core</p>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8 space-y-10 animate-in fade-in duration-700">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 text-primary/40 mb-1">
            <Database size={12} />
            <span className="text-[9px] font-black uppercase tracking-[0.3em]">Operational_Node_Alpha</span>
          </div>
          <h1 className="text-4xl font-black text-primary tracking-tighter uppercase italic leading-none">Command_Ctr</h1>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-3 bg-primary text-secondary px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-accent transition-all shadow-xl shadow-primary/20"
        >
          <Plus size={18} /> New_Transaction
        </button>
      </header>

      {/* STATS SECTION */}
      <StatsGrid products={products} sales={sales} intel={intel} />

      {/* VISUAL ANALYTICS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-primary/5 shadow-2xl h-full">
            <h3 className="text-[10px] font-black text-primary/40 uppercase tracking-widest mb-8">Revenue_Flux_Dynamics</h3>
            <SalesChart sales={sales} />
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <CategoryBreakdown products={products} categories={categories} />
        </div>
      </div>

      {/* LOWER GRID: Focusing on Risk and Stock rather than transactions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h3 className="text-[10px] font-black text-accent uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
             Supply_Risk_Alerts
          </h3>
          <SupplyAlerts products={products} />
        </div>
      </div>

      <QuickSaleModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        products={products}
        token={token}
        onSaleSuccess={fetchData} 
      />
    </div>
  );
};

export default Dashboard;