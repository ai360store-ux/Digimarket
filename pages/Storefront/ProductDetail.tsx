
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
    return products.find(p => p.id === id);
  }, [products, id]);

  if (!product) return <Navigate to="/" />;

  // 2. Robust State Management
  const [activeSubIndex, setActiveSubIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Safe access to sections
  const activeSub = product.subsections?.[activeSubIndex] || product.subsections?.[0];
  const [selectedOption, setSelectedOption] = useState<PriceOption | null>(null);

  // Sync selected option when subsection changes or on initial load
  useEffect(() => {
    if (activeSub?.options?.length) {
      setSelectedOption(activeSub.options[0]);
    }
  }, [activeSubIndex, product, activeSub]);

  // 3. Fallback for Initialization to prevent Blank Page
  if (!activeSub || !selectedOption) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white">
        <div className="w-8 h-8 border-[3px] border-slate-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <span className="text-slate-400 font-black uppercase tracking-widest italic text-[10px]">Accessing Repository...</span>
      </div>
    );
  }

  const handleBuy = () => {
    const durationStr = formatDuration(selectedOption.type, selectedOption.presetValue, selectedOption.expiryDate);
    const orderId = `GV-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
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
    <div className="max-w-[1100px] mx-auto px-4 lg:px-8 py-4 bg-white pb-24 animate-in fade-in duration-700">
      
      {/* 4. Navigation Trail */}
      <div className="flex items-center gap-2 mb-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
        <Link to="/" className="text-blue-600 hover:text-slate-900 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-slate-900">{product.category}</span>
      </div>

      {/* 5. Main Side-by-Side Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 items-start">
        
        {/* Left Column: Media & Spec */}
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
                <span className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-[0.4em] italic shadow-2xl">Vault Empty</span>
              </div>
            )}
          </div>

          <div className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100/50">
             <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic">Technical Specification</h3>
             </div>
             <p className={`text-[15px] text-slate-600 font-medium italic leading-relaxed ${!isExpanded ? 'line-clamp-3' : ''}`}>
               {product.fullDescription}
             </p>
             <button 
               onClick={() => setIsExpanded(!isExpanded)}
               className="mt-4 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-slate-900 transition-colors border-b border-blue-600/10 pb-0.5"
             >
               {isExpanded ? 'Collapse Archives' : 'Read Full Log'}
             </button>
          </div>
        </div>

        {/* Right Column: High-Density Buy Box */}
        <div className="bg-slate-900 rounded-[3rem] p-8 lg:p-10 shadow-2xl shadow-slate-900/40 relative overflow-hidden flex flex-col gap-8 ring-1 ring-white/10">
          
          {/* Discount Badge */}
          {discountPercent > 0 && !isSoldOut && (
            <div className="absolute top-0 right-0 bg-red-600 text-white px-8 py-10 pb-6 pl-14 rounded-bl-[5rem] flex flex-col items-center justify-center animate-pulse z-30 shadow-2xl border-l border-b border-white/5">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] mb-1 opacity-70 italic text-center">Save</span>
              <span className="text-5xl font-black tracking-tighter italic leading-none">-{discountPercent}%</span>
            </div>
          )}

          {/* Header Block */}
          <div className="space-y-6 relative z-10 pr-12">
            <div>
              <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter uppercase italic leading-[0.85] mb-4">
                {product.title}
              </h1>
              <div className="flex items-center gap-4">
                 <span className="bg-white/10 text-white text-[9px] font-black px-3 py-1.5 rounded-md uppercase tracking-[0.3em] italic border border-white/5">Verified Dist.</span>
                 <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest italic">REF: {product.id.includes('-') ? product.id.split('-')[1] : product.id}</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-white/10 pb-8">
               <div className="flex flex-col gap-1">
                 <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em]">Inventory</span>
                 <span className={`text-[11px] font-black uppercase tracking-widest italic ${isSoldOut ? 'text-red-500' : 'text-emerald-500'}`}>
                    {isSoldOut ? 'Inactive' : 'Secure Entry Active'}
                 </span>
               </div>
               <div className="flex flex-col items-end gap-1">
                 <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em]">Reservations</span>
                 <span className="text-[11px] font-black text-white uppercase italic">{product.soldCount}+ Orders</span>
               </div>
            </div>
          </div>

          {/* 6. VERSION SELECTOR (Visible and Clear) */}
          {product.subsections && product.subsections.length > 0 && (
            <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] italic shrink-0">Select Edition</span>
                <div className="h-[1px] bg-white/5 w-full"></div>
              </div>
              <div className="flex flex-wrap bg-white/5 p-1.5 rounded-2xl gap-2 ring-1 ring-white/5">
                 {product.subsections.map((sub, idx) => (
                   <button
                     key={sub.id}
                     onClick={() => setActiveSubIndex(idx)}
                     className={`flex-1 min-w-[120px] py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all italic ${activeSubIndex === idx ? 'bg-white text-slate-900 shadow-xl scale-[1.02]' : 'text-white/30 hover:text-white/60 hover:bg-white/5'}`}
                   >
                     {sub.name}
                   </button>
                 ))}
              </div>
            </div>
          )}

          {/* Pricing Tiers */}
          <div className="space-y-2 relative z-10">
            <div className="flex items-center gap-3 mb-2">
                <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] italic shrink-0">Access Level</span>
                <div className="h-[1px] bg-white/5 w-full"></div>
            </div>
            {activeSub.options.map(opt => {
              const isSelected = selectedOption.id === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelectedOption(opt)}
                  className={`w-full flex items-center justify-between px-6 py-5 rounded-[1.75rem] border transition-all duration-500 ${
                    isSelected 
                    ? 'bg-blue-600 border-blue-500 shadow-2xl shadow-blue-600/20 text-white scale-[1.02] translate-x-1' 
                    : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10 hover:text-white/80'
                  }`}
                >
                  <div className="text-left">
                    <p className="font-black uppercase text-[15px] leading-none italic">{opt.name}</p>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] mt-2 opacity-50 italic">{opt.presetValue}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-2xl italic tracking-tighter">
                      {settings.currencySymbol}{opt.price}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Pricing Total Display */}
          <div className="relative z-10 py-2">
             <div className="flex items-end gap-3">
               <span className="text-white font-black text-7xl tracking-tighter italic leading-none">
                 {settings.currencySymbol}{selectedOption.price}
               </span>
               {selectedOption.mrp > selectedOption.price && (
                 <span className="text-white/20 line-through font-black text-2xl italic mb-1.5">
                   {settings.currencySymbol}{selectedOption.mrp}
                 </span>
               )}
             </div>
             <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] mt-3">Final Licensing Activation Fee</p>
          </div>

          {/* 7. BUY NOW BUTTON (Simplified Text) */}
          <div className="pt-2 relative z-10">
            <button 
              disabled={isSoldOut}
              onClick={handleBuy}
              className={`w-full ${isSoldOut ? 'bg-white/5 text-white/10 cursor-not-allowed' : 'bg-white hover:bg-blue-600 hover:text-white hover:shadow-2xl text-slate-900'} font-black py-8 rounded-[2.5rem] uppercase tracking-[0.5em] transition-all duration-500 italic active:scale-95 shadow-xl text-4xl leading-none`}
            >
              Buy Now
            </button>
            <div className="flex items-center justify-center gap-3 mt-10 opacity-30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-[8px] font-black text-white uppercase tracking-[0.6em] italic">Distribution Bridge Online</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Section */}
      <div className="pt-24 border-t border-slate-50 mt-24">
        <div className="flex items-end justify-between mb-12">
           <div>
             <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">Global Bestsellers</h2>
             <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.4em] mt-4 italic">Trending high-volume requests</p>
           </div>
           <Link to="/search" className="text-[11px] font-black text-blue-600 uppercase tracking-widest hover:text-slate-900 transition-colors italic border-b-2 border-blue-600/10 pb-1">View Archive Explorer →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10">
          {recommendations.map(p => <ProductCard key={p.id} product={p} currency={settings.currencySymbol} />)}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
