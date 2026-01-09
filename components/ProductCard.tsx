
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { calculateDiscount } from '../utils/helpers';

interface ProductCardProps {
  product: Product;
  currency?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, currency = '₹' }) => {
  // Find the absolute minimum price across all versions and options
  const allPrices = product.subsections.flatMap(sub => sub.options.map(opt => opt.price));
  const minPrice = Math.min(...allPrices);
  
  const firstOption = product.subsections[0]?.options[0];
  const discount = firstOption ? calculateDiscount(firstOption.mrp, firstOption.price) : 0;
  const isSoldOut = product.inventory === 0;

  return (
    <div className="flex flex-col group transition-all duration-500 h-full">
      <Link to={`/product/${product.id}`} className="block w-full h-full flex flex-col">
        <div className="relative aspect-[1/1] rounded-[2rem] overflow-hidden bg-slate-50 border border-slate-100/50 shrink-0 shadow-sm group-hover:shadow-2xl group-hover:shadow-blue-500/10 transition-all duration-500">
          <img 
            src={product.images[0]} 
            alt={product.title} 
            loading="lazy"
            decoding="async"
            className={`w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 ${isSoldOut ? 'grayscale opacity-40' : ''}`} 
          />
          
          {discount > 0 && !isSoldOut && (
            <div className="absolute top-4 right-4 bg-red-600 text-white text-[11px] font-black px-3 py-1.5 rounded-xl shadow-xl uppercase tracking-widest z-10 animate-pulse">
              Save Big
            </div>
          )}
          
          {isSoldOut && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/10 backdrop-blur-[2px]">
               <span className="bg-slate-900 text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-[0.2em] shadow-2xl">Vault Empty</span>
            </div>
          )}
        </div>
        
        <div className="pt-4 px-1 flex flex-col flex-grow">
          <div className="mb-2">
            <h3 className="text-[14px] font-black mb-1 line-clamp-1 leading-tight text-slate-900 uppercase tracking-tighter italic">
              {product.title}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{product.category}</span>
              <div className="h-0.5 w-0.5 bg-slate-200 rounded-full"></div>
              <span className="text-[9px] text-emerald-600 font-black uppercase tracking-tighter italic">Verified</span>
            </div>
          </div>
          
          <div className="mt-auto pt-2">
            <div className="flex items-center justify-between mb-4">
               <div className="flex flex-col leading-none">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">From</span>
                  <span className="font-black text-slate-900 text-lg tracking-tighter leading-none italic">
                    {currency}{minPrice}
                  </span>
               </div>
               <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all text-slate-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
               </div>
            </div>

            <div className={`w-full ${isSoldOut ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white group-hover:bg-blue-600 shadow-sm'} font-black text-[10px] py-3 rounded-xl uppercase tracking-[0.2em] text-center transition-all italic`}>
              {isSoldOut ? 'Sold Out' : 'Buy Now'}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
