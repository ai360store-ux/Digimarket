
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
  const newDrops = products.filter(p => p.isNew && p.status === 'active').slice(0, 5);
  const navigate = useNavigate();

  return (
    <div className="w-full bg-white">
      <div className="max-w-[1500px] mx-auto px-6 md:px-12 py-8 space-y-20 lg:space-y-24">
        
        {/* Established Authority Hero */}
        <section className="relative w-full rounded-[2.5rem] bg-[#0A0A0B] py-16 md:py-24 px-8 md:px-12 flex flex-col items-center justify-center text-center overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10 w-full max-w-4xl space-y-10">
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-4">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em]">Network Live: Secure Fulfillment Active</span>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9] italic">
                Official <span className="text-blue-500">License</span><br/>Repository
              </h1>
              <p className="text-white/40 text-xs md:text-[13px] font-bold max-w-xl mx-auto leading-relaxed uppercase tracking-[0.3em]">
                Authorized distribution since {settings.establishedYear}.<br/>Global activation keys with 100% verification rate.
              </p>
            </div>

            <div className="relative w-full max-w-[540px] mx-auto group">
              <input 
                type="text" 
                placeholder="Query activation vault..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 outline-none text-white text-[15px] font-bold transition-all placeholder:text-white/20 focus:ring-4 focus:ring-blue-500/10 focus:border-white/30"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') navigate(`/search?q=${(e.target as HTMLInputElement).value}`);
                }}
              />
              <button 
                onClick={() => navigate('/search')}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white text-slate-900 px-8 py-3 rounded-xl shadow-lg hover:bg-blue-500 hover:text-white transition-all text-[11px] font-black uppercase tracking-widest active:scale-95 italic"
              >
                Access
              </button>
            </div>
          </div>
        </section>

        {/* Grid Sections */}
        <ProductGridSection title="Active Trending" products={trending} currency={settings.currencySymbol} subtitle="High-demand network picks" />
        <ProductGridSection title="Verified Licenses" products={verified} currency={settings.currencySymbol} subtitle="Trusted across 12,000+ deployments" />
        <ProductGridSection title="Recent Additions" products={newDrops} currency={settings.currencySymbol} subtitle="Newly indexed activation keys" />
        
        {/* Distribution Panel */}
        <section className="bg-slate-50 border border-slate-100 rounded-[3rem] p-12 md:p-20 text-center">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-2xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter italic mb-16">Global Distribution Metrics</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
               {[
                 { label: 'Successful Activations', val: '54,200+', icon: '🛡️' },
                 { label: 'Seconds for Fulfillment', val: '< 0.5s', icon: '⚡' },
                 { label: 'Active Regions', val: '190+', icon: '🌐' },
                 { label: 'Technical Bridge', val: '24/7', icon: '💬' },
               ].map((stat, i) => (
                 <div key={i} className="flex flex-col items-center group">
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-3xl mb-6 shadow-sm border border-slate-100 group-hover:-translate-y-2 transition-transform">{stat.icon}</div>
                    <span className="text-lg font-black text-slate-900 tracking-tighter uppercase italic">{stat.val}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{stat.label}</span>
                 </div>
               ))}
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
    <section className="space-y-10">
      <div className="flex items-end justify-between border-b border-slate-100 pb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter italic">{title}</h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mt-3">{subtitle}</p>
        </div>
        <Link to="/search" className="text-[11px] font-black text-blue-600 hover:text-slate-900 transition-colors uppercase tracking-widest italic border-b-2 border-blue-600/10 pb-1">Browse Archive</Link>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12">
        {products.map(p => <ProductCard key={p.id} product={p} currency={currency} />)}
      </div>
    </section>
  );
};

export default Home;
