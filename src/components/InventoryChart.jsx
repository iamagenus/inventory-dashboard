import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const InventoryChart = ({ products }) => {
  
  // 1. DATA TRANSFORMATION: Group products by Category
  // We turn the list of products into: [{ name: 'Electronics', value: 50 }, { name: 'Furniture', value: 20 }]
  const categoryData = products.reduce((acc, product) => {
    const category = product.category || 'Other';
    // If category exists, add stock to it; otherwise start at 0
    acc[category] = (acc[category] || 0) + parseInt(product.stock || 0);
    return acc;
  }, {});

  // Convert object back to an array for Recharts
  const data = Object.keys(categoryData).map(key => ({
    name: key,
    value: categoryData[key]
  }));

  // Colors for the bars
  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-96">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Stock by Category</h3>
      
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }} 
          />
          <Tooltip 
            cursor={{ fill: '#f1f5f9' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InventoryChart;