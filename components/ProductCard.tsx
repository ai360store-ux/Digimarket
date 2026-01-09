
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  currency?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, currency = '₹' }) => {
  const allPrices = product.subsections?.flatMap(sub => sub.options?.map(opt => opt.price) || []) || [];
  const minPrice = allPrices.length > 0 ? Math.min(...allPrices) : 0;
  const isSoldOut = product.inventory === 0;

  return (
    <div className="flex flex-col group h-full">
      <Link to={`/product/${product.id}`} className="block w-full h-full flex flex-col">
        <div className="relative aspect-square rounded-[1.25rem] overflow-hidden bg-[#F8F9FB] border border-slate-100 shrink-0 transition-all duration-500 group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] group-hover:-translate-y-1">
          <img 
            src={product.images[0]} 
            alt={product.title} 
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${isSoldOut ? 'grayscale opacity-40' : ''}`} 
          />
          
          <div className="absolute top-4 left-4 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            {product.isTrending && (
              <span className="bg-slate-900 text-white text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-widest italic">Trending</span>
            )}
            {product.isStaffPick && (
              <span className="bg-blue-600 text-white text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-widest italic">Staff Choice</span>
            )}
          </div>

          {isSoldOut && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/40 backdrop-blur-[2px]">
               <span className="bg-slate-900 text-white text-[10px] font-black px-4 py-2 rounded-lg uppercase tracking-widest">Vault Empty</span>
            </div>
          )}
        </div>
        
        <div className="pt-4 flex flex-col flex-grow">
          <div className="mb-2">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{product.category}</span>
            <h3 className="text-[15px] font-black text-slate-900 uppercase tracking-tight line-clamp-1 italic mt-1 group-hover:text-blue-600 transition-colors">
              {product.title}
            </h3>
          </div>
          
          <div className="mt-auto flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Pricing From</span>
              <span className="font-black text-slate-900 text-lg italic tracking-tighter">
                {currency}{minPrice.toLocaleString()}
              </span>
            </div>
            <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
