import { useState, useMemo } from 'react';
import { X, ShoppingCart, Trash2, CheckCircle2, Plus, Minus, ScanLine } from 'lucide-react';
import toast from 'react-hot-toast';

const POSModal = ({ isOpen, onClose, products, onCompleteSale }) => {
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');

  // Filter products for the search list
  const searchResults = useMemo(() => {
    if (!search) return [];
    return products.filter(p => 
      (p.name.toLowerCase().includes(search.toLowerCase()) || 
       p.sku.toLowerCase().includes(search.toLowerCase())) &&
      p.stock > 0
    );
  }, [search, products]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        // Don't sell more than we have!
        if (existing.qty >= product.stock) {
          toast.error("Not enough stock!");
          return prev;
        }
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setSearch(''); // Clear search after adding
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQty = (productId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = item.qty + delta;
        if (newQty <= 0) return item; // Don't go below 1
        
        // Check stock limit
        const product = products.find(p => p.id === productId);
        if (newQty > product.stock) {
          toast.error("Max stock reached");
          return item;
        }
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    onCompleteSale(cart);
    setCart([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-4xl h-[80vh] flex overflow-hidden">
        
        {/* LEFT SIDE: Product Search & List */}
        <div className="w-1/2 border-r border-slate-100 dark:border-slate-700 flex flex-col bg-slate-50 dark:bg-slate-900/50">
          <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800">
            <h2 className="font-bold text-slate-800 dark:text-white mb-2">Add Items</h2>
            <div className="relative">
              <ScanLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                autoFocus
                placeholder="Scan barcode or type name..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {search ? (
              searchResults.length > 0 ? (
                searchResults.map(product => (
                  <button 
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className="w-full text-left p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-500 transition-colors flex justify-between items-center group"
                  >
                    <div>
                      <div className="font-bold text-slate-800 dark:text-white">{product.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">SKU: {product.sku} | Stock: {product.stock}</div>
                    </div>
                    <div className="text-blue-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      + Add
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center p-4 text-slate-400">No items found.</div>
              )
            ) : (
              <div className="text-center p-8 text-slate-400">
                <ScanLine size={48} className="mx-auto mb-2 opacity-20" />
                <p>Start typing or scanning to find products.</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE: Cart & Checkout */}
        <div className="w-1/2 flex flex-col bg-white dark:bg-slate-800">
          <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
            <h2 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
              <ShoppingCart className="text-blue-600" />
              Current Sale
            </h2>
            <button onClick={onClose}>
              <X className="text-slate-400 hover:text-slate-600" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <ShoppingCart size={48} className="mb-2 opacity-20" />
                <p>Cart is empty</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-slate-800 dark:text-white">{item.name}</div>
                    <div className="text-sm text-slate-500">${item.price} x {item.qty}</div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                      <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-500"><Minus size={14} /></button>
                      <span className="w-8 text-center text-sm font-bold dark:text-white">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-500"><Plus size={14} /></button>
                    </div>
                    <div className="font-bold text-slate-800 dark:text-white w-16 text-right">
                      ${(item.price * item.qty).toFixed(2)}
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700">
            <div className="flex justify-between items-end mb-4">
              <span className="text-slate-500 dark:text-slate-400">Total Due</span>
              <span className="text-3xl font-bold text-slate-800 dark:text-white">${cartTotal.toFixed(2)}</span>
            </div>
            <button 
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-lg font-bold rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <CheckCircle2 size={24} />
              Complete Sale
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default POSModal;