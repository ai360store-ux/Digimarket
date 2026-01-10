
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDigiContext } from '../context/DigiContext';

const Header: React.FC = () => {
  const { categories, products, settings, isAdmin, logout } = useDigiContext();
  const [search, setSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  const brandName = settings?.brandName || 'REPOSITORY';

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
      <nav className="max-w-[1500px] mx-auto flex h-16 md:h-20 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-900 rounded-lg md:rounded-xl flex items-center justify-center text-white font-black text-xl italic transition-transform hover:scale-110">V</div>
            <span className="text-slate-900 font-black text-xl md:text-2xl tracking-tighter uppercase whitespace-nowrap">{brandName}</span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            <Link to="/" className="text-[13px] font-bold text-slate-900 uppercase tracking-widest hover:text-blue-600 transition-colors">Vault</Link>
            <Link to="/search?q=best" className="text-[13px] font-bold text-slate-500 uppercase tracking-widest hover:text-blue-600 transition-colors">Bestsellers</Link>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <div className="relative" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Repository search..."
                className="h-10 md:h-11 w-32 sm:w-64 rounded-xl bg-slate-50 border border-slate-200 pl-10 pr-4 text-[14px] font-semibold text-slate-900 focus:outline-none focus:bg-white focus:ring-4 focus:ring-slate-100 transition-all"
                value={search}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => setSearch(e.target.value)}
              />
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
            </form>
            {showSuggestions && search.length >= 2 && (
              <div className="absolute top-full right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden py-3 z-[2000]">
                {suggestions.map(s => (
                  <Link
                    key={s.id}
                    to={`/product/${s.id}`}
                    onClick={() => setShowSuggestions(false)}
                    className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 transition-colors group"
                  >
                    <img src={s.images?.[0] || ''} alt="" className="w-10 h-10 rounded-lg object-cover border border-slate-50" />
                    <div>
                      <p className="text-[13px] font-bold text-slate-900 uppercase tracking-tight">{s.title}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{s.category}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {isAdmin ? (
            <div className="flex items-center gap-3 bg-slate-900 p-1.5 rounded-2xl shadow-xl shadow-slate-200 border border-slate-800">
              <Link to="/admin" className="text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all">
                Panel
              </Link>
              <button
                onClick={logout}
                className="bg-rose-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg active:scale-95"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link to="/admin" className="hidden sm:flex items-center gap-3 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-95 border border-slate-700">
              Admin
            </Link>
          )}
        </div>
      </nav>

      {/* Category Bar - Slim */}
      <div className="max-w-[1500px] mx-auto px-4 md:px-8 h-10 overflow-x-auto no-scrollbar flex items-center gap-10 text-[11px] font-bold uppercase tracking-widest bg-white border-t border-slate-50">
        {(categories || []).map(cat => (
          <Link key={cat.id} to={`/category/${cat.slug}`} className="text-slate-400 hover:text-slate-900 flex items-center gap-2 transition-colors whitespace-nowrap">
            <span className="text-base">{cat.icon}</span>
            {cat.name}
          </Link>
        ))}
      </div>
    </header>
  );
};

export default Header;
