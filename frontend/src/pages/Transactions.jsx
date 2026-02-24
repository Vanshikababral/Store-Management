import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;
import { Search, Calendar, RefreshCcw, FileText, Download } from 'lucide-react';
import * as XLSX from 'xlsx'; // Import the excel library

const Transactions = ({ token }) => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const config = useMemo(() => ({ 
    headers: { Authorization: `Bearer ${token}` } 
  }), [token]);

  const fetchSales = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}sales/`, config);
      setSales(res.data.reverse()); 
    } catch (err) {
      console.error("Failed to fetch sales log", err);
    } finally {
      setLoading(false);
    }
  }, [config]);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const filteredSales = useMemo(() => {
    return sales.filter(sale => {
      const matchesSearch = sale.product_name.toLowerCase().includes(searchTerm.toLowerCase());
      const saleDate = new Date(sale.timestamp).setHours(0,0,0,0);
      const start = startDate ? new Date(startDate).setHours(0,0,0,0) : null;
      const end = endDate ? new Date(endDate).setHours(0,0,0,0) : null;
      return matchesSearch && (start ? saleDate >= start : true) && (end ? saleDate <= end : true);
    });
  }, [sales, searchTerm, startDate, endDate]);

  // --- EXPORT LOGIC ---
  const exportToExcel = () => {
    // 1. Map data to a clean format for Excel
    const dataToExport = filteredSales.map(sale => ({
      'Date': new Date(sale.timestamp).toLocaleString(),
      'Product Name': sale.product_name,
      'Quantity': sale.quantity,
      'Total Revenue (₹)': parseFloat(sale.total_price).toFixed(2),
      'Transaction ID': `#${sale.id}`
    }));

    // 2. Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales_Report");

    // 3. Trigger download
    const fileName = `Sales_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  if (loading && sales.length === 0) return (
    <div className="p-20 flex flex-col items-center justify-center space-y-4">
      <RefreshCcw className="animate-spin text-primary/20" size={40} />
      <div className="font-black text-primary tracking-[0.3em] uppercase text-xs">Accessing_Ledger...</div>
    </div>
  );

  return (
    <div className="max-w-[1200px] mx-auto p-4 animate-in fade-in duration-500">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-primary tracking-tighter uppercase italic">Audit_Log</h1>
          <p className="text-primary/60 text-[10px] font-bold uppercase tracking-[0.3em]">Master Transaction Ledger</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-primary/5 px-6 py-4 rounded-2xl border border-primary/5 text-right">
            <p className="text-[9px] font-black text-primary/40 uppercase mb-1">Filtered Revenue</p>
            <p className="text-2xl font-black text-primary italic">
              ₹{filteredSales.reduce((acc, s) => acc + parseFloat(s.total_price), 0).toLocaleString('en-IN')}
            </p>
          </div>
          
          {/* EXPORT BUTTON */}
          <button 
            onClick={exportToExcel}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 active:scale-95"
          >
            <Download size={16} /> Export_XLSX
          </button>
        </div>
      </header>

      {/* FILTER CONTROL BAR */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30" size={16} />
          <input 
            type="text"
            placeholder="Search transactions..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-primary/10 rounded-2xl text-xs font-bold uppercase outline-none focus:border-accent/40 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <input 
          type="date"
          className="w-full px-4 py-4 bg-white border border-primary/10 rounded-2xl text-[10px] font-black uppercase outline-none focus:border-accent/40"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <input 
          type="date"
          className="w-full px-4 py-4 bg-white border border-primary/10 rounded-2xl text-[10px] font-black uppercase outline-none focus:border-accent/40"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[2rem] border border-primary/10 shadow-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-neutral/10 text-[9px] font-black text-primary/50 uppercase tracking-[0.2em]">
            <tr>
              <th className="px-8 py-6">Timeline</th>
              <th className="px-8 py-6">Asset</th>
              <th className="px-8 py-6 text-center">Qty</th>
              <th className="px-8 py-6 text-right">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/5">
            {filteredSales.map((sale) => (
              <tr key={sale.id} className="hover:bg-primary/[0.02] transition-colors group">
                <td className="px-8 py-5 text-[10px] font-mono text-primary/30">
                  {new Date(sale.timestamp).toLocaleDateString()}
                </td>
                <td className="px-8 py-5 text-xs font-black text-primary uppercase italic">{sale.product_name}</td>
                <td className="px-8 py-5 text-center font-bold">{sale.quantity}</td>
                <td className="px-8 py-5 text-right font-black text-green-600">
                  ₹{parseFloat(sale.total_price).toLocaleString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;