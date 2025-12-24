import { useState, useEffect } from "react";
import { Search, DollarSign, Package, AlertTriangle, Download } from "lucide-react"; // Added Download icon
import DashboardLayout from "./layout/DashboardLayout";
import InventoryTable from "./components/InventoryTable";
import AddProductModal from "./components/AddProductModal";
import StatsCard from "./components/StatsCard";
import { initialInventory } from "./data/mockData";

function App() {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("inventory_data");
    return saved ? JSON.parse(saved) : initialInventory;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  useEffect(() => {
    localStorage.setItem("inventory_data", JSON.stringify(products));
  }, [products]);

  // --- STATS LOGIC ---
  const totalValue = products.reduce((acc, product) => {
    return acc + (parseFloat(product.price || 0) * parseInt(product.stock || 0));
  }, 0);
  const lowStockCount = products.filter(p => p.stock < 10).length;
  const totalProducts = products.length;

  // --- NEW: EXPORT TO CSV LOGIC ---
  const handleExport = () => {
    // 1. Define the headers
    const headers = ["ID,Name,SKU,Category,Price,Stock,Status"];
    
    // 2. Format the data (add quotes around names to handle commas)
    const rows = products.map(p => 
      `${p.id},"${p.name}",${p.sku},${p.category},${p.price},${p.stock},${p.status}`
    );

    // 3. Combine headers and rows
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    
    // 4. Create a fake download link and click it
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "inventory_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  // --------------------------------

  const handleSaveProduct = (product) => {
    if (productToEdit) {
      setProducts(products.map(p => (p.id === product.id ? product : p)));
      setProductToEdit(null);
    } else {
      setProducts([product, ...products]);
    }
  };

  const handleEditClick = (product) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter((product) => product.id !== productId));
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Inventory Dashboard</h1>
          <p className="text-slate-500">Overview of your current stock and value.</p>
        </div>

        {/* STATS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard 
            title="Total Inventory Value" 
            value={`$${totalValue.toLocaleString()}`} 
            icon={DollarSign} 
            color="bg-blue-500" 
          />
          <StatsCard 
            title="Total Products" 
            value={totalProducts} 
            icon={Package} 
            color="bg-purple-500" 
          />
          <StatsCard 
            title="Low Stock Alerts" 
            value={lowStockCount} 
            icon={AlertTriangle} 
            color={lowStockCount > 0 ? "bg-amber-500" : "bg-emerald-500"} 
          />
        </div>

        {/* CONTROLS ROW */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
           
           {/* Search Input */}
           <div className="relative group w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Search by name or SKU..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 w-full md:w-auto">
              {/* Export Button */}
              <button
                onClick={handleExport}
                className="flex-1 md:flex-none border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2.5 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
              >
                <Download size={18} />
                Export CSV
              </button>

              {/* Add Button */}
              <button
                onClick={handleAddClick}
                className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
              >
                + Add Product
              </button>
            </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <InventoryTable 
            products={filteredProducts} 
            onDelete={handleDeleteProduct}
            onEdit={handleEditClick} 
          />
        </div>

        <AddProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveProduct}
          productToEdit={productToEdit}
        />
      </div>
    </DashboardLayout>
  );
}

export default App;