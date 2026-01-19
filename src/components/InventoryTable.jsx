import { useState } from 'react';
import { Edit, Trash2, AlertCircle, CheckCircle2, XCircle, Package, PlusCircle, MinusCircle, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

const InventoryTable = ({ products, onDelete, onEdit, onAdjust }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const sortedProducts = [...products].sort((a, b) => {
    if (!sortConfig.key) return 0;
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    if (aValue === undefined || aValue === null) aValue = '';
    if (bValue === undefined || bValue === null) bValue = '';

    if (sortConfig.key === 'price' || sortConfig.key === 'stock') {
      aValue = parseFloat(aValue) || 0;
      bValue = parseFloat(bValue) || 0;
    } else {
      aValue = String(aValue).toLowerCase();
      bValue = String(bValue).toLowerCase();
    }

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) return <ArrowUpDown size={14} className="text-slate-300 dark:text-slate-600" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp size={14} className="text-blue-600 dark:text-blue-400" /> 
      : <ArrowDown size={14} className="text-blue-600 dark:text-blue-400" />;
  };

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'in stock': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200';
      case 'low stock': return 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200';
      case 'out of stock': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  const getStatusIcon = (status) => {
    switch(status.toLowerCase()) {
      case 'in stock': return <CheckCircle2 size={16} />;
      case 'low stock': return <AlertCircle size={16} />;
      case 'out of stock': return <XCircle size={16} />;
      default: return null;
    }
  };

  // 1. CALCULATE MARGIN HELPER
  const getMargin = (price, cost) => {
    if (!price || !cost) return null;
    const p = parseFloat(price);
    const c = parseFloat(cost);
    if (p <= 0) return 0;
    return ((p - c) / p) * 100;
  };

  return (
    <div className="overflow-x-auto bg-white dark:bg-slate-800">
      <table className="w-full text-left border-collapse table-fixed">
        <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
          <tr>
            {[
              { key: 'name', label: 'Product Name', width: 'w-1/4' },
              { key: 'sku', label: 'SKU', width: 'w-24' },
              { key: 'category', label: 'Category', width: 'w-28' },
              { key: 'price', label: 'Price', width: 'w-24' },
              { key: 'stock', label: 'Stock', width: 'w-24' },
              { key: 'status', label: 'Status', width: 'w-36' },
            ].map((col) => (
              <th 
                key={col.key}
                onClick={() => requestSort(col.key)} 
                className={`${col.width} px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors select-none`}
              >
                <div className="flex items-center gap-2">{col.label} {getSortIcon(col.key)}</div>
              </th>
            ))}
            <th className="w-40 px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
          {sortedProducts.length > 0 ? (
            sortedProducts.map((product) => {
                const margin = getMargin(product.price, product.cost);
                
                return (
                  <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                          {product.image ? (
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="h-full w-full object-cover"
                              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                            />
                          ) : null}
                          <Package size={20} className="text-slate-400 dark:text-slate-500 absolute" style={{ display: product.image ? 'none' : 'block' }} />
                        </div>
                        <div className="font-medium text-slate-900 dark:text-white truncate">{product.name}</div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 font-mono">{product.sku}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{product.category}</td>
                    
                    {/* 2. PRICE CELL WITH MARGIN */}
                    <td className="px-6 py-4">
                        <div className="text-sm text-slate-700 dark:text-slate-200 font-medium">${Number(product.price).toFixed(2)}</div>
                        {margin !== null && (
                            <div className={`text-[10px] font-bold ${margin < 20 ? 'text-red-500' : 'text-emerald-500'}`}>
                                {margin.toFixed(0)}% Margin
                            </div>
                        )}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-200 font-bold">{product.stock}</td>
                    
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                        {getStatusIcon(product.status)}
                        {product.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => onAdjust(product, 'add')} className="text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 p-1.5 rounded transition-colors" title="Restock">
                          <PlusCircle size={18} />
                        </button>
                        <button onClick={() => onAdjust(product, 'subtract')} className="text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30 p-1.5 rounded transition-colors" title="Issue Stock">
                          <MinusCircle size={18} />
                        </button>
                        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                        <button onClick={() => onEdit(product)} className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 p-1.5 rounded transition-colors">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => onDelete(product.id)} className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 p-1.5 rounded transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
            })
          ) : (
            <tr>
              <td colSpan="8" className="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="p-3 bg-slate-100 dark:bg-slate-700/50 rounded-full">
                    <AlertCircle size={24} />
                  </div>
                  <p>No products found matching your search.</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;