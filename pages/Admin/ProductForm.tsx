
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product, Category, Subsection, PriceOption, AppSettings } from '../../types';
import { compressImage } from '../../utils/helpers';

interface ProductFormProps {
  products?: Product[];
  categories: Category[];
  settings: AppSettings;
  onSave: (product: Product) => void;
}

const AdminProductForm: React.FC<ProductFormProps> = ({ products, categories, settings, onSave }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const existingProduct = products?.find(p => p.id === id);

  const [formData, setFormData] = useState<Partial<Product>>({
    title: '',
    shortDescription: '',
    fullDescription: '',
    category: categories[0]?.name || '',
    status: 'active',
    images: [],
    inventory: 100,
    soldCount: 0,
    subsections: [{
      id: 'sub-' + Math.random().toString(36).substr(2, 5),
      name: 'Tier Classification',
      options: [{
        id: 'opt-' + Math.random().toString(36).substr(2, 5),
        name: 'Standard Package',
        type: 'preset',
        presetValue: 'Full Access',
        mrp: 0,
        price: 0,
        taxPercent: settings.defaultTaxPercent || 0
      }]
    }],
    isTrending: false,
    isBestseller: false,
    isNew: true,
    isStaffPick: false,
    tags: []
  });

  const [tagInput, setTagInput] = useState('');
  const [compressQuality, setCompressQuality] = useState(settings.defaultImageQuality);

  useEffect(() => {
    if (existingProduct) {
      setFormData(existingProduct);
      setTagInput(existingProduct.tags.join(', '));
    }
  }, [existingProduct, categories]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const compressed = await compressImage(files[i], compressQuality, settings.preferredImageFormat);
      newImages.push(compressed);
    }
    setFormData(prev => ({ ...prev, images: [...(prev.images || []), ...newImages] }));
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images?.filter((_, i) => i !== index) }));
  };

  const addSubsection = () => {
    const newSub: Subsection = {
      id: 'sub-' + Math.random().toString(36).substr(2, 5),
      name: 'New Option Group',
      options: [{
        id: 'opt-' + Math.random().toString(36).substr(2, 5),
        name: 'New Variation',
        type: 'preset',
        presetValue: 'Full Access',
        mrp: 0,
        price: 0,
        taxPercent: settings.defaultTaxPercent || 0
      }]
    };
    setFormData(prev => ({ ...prev, subsections: [...(prev.subsections || []), newSub] }));
  };

  const updateSubsectionName = (subId: string, name: string) => {
    setFormData(prev => ({
      ...prev,
      subsections: prev.subsections?.map(s => s.id === subId ? { ...s, name } : s)
    }));
  };

  const addOption = (subId: string) => {
    const newOpt: PriceOption = {
      id: 'opt-' + Math.random().toString(36).substr(2, 5),
      name: 'Add-on Option',
      type: 'preset',
      presetValue: 'Full Access',
      mrp: 0,
      price: 0,
      taxPercent: settings.defaultTaxPercent || 0
    };
    setFormData(prev => ({
      ...prev,
      subsections: prev.subsections?.map(s => s.id === subId ? { ...s, options: [...s.options, newOpt] } : s)
    }));
  };

  const updateOption = (subId: string, optId: string, updates: Partial<PriceOption>) => {
    setFormData(prev => ({
      ...prev,
      subsections: prev.subsections?.map(s => s.id === subId ? {
        ...s,
        options: s.options.map(o => o.id === optId ? { ...o, ...updates } : o)
      } : s)
    }));
  };

  const removeOption = (subId: string, optId: string) => {
    setFormData(prev => ({
      ...prev,
      subsections: prev.subsections?.map(s => s.id === subId ? {
        ...s,
        options: s.options.filter(o => o.id !== optId)
      } : s)
    }));
  };

  const removeSubsection = (subId: string) => {
     setFormData(prev => ({
        ...prev,
        subsections: prev.subsections?.filter(s => s.id !== subId)
     }));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalProduct: Product = {
      ...(formData as Product),
      id: existingProduct?.id || Math.random().toString(36).substr(2, 9),
      tags: tagInput.split(',').map(t => t.trim()).filter(t => t !== ''),
      createdAt: existingProduct?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onSave(finalProduct);
    navigate('/admin/products');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 pb-32">
      
      {/* Left Column */}
      <div className="lg:col-span-7 space-y-10">
        <section className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm space-y-10">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <span className="text-2xl">🆔</span>
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter italic">Identification</h3>
          </div>
          <div className="space-y-8">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Product Title</label>
              <input 
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-black text-slate-900 text-[16px] italic tracking-tight"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Category</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-black text-slate-900 appearance-none cursor-pointer text-[14px]"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Status</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-black text-slate-900 appearance-none cursor-pointer text-[14px]"
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Inventory (Set 0 for Out of Stock)</label>
              <input 
                type="number"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 outline-none transition-all font-bold text-slate-900 text-[14px]"
                value={formData.inventory}
                onChange={e => setFormData({ ...formData, inventory: Number(e.target.value) })}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Search Tags (Comma separated)</label>
              <input 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 outline-none transition-all font-bold text-slate-600 text-[14px] italic"
                placeholder="action, multiplayer, license, exclusive"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm space-y-10">
          <div className="flex items-center justify-between border-b border-slate-100 pb-6">
            <div className="flex items-center gap-4">
              <span className="text-2xl">💰</span>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter italic">Pricing Configurations</h3>
            </div>
            <button type="button" onClick={addSubsection} className="text-[10px] font-black text-blue-600 hover:bg-blue-600 hover:text-white uppercase tracking-widest bg-blue-50 px-6 py-3 rounded-xl transition-all border border-blue-100">
              + Add Group
            </button>
          </div>
          
          <div className="space-y-12">
            {formData.subsections?.map(sub => (
              <div key={sub.id} className="p-8 bg-slate-50 rounded-[32px] border border-slate-200 space-y-8">
                <div className="flex items-center justify-between gap-6">
                  <input 
                    className="bg-transparent text-xl font-black uppercase text-slate-900 focus:outline-none border-b border-slate-200 focus:border-blue-600 w-full pb-2 italic tracking-tight"
                    value={sub.name}
                    onChange={e => updateSubsectionName(sub.id, e.target.value)}
                  />
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => addOption(sub.id)} className="shrink-0 bg-blue-600 text-[10px] font-black uppercase text-white px-5 py-3 rounded-xl shadow-md hover:bg-blue-700 transition-all">
                      Add Option
                    </button>
                    <button type="button" onClick={() => removeSubsection(sub.id)} className="w-10 h-10 flex items-center justify-center bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all border border-rose-100">
                      🗑️
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {sub.options.map(opt => (
                    <div key={opt.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm">
                      <div className="md:col-span-4">
                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Option Name</label>
                        <input 
                          className="w-full text-[13px] font-bold bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-50 outline-none"
                          value={opt.name}
                          onChange={e => updateOption(sub.id, opt.id, { name: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">MRP ({settings.currencySymbol})</label>
                        <input 
                          type="number"
                          className="w-full text-[13px] font-bold bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-50 outline-none"
                          value={opt.mrp}
                          onChange={e => updateOption(sub.id, opt.id, { mrp: Number(e.target.value) })}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Sale Price ({settings.currencySymbol})</label>
                        <input 
                          type="number"
                          className="w-full text-[13px] font-bold bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-50 outline-none"
                          value={opt.price}
                          onChange={e => updateOption(sub.id, opt.id, { price: Number(e.target.value) })}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Tax (%)</label>
                        <input 
                          type="number"
                          className="w-full text-[13px] font-bold bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-50 outline-none"
                          value={opt.taxPercent}
                          onChange={e => updateOption(sub.id, opt.id, { taxPercent: Number(e.target.value) })}
                        />
                      </div>
                      <div className="md:col-span-2 text-center pb-2">
                        <button type="button" onClick={() => removeOption(sub.id, opt.id)} className="p-3 text-slate-300 hover:text-rose-600 transition-colors">🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Right Column */}
      <div className="lg:col-span-5 space-y-10">
        <section className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm space-y-8">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <span className="text-2xl">🖼️</span>
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter italic">Gallery</h3>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {formData.images?.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-[24px] overflow-hidden group shadow-md border border-slate-200">
                  <img src={img} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                  <button 
                    type="button" 
                    onClick={() => handleRemoveImage(i)}
                    className="absolute inset-0 bg-rose-600/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white font-black uppercase text-[10px] tracking-widest"
                  >
                    Delete
                  </button>
                </div>
              ))}
              <label className="aspect-square rounded-[24px] border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 hover:border-blue-600 transition-all group p-4 text-center">
                <span className="text-3xl mb-4 group-hover:scale-110 transition-transform">📤</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Upload Asset</span>
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>
        </section>

        <section className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm space-y-8">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <span className="text-2xl">⚡</span>
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter italic">Badges</h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
             {[
               { field: 'isTrending', label: 'Trending', icon: '🔥' },
               { field: 'isBestseller', label: 'Bestseller', icon: '🏆' },
               { field: 'isNew', label: 'New Arrival', icon: '✨' },
               { field: 'isStaffPick', label: 'Recommended', icon: '👑' },
             ].map(item => (
               <button
                 key={item.field}
                 type="button"
                 onClick={() => setFormData({ ...formData, [item.field]: !formData[item.field as keyof Product] })}
                 className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${formData[item.field as keyof Product] ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'}`}
               >
                 <div className="flex items-center gap-4">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                 </div>
                 <div className={`w-4 h-4 rounded-full border-2 ${formData[item.field as keyof Product] ? 'bg-white border-white' : 'border-slate-300'}`}></div>
               </button>
             ))}
          </div>
        </section>

        <button type="submit" className="w-full bg-blue-600 text-white font-black px-10 py-6 rounded-[32px] shadow-2xl shadow-blue-600/30 hover:bg-blue-700 transition-all active:scale-95 uppercase text-[14px] tracking-[0.4em] italic">
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default AdminProductForm;
