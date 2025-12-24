import Sidebar from '../components/Sidebar';

const DashboardLayout = ({ children }) => {
  return (
    /* Removed border-green-500 */
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      
      {/* 1. The Sidebar (Fixed width) */}
      <Sidebar />

      {/* 2. The Main Content Area (Takes remaining space) */}
      <main className="flex-1 w-full overflow-y-auto">
        
        {/* Optional Header */}
        <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
          <h1 className="text-xl font-semibold text-slate-800">Overview</h1>
        </header>

        {/* Content Wrapper - Kept w-full to prevent shrinking */}
        <div className="p-8 w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;