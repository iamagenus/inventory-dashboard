import { useState } from 'react';
import { X, Plus, Trash2, Building2, Phone, Mail } from 'lucide-react';

const SupplierModal = ({ isOpen, onClose, suppliers, onAdd, onDelete }) => {
  const [newSupplier, setNewSupplier] = useState({ name: '', contact: '', email: '' });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newSupplier.name) return;
    
    onAdd({ ...newSupplier, id: Date.now() });
    setNewSupplier({ name: '', contact: '', email: '' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Building2 className="text-blue-600" />
              Manage Suppliers
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Add and remove your approved vendors.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50 dark:bg-slate-900/50">
          
          {/* Add New Form */}
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 mb-6">
            <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-3 text-sm uppercase tracking-wide">Add New Supplier</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input 
                placeholder="Company Name" 
                className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newSupplier.name}
                onChange={e => setNewSupplier({...newSupplier, name: e.target.value})}
                required
              />
              <input 
                placeholder="Contact Person (Optional)" 
                className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newSupplier.contact}
                onChange={e => setNewSupplier({...newSupplier, contact: e.target.value})}
              />
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors">
                <Plus size={16} /> Add
              </button>
            </div>
          </form>

          {/* List of Suppliers */}
          <div className="space-y-3">
            {suppliers.length === 0 ? (
              <p className="text-center text-slate-400 py-8">No suppliers added yet.</p>
            ) : (
              suppliers.map(supplier => (
                <div key={supplier.id} className="flex flex-col md:flex-row md:items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm group hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white text-lg">{supplier.name}</h4>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {supplier.contact && (
                        <span className="flex items-center gap-1"><Phone size={12} /> {supplier.contact}</span>
                      )}
                      {supplier.email && (
                        <span className="flex items-center gap-1"><Mail size={12} /> {supplier.email}</span>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => onDelete(supplier.id)}
                    className="mt-3 md:mt-0 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors self-start md:self-center"
                    title="Delete Supplier"
                  >
                    <Trash2 size={18} />
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

export default SupplierModal;