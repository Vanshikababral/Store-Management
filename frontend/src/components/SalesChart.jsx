import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SalesChart = ({ sales }) => {
  // Process data to group by date
  const chartData = sales.slice(-7).map(sale => ({
    name: new Date(sale.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    revenue: parseFloat(sale.total_price)
  }));

  return (
    <div className="bg-white p-6 rounded-2xl border border-primary/10 shadow-sm h-[300px] w-full">
      <h3 className="text-[10px] font-black text-primary/40 uppercase tracking-widest mb-6">Revenue Stream (Last 7 Sales)</h3>
      <ResponsiveContainer width="100%" height={220} minWidth={0}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#800000" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#800000" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
          <XAxis dataKey="name" fontSize={9} tickLine={false} axisLine={false} />
          <YAxis fontSize={9} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#800000', borderRadius: '8px', border: 'none' }}
            itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: 'bold' }}
            labelStyle={{ display: 'none' }}
          />
          <Area type="monotone" dataKey="revenue" stroke="#800000" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;