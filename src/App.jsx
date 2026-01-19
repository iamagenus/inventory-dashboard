import { useState, useEffect } from "react";
import { Search, DollarSign, Package, AlertTriangle, Download, ScanLine, LogOut, QrCode, Settings, Plus } from "lucide-react"; // Added Settings, Plus
import toast, { Toaster } from 'react-hot-toast';
import DashboardLayout from "./layout/DashboardLayout";
import InventoryTable from "./components/InventoryTable";
import AddProductModal from "./components/AddProductModal";
import StatsCard from "./components/StatsCard";
import InventoryChart from "./components/InventoryChart";
import ActivityLog from "./components/ActivityLog";
import BarcodeScanner from "./components/BarcodeScanner";
import LoginScreen from "./components/LoginScreen";
import LabelModal from "./components/LabelModal";
import AdjustStockModal from "./components/AdjustStockModal";
import ThemeToggle from "./components/ThemeToggle";
import SupplierModal from "./components/SupplierModal";
import ReorderModal from "./components/ReorderModal";
import CategoryModal from "./components/CategoryModal";
import SettingsModal from "./components/SettingsModal"; // 1. IMPORT SETTINGS
import { initialInventory } from "./data/mockData";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("inventory_auth") === "true";
  });

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("inventory_data");
    return saved ? JSON.parse(saved) : initialInventory;
  });

  const [suppliers, setSuppliers] = useState(() => {
    const saved = localStorage.getItem("inventory_suppliers");
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "NAPA Auto Parts", contact: "Local Branch" },
      { id: 2, name: "Global Industrial", contact: "Sales Dept" }
    ];
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem("inventory_categories");
    return saved ? JSON.parse(saved) : [
      "Engine Parts",
      "Hydraulics",
      "Body & Frame",
      "Electrical",
      "Suspension",
      "Accessories"
    ];
  });

  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem("inventory_activities");
    return saved ? JSON.parse(saved) : [];
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // 2. SETTINGS STATE
  const [productToEdit, setProductToEdit] = useState(null);
  
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [adjustProduct, setAdjustProduct] = useState(null);
  const [adjustType, setAdjustType] = useState('add'); 

  useEffect(() => {
    localStorage.setItem("inventory_data", JSON.stringify(products));
    localStorage.setItem("inventory_activities", JSON.stringify(activities));
    localStorage.setItem("inventory_suppliers", JSON.stringify(suppliers));
    localStorage.setItem("inventory_categories", JSON.stringify(categories));
  }, [products, activities, suppliers, categories]);

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

  const handleAddSupplier = (newSupplier) => {
    setSuppliers([...suppliers, newSupplier]);
    toast.success(`Added supplier: ${newSupplier.name}`);
    addToHistory('add', `New supplier registered: ${newSupplier.name}`);
  };

  const handleDeleteSupplier = (id) => {
    setSuppliers(suppliers.filter(s => s.id !== id));
    toast.error("Supplier removed");
  };

  const handleAddCategory = (newCat) => {
    if (categories.includes(newCat)) {
        toast.error("Category already exists");
        return;
    }
    setCategories([...categories, newCat]);
    toast.success(`Added category: ${newCat}`);
  };

  const handleDeleteCategory = (catToDelete) => {
    setCategories(categories.filter(c => c !== catToDelete));
    toast.success("Category deleted");
  };

  const handleAdjustClick = (product, type) => {
    setAdjustProduct(product);
    setAdjustType(type);
    setAdjustModalOpen(true);
  };

  const handleStockAdjustment = (amount, type, reason) => {
    if (!adjustProduct) return;

    const newStock = type === 'add' 
      ? parseInt(adjustProduct.stock) + amount
      : Math.max(0, parseInt(adjustProduct.stock) - amount); 

    let newStatus = 'In Stock';
    if (newStock === 0) newStatus = 'Out of Stock';
    else if (newStock < 10) newStatus = 'Low Stock';

    const updatedProducts = products.map(p => 
      p.id === adjustProduct.id 
        ? { ...p, stock: newStock, status: newStatus } 
        : p
    );
    
    setProducts(updatedProducts);
    
    const actionWord = type === 'add' ? 'Restocked' : 'Issued';
    const reasonText = reason ? `(${reason})` : '';
    addToHistory(
      type === 'add' ? 'add' : 'delete',
      `${actionWord} ${amount} units of ${adjustProduct.name} ${reasonText}`
    );

    toast.success(`Stock updated: ${newStock} units`);
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
    const headers = ["ID,Name,SKU,Category,Price,Stock,Status,Supplier"];
    const rows = products.map(p => 
      `${p.id},"${p.name}",${p.sku},${p.category},${p.price},${p.stock},${p.status},"${p.supplier || ''}"`
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <DashboardLayout>
        <Toaster position="top-right" />
        
        {/* Modals */}
        <BarcodeScanner 
          isOpen={isScannerOpen} 
          onClose={() => setIsScannerOpen(false)} 
          onScan={handleScan} 
        />

        <LabelModal 
          isOpen={isLabelModalOpen}
          onClose={() => setIsLabelModalOpen(false)}
          products={filteredProducts} 
        />

        <AdjustStockModal
          isOpen={adjustModalOpen}
          onClose={() => setAdjustModalOpen(false)}
          onConfirm={handleStockAdjustment}
          product={adjustProduct}
          type={adjustType}
        />
        
        <SupplierModal
          isOpen={isSupplierModalOpen}
          onClose={() => setIsSupplierModalOpen(false)}
          suppliers={suppliers}
          onAdd={handleAddSupplier}
          onDelete={handleDeleteSupplier}
        />

        <CategoryModal
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
          categories={categories}
          onAdd={handleAddCategory}
          onDelete={handleDeleteCategory}
        />

        <ReorderModal
          isOpen={isReorderModalOpen}
          onClose={() => setIsReorderModalOpen(false)}
          products={products}
        />

        {/* 3. NEW SETTINGS MODAL */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onOpenCategories={() => setIsCategoryModalOpen(true)}
          onOpenSuppliers={() => setIsSupplierModalOpen(true)}
          products={products}
          suppliers={suppliers}
          categories={categories}
          activities={activities}
        />

        <div className="space-y-6">
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Inventory Dashboard</h1>
              <p className="text-slate-500 dark:text-slate-400">Overview of your current stock and value.</p>
            </div>
            
            <div className="flex gap-3">
              <ThemeToggle />
              
              {/* 4. NEW SETTINGS BUTTON */}
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                title="Settings & Backup"
              >
                <Settings size={20} />
              </button>

              <button 
                onClick={handleLogout}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-red-500 hover:bg-red-50 dark:hover:bg-slate-600 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatsCard title="Total Inventory Value" value={`$${totalValue.toLocaleString()}`} icon={DollarSign} color="bg-blue-500" />
            <StatsCard title="Total Products" value={totalProducts} icon={Package} color="bg-purple-500" />
            
            <div 
              onClick={() => setIsReorderModalOpen(true)} 
              className="cursor-pointer hover:opacity-90 transition-opacity"
            >
              <StatsCard 
                title="Low Stock Alerts" 
                value={lowStockCount} 
                icon={AlertTriangle} 
                color={lowStockCount > 0 ? "bg-amber-500" : "bg-emerald-500"} 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <InventoryChart products={products} />
            </div>
            <div className="lg:col-span-1">
              <ActivityLog activities={activities} />
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
             
             <div className="relative group w-full md:w-96 flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input
                    type="text"
                    placeholder="Search by name or SKU..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button 
                  onClick={() => setIsScannerOpen(true)}
                  className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 px-3 rounded-lg border border-slate-200 dark:border-slate-600 transition-colors"
                  title="Scan Barcode"
                >
                  <ScanLine size={20} />
                </button>
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                {/* 5. CLEANER BUTTON GROUP */}
                <button
                  onClick={() => setIsLabelModalOpen(true)}
                  className="flex-1 md:flex-none border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 px-4 py-2.5 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <QrCode size={18} />
                  <span className="hidden md:inline">Labels</span>
                </button>

                <button onClick={handleExport} className="flex-1 md:flex-none border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 px-4 py-2.5 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2">
                  <Download size={18} />
                  <span className="hidden md:inline">CSV</span>
                </button>
                
                <button onClick={handleAddClick} className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2">
                  <Plus size={18} /> Add Product
                </button>
              </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <InventoryTable 
              products={filteredProducts} 
              onDelete={handleDeleteProduct} 
              onEdit={handleEditClick} 
              onAdjust={handleAdjustClick} 
            />
          </div>

          {isModalOpen && (
            <AddProductModal
              onClose={() => setIsModalOpen(false)}
              onSave={handleSaveProduct}
              productToEdit={productToEdit}
              suppliers={suppliers}
              categories={categories}
            />
          )}
        </div>
      </DashboardLayout>
    </div>
  );
}

export default App;