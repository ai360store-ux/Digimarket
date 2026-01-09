
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-xs">Accessing Repository...</p>
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
    <div className="max-w-[1280px] mx-auto px-4 lg:px-10 py-6 bg-white pb-32">
      
      {/* Breadcrumbs - Clean Medium Labels */}
      <div className="flex items-center gap-2 mb-8 text-[13px] font-bold uppercase tracking-widest text-slate-300">
        <Link to="/" className="text-blue-600 hover:text-slate-900 transition-colors">Vault</Link>
        <span className="opacity-40">/</span>
        <span className="text-slate-900">{product.category}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        
        {/* Left: Product Visuals */}
        <div className="lg:col-span-5 space-y-10">
          <div className="aspect-square bg-slate-50 rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm relative group">
            <img 
              src={product.images[0]} 
              alt={product.title} 
              className={`w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 ${isSoldOut ? 'grayscale opacity-50' : ''}`} 
            />
            {isSoldOut && (
              <div className="absolute inset-0 bg-white/40 backdrop-blur-md flex items-center justify-center">
                <span className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black uppercase text-sm tracking-[0.3em] italic shadow-2xl">Vault Exhausted</span>
              </div>
            )}
          </div>
          
          <div className="space-y-4 px-2">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-4 bg-blue-600 rounded-full"></div>
              <h3 className="text-[13px] font-black text-slate-400 uppercase tracking-[0.4em] italic">Archive Details</h3>
            </div>
            <p className="text-[17px] text-slate-600 font-medium leading-relaxed italic border-l-2 border-slate-50 pl-6">
              {product.fullDescription}
            </p>
          </div>
        </div>

        {/* Right: Purchase Control Panel */}
        <div className="lg:col-span-7 flex flex-col gap-10">
          
          {/* Identity & Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="bg-blue-600 text-white text-[11px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest italic">Authenticated</span>
              <span className="text-slate-300 text-[11px] font-bold uppercase tracking-widest">REF: {product.id.split('-').pop()}</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-[0.9]">
              {product.title}
            </h1>
          </div>

          {/* ACTION BAR - PRICE & BUY ON SAME LINE */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 flex flex-col sm:flex-row items-center justify-between gap-8 shadow-2xl shadow-slate-200 ring-1 ring-white/10">
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <div className="flex items-center gap-4">
                  <span className="text-white font-black text-5xl lg:text-6xl tracking-tighter italic leading-none">
                    {settings.currencySymbol}{selectedOption.price}
                  </span>
                  {discountPercent > 0 && (
                    <div className="bg-red-600 text-white px-4 py-2 rounded-xl text-[14px] font-black italic tracking-tighter shadow-xl">
                      -{discountPercent}% OFF
                    </div>
                  )}
                </div>
                {selectedOption.mrp > selectedOption.price && (
                  <span className="text-white/20 line-through font-bold text-xl italic mt-3 ml-1">
                    {settings.currencySymbol}{selectedOption.mrp}
                  </span>
                )}
              </div>
            </div>

            <button 
              disabled={isSoldOut}
              onClick={handleBuy}
              className={`h-full px-14 py-8 bg-white hover:bg-blue-600 hover:text-white text-slate-900 font-black rounded-[2rem] uppercase tracking-[0.3em] transition-all duration-500 italic active:scale-[0.97] shadow-2xl text-2xl flex items-center justify-center min-w-[240px] ${isSoldOut ? 'opacity-5 cursor-not-allowed' : ''}`}
            >
              Buy Now
            </button>
          </div>

          {/* VERSION / TIER SELECTOR */}
          {product.subsections && product.subsections.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-[13px] font-black text-slate-400 uppercase tracking-[0.4em] italic shrink-0">Available Editions</span>
                <div className="h-[1px] bg-slate-100 w-full"></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {product.subsections.map((sub, idx) => (
                  <button
                    key={sub.id}
                    onClick={() => setActiveSubIndex(idx)}
                    className={`px-6 py-5 rounded-2xl text-[14px] font-black uppercase tracking-widest transition-all italic border text-center ${activeSubIndex === idx ? 'bg-slate-900 text-white border-slate-900 shadow-xl scale-[1.03]' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400 hover:text-slate-900'}`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* DURATION / ACCESS OPTION SELECTOR */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-[13px] font-black text-slate-400 uppercase tracking-[0.4em] italic shrink-0">Access Level</span>
              <div className="h-[1px] bg-slate-100 w-full"></div>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {activeSub.options.map(opt => {
                const isSelected = selectedOption.id === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedOption(opt)}
                    className={`w-full flex items-center justify-between px-10 py-6 rounded-[2rem] border transition-all duration-300 ${
                      isSelected 
                      ? 'bg-blue-600 border-blue-500 text-white shadow-2xl shadow-blue-600/20 translate-x-2' 
                      : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="text-left">
                      <p className="font-black uppercase text-lg italic leading-none">{opt.name}</p>
                      <p className={`text-[11px] font-bold uppercase tracking-[0.2em] mt-3 italic ${isSelected ? 'opacity-70' : 'opacity-40'}`}>
                        {opt.presetValue || 'Full Access'}
                      </p>
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
          </div>

          {/* Secure Trust Bar */}
          <div className="pt-8 border-t border-slate-100 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-40">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest italic">Direct fulfillment active</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-900 text-[11px] font-black uppercase tracking-widest italic">Encrypted License feed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Recommended */}
      <div className="pt-24 border-t border-slate-50 mt-24">
        <div className="flex items-end justify-between mb-12">
           <div className="space-y-3">
             <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">Archive Bestsellers</h2>
             <p className="text-slate-400 text-[13px] font-bold uppercase tracking-[0.4em] italic">Verified high-demand repository items</p>
           </div>
           <Link to="/search" className="text-[14px] font-black text-blue-600 hover:text-slate-900 transition-colors uppercase tracking-widest italic border-b-2 border-blue-600/10 pb-1">Archive Explorer</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          {recommendations.map(p => <ProductCard key={p.id} product={p} currency={settings.currencySymbol} />)}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
