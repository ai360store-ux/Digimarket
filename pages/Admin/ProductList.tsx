
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-xl border border-blue-100">📦</div>
          <div>
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter italic leading-none">Inventory</h3>
            <p className="text-slate-400 text-[8px] font-black uppercase tracking-[0.3em] mt-1">Status: {filtered.length} Assets</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch gap-3">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-xs">🔍</span>
            <input
              className="bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:ring-4 focus:ring-blue-50 transition-all font-bold text-slate-600 text-[12px] w-full sm:w-56"
              placeholder="Search catalog..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Link to="/admin/products/add" className="bg-slate-900 text-white font-black px-6 py-2.5 rounded-xl shadow-lg hover:bg-blue-600 transition-all active:scale-95 uppercase text-[10px] tracking-widest italic flex items-center justify-center gap-2">
            <span>+</span> Deploy New
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead className="bg-slate-50 text-[8px] font-black text-slate-400 uppercase tracking-[0.4em] border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Asset Matrix</th>
                <th className="px-6 py-4">Sector</th>
                <th className="px-6 py-4">Valuation</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Console</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm group-hover:scale-110 transition-transform border border-white">
                        <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="font-black text-slate-900 uppercase tracking-tighter italic text-[13px] leading-tight">{p.title}</h4>
                        <span className="text-[7px] font-bold text-slate-300 uppercase tracking-[0.2em] font-mono">NODE_{p.id.split('-')[1]}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-500 text-[8px] font-black px-3 py-1.5 rounded-lg italic uppercase tracking-widest border border-slate-200">{p.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-lg font-black text-slate-900 italic tracking-tighter leading-none">{settings.currencySymbol}{p.subsections[0]?.options[0]?.price || 0}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${p.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                      <div className={`w-1 h-1 rounded-full ${p.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                      <span className="text-[8px] font-black uppercase tracking-widest italic">{p.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/products/edit/${p.id}`}
                        className="w-8 h-8 flex items-center justify-center bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-900 hover:text-white transition-all border border-slate-200 text-xs"
                      >
                        ⚙️
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="w-8 h-8 flex items-center justify-center bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all border border-rose-100 text-xs"
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
