import { useState, useMemo } from 'react';
import { X, Truck, Plus, CheckCircle2, Clock, Calendar, ChevronRight, Package, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const PurchaseOrderModal = ({ isOpen, onClose, orders, products, suppliers, onCreateOrder, onReceiveOrder, onDeleteOrder }) => {
  const [view, setView] = useState('list'); // 'list' or 'create'
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [draftItems, setDraftItems] = useState([]);

  if (!isOpen) return null;

  // --- CREATE ORDER LOGIC ---
  
  // Filter products by selected supplier
  const supplierProducts = useMemo(() => {
    if (!selectedSupplier) return [];
    return products.filter(p => p.supplier === selectedSupplier);
  }, [selectedSupplier, products]);

  const addToDraft = (product) => {
    setDraftItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev; // Already in list
      return [...prev, { ...product, orderQty: 10 }]; // Default 10
    });
  };

  const updateDraftQty = (id, qty) => {
    setDraftItems(prev => prev.map(item => item.id === id ? { ...item, orderQty: parseInt(qty) || 0 } : item));
  };

  const removeDraftItem = (id) => {
    setDraftItems(prev => prev.filter(item => item.id !== id));
  };

  const handleSubmitOrder = () => {
    if (!selectedSupplier || draftItems.length === 0) return;
    
    const newOrder = {
      id: Date.now(),
      supplier: selectedSupplier,
      status: 'Pending',
      date: new Date().toISOString(),
      items: draftItems.map(i => ({ 
        id: i.id, 
        name: i.name, 
        sku: i.sku, 
        qty: i.orderQty, 
        cost: i.cost 
      })),
      totalCost: draftItems.reduce((sum, i) => sum + (i.cost * i.orderQty), 0)
    };

    onCreateOrder(newOrder);
    setDraftItems([]);
    setSelectedSupplier('');
    setView('list');
  };

  // --- RENDER HELPERS ---

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Truck className="text-blue-600" />
              Purchase Orders (PO)
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Manage incoming stock from suppliers.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          
          {/* VIEW: LIST OF ORDERS */}
          {view === 'list' && (
            <div className="w-full h-full flex flex-col">
               <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 flex justify-end">
                 <button 
                   onClick={() => setView('create')}
                   className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
                 >
                   <Plus size={18} /> New Purchase Order
                 </button>
               </div>
               
               <div className="flex-1 overflow-y-auto p-4 space-y-4">
                 {orders.length === 0 ? (
                   <div className="text-center text-slate-400 py-12">No active purchase orders.</div>
                 ) : (
                   orders.sort((a,b) => b.id - a.id).map(order => (
                     <div key={order.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm">
                       <div className="flex justify-between items-start mb-4">
                         <div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                order.status === 'Received' 
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200' 
                                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200'
                              }`}>
                                {order.status}
                              </span>
                              <span className="font-bold text-slate-700 dark:text-slate-200">#{order.id.toString().slice(-6)}</span>
                            </div>
                            <h3 className="font-bold text-lg text-slate-800 dark:text-white mt-1">{order.supplier}</h3>
                            <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                              <Calendar size={12} /> {new Date(order.date).toLocaleDateString()}
                              <span>•</span>
                              Est. Cost: ${order.totalCost.toFixed(2)}
                            </div>
                         </div>
                         
                         {order.status === 'Pending' && (
                           <div className="flex gap-2">
                             <button 
                               onClick={() => onDeleteOrder(order.id)}
                               className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                               title="Cancel Order"
                             >
                               <Trash2 size={18} />
                             </button>
                             <button 
                               onClick={() => onReceiveOrder(order)}
                               className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors shadow-sm"
                             >
                               <CheckCircle2 size={16} /> Receive Items
                             </button>
                           </div>
                         )}
                       </div>

                       {/* Order Items Preview */}
                       <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-3 text-sm">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                           {order.items.map((item, idx) => (
                             <div key={idx} className="flex justify-between text-slate-600 dark:text-slate-300 border-b border-slate-100 dark:border-slate-700 last:border-0 pb-1 last:pb-0">
                               <span>{item.name}</span>
                               <span className="font-mono font-bold">x{item.qty}</span>
                             </div>
                           ))}
                         </div>
                       </div>
                     </div>
                   ))
                 )}
               </div>
            </div>
          )}

          {/* VIEW: CREATE NEW */}
          {view === 'create' && (
            <div className="w-full h-full flex flex-col">
              <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-4 bg-slate-50 dark:bg-slate-900/50">
                 <button onClick={() => setView('list')} className="text-slate-500 hover:text-slate-800 dark:hover:text-white font-medium flex items-center gap-1">
                   ← Back
                 </button>
                 <div className="h-6 w-px bg-slate-300 dark:bg-slate-600"></div>
                 <select 
                   value={selectedSupplier}
                   onChange={(e) => { setSelectedSupplier(e.target.value); setDraftItems([]); }}
                   className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                 >
                   <option value="">-- Select Supplier --</option>
                   {suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                 </select>
              </div>

              <div className="flex-1 flex overflow-hidden">
                {/* Product Picker */}
                <div className="w-1/3 border-r border-slate-100 dark:border-slate-700 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-900/30">
                  <h4 className="font-bold text-xs uppercase text-slate-500 mb-3">Available Products</h4>
                  {selectedSupplier ? (
                    supplierProducts.length > 0 ? (
                      supplierProducts.map(p => (
                        <button 
                          key={p.id} 
                          onClick={() => addToDraft(p)}
                          className="w-full text-left p-3 mb-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-500 transition-all shadow-sm"
                        >
                          <div className="font-bold text-slate-800 dark:text-white text-sm">{p.name}</div>
                          <div className="text-xs text-slate-500">Current Stock: {p.stock}</div>
                        </button>
                      ))
                    ) : (
                      <div className="text-center text-slate-400 text-sm italic">No products linked to this supplier. Edit products to assign them.</div>
                    )
                  ) : (
                    <div className="text-center text-slate-400 text-sm">Select a supplier above.</div>
                  )}
                </div>

                {/* Draft Order */}
                <div className="w-2/3 flex flex-col bg-white dark:bg-slate-800">
                  <div className="flex-1 overflow-y-auto p-4">
                    <h4 className="font-bold text-lg text-slate-800 dark:text-white mb-4">Order Items</h4>
                    {draftItems.length === 0 ? (
                      <div className="text-center text-slate-400 py-10 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                        Add items from the left list.
                      </div>
                    ) : (
                      <table className="w-full text-left text-sm">
                        <thead className="text-slate-500 border-b border-slate-100 dark:border-slate-700">
                          <tr>
                            <th className="pb-2">Item</th>
                            <th className="pb-2 w-24">Order Qty</th>
                            <th className="pb-2 w-24 text-right">Cost</th>
                            <th className="pb-2 w-10"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                          {draftItems.map(item => (
                            <tr key={item.id}>
                              <td className="py-3 text-slate-800 dark:text-white font-medium">{item.name}</td>
                              <td className="py-3">
                                <input 
                                  type="number" 
                                  min="1"
                                  value={item.orderQty}
                                  onChange={(e) => updateDraftQty(item.id, e.target.value)}
                                  className="w-20 px-2 py-1 border border-slate-300 dark:border-slate-600 rounded text-center bg-white dark:bg-slate-700 dark:text-white"
                                />
                              </td>
                              <td className="py-3 text-right text-slate-600 dark:text-slate-300">
                                ${(item.cost * item.orderQty).toFixed(2)}
                              </td>
                              <td className="py-3 text-right">
                                <button onClick={() => removeDraftItem(item.id)} className="text-red-400 hover:text-red-600"><X size={16} /></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                  
                  <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
                    <div className="text-lg font-bold text-slate-800 dark:text-white">
                      Total: ${draftItems.reduce((sum, i) => sum + (i.cost * i.orderQty), 0).toFixed(2)}
                    </div>
                    <button 
                      onClick={handleSubmitOrder}
                      disabled={draftItems.length === 0}
                      className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                    >
                      Submit Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderModal;