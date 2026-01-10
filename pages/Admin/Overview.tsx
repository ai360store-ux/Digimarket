
import React from 'react';
import { Link } from 'react-router-dom';
import { useDigiContext } from '../../context/DigiContext';

const AdminOverview: React.FC = () => {
  const { products } = useDigiContext();

  const stats = [
    { label: 'Catalog', value: products.length, icon: '📦', color: 'bg-blue-50 text-blue-600 border-blue-100' },
    { label: 'Trending', value: products.filter(p => p.isTrending).length, icon: '🔥', color: 'bg-rose-50 text-rose-600 border-rose-100' },
    { label: 'Bestsellers', value: products.filter(p => p.isBestseller).length, icon: '🏆', color: 'bg-amber-50 text-amber-600 border-amber-100' },
    { label: 'New Nodes', value: products.filter(p => p.isNew).length, icon: '✨', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  ];

  const quicklinks = [
    { label: 'New Asset', to: '/admin/products/add', icon: '➕', desc: 'Add product' },
    { label: 'Inventory', to: '/admin/products', icon: '📝', desc: 'Edit listings' },
    { label: 'Sectors', to: '/admin/categories', icon: '📂', desc: 'Categories' },
    { label: 'System', to: '/admin/settings', icon: '⚙️', desc: 'API & Identity' },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section - Tighter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Command Control</h2>
          <p className="text-slate-400 text-[8px] font-black uppercase tracking-[0.3em]">Vault Management Infrastructure</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl border border-emerald-100 text-[9px] font-black uppercase tracking-widest italic flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            Database Live
          </div>
        </div>
      </div>

      {/* Stats Grid - Smaller cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className={`p-5 rounded-3xl border ${stat.color} shadow-sm transition-all hover:shadow-md`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xl">{stat.icon}</span>
              <div className="w-8 h-0.5 bg-current opacity-20 rounded-full"></div>
            </div>
            <div className="space-y-0.5">
              <p className="text-[9px] font-black uppercase tracking-widest opacity-60 italic">{stat.label}</p>
              <h4 className="text-2xl font-black tracking-tighter italic leading-none">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Grid - Tighter cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quicklinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:border-blue-200 transition-all group hover:shadow-md active:scale-95"
          >
            <div className="w-10 h-10 bg-slate-50 flex items-center justify-center rounded-xl text-lg group-hover:scale-110 transition-transform mb-3">
              {link.icon}
            </div>
            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-tight italic mb-1">{link.label}</h4>
            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest leading-none">{link.desc}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
        <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-50 pb-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tighter italic">Recent Updates</h3>
            <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest italic bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">Live Feed</span>
          </div>
          <div className="space-y-3">
            {products.slice(0, 5).map(product => (
              <div key={product.id} className="flex items-center justify-between p-3.5 bg-slate-50/50 rounded-2xl border border-slate-100/50 group hover:border-blue-200 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl overflow-hidden border border-white shadow-sm">
                    <img src={product.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-tight italic">{product.title}</h5>
                    <p className="text-slate-400 text-[8px] font-bold uppercase tracking-widest mt-0.5">{product.category}</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-4">
                  <div className="hidden sm:block">
                    <div className="text-sm font-black text-slate-900 tracking-tighter italic">#{product.id.split('-')[1]}</div>
                    <div className="text-[7px] font-black text-emerald-500 uppercase tracking-widest mt-0.5">Active</div>
                  </div>
                  <Link to={`/admin/products/edit/${product.id}`} className="w-8 h-8 bg-white rounded-xl flex items-center justify-center border border-slate-100 hover:bg-slate-900 hover:text-white transition-all shadow-sm text-xs">
                    ⚙️
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[40px] rounded-full"></div>
            <h3 className="text-sm font-black uppercase tracking-tighter italic relative z-10">Infrastructure</h3>
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40">DB Node</span>
                <span className="text-[8px] font-black text-emerald-400 uppercase italic flex items-center gap-1.5">
                  <span className="w-1 h-1 bg-emerald-400 rounded-full animate-ping"></span>
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40">Vault</span>
                <span className="text-[8px] font-black text-emerald-400 uppercase italic">Sync'd</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40">Engine</span>
                <span className="text-[8px] font-black text-emerald-400 uppercase italic">v3.1</span>
              </div>
            </div>
            <div className="pt-2">
              <div className="w-full bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[8px] font-black uppercase tracking-widest text-white/30">Auto-Backup</span>
                  <span className="text-[8px] font-black text-white/50">85%</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-[85%] bg-blue-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
