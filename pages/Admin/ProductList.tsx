
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDigiContext } from '../../context/DigiContext';

const AdminProductList: React.FC = () => {
  const { products, deleteProduct, settings } = useDigiContext();
  const [search, setSearch] = useState('');

  const filtered = products.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = async (id: string) => {
    if (window.confirm('Erase this data node permanently from the vault?')) {
      await deleteProduct(id);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl border border-blue-100">📦</div>
          <div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">Asset Inventory</h3>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Management Console</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch gap-4">
          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">🔍</span>
            <input
              className="bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-6 py-4 outline-none focus:ring-4 focus:ring-blue-50 transition-all font-bold text-slate-600 text-[13px] w-full sm:w-64"
              placeholder="Filter catalog..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Link to="/admin/products/add" className="bg-slate-900 text-white font-black px-8 py-4 rounded-2xl shadow-xl hover:bg-blue-600 transition-all active:scale-95 uppercase text-[11px] tracking-widest italic flex items-center justify-center gap-3">
            <span>+</span> Deploy New Asset
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] border-b border-slate-200">
              <tr>
                <th className="px-10 py-8">Asset Matrix</th>
                <th className="px-10 py-8">Sector</th>
                <th className="px-10 py-8">Market Price</th>
                <th className="px-10 py-8">Deployment Status</th>
                <th className="px-10 py-8 text-right">Console</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md group-hover:scale-110 transition-transform border border-white">
                        <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-black text-slate-900 uppercase tracking-tighter italic text-[15px]">{p.title}</h4>
                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em] font-mono">NODE_UID: {p.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-4 py-2 rounded-xl italic uppercase tracking-widest border border-slate-200">{p.category}</span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="text-xl font-black text-slate-900 italic tracking-tighter leading-none">{settings.currencySymbol}{p.subsections[0]?.options[0]?.price || 0}</div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Base Valuation</div>
                  </td>
                  <td className="px-10 py-8">
                    <div className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-xl border ${p.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${p.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                      <span className="text-[10px] font-black uppercase tracking-widest italic">{p.status}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        to={`/admin/products/edit/${p.id}`}
                        className="w-12 h-12 flex items-center justify-center bg-slate-50 text-slate-600 rounded-2xl hover:bg-slate-900 hover:text-white transition-all border border-slate-200"
                      >
                        ⚙️
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="w-12 h-12 flex items-center justify-center bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all border border-rose-100"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProductList;
