import React from 'react';

const CategoryBreakdown = ({ products, categories }) => {
    // Calculate value per category
    const stats = categories.map(cat => {
        const catProducts = products.filter(p => p.category === cat.id);
        const totalVal = catProducts.reduce((acc, p) => acc + (parseFloat(p.price) * p.stock), 0);
        const itemCount = catProducts.length;

        return {
            name: cat.name,
            value: totalVal,
            count: itemCount
        };
    }).filter(s => s.count > 0); // Only show categories that have items

    return (
        <div className="bg-white p-6 rounded-xl border border-primary/10 shadow-sm">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Valuation by Department</h3>
            <div className="space-y-4">
                {stats.map((stat, index) => (
                    <div key={index} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                            <span className="text-primary">{stat.name}</span>
                            <span className="text-primary/60">${stat.value.toLocaleString()}</span>
                        </div>
                        {/* Simple Progress Bar to show relative weight */}
                        <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                            <div
                                className="bg-primary h-full transition-all duration-500"
                                style={{ width: `${Math.min((stat.value / 5000) * 100, 100)}%` }}
                            ></div>
                        </div>
                        <p className="text-[9px] text-gray-400 uppercase font-bold">{stat.count} Unique SKUs</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryBreakdown;