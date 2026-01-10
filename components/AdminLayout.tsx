
import React from 'react';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="flex gap-8">
      {/* Optimized Sidebar - now 60 units wide */}
      <AdminSidebar />

      {/* Content Area - tighter margins */}
      <div className="flex-1 lg:ml-64">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
