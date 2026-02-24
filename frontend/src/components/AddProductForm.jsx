import React, { useState } from 'react';
import API from '../utils/axiosInstance';
import { Image as ImageIcon, X, Plus, Package, Database, Hash, Loader2 } from 'lucide-react';

const AddProductForm = ({ onProductAdded, categories }) => {
  const [formData, setFormData] = useState({ 
    name: '', sku: '', price: '', stock: '', category: '', description: '' 
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(false);

  const clearImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setImage(null);
    setPreview(null);
  };

  const handleAddCategory = async () => {
    if (!newCategoryName) return;
    try {
      await API.post('categories/', { name: newCategoryName });
      onProductAdded(); 
      setNewCategoryName('');
      setIsAddingCategory(false);
    } catch (err) {
      console.error("Category creation failed", err.response?.data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (image) data.append('image', image);

    try {
      await API.post('products/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      onProductAdded();
      setFormData({ name: '', sku: '', price: '', stock: '', category: '', description: '' });
      clearImage();
      alert("Asset successfully registered in Matrix.");
    } catch (err) {
      console.error("Full Error Object:", err);
      alert(`Upload Failed: ${err.response?.data?.detail || "Check console for details"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white/50 backdrop-blur-sm p-4 rounded-3xl border border-primary/5">
      
      {/* Product Name */}
      <div className="relative group">
        <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-accent transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="PRODUCT_IDENTITY" 
          className="w-full pl-12 p-5 bg-neutral/10 rounded-2xl border border-primary/5 text-xs font-black uppercase tracking-widest outline-none focus:border-accent/40 focus:bg-white transition-all italic" 
          value={formData.name} 
          onChange={(e) => setFormData({...formData, name: e.target.value})} 
          required 
        />
      </div>
      
      {/* Category Selection */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-grow group">
            <Database className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-accent transition-colors" size={16} />
            <select 
              className="w-full pl-12 p-5 bg-neutral/10 rounded-2xl border border-primary/5 text-[10px] font-black uppercase tracking-widest text-primary outline-none focus:border-accent/40 focus:bg-white appearance-none cursor-pointer"
              value={formData.category} 
              onChange={(e) => setFormData({...formData, category: e.target.value})} 
              required={!isAddingCategory}
            >
              <option value="" className="italic">Select_Department</option>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>
          <button 
            type="button"
            onClick={() => setIsAddingCategory(!isAddingCategory)}
            className={`px-6 rounded-2xl transition-all flex items-center justify-center ${isAddingCategory ? 'bg-primary text-white rotate-45' : 'bg-accent text-white shadow-lg shadow-accent/20 hover:scale-105'}`}
          >
            <Plus size={20} />
          </button>
        </div>

        {isAddingCategory && (
          <div className="flex gap-2 animate-in slide-in-from-top-2">
            <input 
              type="text" 
              placeholder="NEW_CAT_NAME" 
              className="flex-grow p-4 bg-accent/5 border border-accent/20 rounded-xl text-[10px] font-bold outline-none uppercase"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <button 
              type="button" 
              onClick={handleAddCategory}
              className="bg-accent text-white px-6 rounded-xl text-[9px] font-black uppercase tracking-widest"
            >
              Initialize
            </button>
          </div>
        )}
      </div>

      {/* SKU & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="relative group">
          <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-accent transition-colors" size={14} />
          <input 
            type="text" 
            placeholder="MATRIX_SKU" 
            className="w-full pl-10 p-4 bg-neutral/10 rounded-2xl border border-primary/5 text-[10px] font-mono font-bold uppercase outline-none focus:border-accent/40 focus:bg-white transition-all" 
            value={formData.sku} 
            onChange={(e) => setFormData({...formData, sku: e.target.value})} 
            required 
          />
        </div>
        <input 
          type="number" 
          placeholder="UNIT_VAL_₹" 
          className="p-4 bg-neutral/10 rounded-2xl border border-primary/5 text-xs font-black uppercase outline-none focus:border-accent/40 focus:bg-white transition-all" 
          value={formData.price} 
          onChange={(e) => setFormData({...formData, price: e.target.value})} 
          required 
        />
      </div>

      {/* Stock & Image */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input 
          type="number" 
          placeholder="INITIAL_RESERVE" 
          className="p-4 bg-neutral/10 rounded-2xl border border-primary/5 text-xs font-black uppercase outline-none focus:border-accent/40 focus:bg-white transition-all" 
          value={formData.stock} 
          onChange={(e) => setFormData({...formData, stock: e.target.value})} 
          required 
        />
        
        <div className="relative h-[56px]">
          <input 
            type="file" 
            id="product-image"
            className="hidden" 
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setImage(file);
                setPreview(URL.createObjectURL(file));
              }
            }}
          />
          {!preview ? (
            <label 
              htmlFor="product-image"
              className="flex items-center justify-center h-full bg-neutral/10 rounded-2xl border border-dashed border-primary/20 text-[9px] font-black uppercase tracking-[0.2em] text-primary/60 cursor-pointer hover:border-accent/40 hover:text-accent transition-all"
            >
              <ImageIcon size={14} className="mr-2" /> Visual_Data
            </label>
          ) : (
            <div className="relative h-full rounded-2xl overflow-hidden border border-accent/20 group">
              <img src={preview} alt="preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <button 
                  type="button"
                  onClick={clearImage}
                  className="bg-accent text-white p-2 rounded-full shadow-xl hover:scale-110 transition-transform"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <textarea 
        placeholder="CLASSIFICATION_LOGS / DESCRIPTION" 
        className="w-full p-5 bg-neutral/10 rounded-2xl border border-primary/5 text-[10px] font-bold uppercase outline-none focus:border-accent/40 focus:bg-white h-28 resize-none transition-all leading-relaxed"
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
      />
      
      {/* Submit Button */}
      <button 
        type="submit" 
        disabled={loading}
        className="group relative w-full bg-primary text-secondary py-6 rounded-2xl font-black text-xs uppercase tracking-[0.4em] overflow-hidden hover:bg-accent transition-all shadow-2xl shadow-primary/20 italic disabled:opacity-50"
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="animate-spin" size={16} />
            <span>Processing...</span>
          </div>
        ) : (
          <>
            <span className="relative z-10">Register_In_Matrix</span>
            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
          </>
        )}
      </button>
    </form>
  );
};

export default AddProductForm;