import React from 'react';
import { TrendingUp, AlertTriangle, Box, Activity } from 'lucide-react';

const StatsGrid = ({ products = [], sales = [], intel = {} }) => {
  // --- INTELLIGENCE FALLBACKS ---
  // If intel isn't passed, we calculate locally to prevent crashes
  const totalValue = intel.assetVolume 
    ? products.reduce((acc, p) => acc + (p.price * p.stock), 0)
    : 0;

  const today = new Date().toLocaleDateString();
  const todayRevenue = sales
    .filter(sale => new Date(sale.timestamp).toLocaleDateString() === today)
    .reduce((acc, sale) => acc + parseFloat(sale.total_price || 0), 0);

  const lowStockCount = intel.lowStockCount ?? products.filter(p => p.stock < 10).length;

  // --- STYLING ---
  const cardBase = "relative overflow-hidden bg-white/70 backdrop-blur-md p-6 rounded-[2rem] border border-primary/5 shadow-xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl group";
  const labelClass = "text-[9px] font-black text-primary/40 uppercase tracking-[0.2em] mb-1";
  const valueClass = "text-3xl font-black text-primary tracking-tighter italic";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      
      {/* 1. Total Inventory Valuation */}
      <div className={cardBase}>
        <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
          <Box size={100} />
        </div>
        <p className={labelClass}>Asset Valuation</p>
        <p className={valueClass}>₹{totalValue.toLocaleString('en-IN')}</p>
        <div className="mt-2 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[8px] font-bold text-green-600 uppercase">Live_Market_Sync</span>
        </div>
      </div>

      {/* 2. Today's Revenue Performance */}
      <div className={cardBase}>
        <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity text-green-600">
          <TrendingUp size={100} />
        </div>
        <p className={labelClass}>24H Revenue</p>
        <p className={`${valueClass} text-green-600`}>+₹{todayRevenue.toLocaleString('en-IN')}</p>
        <p className="text-[8px] font-bold text-primary/30 uppercase mt-2 tracking-widest">
          {sales.length > 0 ? `${sales.length} Operations Processed` : 'Awaiting Transactions'}
        </p>
      </div>

      {/* 3. SKU Matrix Count */}
      <div className={cardBase}>
        <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
          <Activity size={100} />
        </div>
        <p className={labelClass}>Active SKUs</p>
        <p className={valueClass}>{products.length}</p>
        <p className="text-[8px] font-bold text-primary/30 uppercase mt-2 tracking-widest">Database_Verified</p>
      </div>

      {/* 4. Risk Assessment */}
      <div className={`${cardBase} ${lowStockCount > 0 ? 'border-accent/20 bg-accent/[0.02]' : ''}`}>
        <div className={`absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity ${lowStockCount > 0 ? 'text-accent' : 'text-primary'}`}>
          <AlertTriangle size={100} />
        </div>
        <p className={labelClass}>Stock Risks</p>
        <p className={`${valueClass} ${lowStockCount > 0 ? 'text-accent' : 'text-primary'}`}>
          {lowStockCount.toString().padStart(2, '0')}
        </p>
        <div className="mt-2">
          {lowStockCount > 0 ? (
            <span className="text-[8px] font-black text-accent uppercase animate-pulse italic">Immediate_Action_Required</span>
          ) : (
            <span className="text-[8px] font-bold text-green-600 uppercase tracking-widest">Reserves_Optimal</span>
          )}
        </div>
      </div>

    </div>
  );
};

export default StatsGrid;