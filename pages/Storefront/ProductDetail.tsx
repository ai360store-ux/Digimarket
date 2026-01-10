
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Subsection } from '../../types';
import { useDigiContext } from '../../context/DigiContext';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const { products, settings } = useDigiContext();
  const product = products.find(p => p.id === id);

  const [mainImage, setMainImage] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setMainImage(product.images[0]);
      // Set defaults for options
      const defaults: Record<string, string> = {};
      product.subsections.forEach(sub => {
        if (sub.options.length > 0) {
          defaults[sub.id] = sub.options[0].id;
        }
      });
      setSelectedOptions(defaults);
    }
  }, [product]);

  if (!product) return (
    <div className="py-20 text-center">
      <h2 className="text-2xl font-black italic uppercase">Vault Item Not Found</h2>
      <Link to="/" className="text-blue-600 font-bold mt-4 inline-block">Return to Catalog</Link>
    </div>
  );

  // Calculate price based on selected options
  const calculateTotal = () => {
    let total = 0;
    Object.entries(selectedOptions).forEach(([subId, optId]) => {
      const sub = product.subsections.find(s => s.id === subId);
      const opt = sub?.options.find(o => o.id === optId);
      if (opt) total += opt.price;
    });
    return total;
  };

  return (
    <div className="space-y-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

        {/* Gallery */}
        <div className="lg:col-span-7 space-y-10">
          <div className="aspect-[4/3] rounded-[3.5rem] overflow-hidden bg-slate-100 border border-slate-200 group shadow-2xl relative">
            <img src={mainImage} alt={product.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute top-10 left-10 flex gap-4">
              {product.isTrending && <span className="bg-rose-600 text-white text-[10px] font-black px-4 py-2 rounded-xl italic uppercase tracking-widest shadow-xl">Trending 🔥</span>}
              {product.isStaffPick && <span className="bg-blue-600 text-white text-[10px] font-black px-4 py-2 rounded-xl italic uppercase tracking-widest shadow-xl">Staff Pick 👑</span>}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-6">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setMainImage(img)}
                className={`aspect-square rounded-3xl overflow-hidden border-2 transition-all shadow-lg ${mainImage === img ? 'border-blue-600 scale-95 shadow-blue-200' : 'border-slate-100 hover:border-slate-300 opacity-60 hover:opacity-100'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Purchase Info */}
        <div className="lg:col-span-5 space-y-12">
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-[11px] font-black text-blue-600 uppercase tracking-widest italic">
              <span>{product.category}</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span>Inventory ID: {product.id}</span>
            </div>
            <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">{product.title}</h1>
            <p className="text-slate-400 text-lg font-medium leading-relaxed italic">{product.shortDescription}</p>
          </div>

          <div className="space-y-10">
            {product.subsections.map(sub => (
              <div key={sub.id} className="space-y-6">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">{sub.name}</label>
                <div className="grid grid-cols-1 gap-4">
                  {sub.options.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedOptions(prev => ({ ...prev, [sub.id]: opt.id }))}
                      className={`flex items-center justify-between p-6 rounded-3xl border-2 transition-all text-left ${selectedOptions[sub.id] === opt.id ? 'border-blue-600 bg-blue-50/50 shadow-xl shadow-blue-100/50' : 'border-slate-100 hover:border-slate-200'}`}
                    >
                      <div className="space-y-1">
                        <span className={`text-[13px] font-black uppercase italic tracking-tight ${selectedOptions[sub.id] === opt.id ? 'text-blue-600' : 'text-slate-900'}`}>{opt.name}</span>
                        {opt.type === 'preset' && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{opt.presetValue}</p>}
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-black text-slate-900 italic tracking-tighter">{settings.currencySymbol}{opt.price}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-10 border-t border-slate-100 space-y-10">
            <div className="flex items-end justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Subtotal Investment</span>
                <div className="text-5xl font-black text-slate-900 italic tracking-tighter">
                  {settings.currencySymbol}{calculateTotal()}
                </div>
              </div>
              <div className="text-[11px] font-black text-blue-600 uppercase tracking-widest italic bg-blue-50 px-6 py-3 rounded-2xl border border-blue-100">
                Ready to Provision
              </div>
            </div>

            <button className="w-full bg-slate-900 text-white font-black py-8 rounded-[2.5rem] shadow-2xl shadow-slate-400 hover:bg-black transition-all active:scale-95 uppercase text-[15px] tracking-[0.4em] italic group relative overflow-hidden">
              <span className="relative z-10">Acquire Permanent Rights</span>
              <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Description */}
      <section className="bg-white p-16 rounded-[4rem] border border-slate-100 shadow-sm space-y-12">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-3xl border border-slate-100 shadow-inner">📄</div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Technical Specification</h3>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Full documentation and requirements</p>
          </div>
        </div>
        <div className="prose prose-slate max-w-none">
          <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap italic font-medium">{product.fullDescription}</p>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
