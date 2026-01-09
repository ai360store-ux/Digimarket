
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import { Product, Category, AppSettings } from '../../types';

interface CategoryListingProps {
  products: Product[];
  categories: Category[];
  settings: AppSettings;
}

const CategoryListing: React.FC<CategoryListingProps> = ({ products, categories, settings }) => {
  const { slug } = useParams();
  const category = categories.find(c => c.slug === slug);
  const filteredProducts = products.filter(p => p.category === category?.name && p.status === 'active');

  if (!category) return <div className="p-20 text-center">Category not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 pb-20">
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <Link to="/" className="text-xs font-bold text-blue-600 uppercase tracking-widest">Home</Link>
          <span className="text-slate-300">/</span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{category.name}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-4xl">{category.icon}</span>
          <h1 className="text-3xl font-black text-slate-900">{category.name} Products</h1>
        </div>
        <p className="text-slate-500 mt-2">Browsing {filteredProducts.length} verified listings in this category.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {filteredProducts.map(p => <ProductCard key={p.id} product={p} currency={settings.currencySymbol} />)}
      </div>

      {filteredProducts.length === 0 && (
        <div className="py-40 text-center">
          <p className="text-slate-400 font-medium">No products found in this category yet.</p>
          <Link to="/" className="text-blue-600 font-bold hover:underline mt-4 inline-block">Go back home</Link>
        </div>
      )}
    </div>
  );
};

export default CategoryListing;
