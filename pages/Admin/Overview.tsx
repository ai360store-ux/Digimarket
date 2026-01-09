
import React from 'react';
import { Product } from '../../types';

interface OverviewProps {
  products: Product[];
}

const AdminOverview: React.FC<OverviewProps> = ({ products }) => {
  const stats = [
    { label: 'Total Catalog', value: products.length, icon: '📦', color: 'bg-blue-50 text-blue-600 border-blue-100' },
    { label: 'Hot Trending', value: products.filter(p => p.isTrending).length, icon: '🔥', color: 'bg-rose-50 text-rose-600 border-rose-100' },
    { label: 'Market Bestsellers', value: products.filter(p => p.isBestseller).length, icon: '🏆', color: 'bg-amber-50 text-amber-600 border-amber-100' },
    { label: 'Active Distribution', value: products.filter(p => p.status === 'active').length, icon: '🟢', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  ];

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm group hover:border-blue-200 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between mb-8">
              <div className={`w-14 h-14 ${stat.color} border rounded-[20px] flex items-center justify-center text-2xl shadow-sm transition-transform group-hover:scale-110`}>
                {stat.icon}
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">→</div>
            </div>
            <div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
              <p className="text-4xl font-black text-slate-900 tracking-tighter italic">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm p-10 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-4 italic">
              <span className="w-8 h-1 bg-blue-600 rounded-full"></span>
              Live Catalog Status
            </h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full border border-slate-200">Auto-refreshing Session</span>
          </div>
          
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-separate border-spacing-y-4">
              <thead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
                <tr>
                  <th className="px-6 py-4">Repository Item</th>
                  <th className="px-6 py-4">Sector</th>
                  <th className="px-6 py-4">Operational Status</th>
                  <th className="px-6 py-4 text-right">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 10).map(p => (
                  <tr key={p.id} className="group transition-all">
                    <td className="bg-slate-50 group-hover:bg-slate-100 px-6 py-5 rounded-l-[24px] border-l border-t border-b border-slate-200">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl bg-white p-1 shadow-sm border border-slate-200 shrink-0">
                          <img src={p.images[0]} alt="" className="w-full h-full object-contain" />
                        </div>
                        <span className="font-black text-slate-900 text-[13px] group-hover:text-blue-600 transition-colors uppercase tracking-tight italic">{p.title}</span>
                      </div>
                    </td>
                    <td className="bg-slate-50 group-hover:bg-slate-100 px-6 py-5 border-t border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-widest">{p.category}</td>
                    <td className="bg-slate-50 group-hover:bg-slate-100 px-6 py-5 border-t border-b border-slate-200">
                      <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] border ${p.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-200 text-slate-500 border-slate-300'}`}>
                        {p.status === 'active' ? '● Verified Live' : '○ Standby Mode'}
                      </span>
                    </td>
                    <td className="bg-slate-50 group-hover:bg-slate-100 px-6 py-5 rounded-r-[24px] border-r border-t border-b border-slate-200 text-[11px] font-bold text-slate-400 text-right font-mono">
                      {new Date(p.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
