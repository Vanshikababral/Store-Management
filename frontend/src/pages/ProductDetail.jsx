import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ShieldAlert, Package, Zap, ArrowRight } from 'lucide-react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ProductDetail = ({ token }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path; // Cloudinary/External
    return `${BACKEND_URL}${path}`;   // Local Django
  };

  useEffect(() => {
    axios.get(`${API_URL}products/${id}/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setProduct(res.data))
    .catch(err => console.error(err));
  }, [id, token]);

  if (!product) return (
    <div className="h-screen flex items-center justify-center font-black text-primary animate-pulse tracking-widest">
      DECRYPTING_ASSET_DATA...
    </div>
  );

  const isLowStock = product.stock > 0 && product.stock < 5;
  const isOutOfStock = product.stock === 0;

  return (
    <div className="max-w-6xl mx-auto p-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <button 
        onClick={() => navigate(-1)} 
        className="group mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-primary transition-all"
      >
        <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        Return_to_Matrix
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 bg-white p-12 rounded-[4rem] shadow-2xl border border-primary/5 relative overflow-hidden">
        {/* Aesthetic background element */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full -mr-48 -mt-48 blur-3xl" />

        {/* Product Image Section */}
        <div className="relative group">
          <div className="bg-secondary/30 rounded-[3rem] overflow-hidden aspect-square flex items-center justify-center border border-primary/5 shadow-inner">
            {product.image ? (
              <img 
                src={getImageUrl(product.image)} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
              />
            ) : (
              <div className="text-primary/10 flex flex-col items-center gap-4">
                <Package size={64} />
                <span className="font-black italic text-xs tracking-widest">IMAGE_NOT_FOUND</span>
              </div>
            )}
          </div>
          {isLowStock && (
            <div className="absolute top-6 left-6 bg-accent text-white px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-xl animate-bounce">
              Critical Stock
            </div>
          )}
        </div>

        {/* Product Info Section */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-primary/5 text-primary text-[9px] font-black uppercase tracking-widest rounded-lg">
              {product.category_name}
            </span>
            <span className="text-gray-300 font-mono text-[9px] tracking-widest">SKU: {product.sku}</span>
          </div>
          
          <h1 className="text-6xl font-black text-primary uppercase italic tracking-tighter mb-6 leading-none">
            {product.name}
          </h1>
          
          <p className="text-gray-400 text-sm font-medium mb-10 leading-relaxed max-w-md">
            {product.description || "System protocol mandates a secondary classification for this asset. No details provided."}
          </p>
          
          <div className="grid grid-cols-2 gap-8 mb-12 p-8 bg-neutral/10 rounded-[2rem] border border-primary/5">
            <div>
              <p className="text-[9px] text-gray-400 font-black uppercase mb-1 tracking-widest">Unit Price</p>
              <p className="text-4xl font-black text-primary tracking-tighter">₹{product.price}</p>
            </div>
            <div>
              <p className="text-[9px] text-gray-400 font-black uppercase mb-1 tracking-widest">Fleet Status</p>
              <p className={`text-xl font-black uppercase italic ${isOutOfStock ? 'text-accent' : isLowStock ? 'text-orange-500' : 'text-green-500'}`}>
                {isOutOfStock ? 'Depleted' : isLowStock ? 'Low Reserve' : 'Available'}
              </p>
              <p className="text-[10px] font-bold text-primary/40">{product.stock} units in matrix</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              disabled={isOutOfStock}
              className={`flex-1 group py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-lg ${
                isOutOfStock 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-primary text-secondary hover:bg-accent shadow-primary/20'
              }`}
            >
              <Zap size={16} className={isOutOfStock ? 'hidden' : 'fill-current'} />
              {isOutOfStock ? 'Asset Unavailable' : 'Initialize Transaction'}
            </button>
            <button className="px-8 py-5 border-2 border-primary/10 rounded-2xl font-black text-xs uppercase hover:bg-primary/5 transition-all flex items-center justify-center gap-2">
              Log to Fleet <ArrowRight size={14} />
            </button>
          </div>
          
          <div className="mt-10 flex items-center gap-4 text-[9px] font-black text-primary/30 uppercase tracking-[0.2em]">
            <ShieldAlert size={14} />
            <span>Secure Transaction Protocol v4.0 Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;