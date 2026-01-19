import { useState, useEffect } from 'react';
import { X, Copy, Check, ShoppingCart, Printer } from 'lucide-react';
import toast from 'react-hot-toast';

const ReorderModal = ({ isOpen, onClose, products }) => {
  const [groupedItems, setGroupedItems] = useState({});
  const [copied, setCopied] = useState(false);

  // 1. Filter and Group Data whenever the modal opens
  useEffect(() => {
    if (isOpen) {
      const lowStockItems = products.filter(p => p.stock < 10);
      
      const groups = lowStockItems.reduce((acc, item) => {
        const supplierName = item.supplier || 'Unassigned Vendor';
        if (!acc[supplierName]) acc[supplierName] = [];
        acc[supplierName].push(item);
        return acc;
      }, {});

      setGroupedItems(groups);
    }
  }, [isOpen, products]);

  if (!isOpen) return null;

  // 2. "Copy to Clipboard" Logic
  const handleCopy = () => {
    let text = "ORDER REQUEST\n\n";
    
    Object.keys(groupedItems).forEach(supplier => {
      text += `VENDOR: ${supplier}\n`;
      text += "------------------------\n";
      groupedItems[supplier].forEach(item => {
        // Calculate recommended order (target stock 20)
        const toOrder = 20 - item.stock; 
        text += `[ ] ${item.name} (SKU: ${item.sku}) - Current: ${item.stock} - ORDER: ${toOrder}\n`;
      });
      text += "\n";
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Order list copied to clipboard!");
    
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700 print:hidden">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <ShoppingCart className="text-amber-500" />
              Low Stock Reorder Report
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Items below 10 units, grouped by supplier.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-900/50">
          
          {Object.keys(groupedItems).length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-emerald-100 text-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">All Stock Levels Healthy</h3>
              <p className="text-slate-500 dark:text-slate-400">No items are currently below the threshold (10).</p>
            </div>
          ) : (
            <div id="printable-area" className="space-y-6">
              {Object.keys(groupedItems).map(supplier => (
                <div key={supplier} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden break-inside-avoid">
                  <div className="bg-slate-100 dark:bg-slate-700/50 px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 dark:text-white">{supplier}</h3>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-600">
                      {groupedItems[supplier].length} Items
                    </span>
                  </div>
                  <table className="w-full text-left text-sm">
                    <thead className="text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700">
                      <tr>
                        <th className="px-4 py-2 font-medium">Item</th>
                        <th className="px-4 py-2 font-medium w-24">SKU</th>
                        <th className="px-4 py-2 font-medium w-24 text-center">Current</th>
                        <th className="px-4 py-2 font-medium w-24 text-right text-blue-600 dark:text-blue-400">Restock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {groupedItems[supplier].map(item => (
                        <tr key={item.id} className="text-slate-700 dark:text-slate-300">
                          <td className="px-4 py-2">{item.name}</td>
                          <td className="px-4 py-2 font-mono text-xs">{item.sku}</td>
                          <td className="px-4 py-2 text-center font-bold text-red-500">{item.stock}</td>
                          <td className="px-4 py-2 text-right font-bold text-blue-600 dark:text-blue-400">
                            {/* Simple logic: Order enough to reach 20 */}
                            +{20 - item.stock}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 flex gap-3 print:hidden">
            <button 
              onClick={handlePrint}
              disabled={Object.keys(groupedItems).length === 0}
              className="flex-1 flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 py-2.5 rounded-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
            >
              <Printer size={18} />
              Print Report
            </button>
            <button 
              onClick={handleCopy}
              disabled={Object.keys(groupedItems).length === 0}
              className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-lg font-bold disabled:opacity-50 transition-colors"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? 'Copied!' : 'Copy to Email'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ReorderModal;