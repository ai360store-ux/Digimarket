
import React from 'react';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="flex gap-10">
      {/* Persistent Sidebar */}
      <AdminSidebar />

      {/* Content Area - shifted right on desktop to make room for sidebar */}
      <div className="flex-1 lg:ml-80">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
