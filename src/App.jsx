import { useState, useEffect } from "react";
import { Search, DollarSign, Package, AlertTriangle, Download, ScanLine, LogOut, QrCode } from "lucide-react"; // Added QrCode Icon
import toast, { Toaster } from 'react-hot-toast';
import DashboardLayout from "./layout/DashboardLayout";
import InventoryTable from "./components/InventoryTable";
import AddProductModal from "./components/AddProductModal";
import StatsCard from "./components/StatsCard";
import InventoryChart from "./components/InventoryChart";
import ActivityLog from "./components/ActivityLog";
import BarcodeScanner from "./components/BarcodeScanner";
import LoginScreen from "./components/LoginScreen";
import LabelModal from "./components/LabelModal"; // 1. Import Label Modal
import { initialInventory } from "./data/mockData";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("inventory_auth") === "true";
  });

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("inventory_data");
    return saved ? JSON.parse(saved) : initialInventory;
  });

  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem("inventory_activities");
    return saved ? JSON.parse(saved) : [];
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false); // 2. Label Modal State
  const [productToEdit, setProductToEdit] = useState(null);

  useEffect(() => {
    localStorage.setItem("inventory_data", JSON.stringify(products));
    localStorage.setItem("inventory_activities", JSON.stringify(activities));
  }, [products, activities]);

  const handleLogin = (status) => {
    setIsAuthenticated(status);
    localStorage.setItem("inventory_auth", status);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("inventory_auth");
    toast.success("Logged out successfully");
  };

  const addToHistory = (actionType, message) => {
    const newLog = {
      id: Date.now(),
      type: actionType,
      message: message,
      timestamp: new Date().toLocaleString()
    };
    setActivities([newLog, ...activities]);
  };

  const totalValue = products.reduce((acc, product) => {
    return acc + (parseFloat(product.price || 0) * parseInt(product.stock || 0));
  }, 0);
  const lowStockCount = products.filter(p => p.stock < 10).length;
  const totalProducts = products.length;

  const handleScan = (code) => {
    setSearchTerm(code);
    setIsScannerOpen(false);
    toast.success(`Scanned: ${code}`);
    addToHistory('search', `Scanned barcode: ${code}`);
  };

  const handleExport = () => {
    const headers = ["ID,Name,SKU,Category,Price,Stock,Status"];
    const rows = products.map(p => 
      `${p.id},"${p.name}",${p.sku},${p.category},${p.price},${p.stock},${p.status}`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "inventory_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Inventory exported successfully!");
    addToHistory('export', 'Exported inventory to CSV');
  };

  const handleSaveProduct = (product) => {
    if (productToEdit) {
      setProducts(products.map(p => (p.id === product.id ? product : p)));
      setProductToEdit(null);
      toast.success("Product updated successfully!");
      addToHistory('edit', `Updated details for ${product.name}`);
    } else {
      setProducts([product, ...products]);
      toast.success("New product added!");
      addToHistory('add', `Added new product: ${product.name}`);
    }
  };

  const handleDeleteProduct = (productId) => {
    const product = products.find(p => p.id === productId);
    setProducts(products.filter((p) => p.id !== productId));
    toast.error("Product deleted.");
    addToHistory('delete', `Deleted product: ${product ? product.name : 'Unknown'}`);
  };

  const handleEditClick = (product) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (!isAuthenticated) {
    return (
      <>
        <Toaster position="top-right" />
        <LoginScreen onLogin={handleLogin} />
      </>
    );
  }

  return (
    <DashboardLayout>
      <Toaster position="top-right" />
      
      <BarcodeScanner 
        isOpen={isScannerOpen} 
        onClose={() => setIsScannerOpen(false)} 
        onScan={handleScan} 
      />

      {/* 3. The Label Modal */}
      <LabelModal 
        isOpen={isLabelModalOpen}
        onClose={() => setIsLabelModalOpen(false)}
        products={filteredProducts} // Note: It prints whatever you have filtered!
      />

      <div className="space-y-6">
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Inventory Dashboard</h1>
            <p className="text-slate-500">Overview of your current stock and value.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
          >
            <LogOut size={18} />
            <span className="font-medium">Logout</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard title="Total Inventory Value" value={`$${totalValue.toLocaleString()}`} icon={DollarSign} color="bg-blue-500" />
          <StatsCard title="Total Products" value={totalProducts} icon={Package} color="bg-purple-500" />
          <StatsCard title="Low Stock Alerts" value={lowStockCount} icon={AlertTriangle} color={lowStockCount > 0 ? "bg-amber-500" : "bg-emerald-500"} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <InventoryChart products={products} />
          </div>
          <div className="lg:col-span-1">
            <ActivityLog activities={activities} />
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
           
           <div className="relative group w-full md:w-96 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Search by name or SKU..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                onClick={() => setIsScannerOpen(true)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 rounded-lg border border-slate-200 transition-colors"
                title="Scan Barcode"
              >
                <ScanLine size={20} />
              </button>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              {/* 4. NEW BUTTON: Print Labels */}
              <button
                onClick={() => setIsLabelModalOpen(true)}
                className="flex-1 md:flex-none border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2.5 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
              >
                <QrCode size={18} />
                Labels
              </button>

              <button onClick={handleExport} className="flex-1 md:flex-none border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2.5 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2">
                <Download size={18} />
                Export CSV
              </button>
              
              <button onClick={handleAddClick} className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2">
                + Add Product
              </button>
            </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <InventoryTable products={filteredProducts} onDelete={handleDeleteProduct} onEdit={handleEditClick} />
        </div>

        {isModalOpen && (
          <AddProductModal
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveProduct}
            productToEdit={productToEdit}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

export default App;