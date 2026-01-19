import { useState } from 'react';
import { X } from 'lucide-react';

const CATEGORIES = [
  "Engine Parts",
  "Hydraulics",
  "Body & Frame",
  "Electrical",
  "Suspension",
  "Accessories"
];

// 1. ADD 'suppliers' PROP
const AddProductModal = ({ onClose, onSave, productToEdit, suppliers = [] }) => {
  
  const [formData, setFormData] = useState(productToEdit || {
    name: '',
    sku: '',
    category: CATEGORIES[0],
    price: '',
    stock: '',
    status: 'In Stock',
    image: '',
    supplier: '' // 2. NEW FIELD
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalProduct = {
      ...formData,
      id: productToEdit ? productToEdit.id : Date.now(),
      price: parseFloat(formData.price),
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
            {formData.image && (
              <div className="mt-2 w-full h-32 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                <img 
                  src={formData.image} 
                  alt="Preview" 
                  className="w-full h-full object-contain"
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>
            )}
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
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. NEW SUPPLIER DROPDOWN */}
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price ($)</label>
              <input required type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Stock Qty</label>
              <input required type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
            </div>
          </div>

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