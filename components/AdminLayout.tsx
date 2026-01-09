
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Overview', path: '/admin', icon: '📊' },
    { label: 'Inventory', path: '/admin/products', icon: '📦' },
    { label: 'Add Product', path: '/admin/products/add', icon: '➕' },
    { label: 'Categories', path: '/admin/categories', icon: '🏷️' },
    { label: 'System Settings', path: '/admin/settings', icon: '⚙️' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('dm_admin_auth');
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 shrink-0 hidden lg:flex flex-col shadow-sm">
        <div className="p-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white italic shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform">V</div>
            <div className="flex flex-col">
              <span className="font-black text-[13px] tracking-widest uppercase text-slate-900 leading-none mb-1">Vault Control</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Admin Terminal</span>
            </div>
          </Link>
        </div>
        
        <nav className="flex-grow px-4 mt-4 space-y-1">
          {menuItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold text-[11px] uppercase tracking-wider ${isActive ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
              >
                <span className={`text-xl transition-transform ${isActive ? 'scale-110' : 'opacity-60'}`}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-6 mt-auto">
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 mb-6">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Support Bridge</p>
            <p className="text-[11px] font-bold text-slate-900">Console v7.4.2</p>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-5 py-4 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all font-bold text-[11px] uppercase tracking-wider group"
          >
            <span className="text-xl group-hover:scale-110 transition-transform">🚪</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-10 shrink-0 sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <h2 className="font-black text-slate-900 text-[12px] uppercase tracking-[0.2em]">
               {menuItems.find(item => item.path === location.pathname)?.label || 'Console Home'}
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-[10px] font-black text-blue-600 hover:bg-blue-600 hover:text-white uppercase tracking-widest flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl transition-all border border-blue-100">
               <span className="text-sm">👁️</span>
               View Storefront
            </Link>
          </div>
        </header>
        <div className="flex-grow p-10 overflow-y-auto no-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
