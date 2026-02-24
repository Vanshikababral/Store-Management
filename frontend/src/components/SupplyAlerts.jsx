import React from 'react';

const SupplyAlerts = ({ products }) => {
    // Logic to find items with less than 5 units in stock
    const criticalItems = products.filter(p => p.stock < 5);

    if (criticalItems.length === 0) return null;

    return (
        <div className="bg-white border-l-4 border-accent p-6 rounded-xl shadow-sm mb-8">
            <div className="flex items-center gap-3 mb-4">
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
                </span>
                <h3 className="text-sm font-black text-accent uppercase tracking-tighter">Supply Chain Risk</h3>
            </div>
            <ul className="space-y-3">
                {criticalItems.map(item => (
                    <li key={item.id} className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-primary truncate mr-2">{item.name}</span>
                        <span className="text-accent font-black whitespace-nowrap">
                            {item.stock === 0 ? 'DEPLETED' : `${item.stock} UNITS`}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SupplyAlerts;