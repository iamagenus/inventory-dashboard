import { useState } from 'react';
import { X, Receipt, Calendar, Printer, ChevronRight, ShoppingBag } from 'lucide-react';

const SalesHistoryModal = ({ isOpen, onClose, sales }) => {
  const [selectedSale, setSelectedSale] = useState(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    // 1. Get the content of the receipt area
    const printContent = document.getElementById('receipt-area').innerHTML;
    const originalContents = document.body.innerHTML;

    // 2. Swap the body content for just the receipt
    document.body.innerHTML = printContent;

    // 3. Print
    window.print();

    // 4. Restore the app
    document.body.innerHTML = originalContents;
    window.location.reload(); // Reload ensures event listeners re-attach properly
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-5xl h-[85vh] flex overflow-hidden">
        
        {/* LEFT PANE: Transaction List */}
        <div className="w-1/3 border-r border-slate-100 dark:border-slate-700 flex flex-col bg-slate-50 dark:bg-slate-900/50">
          <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800">
            <h2 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Receipt className="text-blue-600" /> Sales History
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {sales.length} transactions found
            </p>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {sales.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8">
                <ShoppingBag size={32} className="mb-2 opacity-50"/>
                <p className="text-sm">No sales recorded yet.</p>
              </div>
            ) : (
              // Sort by date (newest first)
              [...sales].reverse().map((sale) => (
                <button
                  key={sale.id}
                  onClick={() => setSelectedSale(sale)}
                  className={`w-full text-left p-4 border-b border-slate-100 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-colors flex justify-between items-center group ${
                    selectedSale?.id === sale.id ? 'bg-white dark:bg-slate-800 ring-2 ring-inset ring-blue-500' : ''
                  }`}
                >
                  <div>
                    <div className="font-bold text-slate-800 dark:text-white text-lg">
                      ${sale.total.toFixed(2)}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1 font-mono">
                      <Calendar size={10} /> 
                      {new Date(sale.date).toLocaleDateString()} 
                      <span className="opacity-50">|</span> 
                      {new Date(sale.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors" />
                </button>
              ))
            )}
          </div>
        </div>

        {/* RIGHT PANE: Receipt View */}
        <div className="w-2/3 flex flex-col bg-slate-200 dark:bg-black p-4 md:p-8 overflow-y-auto relative">
           
           {/* Close Button */}
           <button onClick={onClose} className="absolute top-4 right-4 z-10 bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 p-2 rounded-full transition-colors text-slate-600 dark:text-slate-300">
             <X size={20} />
           </button>

           {selectedSale ? (
             <div className="max-w-sm mx-auto w-full flex flex-col h-full justify-center">
                
                {/* === THE RECEIPT === */}
                <div id="receipt-area" className="bg-white p-6 shadow-2xl rounded-sm text-slate-900 text-sm font-mono leading-relaxed">
                    {/* Header */}
                    <div className="text-center mb-6 border-b-2 border-slate-800 pb-4">
                        <div className="font-black text-2xl uppercase tracking-widest mb-1">RECEIPT</div>
                        <div className="text-xs text-slate-500">Inventory System v1.0</div>
                        <div className="text-xs text-slate-500 mt-2">
                          ID: #{selectedSale.id.toString().slice(-8)}<br/>
                          Date: {new Date(selectedSale.date).toLocaleString()}
                        </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-2 mb-6">
                        {selectedSale.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-start">
                                <div>
                                    <span className="font-bold">{item.name}</span>
                                    <div className="text-xs text-slate-500 ml-2">
                                      {item.qty} x ${item.price.toFixed(2)}
                                    </div>
                                </div>
                                <div className="font-bold">${(item.qty * item.price).toFixed(2)}</div>
                            </div>
                        ))}
                    </div>

                    {/* Totals */}
                    <div className="border-t-2 border-slate-800 pt-2 mb-8">
                        <div className="flex justify-between items-center text-lg font-black">
                            <span>TOTAL</span>
                            <span>${selectedSale.total.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center text-[10px] text-slate-400">
                        <p>Thank you for your business!</p>
                        <p>Please retain this for your records.</p>
                    </div>
                </div>
                {/* === END RECEIPT === */}

                {/* Print Action */}
                <button 
                    onClick={handlePrint}
                    className="mt-6 w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all transform hover:scale-[1.02]"
                >
                    <Printer size={18} /> Print Receipt
                </button>
             </div>
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600">
                <Receipt size={64} className="mb-4 opacity-20" />
                <p>Select a transaction to view details</p>
             </div>
           )}
        </div>

      </div>
    </div>
  );
};

export default SalesHistoryModal;