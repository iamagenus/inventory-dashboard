import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import DashboardLayout from "./layout/DashboardLayout";
import InventoryTable from "./components/InventoryTable";
import AddProductModal from "./components/AddProductModal";
import { initialInventory } from "./data/mockData";

function App() {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("inventory_data");
    return saved ? JSON.parse(saved) : initialInventory;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null); // 1. New State for Editing

  useEffect(() => {
    localStorage.setItem("inventory_data", JSON.stringify(products));
  }, [products]);

  // 2. SMART SAVE FUNCTION (Handles both Add AND Edit)
  const handleSaveProduct = (product) => {
    if (productToEdit) {
      // Logic for EDIT: Find item by ID and replace it
      setProducts(products.map((p) => (p.id === product.id ? product : p)));
      setProductToEdit(null); // Clear edit mode
    } else {
      // Logic for ADD: Add to top
      setProducts([product, ...products]);
    }
  };

  // 3. Trigger Edit Mode
  const handleEditClick = (product) => {
    setProductToEdit(product); // Load data into state
    setIsModalOpen(true); // Open modal
  };

  const handleAddClick = () => {
    setProductToEdit(null); // Ensure we are in "Add" mode (clear old data)
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Inventory</h1>
            <p className="text-slate-500">
              Manage your products and stock levels.
            </p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative group w-full md:w-64">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                size={20}
              />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              onClick={handleAddClick} // Updated to use new handler
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
            >
              + Add Product
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* 4. Pass the Edit Handler to Table */}
          <InventoryTable
            products={filteredProducts}
            onDelete={handleDeleteProduct}
            onEdit={handleEditClick}
          />
        </div>

        {/* 5. Pass Data to Modal */}
        <AddProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveProduct} // Renamed prop for clarity
          productToEdit={productToEdit}
        />
      </div>
    </DashboardLayout>
  );
}

export default App;
