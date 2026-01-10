
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import { useDigiContext } from '../../context/DigiContext';

const CategoryProducts: React.FC = () => {
    const { slug } = useParams();
    const { products, categories } = useDigiContext();

    const category = categories.find(c => c.slug === slug);
    const filteredProducts = products.filter(p => p.category === category?.name);

    if (!category) return (
        <div className="py-20 text-center">
            <h2 className="text-2xl font-black italic uppercase">Sector Not Found</h2>
            <Link to="/" className="text-blue-600 font-bold mt-4 inline-block">Return to Catalog</Link>
        </div>
    );

    return (
        <div className="space-y-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-100 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-4 text-3xl">
                        <span>{category.icon}</span>
                        <span className="w-8 h-1 bg-blue-600 rounded-full"></span>
                    </div>
                    <h1 className="text-6xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">{category.name}</h1>
                    <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.5em]">Digital Assets • Specialized Solutions</p>
                </div>
                <div className="bg-slate-900 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest italic flex items-center gap-4 shadow-xl">
                    <span>Active Nodes</span>
                    <span className="text-blue-400">{filteredProducts.length}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="py-20 text-center space-y-4">
                    <div className="text-6xl grayscale opacity-20">📂</div>
                    <h3 className="text-xl font-black text-slate-900 uppercase italic">Sector Empty</h3>
                    <p className="text-slate-400 text-[11px] uppercase font-black tracking-widest">No products have been assigned to this sector yet.</p>
                </div>
            )}
        </div>
    );
};

export default CategoryProducts;
