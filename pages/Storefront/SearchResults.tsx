
import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import { Product, AppSettings } from '../../types';

interface SearchResultsProps {
  products: Product[];
  settings: AppSettings;
}

const SearchResults: React.FC<SearchResultsProps> = ({ products, settings }) => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  let filteredProducts = products.filter(p => p.status === 'active');

  if (query === 'trending') {
    filteredProducts = filteredProducts.filter(p => p.isTrending);
  } else if (query === 'best') {
    filteredProducts = filteredProducts.filter(p => p.isBestseller);
  } else if (query === 'new') {
    filteredProducts = [...filteredProducts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else {
    filteredProducts = filteredProducts.filter(p => 
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pb-20">
      <div className="mb-12">
        <h1 className="text-3xl font-black text-slate-900">
          {query ? `Search results for "${query}"` : 'All Products'}
        </h1>
        <p className="text-slate-500 mt-2">Found {filteredProducts.length} products matching your criteria.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {filteredProducts.map(p => <ProductCard key={p.id} product={p} currency={settings.currencySymbol} />)}
      </div>

      {filteredProducts.length === 0 && (
        <div className="py-40 text-center">
          <p className="text-slate-400 font-medium">Oops! We couldn't find anything for "{query}".</p>
          <p className="text-slate-400 text-sm mt-1">Try checking your spelling or search for something else.</p>
          <Link to="/" className="text-blue-600 font-bold hover:underline mt-6 inline-block">Return to home</Link>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
