import { useRef } from 'react';
import { X, Save, Upload, Trash2, Layers, Truck, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const SettingsModal = ({ 
  isOpen, 
  onClose, 
  onOpenCategories, 
  onOpenSuppliers, 
  products, 
  suppliers, 
  categories,
  activities 
}) => {
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  // 1. BACKUP FUNCTION
  const handleBackup = () => {
    const data = {
      products,
      suppliers,
      categories,
      activities,
      backupDate: new Date().toISOString()
    };
    
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(data)
    )}`;
    
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `inventory_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    toast.success("Backup file downloaded!");
  };

  // 2. RESTORE FUNCTION
  const handleRestoreClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (event) => {
      try {
        const parsedData = JSON.parse(event.target.result);
        
        // Simple validation
        if (!parsedData.products || !parsedData.categories) {
          throw new Error("Invalid backup file");
        }

        // Restore to LocalStorage
        localStorage.setItem("inventory_data", JSON.stringify(parsedData.products));
        localStorage.setItem("inventory_suppliers", JSON.stringify(parsedData.suppliers));
        localStorage.setItem("inventory_categories", JSON.stringify(parsedData.categories));
        localStorage.setItem("inventory_activities", JSON.stringify(parsedData.activities));

        toast.success("Data restored! Reloading...");
        setTimeout(() => window.location.reload(), 1500);
      } catch (err) {
        toast.error("Failed to restore data. Invalid file.");
        console.error(err);
      }
    };
  };

  // 3. WIPE DATA FUNCTION
  const handleWipeData = () => {
    if (window.confirm("ARE YOU SURE? This will delete ALL products, suppliers, and history. This cannot be undone.")) {
      localStorage.clear();
      // Keep auth so we don't get logged out
      localStorage.setItem("inventory_auth", "true"); 
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">System Settings</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Section 1: Data Management */}
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Data Management</h3>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={onOpenCategories}
                className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600 hover:border-purple-500 hover:text-purple-600 transition-all gap-2"
              >
                <Layers size={24} />
                <span className="font-medium text-sm">Categories</span>
              </button>
              
              <button 
                onClick={onOpenSuppliers}
                className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600 hover:border-blue-500 hover:text-blue-600 transition-all gap-2"
              >
                <Truck size={24} />
                <span className="font-medium text-sm">Suppliers</span>
              </button>
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-700" />

          {/* Section 2: Backup & Restore */}
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Backup & Restore</h3>
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleBackup}
                className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                    <Save size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">Backup Data</p>
                    <p className="text-xs text-slate-500">Download a .json file of your inventory</p>
                  </div>
                </div>
                <Download size={18} className="text-slate-400" />
              </button>

              <button 
                onClick={handleRestoreClick}
                className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <Upload size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">Restore Data</p>
                    <p className="text-xs text-slate-500">Upload a .json backup file</p>
                  </div>
                </div>
                <Upload size={18} className="text-slate-400" />
              </button>
              {/* Hidden File Input */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept=".json"
              />
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-700" />

          {/* Section 3: Danger Zone */}
          <div>
            <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-3">Danger Zone</h3>
            <button 
              onClick={handleWipeData}
              className="w-full flex items-center justify-center gap-2 p-3 border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors font-bold text-sm"
            >
              <Trash2 size={18} />
              Wipe All Data & Reset
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SettingsModal;