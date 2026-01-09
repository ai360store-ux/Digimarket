
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
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
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
    <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-4 bg-white pb-32">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-8 text-sm font-bold uppercase tracking-widest text-slate-300">
        <Link to="/" className="text-blue-600 hover:text-blue-700">Repository</Link>
        <span className="opacity-40">/</span>
        <span className="text-slate-900">{product.category}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
        
        {/* Left: Media & Details */}
        <div className="lg:col-span-5 space-y-8">
          <div className="aspect-square bg-slate-50 rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm relative group">
            <img 
              src={product.images[0]} 
              alt={product.title} 
              className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${isSoldOut ? 'grayscale opacity-50' : ''}`} 
            />
            {isSoldOut && (
              <div className="absolute inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-black uppercase text-xs tracking-widest">Out of Stock</span>
              </div>
            )}
          </div>
          
          <div className="space-y-4 px-2">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest italic">Product Documentation</h3>
            <p className="text-base text-slate-600 font-medium leading-relaxed italic">
              {product.fullDescription}
            </p>
          </div>
        </div>

        {/* Right: Purchase Terminal */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          
          {/* Identity Bar */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="bg-blue-100 text-blue-600 text-[11px] font-black px-3 py-1 rounded-md uppercase tracking-widest italic">Official License</span>
              <span className="text-slate-300 text-[11px] font-bold uppercase tracking-widest">UID: {product.id.split('-').pop()}</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
              {product.title}
            </h1>
          </div>

          {/* MAIN ACTION BAR (Same Line Price & Buy) */}
          <div className="bg-slate-900 rounded-[2.5rem] p-6 lg:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl shadow-slate-200">
            <div className="flex items-center gap-5">
              <div className="flex flex-col">
                <div className="flex items-center gap-4">
                  <span className="text-white font-black text-4xl lg:text-5xl tracking-tighter italic leading-none">
                    {settings.currencySymbol}{selectedOption.price}
                  </span>
                  {discountPercent > 0 && (
                    <div className="bg-red-600 text-white px-3 py-1.5 rounded-xl text-[13px] font-black italic tracking-tighter">
                      -{discountPercent}%
                    </div>
                  )}
                </div>
                {selectedOption.mrp > selectedOption.price && (
                  <span className="text-white/20 line-through font-bold text-lg italic mt-2 ml-1">
                    {settings.currencySymbol}{selectedOption.mrp}
                  </span>
                )}
              </div>
            </div>

            <button 
              disabled={isSoldOut}
              onClick={handleBuy}
              className={`h-full px-12 py-5 bg-white hover:bg-blue-600 hover:text-white text-slate-900 font-black rounded-[1.5rem] uppercase tracking-[0.2em] transition-all duration-300 italic shadow-lg text-lg flex items-center justify-center min-w-[200px] ${isSoldOut ? 'opacity-5 cursor-not-allowed' : 'active:scale-95'}`}
            >
              Buy Now
            </button>
          </div>

          {/* EDITION SELECTOR (VERSIONS / TIRES) */}
          {product.subsections && product.subsections.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest italic">Select Version</span>
                <div className="h-[1px] bg-slate-100 w-full"></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {product.subsections.map((sub, idx) => (
                  <button
                    key={sub.id}
                    onClick={() => setActiveSubIndex(idx)}
                    className={`px-5 py-3.5 rounded-2xl text-[13px] font-black uppercase tracking-wide transition-all italic border ${activeSubIndex === idx ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-[1.02]' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400'}`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* DURATION SELECTOR (ACCESS OPTIONS) */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest italic">Access Duration</span>
              <div className="h-[1px] bg-slate-100 w-full"></div>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {activeSub.options.map(opt => {
                const isSelected = selectedOption.id === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedOption(opt)}
                    className={`w-full flex items-center justify-between px-8 py-5 rounded-[1.5rem] border transition-all duration-200 ${
                      isSelected 
                      ? 'bg-blue-50 border-blue-600 text-blue-900 ring-1 ring-blue-600/50 shadow-sm' 
                      : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-left">
                      <p className="font-black uppercase text-base italic leading-none">{opt.name}</p>
                      <p className="text-[11px] font-bold uppercase tracking-widest mt-2 opacity-50 italic">{opt.presetValue || 'Activation Key'}</p>
                    </div>
                    <span className="font-black text-xl italic tracking-tighter">
                      {settings.currencySymbol}{opt.price}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Secure Trust Bar */}
          <div className="pt-6 flex items-center justify-center gap-10 opacity-30 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic">Instant Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-900 text-[10px] font-black uppercase tracking-widest italic">Global Activation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Section */}
      <div className="pt-24 border-t border-slate-50 mt-24">
        <div className="flex items-end justify-between mb-12">
           <div className="space-y-3">
             <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight italic leading-none">Archive Bestsellers</h2>
             <p className="text-slate-400 text-xs font-bold uppercase tracking-widest italic">Verified high-demand repository items</p>
           </div>
           <Link to="/search" className="text-sm font-black text-blue-600 hover:text-slate-900 transition-colors uppercase tracking-widest italic border-b-2 border-blue-600/10 pb-1">Archive Explorer</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          {recommendations.map(p => <ProductCard key={p.id} product={p} currency={settings.currencySymbol} />)}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
