import React, { useState } from 'react';
import API from '../utils/axiosInstance';
import { Package, X, Loader2, CheckCircle2, Printer } from 'lucide-react';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const QuickPOS = ({ products, onSaleComplete }) => {
  const [cart, setCart] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [selectedQty, setSelectedQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // --- CONFIGURATION ---
  const TAX_RATE = 0.12; // 12% Total GST
  const STORE_NAME = "MATRIX_RETAIL_STORES";
  const STORE_ADDR = "123 Matrix Plaza, Tech Hub, IN";

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${BACKEND_URL}${path}`;
  };

  // --- RECEIPT PRINTING LOGIC ---
  const printCustomerReceipt = (cartData, subtotal) => {
    const printWindow = window.open('', '_blank', 'width=350,height=600');
    const date = new Date().toLocaleString('en-IN');
    const taxAmount = subtotal * TAX_RATE;
    const grandTotal = subtotal + taxAmount;
    const cgst = taxAmount / 2;
    const sgst = taxAmount / 2;

    const receiptHtml = `
      <html>
        <head>
          <style>
            body { font-family: 'Courier New', Courier, monospace; width: 280px; padding: 15px; color: #000; line-height: 1.2; }
            .center { text-align: center; }
            .divider { border-top: 1px dashed #000; margin: 8px 0; }
            .item-row { display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 3px; }
            .bold { font-weight: bold; }
            .footer { font-size: 9px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="center">
            <h2 style="margin:0; font-size:18px;">${STORE_NAME}</h2>
            <p style="font-size:10px; margin:2px;">${STORE_ADDR}</p>
            <div class="divider"></div>
            <p class="bold">TAX INVOICE</p>
            <p style="font-size:10px;">${date}</p>
          </div>

          <div class="divider"></div>
          ${cartData.map(item => `
            <div class="item-row">
              <span>${item.name.substring(0,15)} x${item.qty}</span>
              <span>₹${(item.price * item.qty).toFixed(2)}</span>
            </div>
          `).join('')}
          <div class="divider"></div>

          <div class="item-row">
            <span>NET AMOUNT:</span>
            <span>₹${subtotal.toFixed(2)}</span>
          </div>
          <div class="item-row">
            <span>CGST (6%):</span>
            <span>₹${cgst.toFixed(2)}</span>
          </div>
          <div class="item-row">
            <span>SGST (6%):</span>
            <span>₹${sgst.toFixed(2)}</span>
          </div>
          
          <div class="divider"></div>
          <div class="item-row bold" style="font-size:14px;">
            <span>GRAND TOTAL:</span>
            <span>₹${grandTotal.toFixed(2)}</span>
          </div>
          <div class="divider"></div>

          <div class="center footer">
            <p>GSTIN: 27AAAAA0000A1Z5</p>
            <p>E-PAYMENT AUTHORIZED</p>
            <p class="bold" style="margin-top:10px;">THANK YOU FOR YOUR VISIT!</p>
          </div>
          <script>
            window.onload = () => { window.print(); setTimeout(() => window.close(), 500); }
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(receiptHtml);
    printWindow.document.close();
  };

  const addToCart = () => {
    const product = products.find(p => p.id === parseInt(selectedId));
    if (!product) return;
    
    const existingInCart = cart.find(item => item.id === product.id);
    const currentCartQty = existingInCart ? existingInCart.qty : 0;
    
    if (product.stock < (currentCartQty + selectedQty)) {
      return alert(`STOCK_DEFICIT: Only ${product.stock} units available.`);
    }

    if (existingInCart) {
      setCart(cart.map(item => item.id === product.id ? 
        {...item, qty: item.qty + selectedQty} : item));
    } else {
      setCart([...cart, { ...product, qty: selectedQty }]);
    }
    setSelectedId("");
    setSelectedQty(1);
  };

  const removeItem = (id) => setCart(cart.filter(item => item.id !== id));

  const handleCommitTransaction = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const cartSnapshot = [...cart];
    try {
      const saleRequests = cart.map(item => 
        API.post('sales/', {
          product_name: item.name,
          quantity: item.qty,
          total_price: (item.price * item.qty).toFixed(2)
        })
      );

      await Promise.all(saleRequests);
      
      setSuccess(true);
      setCart([]);
      
      // Print the tax-inclusive receipt
      printCustomerReceipt(cartSnapshot, subtotal);

      setTimeout(() => {
        onSaleComplete(); 
        setSuccess(false);
      }, 2000);

    } catch (err) {
      console.error("Critical Protocol Error", err);
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const taxAmount = subtotal * TAX_RATE;
  const grandTotal = subtotal + taxAmount;

  return (
    <div className="bg-primary p-6 md:p-8 rounded-[2.5rem] shadow-2xl text-secondary border border-white/10 relative overflow-hidden min-h-[550px] flex flex-col">
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full -mr-32 -mt-32 blur-[80px]" />
      
      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-6 relative z-10 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
        Matrix_POS_Terminal
      </h3>

      {success ? (
        <div className="flex-grow flex flex-col items-center justify-center animate-in zoom-in-95">
           <CheckCircle2 size={48} className="text-accent mb-4" />
           <p className="font-black italic uppercase tracking-widest text-sm text-accent">Payment_Authorized</p>
           <p className="text-[9px] opacity-40 uppercase mt-2 italic">Receipt Printing...</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-3 mb-8 relative z-10">
            <select 
              onChange={(e) => setSelectedId(e.target.value)}
              className="flex-grow p-4 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-bold outline-none focus:border-accent/50 appearance-none"
              value={selectedId}
            >
              <option value="" className="text-primary italic">Select_Product...</option>
              {products.map(p => (
                <option key={p.id} value={p.id} disabled={p.stock <= 0} className="text-primary font-bold">
                  {p.name} (₹{p.price})
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <input 
                type="number" min="1" value={selectedQty}
                onChange={(e) => setSelectedQty(parseInt(e.target.value) || 1)}
                className="w-20 p-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-black text-center"
              />
              <button 
                onClick={addToCart} disabled={!selectedId}
                className="bg-accent text-white px-6 rounded-2xl font-black text-[10px] uppercase hover:scale-105 transition-all"
              >
                Buffer
              </button>
            </div>
          </div>

          <div className="flex-grow space-y-3 mb-8 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar relative z-10">
            {cart.map(item => (
              <div key={item.id} className="group flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                    {item.image ? <img src={getImageUrl(item.image)} className="w-full h-full object-cover rounded-xl" /> : <Package size={14} className="opacity-20" />}
                   </div>
                   <div>
                    <span className="text-[10px] font-black uppercase block tracking-tight">{item.name}</span>
                    <span className="text-[9px] font-bold opacity-30 uppercase">₹{item.price} × {item.qty}</span>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-black text-accent italic">₹{(item.price * item.qty).toFixed(2)}</span>
                  <button onClick={() => removeItem(item.id)} className="p-1 hover:text-accent opacity-0 group-hover:opacity-100"><X size={14} /></button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-6 mt-auto relative z-10">
            <div className="space-y-1 mb-6">
              <div className="flex justify-between text-[10px] font-bold opacity-40 uppercase">
                <span>Net_Amount</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[10px] font-bold opacity-40 uppercase">
                <span>Total_Tax_(GST_12%)</span>
                <span>₹{taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-end mt-2">
                <span className="text-[11px] font-black opacity-30 uppercase">Grand_Total</span>
                <span className="text-4xl font-black italic tracking-tighter text-white">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
            
            <button 
              onClick={handleCommitTransaction}
              disabled={cart.length === 0 || loading}
              className="w-full py-5 bg-white text-primary rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-accent hover:text-white disabled:opacity-10 transition-all flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="animate-spin" /> : <><Printer size={16}/> AUTHORIZE & PRINT INVOICE</>}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default QuickPOS;