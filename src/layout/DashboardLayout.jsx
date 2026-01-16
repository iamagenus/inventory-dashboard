import React from 'react';

const DashboardLayout = ({ children }) => {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {children}
    </div>
  );
};

export default DashboardLayout;