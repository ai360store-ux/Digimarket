
import React, { useState, useEffect } from 'react';
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
  const product = products.find(p => p.id === id);

  if (!product) return <Navigate to="/" />;

  const [activeSubIndex, setActiveSubIndex] = useState(0);
  const activeSub = product.subsections[activeSubIndex];
  const [selectedOption, setSelectedOption] = useState<PriceOption>(() => activeSub?.options[0]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (product) {
      setActiveSubIndex(0);
      setSelectedOption(product.subsections[0]?.options[0]);
      setIsExpanded(false);
    }
  }, [id, product]);

  useEffect(() => {
    if (activeSub) {
      setSelectedOption(activeSub.options[0]);
    }
  }, [activeSubIndex]);

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
  const currentDiscount = selectedOption ? calculateDiscount(selectedOption.mrp, selectedOption.price) : 0;
  
  const recommendations = products
    .filter(p => p.id !== product.id && p.status === 'active' && p.category === product.category)
    .slice(0, 5);

  return (
    <div className="max-w-[1000px] mx-auto px-4 lg:px-6 py-4 bg-white pb-20 overflow-hidden">
      
      {/* 1. Header Navigation */}
      <div className="flex items-center gap-2 mb-6 text-[10px] font-black uppercase tracking-widest text-slate-300">
        <Link to="/" className="text-blue-600 hover:text-slate-900 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-slate-400">{product.category}</span>
      </div>

      {/* 2. Side-by-Side Product Terminal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
        
        {/* Left Column: Product Box (Image & Info) */}
        <div className="space-y-8">
          <div className="mb-2">
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-[0.85] mb-3">
              {product.title}
            </h1>
            <div className="flex items-center gap-3">
               <span className="bg-slate-900 text-white text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-[0.2em] italic">Official Release</span>
               <span className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">ID: {product.id.split('-')[1]}</span>
            </div>
          </div>

          <div className="aspect-square bg-slate-50 rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm relative group ring-1 ring-slate-50">
            <img 
              src={product.images[0]} 
              alt={product.title} 
              loading="eager"
              decoding="async"
              className={`w-full h-full object-cover transition-all duration-700 ${isSoldOut ? 'grayscale opacity-50' : ''}`} 
            />
            {isSoldOut && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-20">
                <span className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-[0.3em] italic">Sold Out</span>
              </div>
            )}
          </div>

          <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
             <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] italic mb-3">Core Intelligence</h3>
             <p className={`text-[14px] text-slate-600 font-medium italic leading-relaxed transition-all ${!isExpanded ? 'line-clamp-2' : ''}`}>
               {product.fullDescription}
             </p>
             <button 
               onClick={() => setIsExpanded(!isExpanded)}
               className="mt-3 text-[9px] font-black text-blue-600 uppercase tracking-widest hover:text-slate-900 transition-colors"
             >
               {isExpanded ? 'Hide Archives ↑' : 'View Full Intel ↓'}
             </button>
          </div>
        </div>

        {/* Right Column: Compact Buy Now Terminal */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl shadow-slate-900/40 relative overflow-hidden flex flex-col gap-6 ring-1 ring-white/10">
          
          {/* GIANT DISCOUNT BADGE */}
          {currentDiscount > 0 && !isSoldOut && (
            <div className="absolute top-0 right-0 bg-red-600 text-white px-6 py-8 pb-4 pl-10 rounded-bl-[4rem] flex flex-col items-center justify-center animate-pulse z-30 shadow-2xl">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-70">Price Drop</span>
              <span className="text-5xl font-black tracking-tighter italic leading-none">-{currentDiscount}%</span>
            </div>
          )}

          {/* Terminal Header */}
          <div className="flex items-center justify-between border-b border-white/5 pb-6 relative z-10">
             <div className="flex flex-col">
               <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Repository Status</span>
               <span className={`text-[11px] font-black uppercase tracking-widest ${isSoldOut ? 'text-red-500' : 'text-emerald-500'}`}>
                  {isSoldOut ? 'Out of Stock' : `${product.inventory} Units Active`}
               </span>
             </div>
             <div className="flex flex-col items-end">
               <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Global Fulfilment</span>
               <span className="text-[11px] font-black text-white uppercase italic">{product.soldCount}+ Verified</span>
             </div>
          </div>

          {/* Compact Pricing Section */}
          <div className="space-y-1 relative z-10">
            <div className="flex items-end gap-3">
               <span className="text-white font-black text-6xl tracking-tighter italic leading-none">
                 {settings.currencySymbol}{selectedOption?.price}
               </span>
               {selectedOption && selectedOption.mrp > selectedOption.price && (
                 <span className="text-white/20 line-through font-black text-xl italic mb-1.5">
                   {settings.currencySymbol}{selectedOption.mrp}
                 </span>
               )}
            </div>
            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Secure Activation Terminal Rate</p>
          </div>

          {/* Sub-Edition Toggles */}
          {product.subsections.length > 1 && (
            <div className="flex bg-white/5 p-1 rounded-xl gap-1 relative z-10">
               {product.subsections.map((sub, idx) => (
                 <button
                   key={sub.id}
                   onClick={() => setActiveSubIndex(idx)}
                   className={`flex-1 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeSubIndex === idx ? 'bg-white text-slate-900 shadow-xl' : 'text-white/30 hover:text-white/60'}`}
                 >
                   {sub.name.split(' ')[0]}
                 </button>
               ))}
            </div>
          )}

          {/* Licensing Tiers */}
          <div className="space-y-1.5 relative z-10">
            {activeSub?.options.map(opt => {
              const isSelected = selectedOption?.id === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelectedOption(opt)}
                  className={`w-full flex items-center justify-between px-5 py-3 rounded-2xl border transition-all ${
                    isSelected 
                    ? 'bg-blue-600 border-blue-500 shadow-lg text-white scale-[1.02] translate-x-1' 
                    : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10 hover:text-white/80'
                  }`}
                >
                  <div className="text-left">
                    <p className="font-black uppercase text-[12px] leading-none italic">{opt.name}</p>
                    <p className="text-[8px] font-bold uppercase tracking-widest mt-1 opacity-50">{opt.presetValue}</p>
                  </div>
                  <span className="font-black text-[16px] italic">
                    {settings.currencySymbol}{opt.price}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Action Interface */}
          <div className="pt-4 relative z-10">
            <button 
              disabled={isSoldOut}
              onClick={handleBuy}
              className={`w-full ${isSoldOut ? 'bg-white/5 text-white/10 cursor-not-allowed border-white/5' : 'bg-white hover:bg-blue-600 hover:text-white hover:shadow-2xl text-slate-900'} font-black py-5 rounded-[1.75rem] flex flex-col items-center justify-center gap-0.5 uppercase tracking-[0.4em] transition-all duration-300 italic active:scale-95 border border-white/10 shadow-xl`}
            >
              <span className="text-[24px] leading-none">Buy Now</span>
              <span className="text-[8px] opacity-40 font-bold tracking-[0.2em]">Instant Delivery Path</span>
            </button>
            <div className="flex items-center justify-center gap-2 mt-6 opacity-30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-[8px] font-black text-white uppercase tracking-[0.5em] italic">Direct Gateway Link Online</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Related Sector */}
      <div className="pt-20 border-t border-slate-50 mt-16">
        <div className="flex items-end justify-between mb-10">
           <div>
             <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">Global Bestsellers</h2>
             <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-3 italic">Verified Trending Repositories</p>
           </div>
           <Link to="/search" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-slate-900 transition-colors italic border-b-2 border-blue-600/5 pb-1">Browse Archive →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {recommendations.map(p => <ProductCard key={p.id} product={p} currency={settings.currencySymbol} />)}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
