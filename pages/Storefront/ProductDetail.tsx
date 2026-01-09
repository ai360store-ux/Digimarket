
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
  
  // 1. Safe Product Lookup
  const product = useMemo(() => {
    if (!products || !id) return null;
    return products.find(p => p.id === id) || null;
  }, [products, id]);

  const [activeSubIndex, setActiveSubIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedOption, setSelectedOption] = useState<PriceOption | null>(null);

  // Sync state with strict error handling
  useEffect(() => {
    if (product && product.subsections && product.subsections[activeSubIndex]) {
      const sub = product.subsections[activeSubIndex];
      if (sub.options && sub.options.length > 0) {
        setSelectedOption(sub.options[0]);
      }
    }
  }, [product, activeSubIndex]);

  if (!product) return <Navigate to="/" />;

  const activeSub = product.subsections?.[activeSubIndex] || product.subsections?.[0];

  // Defensive loading UI to prevent hydration mismatch blank page
  if (!activeSub || !selectedOption) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white p-10">
        <div className="w-10 h-10 border-[3px] border-slate-100 border-t-blue-600 rounded-full animate-spin mb-6"></div>
        <span className="text-slate-400 font-black uppercase tracking-[0.4em] italic text-[10px]">Establishing Secure Repository Link...</span>
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
    <div className="max-w-[1200px] mx-auto px-4 lg:px-8 bg-white pb-32 animate-in fade-in duration-500">
      
      {/* Reduced Top Spacing for No-Scroll visibility */}
      <div className="flex items-center gap-2 mb-6 pt-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
        <Link to="/" className="text-blue-600 hover:text-slate-900 transition-colors">Vault</Link>
        <span>/</span>
        <span className="text-slate-900">{product.category}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
        
        {/* Left: Product Visuals */}
        <div className="space-y-6">
          <div className="aspect-[4/5] bg-slate-50 rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden border border-slate-100 shadow-sm relative group ring-1 ring-slate-100/50">
            <img 
              src={product.images[0]} 
              alt={product.title} 
              fetchpriority="high"
              className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-105 ${isSoldOut ? 'grayscale opacity-50' : ''}`} 
            />
            {isSoldOut && (
              <div className="absolute inset-0 bg-white/40 backdrop-blur-md flex items-center justify-center z-20">
                <span className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-[0.4em] italic shadow-2xl">Vault Empty</span>
              </div>
            )}
          </div>

          <div className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100/50">
             <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-4 bg-blue-600 rounded-full"></div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic">Technical Summary</h3>
             </div>
             <p className={`text-[15px] text-slate-600 font-medium italic leading-relaxed ${!isExpanded ? 'line-clamp-4' : ''}`}>
               {product.fullDescription}
             </p>
             <button 
               onClick={() => setIsExpanded(!isExpanded)}
               className="mt-4 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-slate-900 transition-colors border-b-2 border-blue-600/10 pb-1"
             >
               {isExpanded ? 'Collapse' : 'Full Documentation'}
             </button>
          </div>
        </div>

        {/* Right: Premium Purchase Console (Optimized for Fold) */}
        <div className="bg-slate-900 rounded-[3rem] p-8 lg:p-10 shadow-2xl shadow-slate-900/40 relative overflow-hidden flex flex-col gap-6 ring-1 ring-white/10">
          
          {/* Header Area */}
          <div className="relative z-10 pr-12">
            <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter uppercase italic leading-[0.85] mb-4">
              {product.title}
            </h1>
            <div className="flex items-center gap-4">
               <span className="bg-white/10 text-white text-[9px] font-black px-3 py-1.5 rounded-md uppercase tracking-[0.3em] italic border border-white/5">Authenticated</span>
               <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest italic opacity-50">REF: {product.id.split('-').pop()}</span>
            </div>
          </div>

          {/* MASSIVE CTA & PRICE (Directly under Title for no-scroll) */}
          <div className="bg-white/5 rounded-[2.5rem] p-6 border border-white/5 space-y-4">
             <div className="flex items-end justify-between px-2">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic mb-1">Activation Fee</span>
                  <div className="flex items-end gap-3">
                    <span className="text-white font-black text-6xl tracking-tighter italic leading-none">
                      {settings.currencySymbol}{selectedOption.price}
                    </span>
                    {selectedOption.mrp > selectedOption.price && (
                      <span className="text-white/20 line-through font-black text-2xl italic mb-1.5">
                        {settings.currencySymbol}{selectedOption.mrp}
                      </span>
                    )}
                  </div>
                </div>
                {discountPercent > 0 && (
                  <div className="bg-red-600 text-white px-4 py-2 rounded-xl text-[12px] font-black italic tracking-tighter shadow-xl">
                    -{discountPercent}% OFF
                  </div>
                )}
             </div>

             <button 
                disabled={isSoldOut}
                onClick={handleBuy}
                className={`w-full ${isSoldOut ? 'bg-white/5 text-white/10 cursor-not-allowed border-white/5' : 'bg-white hover:bg-blue-600 hover:text-white hover:shadow-2xl text-slate-900'} font-black py-10 rounded-[2.5rem] uppercase tracking-[0.5em] transition-all duration-500 italic active:scale-[0.98] shadow-2xl text-5xl leading-none`}
              >
                Buy Now
              </button>
          </div>

          {/* EDITIONS & OPTIONS (Secondary) */}
          <div className="space-y-6">
            {/* Version Toggles */}
            {product.subsections && product.subsections.length > 1 && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] italic shrink-0">Select Edition</span>
                  <div className="h-[1px] bg-white/10 w-full"></div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.subsections.map((sub, idx) => (
                    <button
                      key={sub.id}
                      onClick={() => setActiveSubIndex(idx)}
                      className={`px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all italic border ${activeSubIndex === idx ? 'bg-white text-slate-900 border-white' : 'bg-transparent text-white/40 border-white/10 hover:border-white/30'}`}
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price Tiers */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] italic shrink-0">Access Level</span>
                <div className="h-[1px] bg-white/10 w-full"></div>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {activeSub.options.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedOption(opt)}
                    className={`w-full flex items-center justify-between px-6 py-4.5 rounded-2xl border transition-all duration-300 ${
                      selectedOption.id === opt.id 
                      ? 'bg-blue-600 border-blue-500 text-white ring-4 ring-blue-600/10' 
                      : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'
                    }`}
                  >
                    <span className="font-black uppercase text-[12px] italic">{opt.name}</span>
                    <span className="font-black text-[16px] italic">{settings.currencySymbol}{opt.price}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="pt-4 border-t border-white/5 flex items-center justify-center gap-8 opacity-40">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[8px] font-black text-white uppercase tracking-widest">Global Link Active</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white text-[8px] font-black uppercase tracking-widest">256-Bit SSL Encrypted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Archives */}
      <div className="pt-24 border-t border-slate-50 mt-24">
        <div className="flex items-end justify-between mb-12 px-2">
           <div>
             <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">Market Bestsellers</h2>
             <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.4em] mt-3 italic">Verified high-volume requests</p>
           </div>
           <Link to="/search" className="text-[11px] font-black text-blue-600 uppercase tracking-widest hover:text-slate-900 transition-colors italic border-b-2 border-blue-600/10 pb-1">Archive Explorer →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
          {recommendations.map(p => <ProductCard key={p.id} product={p} currency={settings.currencySymbol} />)}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
