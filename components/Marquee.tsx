
import React from 'react';
import { Product } from '../types';

interface MarqueeProps {
  products: Product[];
}

const Marquee: React.FC<MarqueeProps> = ({ products }) => {
  const deals = products.filter(p => p.status === 'active' && p.isTrending).slice(0, 10);
  
  return (
    <div className="marquee-wrapper w-full bg-white border-b border-slate-50 overflow-hidden py-3 shadow-sm">
      <div className="marquee-container">
        <div className="marquee-content flex items-center">
          {[...deals, ...deals].map((deal, idx) => {
            const opt = deal.subsections[0]?.options[0];
            const discount = opt ? Math.round(((opt.mrp - opt.price) / opt.mrp) * 100) : 0;
            return (
              <span key={`${deal.id}-${idx}`} className="inline-flex items-center whitespace-nowrap mx-16">
                <span className="text-slate-900 font-bold text-[13px] uppercase tracking-widest italic">{deal.title}</span>
                <span className="ml-4 px-3 py-1 bg-red-600 text-white font-black text-[11px] rounded-lg uppercase tracking-widest shadow-sm">
                  {discount}% OFF
                </span>
                <span className="text-slate-200 mx-12 text-lg opacity-40">/</span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Marquee;
