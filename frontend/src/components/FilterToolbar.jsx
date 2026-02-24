import React from 'react';

const FilterToolbar = ({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, categories }) => {


    return (
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <input
                type="text"
                placeholder="Filter by Name/SKU..."
                className="flex-grow p-4 rounded-2xl border border-primary/10 bg-neutral/10 outline-none focus:border-accent/40 transition-all text-xs font-black uppercase tracking-widest"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
                className="p-4 rounded-2xl border border-primary/10 bg-neutral/10 font-black text-primary text-[10px] uppercase tracking-widest outline-none focus:border-accent/40"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
            >
                <option value="" className="italic">All Departments</option>
                {categories.map(cat => <option key={cat.id} value={cat.id} className="font-bold">{cat.name}</option>)}
            </select>
        </div>
    );
};

export default FilterToolbar;