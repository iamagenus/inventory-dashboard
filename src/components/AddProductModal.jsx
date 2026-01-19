import { useState } from 'react';
import { X, TrendingUp } from 'lucide-react';

const AddProductModal = ({ onClose, onSave, productToEdit, suppliers = [], categories = [] }) => {
  
  const [formData, setFormData] = useState(productToEdit || {
    name: '',
    sku: '',
    category: categories[0] || '',
    price: '',
    cost: '', // 1. NEW FIELD
    stock: '',
    status: 'In Stock',
    image: '',
    supplier: '' 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 2. CALCULATE MARGIN ON THE FLY
  const calculateMargin = () => {
    const price = parseFloat(formData.price) || 0;
    const cost = parseFloat(formData.cost) || 0;
    if (price <= 0 || cost <= 0) return 0;
    return ((price - cost) / price) * 100;
  };

  const margin = calculateMargin();
  const profit = (parseFloat(formData.price) || 0) - (parseFloat(formData.cost) || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalProduct = {
      ...formData,
      id: productToEdit ? productToEdit.id : Date.now(),
      price: parseFloat(formData.price),
      cost: parseFloat(formData.cost), // Save Cost
      stock: parseInt(formData.stock)
    };
    onSave(finalProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto">
        
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            {productToEdit ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Product Image URL</label>
            <input 
              name="image"
              value={formData.image || ''} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white" 
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Product Name</label>
            <input required name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">SKU</label>
              <input required name="sku" value={formData.sku} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              >
                {categories.length > 0 ? categories.map(cat => <option key={cat} value={cat}>{cat}</option>) : <option value="">No categories</option>}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Supplier</label>
            <select 
              name="supplier" 
              value={formData.supplier || ''} 
              onChange={handleChange} 
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            >
              <option value="">-- Select Supplier --</option>
              {suppliers.map(sup => (
                <option key={sup.id} value={sup.name}>{sup.name}</option>
              ))}
            </select>
          </div>

          {/* 3. FINANCIALS ROW */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cost ($)</label>
              <input 
                type="number" step="0.01" 
                name="cost" 
                value={formData.cost} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" 
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price ($)</label>
              <input required type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Stock</label>
              <input required type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
            </div>
          </div>

          {/* 4. LIVE MARGIN PREVIEW */}
          {(margin > 0 || profit > 0) && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg flex items-center justify-between border border-blue-100 dark:border-blue-900/50">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <TrendingUp size={18} />
                <span className="text-sm font-bold">Estimated Profit</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-slate-800 dark:text-white">${profit.toFixed(2)} / unit</div>
                <div className={`text-xs font-bold ${margin < 20 ? 'text-red-500' : 'text-emerald-500'}`}>
                  {margin.toFixed(1)}% Margin
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
              {productToEdit ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;