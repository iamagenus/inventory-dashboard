import { useState } from 'react';
import { X, Plus, Minus, ArrowRight } from 'lucide-react';

const AdjustStockModal = ({ isOpen, onClose, onConfirm, product, type }) => {
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');

  if (!isOpen || !product) return null;

  const isAdd = type === 'add';
  const colorClass = isAdd ? 'text-emerald-600' : 'text-red-600';
  const bgClass = isAdd ? 'bg-emerald-100' : 'bg-red-100';
  const btnClass = isAdd ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!quantity || parseInt(quantity) <= 0) return;
    
    onConfirm(parseInt(quantity), type, reason);
    setQuantity('');
    setReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
        
        {/* Header */}
        <div className={`p-4 border-b border-slate-100 flex justify-between items-center ${bgClass}`}>
          <div className="flex items-center gap-2">
            {isAdd ? <Plus size={20} className={colorClass} /> : <Minus size={20} className={colorClass} />}
            <h2 className={`font-bold ${colorClass}`}>
              {isAdd ? 'Restock Item' : 'Issue Item'}
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 bg-white/50 p-1 rounded-full">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <p className="text-sm text-slate-500 mb-1">Product:</p>
            <p className="font-bold text-slate-800 text-lg">{product.name}</p>
            <p className="text-xs text-slate-400">Current Stock: {product.stock}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Quantity to {isAdd ? 'Add' : 'Remove'}
            </label>
            <input 
              type="number" 
              min="1"
              autoFocus
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Reason (Optional)</label>
             <input 
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={isAdd ? "e.g. Weekly delivery" : "e.g. Sales order #123"}
             />
          </div>

          <button 
            type="submit" 
            className={`w-full ${btnClass} text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-2`}
          >
            Confirm Adjustment
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdjustStockModal;