import { useState, useEffect } from "react";
import { 
  Search, DollarSign, Package, AlertTriangle, Download, ScanLine, 
  LogOut, QrCode, Settings, Plus, Filter, X, CreditCard, Truck, 
  Layers, TrendingUp, Receipt 
} from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';

// Layouts & Components
import DashboardLayout from "./layout/DashboardLayout";
import InventoryTable from "./components/InventoryTable";
import StatsCard from "./components/StatsCard";
import InventoryChart from "./components/InventoryChart";
import ActivityLog from "./components/ActivityLog";
import LoginScreen from "./components/LoginScreen";
import ThemeToggle from "./components/ThemeToggle";

// Modals
import AddProductModal from "./components/AddProductModal";
import BarcodeScanner from "./components/BarcodeScanner";
import LabelModal from "./components/LabelModal";
import AdjustStockModal from "./components/AdjustStockModal";
import SupplierModal from "./components/SupplierModal";
import ReorderModal from "./components/ReorderModal";
import CategoryModal from "./components/CategoryModal";
import SettingsModal from "./components/SettingsModal";
import POSModal from "./components/POSModal";
import SalesHistoryModal from "./components/SalesHistoryModal";

// Data
import { initialInventory } from "./data/mockData";

function App() {
  // --- 1. INITIALIZATION & STATE ---
  
  // Auth
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("inventory_auth") === "true";
  });

  // Data States
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

  const [sales, setSales] = useState(() => {
    const saved = localStorage.getItem("inventory_sales");
    return saved ? JSON.parse(saved) : [];
  });

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterSupplier, setFilterSupplier] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // Modal Visibility States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPOSOpen, setIsPOSOpen] = useState(false);
  const [isSalesHistoryOpen, setIsSalesHistoryOpen] = useState(false);
  
  // Selection States
  const [productToEdit, setProductToEdit] = useState(null);
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [adjustProduct, setAdjustProduct] = useState(null);
  const [adjustType, setAdjustType] = useState('add'); 

  // --- 2. PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem("inventory_data", JSON.stringify(products));
    localStorage.setItem("inventory_activities", JSON.stringify(activities));
    localStorage.setItem("inventory_suppliers", JSON.stringify(suppliers));
    localStorage.setItem("inventory_categories", JSON.stringify(categories));
    localStorage.setItem("inventory_sales", JSON.stringify(sales));
  }, [products, activities, suppliers, categories, sales]);

  // --- 3. CORE HANDLERS ---

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

  // --- 4. DATA MANIPULATION HANDLERS ---

  // Suppliers
  const handleAddSupplier = (newSupplier) => {
    setSuppliers([...suppliers, newSupplier]);
    toast.success(`Added supplier: ${newSupplier.name}`);
    addToHistory('add', `New supplier registered: ${newSupplier.name}`);
  };

  const handleDeleteSupplier = (id) => {
    setSuppliers(suppliers.filter(s => s.id !== id));
    toast.error("Supplier removed");
  };

  // Categories
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

  // Products
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

  // Stock Adjustments
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

  // POS Sale
  const handlePOSSale = (cartItems) => {
    let updatedProducts = [...products];
    let totalRevenue = 0;

    cartItems.forEach(item => {
        const productIndex = updatedProducts.findIndex(p => p.id === item.id);
        if (productIndex > -1) {
            let p = updatedProducts[productIndex];
            p.stock = Math.max(0, p.stock - item.qty);
            
            if (p.stock === 0) p.status = 'Out of Stock';
            else if (p.stock < 10) p.status = 'Low Stock';
            else p.status = 'In Stock';

            totalRevenue += (p.price * item.qty);
        }
    });

    setProducts(updatedProducts);

    // Save to History
    const newSale = {
        id: Date.now(),
        date: new Date().toISOString(),
        items: cartItems,
        total: totalRevenue
    };
    setSales([newSale, ...sales]);

    addToHistory('export', `Sale completed. Revenue: $${totalRevenue.toFixed(2)}. Items: ${cartItems.length}`);
    toast.success("Sale Recorded Successfully!");
  };

  // Tools
  const handleScan = (code) => {
    setSearchTerm(code);
    setIsScannerOpen(false);
    toast.success(`Scanned: ${code}`);
    addToHistory('search', `Scanned barcode: ${code}`);
  };

  const handleExport = () => {
    const headers = ["ID,Name,SKU,Category,Price,Cost,Stock,Status,Supplier"];
    const rows = products.map(p => 
      `${p.id},"${p.name}",${p.sku},${p.category},${p.price},${p.cost || 0},${p.stock},${p.status},"${p.supplier || ''}"`
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

  const handleEditClick = (product) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterCategory("All");
    setFilterSupplier("All");
    setFilterStatus("All");
  };

  // --- 5. CALCULATIONS ---

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === "All" || product.category === filterCategory;
    const matchesSupplier = filterSupplier === "All" || product.supplier === filterSupplier;
    
    let matchesStatus = true;
    if (filterStatus === "Low Stock") matchesStatus = product.stock < 10 && product.stock > 0;
    if (filterStatus === "Out of Stock") matchesStatus = product.stock === 0;
    
    return matchesSearch && matchesCategory && matchesSupplier && matchesStatus;
  });

  const totalValue = products.reduce((acc, product) => {
    return acc + (parseFloat(product.price || 0) * parseInt(product.stock || 0));
  }, 0);
  
  const totalCost = products.reduce((acc, product) => {
    return acc + (parseFloat(product.cost || 0) * parseInt(product.stock || 0));
  }, 0);

  const potentialProfit = totalValue - totalCost;
  const lowStockCount = products.filter(p => p.stock < 10).length;
  const totalProducts = products.length;

  // --- 6. RENDER ---

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
        
        {/* === MODALS === */}
        <BarcodeScanner isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} onScan={handleScan} />
        <LabelModal isOpen={isLabelModalOpen} onClose={() => setIsLabelModalOpen(false)} products={filteredProducts} />
        <AdjustStockModal isOpen={adjustModalOpen} onClose={() => setAdjustModalOpen(false)} onConfirm={handleStockAdjustment} product={adjustProduct} type={adjustType} />
        <SupplierModal isOpen={isSupplierModalOpen} onClose={() => setIsSupplierModalOpen(false)} suppliers={suppliers} onAdd={handleAddSupplier} onDelete={handleDeleteSupplier} />
        <CategoryModal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} categories={categories} onAdd={handleAddCategory} onDelete={handleDeleteCategory} />
        <ReorderModal isOpen={isReorderModalOpen} onClose={() => setIsReorderModalOpen(false)} products={products} />
        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} onOpenCategories={() => setIsCategoryModalOpen(true)} onOpenSuppliers={() => setIsSupplierModalOpen(true)} products={products} suppliers={suppliers} categories={categories} activities={activities} />
        <POSModal isOpen={isPOSOpen} onClose={() => setIsPOSOpen(false)} products={products} onCompleteSale={handlePOSSale} />
        <SalesHistoryModal isOpen={isSalesHistoryOpen} onClose={() => setIsSalesHistoryOpen(false)} sales={sales} />
        
        {isModalOpen && (
          <AddProductModal onClose={() => setIsModalOpen(false)} onSave={handleSaveProduct} productToEdit={productToEdit} suppliers={suppliers} categories={categories} />
        )}

        <div className="space-y-6">
          
          {/* === HEADER === */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Inventory Dashboard</h1>
              <p className="text-slate-500 dark:text-slate-400">Overview of your current stock and value.</p>
            </div>
            
            <div className="flex gap-3">
              <ThemeToggle />
              <button onClick={() => setIsSettingsOpen(true)} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors" title="Settings & Backup">
                <Settings size={20} />
              </button>
              <button onClick={handleLogout} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-red-500 hover:bg-red-50 dark:hover:bg-slate-600 transition-colors" title="Logout">
                <LogOut size={20} />
              </button>
            </div>
          </div>

          {/* === STATS CARDS === */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard title="Total Value" value={`$${totalValue.toLocaleString()}`} icon={DollarSign} color="bg-blue-500" />
            
            <StatsCard title="Potential Profit" value={`$${potentialProfit.toLocaleString()}`} icon={TrendingUp} color="bg-emerald-500" />

            <div onClick={() => setIsPOSOpen(true)} className="cursor-pointer hover:opacity-90 transition-opacity">
               <StatsCard title="New Sale" value="Register" icon={CreditCard} color="bg-purple-500" />
            </div>

            <div onClick={() => setIsSalesHistoryOpen(true)} className="cursor-pointer hover:opacity-90 transition-opacity">
               <StatsCard title="Sales History" value={sales.length} icon={Receipt} color="bg-indigo-500" />
            </div>
          </div>
          
          {/* Low Stock Banner (If Needed) */}
          {lowStockCount > 0 && (
            <div 
              onClick={() => setIsReorderModalOpen(true)}
              className="bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 flex items-center justify-between cursor-pointer hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
            >
              <div className="flex items-center gap-3 text-amber-800 dark:text-amber-200">
                <AlertTriangle size={20} />
                <span className="font-bold">{lowStockCount} items are running low on stock.</span>
              </div>
              <span className="text-sm font-bold text-amber-700 dark:text-amber-300">View Reorder Report →</span>
            </div>
          )}

          {/* === CHARTS & LOGS === */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <InventoryChart products={products} />
            </div>
            <div className="lg:col-span-1">
              <ActivityLog activities={activities} />
            </div>
          </div>

          {/* === TOOLBAR & FILTERS === */}
          <div className="flex flex-col gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
             
            {/* Top Row: Search & Scan */}
            <div className="flex flex-col md:flex-row gap-3">
               <div className="relative group flex-1">
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
                  className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 transition-colors flex items-center justify-center gap-2"
                  title="Scan Barcode"
                >
                  <ScanLine size={20} />
                  <span className="md:hidden">Scan</span>
                </button>
            </div>

            {/* Bottom Row: Filters & Actions */}
            <div className="flex flex-col md:flex-row gap-3 justify-between">
              
              {/* Filters Group */}
              <div className="flex flex-col md:flex-row gap-2 flex-1">
                
                {/* Category Filter */}
                <div className="relative">
                  <select 
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full md:w-40 pl-3 pr-8 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-white appearance-none cursor-pointer"
                  >
                    <option value="All">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <Filter className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                </div>

                {/* Supplier Filter */}
                <div className="relative">
                  <select 
                    value={filterSupplier}
                    onChange={(e) => setFilterSupplier(e.target.value)}
                    className="w-full md:w-40 pl-3 pr-8 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-white appearance-none cursor-pointer"
                  >
                    <option value="All">All Suppliers</option>
                    {suppliers.map(sup => (
                      <option key={sup.id} value={sup.name}>{sup.name}</option>
                    ))}
                  </select>
                  <Filter className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full md:w-40 pl-3 pr-8 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-white appearance-none cursor-pointer"
                  >
                    <option value="All">All Status</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                  <AlertTriangle className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                </div>

                {(filterCategory !== "All" || filterSupplier !== "All" || filterStatus !== "All" || searchTerm) && (
                  <button onClick={clearFilters} className="text-slate-500 dark:text-slate-400 hover:text-red-500 text-sm flex items-center gap-1 px-2">
                    <X size={14} /> Clear
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 w-full md:w-auto border-t md:border-t-0 border-slate-100 dark:border-slate-700 pt-3 md:pt-0">
                <button
                  onClick={() => setIsLabelModalOpen(true)}
                  className="flex-1 md:flex-none border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 px-3 py-2 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
                  title="Print Labels"
                >
                  <QrCode size={18} />
                </button>

                <button onClick={handleExport} className="flex-1 md:flex-none border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 px-3 py-2 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2">
                  <Download size={18} />
                  <span className="hidden md:inline">Export</span>
                </button>
                
                <button onClick={handleAddClick} className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2">
                  <Plus size={18} /> Add
                </button>
              </div>
            </div>
          </div>

          {/* === MAIN TABLE === */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <InventoryTable 
              products={filteredProducts} 
              onDelete={handleDeleteProduct} 
              onEdit={handleEditClick} 
              onAdjust={handleAdjustClick} 
            />
          </div>

        </div>
      </DashboardLayout>
    </div>
  );
}

export default App;