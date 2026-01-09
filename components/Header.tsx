
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Category, Product, AppSettings } from '../types';

interface HeaderProps {
  categories: Category[];
  products: Product[];
  settings: AppSettings;
}

const Header: React.FC<HeaderProps> = ({ categories, products, settings }) => {
  const [search, setSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search)}`);
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const suggestions = products
    .filter(p => 
      p.status === 'active' && 
      (p.title.toLowerCase().includes(search.toLowerCase()) || 
       p.category.toLowerCase().includes(search.toLowerCase()))
    )
    .slice(0, 5);

  return (
    <header className="glass-header">
      <nav className="max-w-[1500px] mx-auto flex h-20 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-14">
          <Link to="/" className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-2xl italic">V</div>
            <span className="text-slate-900 font-black text-2xl tracking-tighter uppercase">{settings.brandName}</span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-12">
            <Link to="/" className="text-[16px] font-bold text-slate-900 uppercase tracking-widest hover:text-blue-600 transition-colors">Vault</Link>
            <Link to="/search?q=best" className="text-[16px] font-bold text-slate-500 uppercase tracking-widest hover:text-blue-600 transition-colors">Bestsellers</Link>
            <Link to="/search?q=new" className="text-[16px] font-bold text-slate-500 uppercase tracking-widest hover:text-blue-600 transition-colors">New Drops</Link>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="relative" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative">
              <input 
                type="text" 
                placeholder="Search repository..." 
                className="h-12 w-48 sm:w-80 rounded-2xl bg-slate-50 border border-slate-200 pl-12 pr-4 text-[15px] font-semibold text-slate-900 focus:outline-none focus:bg-white focus:ring-4 focus:ring-slate-100 transition-all"
                value={search}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => setSearch(e.target.value)}
              />
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4.5 top-1/2 -translate-y-1/2 text-slate-400">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
            </form>
            {showSuggestions && search.length >= 2 && (
              <div className="absolute top-full right-0 mt-4 w-96 bg-white border border-slate-200 rounded-[28px] shadow-2xl overflow-hidden py-4 z-[2000]">
                {suggestions.map(s => (
                  <Link 
                    key={s.id} 
                    to={`/product/${s.id}`} 
                    onClick={() => setShowSuggestions(false)}
                    className="flex items-center gap-5 px-6 py-4 hover:bg-slate-50 transition-colors group"
                  >
                    <img src={s.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover shadow-sm border border-slate-50" />
                    <div>
                      <p className="text-[14px] font-bold text-slate-900 uppercase tracking-tight">{s.title}</p>
                      <p className="text-[12px] text-slate-400 font-bold uppercase tracking-widest mt-1">{s.category}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link to="/admin" className="hidden sm:flex items-center gap-4 bg-slate-900 text-white px-6 py-3 rounded-2xl text-[14px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl active:scale-95">
            Admin
          </Link>
        </div>
      </nav>
      
      <div className="max-w-[1500px] mx-auto px-4 md:px-8 h-12 overflow-x-auto no-scrollbar flex items-center gap-14 text-[13px] font-bold uppercase tracking-widest bg-white border-t border-slate-50">
        {categories.map(cat => (
          <Link key={cat.id} to={`/category/${cat.slug}`} className="text-slate-400 hover:text-slate-900 flex items-center gap-3 transition-colors whitespace-nowrap">
            <span className="text-lg">{cat.icon}</span>
            {cat.name}
          </Link>
        ))}
      </div>
    </header>
  );
};

export default Header;
