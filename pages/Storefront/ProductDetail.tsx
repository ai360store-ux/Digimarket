
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
  
  // 1. Safe Product Lookup with useMemo
  const product = useMemo(() => {
    if (!products || !id) return null;
    return products.find(p => p.id === id) || null;
  }, [products, id]);

  // If product doesn't exist, redirect safely
  if (!product) return <Navigate to="/" />;

  // 2. Robust State Initialization
  // We initialize the index and find the initial option immediately to prevent render crashes
  const [activeSubIndex, setActiveSubIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Current subsection (Version)
  const activeSub = useMemo(() => {
    return product.subsections?.[activeSubIndex] || product.subsections?.[0] || null;
  }, [product, activeSubIndex]);

  // Current pricing option
  const [selectedOption, setSelectedOption] = useState<PriceOption | null>(() => {
    const sub = product.subsections?.[0];
    return sub?.options?.[0] || null;
  });

  // Sync selected option when the Version (subsection) changes
  useEffect(() => {
    if (activeSub && activeSub.options?.length > 0) {
      setSelectedOption(activeSub.options[0]);
    }
  }, [activeSubIndex, activeSub]);

  // 3. Final Safety Guard for Rendering
  if (!activeSub || !selectedOption) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white p-10 text-center">
        <div className="w-10 h-10 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin mb-6"></div>
        <span className="text-slate-400 font-black uppercase tracking-[0.3em] italic text-[11px]">Establishing Secure Repository Link...</span>
      </div>
    );
  }

  const handleBuy = () => {
    const durationStr = formatDuration(selectedOption.type, selectedOption.presetValue, selectedOption.expiryDate);
    // Generate a clean reference ID
    const refId = product.id.includes('-') ? product.id.split('-')[1] : product.id.slice(-6).toUpperCase();
    const orderId = `GV-${refId}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    
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
    <div className="max-w-[1100px] mx-auto px-4 lg:px-8 py-4 bg-white pb-32 animate-in fade-in duration-700">
      
      {/* Navigation Path */}
      <div className="flex items-center gap-2 mb-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
        <Link to="/" className="text-blue-600 hover:text-slate-900 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-slate-900">{product.category}</span>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-start">
        
        {/* Left: Product Visuals & Specs */}
        <div className="space-y-8">
          <div className="aspect-square bg-slate-50 rounded-[2.5rem] lg:rounded-[3.5rem] overflow-hidden border border-slate-100 shadow-sm relative group ring-1 ring-slate-100/50">
            <img 
              src={product.images?.[0] || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'} 
              alt={product.title} 
              fetchpriority="high"
              decoding="async"
              className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-105 ${isSoldOut ? 'grayscale opacity-50' : ''}`} 
            />
            {isSoldOut && (
              <div className="absolute inset-0 bg-white/40 backdrop-blur-md flex items-center justify-center z-20">
                <span className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-[0.4em] shadow-2xl">Out of Stock</span>
              </div>
            )}
          </div>

          <div className="p-8 bg-slate-50/30 rounded-[2.5rem] border border-slate-100/50">
             <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-4 bg-blue-600 rounded-full"></div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic">Product Specifications</h3>
             </div>
             <p className={`text-[15px] text-slate-600 font-medium italic leading-relaxed ${!isExpanded ? 'line-clamp-4' : ''}`}>
               {product.fullDescription}
             </p>
             <button 
               onClick={() => setIsExpanded(!isExpanded)}
               className="mt-4 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-slate-900 transition-colors border-b-2 border-blue-600/10 pb-1"
             >
               {isExpanded ? 'Show Less' : 'Full Documentation'}
             </button>
          </div>
        </div>

        {/* Right: Premium Purchase Console */}
        <div className="bg-slate-900 rounded-[3rem] p-8 lg:p-12 shadow-2xl shadow-slate-900/40 relative overflow-hidden flex flex-col gap-10 ring-1 ring-white/10">
          
          {/* Discount Visual */}
          {discountPercent > 0 && !isSoldOut && (
            <div className="absolute top-0 right-0 bg-red-600 text-white px-8 py-12 pb-8 pl-14 rounded-bl-[6rem] flex flex-col items-center justify-center animate-pulse z-30 shadow-2xl border-l border-b border-white/5">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] mb-1 opacity-70 italic">Save</span>
              <span className="text-5xl font-black tracking-tighter italic leading-none">-{discountPercent}%</span>
            </div>
          )}

          {/* Console Header */}
          <div className="space-y-6 relative z-10 pr-12">
            <div>
              <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tighter uppercase italic leading-[0.8] mb-6">
                {product.title}
              </h1>
              <div className="flex items-center gap-4">
                 <span className="bg-white/10 text-white text-[9px] font-black px-3 py-1.5 rounded-md uppercase tracking-[0.3em] italic border border-white/5">Authentic License</span>
                 <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest italic">REF: {product.id.includes('-') ? product.id.split('-')[1] : product.id.slice(0, 8)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-white/10 pb-10">
               <div className="flex flex-col gap-1.5">
                 <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em]">Status</span>
                 <span className={`text-[12px] font-black uppercase tracking-widest italic ${isSoldOut ? 'text-red-500' : 'text-emerald-500'}`}>
                    {isSoldOut ? 'Not Available' : 'Secure Channel Active'}
                 </span>
               </div>
               <div className="flex flex-col items-end gap-1.5">
                 <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em]">Activity</span>
                 <span className="text-[12px] font-black text-white uppercase italic">{product.soldCount}+ Fulfilled</span>
               </div>
            </div>
          </div>

          {/* VERSION SELECTOR - VISIBLE EDITIONS */}
          {product.subsections && product.subsections.length > 0 && (
            <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] italic shrink-0">Choose Version</span>
                <div className="h-[1px] bg-white/10 w-full"></div>
              </div>
              <div className="flex flex-wrap bg-white/5 p-2 rounded-[2rem] gap-2 ring-1 ring-white/5">
                 {product.subsections.map((sub, idx) => (
                   <button
                     key={sub.id}
                     onClick={() => setActiveSubIndex(idx)}
                     className={`flex-1 min-w-[140px] py-4.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all italic ${activeSubIndex === idx ? 'bg-white text-slate-900 shadow-2xl scale-[1.03]' : 'text-white/30 hover:text-white/60 hover:bg-white/5'}`}
                   >
                     {sub.name}
                   </button>
                 ))}
              </div>
            </div>
          )}

          {/* TIER OPTIONS */}
          <div className="space-y-3 relative z-10">
            <div className="flex items-center gap-4 mb-2">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] italic shrink-0">Access Duration</span>
                <div className="h-[1px] bg-white/10 w-full"></div>
            </div>
            {activeSub.options.map(opt => {
              const isSelected = selectedOption.id === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelectedOption(opt)}
                  className={`w-full flex items-center justify-between px-8 py-6 rounded-[2rem] border transition-all duration-500 ${
                    isSelected 
                    ? 'bg-blue-600 border-blue-500 shadow-2xl shadow-blue-600/30 text-white scale-[1.02] translate-x-2' 
                    : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10 hover:text-white/80'
                  }`}
                >
                  <div className="text-left">
                    <p className="font-black uppercase text-[17px] leading-none italic">{opt.name}</p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] mt-3 opacity-50 italic">{opt.presetValue}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-3xl italic tracking-tighter">
                      {settings.currencySymbol}{opt.price}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Pricing Summary */}
          <div className="relative z-10 py-2 border-t border-white/5 pt-10">
             <div className="flex items-end gap-4">
               <span className="text-white font-black text-8xl tracking-tighter italic leading-none">
                 {settings.currencySymbol}{selectedOption.price}
               </span>
               {selectedOption.mrp > selectedOption.price && (
                 <span className="text-white/20 line-through font-black text-3xl italic mb-2">
                   {settings.currencySymbol}{selectedOption.mrp}
                 </span>
               )}
             </div>
             <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.6em] mt-6 italic">Verified Distribution License Fee</p>
          </div>

          {/* BUY NOW CTA */}
          <div className="pt-2 relative z-10">
            <button 
              disabled={isSoldOut}
              onClick={handleBuy}
              className={`w-full ${isSoldOut ? 'bg-white/5 text-white/10 cursor-not-allowed border-white/5' : 'bg-white hover:bg-blue-600 hover:text-white hover:shadow-2xl text-slate-900'} font-black py-9 rounded-[3rem] uppercase tracking-[0.6em] transition-all duration-500 italic active:scale-[0.98] shadow-2xl text-5xl leading-none`}
            >
              Buy Now
            </button>
            <div className="flex items-center justify-center gap-4 mt-12 opacity-30">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-[9px] font-black text-white uppercase tracking-[0.8em] italic">Direct Fulfilment Pipeline Online</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Grid */}
      <div className="pt-32 border-t border-slate-50 mt-32">
        <div className="flex items-end justify-between mb-16">
           <div>
             <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">Related Archive</h2>
             <p className="text-slate-400 text-[12px] font-bold uppercase tracking-[0.5em] mt-6 italic">High-demand repository additions</p>
           </div>
           <Link to="/search" className="text-[12px] font-black text-blue-600 uppercase tracking-widest hover:text-slate-900 transition-colors italic border-b-4 border-blue-600/10 pb-1">Archive Explorer →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
          {recommendations.map(p => <ProductCard key={p.id} product={p} currency={settings.currencySymbol} />)}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
