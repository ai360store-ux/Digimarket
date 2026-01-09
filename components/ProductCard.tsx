
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { calculateDiscount } from '../utils/helpers';

interface ProductCardProps {
  product: Product;
  currency?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, currency = '₹' }) => {
  const allPrices = product.subsections?.flatMap(sub => sub.options?.map(opt => opt.price) || []) || [];
  const minPrice = allPrices.length > 0 ? Math.min(...allPrices) : 0;
  
  const firstOption = product.subsections?.[0]?.options?.[0];
  const isSoldOut = product.inventory === 0;

  return (
    <div className="flex flex-col group transition-all duration-500 h-full">
      <Link to={`/product/${product.id}`} className="block w-full h-full flex flex-col">
        <div className="relative aspect-square rounded-[1.5rem] overflow-hidden bg-slate-50 border border-slate-100 shrink-0 shadow-sm group-hover:shadow-xl transition-all duration-500">
          <img 
            src={product.images[0]} 
            alt={product.title} 
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${isSoldOut ? 'grayscale opacity-40' : ''}`} 
          />
          
          {isSoldOut && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/40 backdrop-blur-[2px]">
               <span className="bg-slate-900 text-white text-[10px] font-black px-4 py-2 rounded-lg uppercase tracking-widest">Sold Out</span>
            </div>
          )}
        </div>
        
        <div className="pt-4 flex flex-col flex-grow">
          <div className="mb-2">
            <h3 className="text-base font-black text-slate-900 uppercase tracking-tight line-clamp-1 italic">
              {product.title}
            </h3>
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">{product.category}</span>
          </div>
          
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-3">
               <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">From</span>
                  <span className="font-black text-slate-900 text-lg italic tracking-tighter">
                    {currency}{minPrice}
                  </span>
               </div>
            </div>

            <div className={`w-full ${isSoldOut ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white group-hover:bg-blue-600'} font-black text-[12px] py-3.5 rounded-xl uppercase tracking-widest text-center transition-all italic`}>
              {isSoldOut ? 'Out of Stock' : 'Buy Now'}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

// Added missing default export
export default ProductCard;
