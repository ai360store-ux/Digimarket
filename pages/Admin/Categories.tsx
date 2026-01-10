
import React, { useState } from 'react';
import { useDigiContext } from '../../context/DigiContext';
import { Category } from '../../types';

const AdminCategories: React.FC = () => {
  const { categories, addCategory, deleteCategory } = useDigiContext();
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('📦');

  const handleAdd = async () => {
    if (!newName) return;
    const newCat: Category = {
      id: Math.random().toString(36).substr(2, 9),
      name: newName,
      slug: newName.toLowerCase().replace(/\s+/g, '-'),
      icon: newIcon
    };

    await addCategory(newCat);
    setNewName('');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Erase this sector? Existing node linkages may be affected.')) {
      await deleteCategory(id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
      <div className="lg:col-span-4 space-y-8">
        <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm space-y-10">
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic flex items-center gap-4">
            <span className="w-6 h-1 bg-blue-600 rounded-full"></span>
            New Sector
          </h3>
          <div className="space-y-8">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Glyph</label>
              <input
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-4xl text-center"
                value={newIcon}
                onChange={e => setNewIcon(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Name</label>
              <input
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-slate-900 font-black italic tracking-tight uppercase"
                placeholder="Subscriptions"
                value={newName}
                onChange={e => setNewName(e.target.value)}
              />
            </div>
            <button
              onClick={handleAdd}
              className="w-full bg-blue-600 text-white font-black py-5 rounded-[24px] shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95 uppercase text-[12px] tracking-widest italic"
            >
              Protect & Add
            </button>
          </div>
        </div>
      </div>

      <tbody className="divide-y divide-slate-100">
        <div className="lg:col-span-8 bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] border-b border-slate-200">
                <tr>
                  <th className="px-8 py-6">Glyph</th>
                  <th className="px-8 py-6">Name</th>
                  <th className="px-8 py-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map(cat => (
                  <tr key={cat.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-8 py-6 text-4xl group-hover:scale-110 transition-transform">{cat.icon}</td>
                    <td className="px-8 py-6 font-black text-slate-900 text-[15px] uppercase tracking-tighter italic">{cat.name}</td>
                    <td className="px-8 py-6 text-right">
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="w-10 h-10 flex items-center justify-center bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all border border-rose-100"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </tbody>
    </div>
  );
};

export default AdminCategories;
