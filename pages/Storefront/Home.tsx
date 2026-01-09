
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import { Product, Category, AppSettings } from '../../types';

interface HomeProps {
  products: Product[];
  categories: Category[];
  settings: AppSettings;
}

const Home: React.FC<HomeProps> = ({ products, categories, settings }) => {
  const trending = products.filter(p => p.isTrending && p.status === 'active').slice(0, 5);
  const verified = products.filter(p => p.isBestseller && p.status === 'active').slice(0, 5);
  const limitedStock = products.filter(p => p.inventory > 0 && p.inventory <= 10 && p.status === 'active').slice(0, 5);
  const newDrops = products.filter(p => p.isNew && p.status === 'active').slice(0, 5);
  const navigate = useNavigate();

  return (
    <div className="w-full white-mesh">
      <div className="max-w-[1500px] mx-auto px-4 md:px-8 py-6 space-y-12 lg:space-y-16">
        
        {/* Compact Authentic Hero */}
        <section className="mobile-compact-hero relative w-full rounded-[32px] md:rounded-[48px] bg-slate-50 border border-slate-100 py-10 md:py-16 px-6 md:px-8 flex flex-col items-center justify-center text-center shadow-sm overflow-hidden min-h-[200px] md:min-h-[260px]">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/5 blur-[100px] rounded-full"></div>
          <div className="relative z-10 w-full max-w-3xl space-y-6 md:space-y-8">
            <div className="space-y-3 md:space-y-4">
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none italic">
                Official <span className="gradient-text">License Vault</span>
              </h1>
              <p className="text-slate-400 text-[11px] md:text-sm font-semibold max-w-2xl mx-auto leading-relaxed uppercase tracking-[0.2em]">
                Authentic Activation Keys • 24/7 Global Fulfillment • Licensed Since {settings.establishedYear}
              </p>
            </div>

            {/* Compact Search */}
            <div className="relative w-full max-w-[480px] mx-auto group">
              <input 
                type="text" 
                placeholder="Find an activation key..."
                className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 md:py-4.5 outline-none text-slate-900 text-[14px] font-bold transition-all shadow-xl shadow-slate-200/10 group-hover:border-slate-300 focus:ring-4 focus:ring-slate-100"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') navigate(`/search?q=${(e.target as HTMLInputElement).value}`);
                }}
              />
              <button 
                onClick={() => navigate('/search')}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-900 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-xl shadow-lg hover:bg-slate-800 transition-all text-[11px] md:text-[12px] font-black uppercase tracking-widest active:scale-95"
              >
                Search
              </button>
            </div>
          </div>
        </section>

        {/* High Density Product Sections */}
        <ProductGridSection title="Market Trending" products={trending} currency={settings.currencySymbol} subtitle="Active Hot-picks in Repository" />
        <ProductGridSection title="Verified Distribution" products={verified} currency={settings.currencySymbol} subtitle="Trusted Authenticated Licenses" />
        
        {limitedStock.length > 0 && (
          <ProductGridSection title="Limited Stock Clearance" products={limitedStock} currency={settings.currencySymbol} subtitle="Final Reserve Inventory Available" />
        )}
        
        <ProductGridSection title="Recent Additions" products={newDrops} currency={settings.currencySymbol} subtitle="Fresh License Queue Uploaded" />
        
        {/* Marketplace Trust Panel */}
        <section className="bg-white border border-slate-100 rounded-[40px] p-10 md:p-14 lg:p-20 text-center shadow-sm">
          <div className="max-w-4xl mx-auto space-y-10 md:space-y-14">
            <h3 className="text-2xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">AUTHENTICITY <span className="text-red-600">CERTIFIED</span></h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
               <div className="flex flex-col items-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 border border-slate-100 rounded-2xl md:rounded-[28px] flex items-center justify-center text-2xl md:text-3xl mb-4 md:mb-6 shadow-sm">🛡️</div>
                  <span className="text-[12px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">50k+ Successful</span>
               </div>
               <div className="flex flex-col items-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 border border-slate-100 rounded-2xl md:rounded-[28px] flex items-center justify-center text-2xl md:text-3xl mb-4 md:mb-6 shadow-sm">⚡</div>
                  <span className="text-[12px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">Instant Fulfillment</span>
               </div>
               <div className="flex flex-col items-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 border border-slate-100 rounded-2xl md:rounded-[28px] flex items-center justify-center text-2xl md:text-3xl mb-4 md:mb-6 shadow-sm">🌐</div>
                  <span className="text-[12px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">Global License</span>
               </div>
               <div className="flex flex-col items-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 border border-slate-100 rounded-2xl md:rounded-[28px] flex items-center justify-center text-2xl md:text-3xl mb-4 md:mb-6 shadow-sm">💬</div>
                  <span className="text-[12px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">24/7 Bridge Active</span>
               </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const ProductGridSection = ({ title, products, currency, subtitle }: { title: string, products: Product[], currency: string, subtitle?: string }) => {
  if (products.length === 0) return null;
  return (
    <section className="space-y-6 md:space-y-8">
      <div className="flex items-end justify-between border-b border-slate-50 pb-3 md:pb-6">
        <div>
          <h2 className="text-xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none italic">{title}</h2>
          <p className="text-slate-400 text-[11px] md:text-[12px] font-bold uppercase tracking-[0.3em] mt-2 md:mt-3">{subtitle || 'Verified Repository Queue'}</p>
        </div>
        <Link to="/search" className="text-[12px] font-black text-slate-900 hover:text-red-600 transition-colors uppercase tracking-widest">Browse All</Link>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 md:gap-8">
        {products.map(p => <ProductCard key={p.id} product={p} currency={currency} />)}
      </div>
    </section>
  );
};

export default Home;
