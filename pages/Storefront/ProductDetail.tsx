
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Product, AppSettings, PriceOption } from '../../types';
import { formatDuration, generateWhatsAppUrl, calculateDiscount } from '../../utils/helpers';
import ProductCard from '../../components/ProductCard';

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

  if (!activeSub || !selectedOption) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center bg-white">
        <div className="w-8 h-8 border-2 border-slate-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <span className="text-slate-400 font-bold uppercase tracking-widest text-[11px]">Synchronizing License...</span>
      </div>
    );
  }

  const handleBuy = () => {
    const durationStr = formatDuration(selectedOption.type, selectedOption.presetValue, selectedOption.expiryDate);
    const orderId = `GV-${product.id.split('-').pop()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
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
  const discountPercent = calculateDiscount(selectedOption.mrp, selectedOption.price);
  const recommendations = products
    .filter(p => p.id !== product.id && p.status === 'active' && p.category === product.category)
    .slice(0, 5);

  return (
    <div className="max-w-[1200px] mx-auto px-4 lg:px-8 bg-white pb-24 animate-in fade-in duration-500">
      
      {/* Top Nav - Compact */}
      <div className="flex items-center gap-2 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-300">
        <Link to="/" className="text-blue-600">Store</Link>
        <span className="opacity-30">/</span>
        <span className="text-slate-900">{product.category}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left: Product Media */}
        <div className="lg:col-span-5 space-y-6">
          <div className="aspect-square bg-slate-50 rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm relative">
            <img 
              src={product.images[0]} 
              alt={product.title} 
              className={`w-full h-full object-cover ${isSoldOut ? 'grayscale opacity-50' : ''}`} 
            />
            {isSoldOut && (
              <div className="absolute inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[12px] italic">Out of Stock</span>
              </div>
            )}
          </div>
          
          <div className="p-6 bg-slate-50/50 rounded-[1.5rem] border border-slate-100">
            <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-3 italic">Description</h3>
            <p className="text-[15px] text-slate-600 font-medium leading-relaxed italic">
              {product.fullDescription}
            </p>
          </div>
        </div>

        {/* Right: Purchase Console - High Density */}
        <div className="lg:col-span-7 bg-white rounded-[2.5rem] p-6 lg:p-10 border border-slate-100 shadow-2xl shadow-slate-200/50 flex flex-col gap-8">
          
          {/* Title & Badge */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="bg-blue-600 text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest italic">Authenticated</span>
              <span className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">ID: {product.id.split('-').pop()}</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-[1.1]">
              {product.title}
            </h1>
          </div>

          {/* MAIN ACTION BAR - PRICE & BUY ON SAME LINE */}
          <div className="bg-slate-900 rounded-[2rem] p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="flex items-center gap-4">
               <div className="flex flex-col">
                  <div className="flex items-center gap-3">
                    <span className="text-white font-black text-4xl lg:text-5xl tracking-tighter italic leading-none">
                      {settings.currencySymbol}{selectedOption.price}
                    </span>
                    {discountPercent > 0 && (
                      <span className="bg-red-600 text-white px-2.5 py-1 rounded-lg text-[12px] font-black italic tracking-tighter">
                        -{discountPercent}%
                      </span>
                    )}
                  </div>
                  {selectedOption.mrp > selectedOption.price && (
                    <span className="text-white/30 line-through font-bold text-base italic mt-1 ml-1">
                      {settings.currencySymbol}{selectedOption.mrp}
                    </span>
                  )}
               </div>
            </div>

            <button 
              disabled={isSoldOut}
              onClick={handleBuy}
              className={`h-full px-10 py-5 bg-white hover:bg-blue-600 hover:text-white text-slate-900 font-black rounded-2xl uppercase tracking-widest transition-all italic shadow-lg text-lg flex items-center justify-center min-w-[180px] ${isSoldOut ? 'opacity-10 cursor-not-allowed' : ''}`}
            >
              Buy Now
            </button>
          </div>

          {/* EDITION / VERSION SELECTOR */}
          {product.subsections && product.subsections.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest italic shrink-0">Select Version</span>
                <div className="h-[1px] bg-slate-100 w-full"></div>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.subsections.map((sub, idx) => (
                  <button
                    key={sub.id}
                    onClick={() => setActiveSubIndex(idx)}
                    className={`px-5 py-3 rounded-xl text-[13px] font-black uppercase tracking-wide transition-all italic border ${activeSubIndex === idx ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400'}`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* DURATION / ACCESS SELECTOR */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest italic shrink-0">Access Duration</span>
              <div className="h-[1px] bg-slate-100 w-full"></div>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {activeSub.options.map(opt => {
                const isSelected = selectedOption.id === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedOption(opt)}
                    className={`w-full flex items-center justify-between px-6 py-4 rounded-xl border transition-all duration-200 ${
                      isSelected 
                      ? 'bg-blue-50 border-blue-600 text-blue-900 ring-1 ring-blue-600' 
                      : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-left">
                      <p className="font-black uppercase text-[14px] italic leading-none">{opt.name}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest mt-2 opacity-60 italic">{opt.presetValue || 'Full Access'}</p>
                    </div>
                    <span className="font-black text-lg italic tracking-tighter">
                      {settings.currencySymbol}{opt.price}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="pt-4 flex items-center justify-center gap-8 opacity-40 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest italic">Secure Link</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-900 text-[9px] font-black uppercase tracking-widest italic">Official Feed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Recommendations */}
      <div className="pt-20 border-t border-slate-100 mt-20">
        <div className="flex items-end justify-between mb-10">
           <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic">Recommended Additions</h2>
           <Link to="/search" className="text-[12px] font-black text-blue-600 uppercase tracking-widest hover:text-slate-900 transition-colors italic border-b-2 border-blue-600/10 pb-1">Archive Explorer</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
          {recommendations.map(p => <ProductCard key={p.id} product={p} currency={settings.currencySymbol} />)}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
