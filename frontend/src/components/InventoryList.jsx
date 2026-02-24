import React from 'react';
import { Image as ImageIcon, Package } from 'lucide-react';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import { Link } from 'react-router-dom'; // 1. Added Link import

const InventoryList = ({ 
  products, onEdit, onDelete, onQuickUpdate, 
  editingId, editFormData, setEditFormData, onSave, onCancel 
}) => {
  
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${BACKEND_URL}${path}`;
  };

  const isAdmin = localStorage.getItem('isAdmin') === 'true' || localStorage.getItem('isAdmin') === true;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="text-[10px] font-black text-primary/60 uppercase tracking-widest border-b border-primary/10 bg-neutral/10">
            <th className="px-6 py-5">Asset Visual</th>
            <th className="px-6 py-5">Asset Details</th>
            <th className="px-6 py-5 text-center">In-Stock</th>
            <th className="px-6 py-5 text-right">Price</th>
            <th className="px-6 py-5 text-center">Management</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-primary/5">
          {products.map(product => (
            <tr key={product.id} className="group hover:bg-secondary/10 transition-colors">
              {editingId === product.id ? (
                // --- EDIT MODE (Stays the same) ---
                <>
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 bg-neutral/20 rounded-xl overflow-hidden flex items-center justify-center border border-primary/5 opacity-50">
                      {product.image ? (
                        <img src={getImageUrl(product.image)} className="w-full h-full object-cover" alt="edit preview" />
                      ) : (
                        <ImageIcon size={18} className="text-primary/20" />
                      )}
                    </div>
                  </td>
                  <td className="py-4">
                    <input 
                      value={editFormData.name} 
                      onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} 
                      className="text-xs font-bold border-b-2 border-primary outline-none bg-transparent w-full" 
                    />
                  </td>
                  <td className="py-4 text-center">
                    <input 
                      type="number" 
                      value={editFormData.stock} 
                      onChange={(e) => setEditFormData({...editFormData, stock: e.target.value})} 
                      className="text-xs font-bold w-16 text-center bg-secondary/30 rounded py-1" 
                    />
                  </td>
                  <td className="py-4 text-right">
                    <input 
                      type="number" 
                      value={editFormData.price} 
                      onChange={(e) => setEditFormData({...editFormData, price: e.target.value})} 
                      className="text-xs font-bold w-20 text-right bg-secondary/30 rounded py-1" 
                    />
                  </td>
                  <td className="py-4 text-center space-x-3">
                    <button onClick={() => onSave(product.id)} className="text-[9px] font-black text-green-600 uppercase hover:underline">Confirm</button>
                    <button onClick={onCancel} className="text-[9px] font-black text-gray-400 uppercase hover:underline">Abort</button>
                  </td>
                </>
              ) : (
                // --- VIEW MODE (Links added here) ---
                <>
                  <td className="px-6 py-4">
                    {/* 2. Wrap image in Link */}
                    <Link to={`/products/${product.id}`} className="block w-12 h-12 cursor-pointer">
                      <div className="w-full h-full bg-neutral/20 rounded-xl overflow-hidden flex items-center justify-center border border-primary/5">
                        {product.image ? (
                          <img 
                            src={getImageUrl(product.image)} 
                            alt={product.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <Package size={18} className="text-primary/20" />
                        )}
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-5">
                    {/* 3. Wrap Name in Link */}
                    <Link to={`/products/${product.id}`} className="cursor-pointer group/link">
                      <p className="text-xs font-black text-primary uppercase italic group-hover/link:text-accent transition-colors">
                        {product.name}
                      </p>
                      <p className="text-[9px] text-primary/40 font-mono uppercase font-bold tracking-tighter mt-0.5">
                        {product.sku}
                      </p>
                    </Link>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center justify-center gap-2">
                      {isAdmin && (
                        <button onClick={() => onQuickUpdate(product.id, -1)} className="w-5 h-5 rounded bg-secondary flex items-center justify-center text-[10px] hover:bg-primary hover:text-white transition-all">-</button>
                      )}
                      
                      <span className={`text-xs font-black ${product.stock < 10 ? 'text-accent animate-pulse' : 'text-primary'}`}>
                        {product.stock}
                      </span>

                      {isAdmin && (
                        <button onClick={() => onQuickUpdate(product.id, 1)} className="w-5 h-5 rounded bg-secondary flex items-center justify-center text-[10px] hover:bg-primary hover:text-white transition-all">+</button>
                      )}
                    </div>
                  </td>
                  <td className="py-4 text-right text-xs font-bold text-primary/70">₹{product.price}</td>
                  <td className="py-4 text-center">
                    {isAdmin ? (
                      <div className="flex justify-center gap-3">
                        <button onClick={() => onEdit(product)} className="text-[9px] font-black text-primary/30 hover:text-primary uppercase tracking-widest transition-all hover:underline underline-offset-4">Edit</button>
                        <button onClick={() => onDelete(product.id, product.name)} className="text-[9px] font-black text-accent/30 hover:text-accent uppercase tracking-widest transition-all hover:underline underline-offset-4">Purge</button>
                      </div>
                    ) : (
                      <span className="text-[8px] font-black text-gray-300 uppercase italic">Restricted Access</span>
                    )}
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryList;