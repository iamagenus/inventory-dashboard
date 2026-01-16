import { useState } from 'react';
import { Edit, Trash2, AlertCircle, CheckCircle2, XCircle, Package, PlusCircle, MinusCircle, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

const InventoryTable = ({ products, onDelete, onEdit, onAdjust }) => {
  // 1. SORTING STATE
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // 2. SORTING LOGIC
  const sortedProducts = [...products].sort((a, b) => {
    if (!sortConfig.key) return 0;

    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    // Handle numbers (Price/Stock) correctly so 10 comes after 2, not before
    if (sortConfig.key === 'price' || sortConfig.key === 'stock') {
      aValue = parseFloat(aValue);
      bValue = parseFloat(bValue);
    } else {
      // Case insensitive string sort
      aValue = String(aValue).toLowerCase();
      bValue = String(bValue).toLowerCase();
    }

    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Helper to show the correct arrow icon
  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) return <ArrowUpDown size={14} className="text-slate-300" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp size={14} className="text-blue-600" /> 
      : <ArrowDown size={14} className="text-blue-600" />;
  };

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'in stock': return 'bg-emerald-100 text-emerald-700';
      case 'low stock': return 'bg-amber-100 text-amber-700';
      case 'out of stock': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
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

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse table-fixed">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th 
              onClick={() => requestSort('name')} 
              className="w-1/3 px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors select-none"
            >
              <div className="flex items-center gap-2">Product Name {getSortIcon('name')}</div>
            </th>
            
            <th 
              onClick={() => requestSort('sku')} 
              className="w-32 px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors select-none"
            >
              <div className="flex items-center gap-2">SKU {getSortIcon('sku')}</div>
            </th>

            <th 
              onClick={() => requestSort('category')} 
              className="w-32 px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors select-none"
            >
              <div className="flex items-center gap-2">Category {getSortIcon('category')}</div>
            </th>

            <th 
              onClick={() => requestSort('price')} 
              className="w-24 px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors select-none"
            >
              <div className="flex items-center gap-2">Price {getSortIcon('price')}</div>
            </th>

            <th 
              onClick={() => requestSort('stock')} 
              className="w-24 px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors select-none"
            >
              <div className="flex items-center gap-2">Stock {getSortIcon('stock')}</div>
            </th>

            <th 
              onClick={() => requestSort('status')} 
              className="w-40 px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors select-none"
            >
              <div className="flex items-center gap-2">Status {getSortIcon('status')}</div>
            </th>

            <th className="w-40 px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {sortedProducts.length > 0 ? (
            sortedProducts.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none'; 
                            e.target.nextSibling.style.display = 'block'; 
                          }}
                        />
                      ) : null}
                      <Package 
                        size={20} 
                        className="text-slate-400 absolute"
                        style={{ display: product.image ? 'none' : 'block' }} 
                      />
                    </div>
                    <div className="font-medium text-slate-900 truncate">{product.name}</div>
                  </div>
                </td>

                <td className="px-6 py-4 text-sm text-slate-500 font-mono">{product.sku}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{product.category}</td>
                <td className="px-6 py-4 text-sm text-slate-700 font-medium">${Number(product.price).toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-slate-700 font-bold">{product.stock}</td>
                
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                    {getStatusIcon(product.status)}
                    {product.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => onAdjust(product, 'add')}
                      className="text-emerald-600 hover:bg-emerald-50 p-1.5 rounded transition-colors"
                      title="Restock"
                    >
                      <PlusCircle size={18} />
                    </button>
                    <button 
                      onClick={() => onAdjust(product, 'subtract')}
                      className="text-amber-600 hover:bg-amber-50 p-1.5 rounded transition-colors"
                      title="Issue Stock"
                    >
                      <MinusCircle size={18} />
                    </button>
                    
                    <div className="w-px h-6 bg-slate-200 mx-1"></div>

                    <button 
                      onClick={() => onEdit(product)}
                      className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                    
                    <button 
                      onClick={() => onDelete(product.id)}
                      className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="p-3 bg-slate-100 rounded-full">
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