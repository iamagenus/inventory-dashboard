import React from 'react';
import QRCode from 'react-qr-code';
import { X, Printer } from 'lucide-react';

const LabelModal = ({ isOpen, onClose, products }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 modal-overlay">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header - Hidden when printing */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 print:hidden">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Print Labels</h2>
            <p className="text-slate-500 text-sm">Generate QR codes for physical inventory.</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition-colors"
            >
              <Printer size={18} />
              Print Labels
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-2">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-8 bg-slate-50 flex-1">
          
          {/* THE PRINTABLE AREA */}
          <div id="printable-area" className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col items-center text-center shadow-sm break-inside-avoid">
                <div className="mb-3">
                  <QRCode 
                    value={product.sku} 
                    size={100} 
                    level="M" // Medium error correction
                  />
                </div>
                <h3 className="font-bold text-slate-900 text-sm leading-tight mb-1">{product.name}</h3>
                <p className="font-mono text-xs text-slate-500">{product.sku}</p>
                <p className="text-xs text-slate-400 mt-1">{product.category}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default LabelModal;