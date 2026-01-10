
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDigiContext } from '../context/DigiContext';

const AdminSidebar: React.FC = () => {
    const { logout } = useDigiContext();

    const navItems = [
        { to: '/admin', label: 'Overview', icon: '📊' },
        { to: '/admin/products', label: 'Products', icon: '📦' },
        { to: '/admin/categories', label: 'Categories', icon: '📁' },
        { to: '/admin/settings', label: 'Settings', icon: '⚙️' },
    ];

    return (
        <aside className="fixed left-4 top-40 w-72 bg-white/80 backdrop-blur-2xl border border-white/20 rounded-[3rem] shadow-2xl p-8 space-y-12 z-50 hidden lg:block">
            <div className="space-y-4">
                <div className="flex items-center gap-4 px-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-xl border-4 border-blue-50 shadow-xl shadow-blue-200">
                        A
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-slate-900 uppercase italic tracking-tighter">Admin Node</h3>
                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic animate-pulse">Authenticated</p>
                    </div>
                </div>
            </div>

            <nav className="space-y-2">
                {navItems.map(item => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === '/admin'}
                        className={({ isActive }) => `
                            flex items-center gap-6 px-6 py-5 rounded-3xl transition-all font-black uppercase text-[11px] tracking-widest italic
                            ${isActive
                                ? 'bg-slate-900 text-white shadow-xl shadow-slate-300'
                                : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}
                        `}
                    >
                        <span className="text-xl opacity-60">{item.icon}</span>
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="pt-12 border-t border-slate-100">
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-6 px-6 py-5 rounded-3xl text-rose-600 font-black uppercase text-[11px] tracking-widest italic hover:bg-rose-50 transition-all group"
                >
                    <span className="text-xl group-hover:rotate-12 transition-transform">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
