import React, { useState, useEffect } from 'react';
import API from '../utils/axiosInstance';
import { X, ShoppingCart, CheckCircle, AlertCircle } from 'lucide-react';

const QuickSaleModal = ({ isOpen, onClose, products, onSaleSuccess }) => {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | success | error

  // Auto-reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
      setQuantity(1);
      if (products.length > 0) setSelectedProductId(products[0].id);
    }
  }, [isOpen, products]);

  const selectedProduct = products.find(p => p.id === parseInt(selectedProductId));
  const totalPrice = selectedProduct ? (selectedProduct.price * quantity).toFixed(2) : "0.00";

  const handleSale = async (e) => {
    e.preventDefault();
    if (!selectedProductId || quantity < 1) return;
    
    setLoading(true);
    try {
      await API.post('sales/', {
        product_name: selectedProduct.name,
        quantity: parseInt(quantity),
        total_price: totalPrice
      });
      setStatus('success');
      setTimeout(() => {
        onSaleSuccess(); // This triggers the Dashboard's fetchData
        onClose();
      }, 1500);
    } catch (err) {
      setStatus('error');
      console.error("Transaction Failed:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-primary/5 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black text-primary italic uppercase tracking-tighter">Initialize_Transaction</h2>
            <button onClick={onClose} className="p-2 hover:bg-neutral/10 rounded-full transition-colors">
              <X size={20} className="text-primary/40" />
            </button>
          </div>

          {status === 'success' ? (
            <div className="py-12 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle size={32} />
              </div>
              <p className="font-black text-primary uppercase tracking-widest text-xs">Transaction Authorized</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Updating Matrix Ledger...</p>
            </div>
          ) : (
            <form onSubmit={handleSale} className="space-y-6">
              {/* Product Selection */}
              <div>
                <label className="text-[9px] font-black text-primary/40 uppercase tracking-[0.2em] ml-2">Select Asset</label>
                <select 
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full mt-2 bg-neutral/10 border-none rounded-2xl px-4 py-4 text-sm font-bold text-primary focus:ring-2 focus:ring-primary/20"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                      {p.name} {p.stock <= 0 ? '(DEPLETED)' : `(Stock: ${p.stock})`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label className="text-[9px] font-black text-primary/40 uppercase tracking-[0.2em] ml-2">Volume (Quantity)</label>
                <input 
                  type="number" 
                  min="1"
                  max={selectedProduct?.stock || 1}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full mt-2 bg-neutral/10 border-none rounded-2xl px-4 py-4 text-sm font-bold text-primary"
                />
              </div>

              {/* Price Summary */}
              <div className="bg-primary/5 p-6 rounded-3xl border border-primary/5">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] font-black text-primary/40 uppercase tracking-widest">Calculated Value</span>
                  <span className="text-[9px] font-black text-green-600 uppercase tracking-widest italic">Ready to process</span>
                </div>
                <div className="text-3xl font-black text-primary tracking-tighter italic">₹{totalPrice}</div>
              </div>

              {status === 'error' && (
                <div className="flex items-center gap-2 text-accent font-bold text-[10px] uppercase italic">
                  <AlertCircle size={14} /> System Protocol Failure: Check Stocks
                </div>
              )}

              <button 
                type="submit"
                disabled={loading || (selectedProduct && selectedProduct.stock < quantity)}
                className="w-full bg-primary text-secondary py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-accent transition-all shadow-xl shadow-primary/10"
              >
                {loading ? <div className="w-4 h-4 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin" /> : <ShoppingCart size={16} />}
                Confirm_Order
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickSaleModal;