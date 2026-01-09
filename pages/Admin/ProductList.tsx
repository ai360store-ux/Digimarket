
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';

interface ProductListProps {
  products: Product[];
  onDelete: (id: string) => void;
}

const AdminProductList: React.FC<ProductListProps> = ({ products, onDelete }) => {
  const [search, setSearch] = useState('');

  const filtered = products.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
        <div className="relative w-full md:w-[400px]">
          <input 
            type="text"
            placeholder="Search catalog inventory..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-6 py-4 text-[13px] font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-slate-400"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl opacity-20">🔍</span>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Link 
            to="/admin/products/add"
            className="flex-grow md:flex-none bg-blue-600 text-white font-black px-8 py-4 rounded-2xl text-[12px] uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95 text-center italic"
          >
            + New Entry
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] border-b border-slate-200">
              <tr>
                <th className="px-8 py-6">Identity & Details</th>
                <th className="px-8 py-6">Sector</th>
                <th className="px-8 py-6">Stock Level</th>
                <th className="px-8 py-6">Indicators</th>
                <th className="px-8 py-6 text-right">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-[20px] bg-white p-1 shadow-sm border border-slate-200 shrink-0 group-hover:scale-105 transition-transform">
                        <img src={p.images[0]} alt="" className="w-full h-full object-contain" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-black text-slate-900 text-[14px] uppercase tracking-tight italic line-clamp-1">{p.title}</p>
                        <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-widest italic truncate">{p.shortDescription}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">{p.category}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className={`text-[11px] font-black uppercase tracking-widest ${p.inventory === 0 ? 'text-rose-600' : p.inventory <= 5 ? 'text-amber-600' : 'text-slate-900'}`}>
                        {p.inventory === 0 ? 'Out of Stock' : `${p.inventory} Units`}
                      </span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">{p.status}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-wrap gap-2">
                      {p.isTrending && <span className="text-[8px] font-black bg-rose-50 text-rose-500 border border-rose-100 px-2.5 py-1 rounded-lg uppercase tracking-widest">Hot</span>}
                      {p.isBestseller && <span className="text-[8px] font-black bg-amber-50 text-amber-500 border border-amber-100 px-2.5 py-1 rounded-lg uppercase tracking-widest">Top</span>}
                      {p.isNew && <span className="text-[8px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100 px-2.5 py-1 rounded-lg uppercase tracking-widest">New</span>}
                      {p.tags.slice(0, 2).map((tag, i) => (
                        <span key={i} className="text-[8px] font-black bg-slate-50 text-slate-400 border border-slate-200 px-2.5 py-1 rounded-lg uppercase tracking-widest">{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-4">
                      <Link 
                        to={`/admin/products/edit/${p.id}`}
                        className="w-10 h-10 flex items-center justify-center bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-blue-100"
                        title="Edit Entry"
                      >
                        <span className="text-sm">✏️</span>
                      </Link>
                      <button 
                        onClick={() => {
                          if (window.confirm('IRREVERSIBLE ACTION: Purge this repository entry?')) {
                            onDelete(p.id);
                          }
                        }}
                        className="w-10 h-10 flex items-center justify-center bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm border border-rose-100"
                        title="Delete Entry"
                      >
                        <span className="text-sm">🗑️</span>
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
