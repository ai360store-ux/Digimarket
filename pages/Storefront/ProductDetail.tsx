
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Product, AppSettings, PriceOption } from '../../types.ts';
import { formatDuration, generateWhatsAppUrl, calculateDiscount } from '../../utils/helpers.ts';
import ProductCard from '../../components/ProductCard.tsx';

interface ProductDetailProps {
  products: Product[];
  settings: AppSettings;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ products, settings }) => {
  const { id } = useParams();
  
  const product = useMemo(() => {
    if (!products || !id) return null;
    return products.find(p => p.id === id) || null;
  }, [products, id]);

  const [activeSubIndex, setActiveSubIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<PriceOption | null>(null);

  useEffect(() => {
    if (product?.subsections?.[activeSubIndex]) {
      const sub = product.subsections[activeSubIndex];
      if (sub.options?.length > 0) {
        setSelectedOption(sub.options[0]);
      }
    }
  }, [product, activeSubIndex]);

  if (!product) return <Navigate to="/" />;

  const activeSub = product.subsections?.[activeSubIndex] || product.subsections?.[0];

  if (!activeSub || !selectedOption) return null;

  const handleBuy = () => {
    const durationStr = formatDuration(selectedOption.type, selectedOption.presetValue, selectedOption.expiryDate);
    const orderId = `V-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    const url = generateWhatsAppUrl(
      settings.whatsappNumber,
      product.title,
      `${activeSub.name} - ${selectedOption.name}`,
      durationStr,
      selectedOption.price,
      selectedOption.mrp,
      orderId,
      settings.currencySymbol,
      selectedOption.taxPercent || 0
    );
    window.open(url, '_blank');
  };

  const isSoldOut = product.inventory === 0;
  const recommendations = products
    .filter(p => p.id !== product.id && p.status === 'active' && p.category === product.category)
    .slice(0, 5);

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-10 bg-white">
      
      {/* Dynamic Nav */}
      <div className="flex items-center gap-3 mb-12 text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
        <Link to="/" className="text-blue-600 hover:text-slate-900 transition-colors">Archive</Link>
        <span className="opacity-40">/</span>
        <span className="text-slate-900">{product.category}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
        
        {/* License Visual */}
        <div className="lg:col-span-5 space-y-12">
          <div className="aspect-square bg-[#F8F9FB] rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm relative group">
            <img 
              src={product.images[0]} 
              alt={product.title} 
              className={`w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 ${isSoldOut ? 'grayscale opacity-50' : ''}`} 
            />
          </div>
          
          <div className="space-y-6">
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] italic flex items-center gap-3">
              <span className="w-4 h-[2px] bg-blue-600"></span>
              Technical Spec
            </h3>
            <p className="text-[15px] text-slate-500 font-medium leading-relaxed italic">
              {product.fullDescription}
            </p>
          </div>
        </div>

        {/* Console Panel */}
        <div className="lg:col-span-7 space-y-12">
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="bg-slate-900 text-white text-[9px] font-black px-3 py-1.5 rounded-md uppercase tracking-widest italic">Authentic Key</span>
              <span className="text-slate-300 text-[9px] font-bold uppercase tracking-widest">ID: {product.id.split('-').pop()}</span>
            </div>
            <h1 className="text-4xl lg:text-7xl font-black text-slate-900 tracking-tighter uppercase italic leading-[0.85]">
              {product.title}
            </h1>
          </div>

          <div className="bg-slate-900 rounded-[3rem] p-10 flex flex-col sm:flex-row items-center justify-between gap-10 shadow-2xl">
            <div className="flex flex-col">
              <div className="flex items-center gap-4">
                <span className="text-white font-black text-4xl lg:text-5xl tracking-tighter italic leading-none">
                  {settings.currencySymbol}{selectedOption.price.toLocaleString()}
                </span>
                {calculateDiscount(selectedOption.mrp, selectedOption.price) > 0 && (
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-[12px] font-black italic">
                    SAVE {calculateDiscount(selectedOption.mrp, selectedOption.price)}%
                  </span>
                )}
              </div>
              <span className="text-white/20 line-through font-bold text-sm italic mt-3 ml-1">
                MRP {settings.currencySymbol}{selectedOption.mrp.toLocaleString()}
              </span>
            </div>

            <button 
              disabled={isSoldOut}
              onClick={handleBuy}
              className={`px-12 py-6 bg-white hover:bg-blue-500 hover:text-white text-slate-900 font-black rounded-[1.5rem] uppercase tracking-[0.2em] transition-all duration-500 italic active:scale-95 text-lg min-w-[240px] ${isSoldOut ? 'opacity-20 cursor-not-allowed' : ''}`}
            >
              Secure License
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
            {/* Edition Selector */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Available Editions</h4>
              <div className="grid grid-cols-1 gap-3">
                {product.subsections.map((sub, idx) => (
                  <button
                    key={sub.id}
                    onClick={() => setActiveSubIndex(idx)}
                    className={`text-left px-6 py-4 rounded-2xl text-[13px] font-black uppercase tracking-widest transition-all italic border ${activeSubIndex === idx ? 'bg-slate-900 text-white border-slate-900 shadow-xl' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Plan Selector */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Access Tenure</h4>
              <div className="grid grid-cols-1 gap-3">
                {activeSub.options.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedOption(opt)}
                    className={`text-left px-6 py-4 rounded-2xl border transition-all ${selectedOption.id === opt.id ? 'bg-blue-600 border-blue-500 text-white shadow-xl' : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'}`}
                  >
                    <p className="font-black uppercase text-[13px] italic leading-none">{opt.name}</p>
                    <p className="text-[9px] font-bold uppercase tracking-widest mt-2 opacity-60 italic">{opt.presetValue}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-32 pt-20 border-t border-slate-100">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic mb-12">Related Distribution</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10">
          {recommendations.map(p => <ProductCard key={p.id} product={p} currency={settings.currencySymbol} />)}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
