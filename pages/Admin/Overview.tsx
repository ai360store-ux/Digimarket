
import React from 'react';
import { useDigiContext } from '../../context/DigiContext';

const AdminOverview: React.FC = () => {
  const { products } = useDigiContext();
  const stats = [
    { label: 'Total Catalog', value: products.length, icon: '📦', color: 'bg-blue-50 text-blue-600 border-blue-100' },
    { label: 'Hot Trending', value: products.filter(p => p.isTrending).length, icon: '🔥', color: 'bg-rose-50 text-rose-600 border-rose-100' },
    { label: 'Bestsellers', value: products.filter(p => p.isBestseller).length, icon: '🏆', color: 'bg-amber-50 text-amber-600 border-amber-100' },
    { label: 'New Nodes', value: products.filter(p => p.isNew).length, icon: '✨', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  ];

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className={`p-8 rounded-[2.5rem] border ${stat.color} shadow-sm transition-transform hover:scale-105 duration-500`}>
            <div className="flex items-center justify-between mb-6">
              <span className="text-3xl">{stat.icon}</span>
              <div className="w-10 h-1 bg-current opacity-20 rounded-full"></div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 italic">{stat.label}</p>
              <h4 className="text-4xl font-black tracking-tighter italic leading-none">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-10">
          <div className="flex items-center justify-between border-b border-slate-50 pb-6">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">Recent Updates</h3>
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest italic bg-blue-50 px-4 py-2 rounded-xl">Live Feed</span>
          </div>
          <div className="space-y-6">
            {products.slice(0, 5).map(product => (
              <div key={product.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-blue-200 transition-all">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white shadow-md">
                    <img src={product.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h5 className="font-black text-slate-900 uppercase tracking-tight italic">{product.title}</h5>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">{product.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-slate-900 tracking-tighter italic">ID: {product.id}</div>
                  <div className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-1">Status: Active</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-10">
          <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white space-y-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/20 blur-[60px] rounded-full"></div>
            <h3 className="text-xl font-black uppercase tracking-tighter italic relative z-10">System Status</h3>
            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Database Node</span>
                <span className="text-[10px] font-black text-emerald-400 uppercase italic">Online Connected</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Storage Vault</span>
                <span className="text-[10px] font-black text-emerald-400 uppercase italic">Synchronized</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">API Engine</span>
                <span className="text-[10px] font-black text-emerald-400 uppercase italic">Stable 2.0</span>
              </div>
            </div>
            <div className="pt-4">
              <div className="w-full bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Auto-Backup</span>
                  <span className="text-[9px] font-black text-white/60">Every 4H</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-[85%] bg-blue-500 rounded-full animate-pulse"></div>
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
