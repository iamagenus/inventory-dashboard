import { LayoutDashboard, Package, ShoppingCart, Settings } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard' },
    { icon: Package, label: 'Inventory' },
    { icon: ShoppingCart, label: 'Orders' },
    { icon: Settings, label: 'Settings' },
  ];

  return (
    // h-screen makes it full height
    <aside className="h-screen w-64 bg-slate-900 text-white flex flex-col">
      {/* Logo Area */}
      <div className="p-6 text-2xl font-bold border-b border-slate-800">
        Stock<span className="text-blue-500">Master</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className="flex items-center w-full gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold">
            JD
          </div>
          <div className="text-sm">
            <p className="font-medium">John Doe</p>
            <p className="text-xs text-slate-400">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;