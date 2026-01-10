
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDigiContext } from '../context/DigiContext';

const AdminSidebar: React.FC = () => {
    const { logout } = useDigiContext();

    const navItems = [
        { to: '/admin', label: 'Overview', icon: '📈' },
        { to: '/admin/products', label: 'Products', icon: '📦' },
        { to: '/admin/categories', label: 'Categories', icon: '📂' },
        { to: '/admin/settings', label: 'Settings', icon: '⚙️' },
    ];

    return (
        <aside className="fixed left-4 top-32 w-60 bg-white/90 backdrop-blur-3xl border border-slate-200/60 rounded-3xl shadow-xl p-6 space-y-10 z-50 hidden lg:block">
            <div className="">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center text-white text-sm font-black italic shadow-lg">
                        A
                    </div>
                    <div>
                        <h3 className="text-[11px] font-black text-slate-900 uppercase italic tracking-tight">Admin Portal</h3>
                        <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest italic opacity-80">Online</p>
                    </div>
                </div>
            </div>

            <nav className="space-y-1">
                {navItems.map(item => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === '/admin'}
                        className={({ isActive }) => `
                            flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all font-black uppercase text-[10px] tracking-widest italic
                            ${isActive
                                ? 'bg-slate-900 text-white shadow-lg shadow-slate-200'
                                : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}
                        `}
                    >
                        <span className="text-base opacity-70">{item.icon}</span>
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="pt-6 border-t border-slate-100">
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-rose-600 font-black uppercase text-[10px] tracking-widest italic hover:bg-rose-50 transition-all group"
                >
                    <span className="text-base group-hover:rotate-12 transition-transform">🚪 Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
