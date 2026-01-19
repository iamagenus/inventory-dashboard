import { useState } from 'react';
import { X, Plus, Trash2, Tag, Layers } from 'lucide-react';

const CategoryModal = ({ isOpen, onClose, categories, onAdd, onDelete }) => {
  const [newCategory, setNewCategory] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    
    onAdd(newCategory.trim());
    setNewCategory('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Layers className="text-purple-600" />
              Manage Categories
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Organize your products.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50 dark:bg-slate-900/50">
          
          {/* Add New Form */}
          <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
            <input 
              placeholder="New Category Name..." 
              className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              autoFocus
            />
            <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors">
              <Plus size={20} />
            </button>
          </form>

          {/* List of Categories */}
          <div className="space-y-2">
            {categories.length === 0 ? (
              <p className="text-center text-slate-400 py-4">No categories found.</p>
            ) : (
              categories.map((cat, index) => (
                <div key={index} className="flex items-center justify-between bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm group">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-md text-purple-600 dark:text-purple-400">
                        <Tag size={16} />
                    </div>
                    <span className="font-medium text-slate-700 dark:text-slate-200">{cat}</span>
                  </div>
                  
                  <button 
                    onClick={() => onDelete(cat)}
                    className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 p-2 rounded-lg transition-colors opacity-100 md:opacity-0 group-hover:opacity-100"
                    title="Delete Category"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;