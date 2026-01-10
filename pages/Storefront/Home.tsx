
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import { useDigiContext } from '../../context/DigiContext';

const Home: React.FC = () => {
  const { products, categories, settings } = useDigiContext();
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q')?.toLowerCase() || '';

  const [activeCategory, setActiveCategory] = useState('All');

  // Filter products based on search or category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(query) ||
      product.shortDescription.toLowerCase().includes(query);
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden rounded-[3rem] bg-slate-900">
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center animate-parallax"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        <div className="relative z-10 text-center space-y-6 px-4">
          <div className="inline-block px-4 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4">
            Official {settings.brandName} Catalog
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-none">
            Elite Digital <br /> Solutions
          </h1>
          <p className="text-white/50 text-[11px] font-black uppercase tracking-[0.5em]">
            Precision Engineering • Worldwide Delivery
          </p>
        </div>
      </section>

      {/* Categories Bar */}
      <div className="sticky top-24 z-40 bg-white/80 backdrop-blur-xl border border-white/20 p-4 rounded-3xl shadow-xl shadow-slate-200/50 flex gap-4 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveCategory('All')}
          className={`shrink-0 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${activeCategory === 'All'
              ? 'bg-slate-900 text-white shadow-lg shadow-slate-400/50'
              : 'bg-slate-50 text-slate-400 hover:text-slate-900'
            }`}
        >
          All Access
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.name)}
            className={`shrink-0 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${activeCategory === cat.name
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-400/50'
                : 'bg-slate-50 text-slate-400 hover:text-slate-900'
              }`}
          >
            <span>{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="py-20 text-center space-y-4">
          <div className="text-6xl grayscale opacity-20">📂</div>
          <h3 className="text-xl font-black text-slate-900 uppercase italic">No items found</h3>
          <p className="text-slate-400 text-[11px] uppercase font-black tracking-widest">Adjust your filters or search terminology</p>
        </div>
      )}
    </div>
  );
};

export default Home;
