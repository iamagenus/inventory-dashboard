import {
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Package,
} from "lucide-react"; // Added Package icon

const InventoryTable = ({ products, onDelete, onEdit }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "in stock":
        return "bg-emerald-100 text-emerald-700";
      case "low stock":
        return "bg-amber-100 text-amber-700";
      case "out of stock":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "in stock":
        return <CheckCircle2 size={16} />;
      case "low stock":
        return <AlertCircle size={16} />;
      case "out of stock":
        return <XCircle size={16} />;
      default:
        return null;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse table-fixed">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="w-1/3 px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Product Name
            </th>
            <th className="w-32 px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              SKU
            </th>
            <th className="w-32 px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Category
            </th>
            <th className="w-24 px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Price
            </th>
            <th className="w-24 px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Stock
            </th>
            <th className="w-40 px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Status
            </th>
            <th className="w-24 px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {products.length > 0 ? (
            products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-slate-50 transition-colors"
              >
                {/* 1. UPDATED PRODUCT NAME CELL WITH IMAGE */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {/* The Image Box */}
                    <div className="h-10 w-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null; // Prevent infinite loop
                            e.target.style.display = "none"; // Hide broken image
                            e.target.parentElement.classList.add(
                              "flex",
                              "items-center",
                              "justify-center",
                            ); // Re-center placeholder
                            // We can't easily render the Package icon here via standard DOM,
                            // so usually we hide the img and let the background show,
                            // or rely on the condition below if we had state management for errors.
                          }}
                        />
                      ) : (
                        <Package size={20} className="text-slate-400" />
                      )}
                    </div>
                    {/* The Name */}
                    <div className="font-medium text-slate-900 truncate">
                      {product.name}
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-sm text-slate-500 font-mono">
                  {product.sku}
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {product.category}
                </td>
                <td className="px-6 py-4 text-sm text-slate-700 font-medium">
                  ${Number(product.price).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm text-slate-700">
                  {product.stock}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}
                  >
                    {getStatusIcon(product.status)}
                    {product.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="text-slate-400 hover:text-blue-600 transition-colors p-1 rounded hover:bg-blue-50"
                  >
                    <Edit size={18} />
                  </button>

                  <button
                    onClick={() => onDelete(product.id)}
                    className="text-slate-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="p-3 bg-slate-100 rounded-full">
                    <AlertCircle size={24} />
                  </div>
                  <p>No products found matching your search.</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;
