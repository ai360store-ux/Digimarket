
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Product, AppSettings, PriceOption } from '../../types.ts';
import { formatDuration, generateWhatsAppUrl, calculateDiscount } from '../../utils/helpers.ts';
import ProductCard from '../../components/ProductCard.tsx';

interface ProductDetailProps {
  products: Product[];
  settings: AppSettings;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ products, settings }) => {
  const { id } = useParams();

  const product = useMemo(() => {
    if (!products || !id) return null;
    return products.find(p => p.id === id) || null;
  }, [products, id]);

  const [activeSubIndex, setActiveSubIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<PriceOption | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    if (product?.subsections?.[activeSubIndex]) {
      const sub = product.subsections[activeSubIndex];
      if (sub.options?.length > 0) {
        setSelectedOption(sub.options[0]);
      }
    }
  }, [product, activeSubIndex]);

  if (!product) return <Navigate to="/" />;

  const activeSub = product.subsections?.[activeSubIndex] || product.subsections?.[0];

  if (!activeSub || !selectedOption) return null;

  const handleBuy = () => {
    setIsPurchasing(true);

    const durationStr = formatDuration(selectedOption.type, selectedOption.presetValue, selectedOption.expiryDate);
    const orderId = `V-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    const url = generateWhatsAppUrl(
      settings.whatsappNumber,
      product.title,
      `${activeSub.name} - ${selectedOption.name}`,
      durationStr,
      selectedOption.price,
      selectedOption.mrp,
      orderId,
      settings.currencySymbol,
      selectedOption.taxPercent || 0
    );

    // Simulate purchase animation
    setTimeout(() => {
      window.open(url, '_blank');
      setIsPurchasing(false);
    }, 600);
  };

  const isSoldOut = product.inventory === 0;
  const recommendations = products
    .filter(p => p.id !== product.id && p.status === 'active' && p.category === product.category)
    .slice(0, 5);

  const discountPercent = calculateDiscount(selectedOption.mrp, selectedOption.price);

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-6 bg-white">

      {/* Compact Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-[9px] font-bold uppercase tracking-wider text-slate-400">
        <Link to="/" className="text-blue-600 hover:text-slate-900 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-slate-900">{product.category}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

        {/* Product Image - Compact */}
        <div className="lg:col-span-5 space-y-6">
          <div className="aspect-square bg-[#F8F9FB] rounded-3xl overflow-hidden border border-slate-100 shadow-sm relative group">
            <img
              src={product.images[0]}
              alt={product.title}
              className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${isSoldOut ? 'grayscale opacity-50' : ''}`}
            />
            {discountPercent > 0 && (
              <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-xl shadow-lg">
                <p className="text-xs font-black uppercase tracking-wide">{discountPercent}% OFF</p>
              </div>
            )}
          </div>

          {/* Trust Badges - Compact */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
              <div className="text-xl mb-1">✓</div>
              <p className="text-[8px] font-black uppercase tracking-wider text-slate-600">Authentic</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
              <div className="text-xl mb-1">⚡</div>
              <p className="text-[8px] font-black uppercase tracking-wider text-slate-600">Instant</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
              <div className="text-xl mb-1">🔒</div>
              <p className="text-[8px] font-black uppercase tracking-wider text-slate-600">Secure</p>
            </div>
          </div>

          {/* Product Description - Compact */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] italic flex items-center gap-2">
              <span className="w-3 h-[2px] bg-blue-600"></span>
              Details
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {product.fullDescription}
            </p>
          </div>
        </div>

        {/* Product Info - Reorganized */}
        <div className="lg:col-span-7 space-y-6">

          {/* Edition & Tenure Selectors - MOVED TO TOP */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Edition Selector */}
            <div className="space-y-3">
              <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.25em]">Edition</h4>
              <div className="flex flex-wrap gap-2">
                {product.subsections.map((sub, idx) => (
                  <button
                    key={sub.id}
                    onClick={() => setActiveSubIndex(idx)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all border-2 ${activeSubIndex === idx ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Tenure Selector */}
            <div className="space-y-3">
              <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.25em]">Duration</h4>
              <div className="flex flex-wrap gap-2">
                {activeSub.options.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedOption(opt)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all border-2 ${selectedOption.id === opt.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}
                  >
                    {opt.presetValue}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Name - SMALLER & MOVED BELOW OPTIONS */}
          <div className="space-y-2 border-t border-slate-100 pt-6">
            <div className="flex items-center gap-2">
              <span className="bg-slate-900 text-white text-[8px] font-black px-2 py-1 rounded uppercase tracking-wider">Verified</span>
              <span className="text-slate-300 text-[8px] font-bold uppercase tracking-wider">ID: {product.id.split('-').pop()}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase leading-tight">
              {product.title}
            </h1>
            <p className="text-xs text-slate-500 font-medium">{activeSub.name} - {selectedOption.name}</p>
          </div>

          {/* Optimized Pricing Card */}
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border-2 border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              {/* Price Info */}
              <div className="flex flex-col gap-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-slate-900 font-black text-4xl tracking-tight">
                    {settings.currencySymbol}{selectedOption.price.toLocaleString()}
                  </span>
                  {discountPercent > 0 && (
                    <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-lg text-xs font-black uppercase">
                      Save {discountPercent}%
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 line-through text-sm font-semibold">
                    MRP {settings.currencySymbol}{selectedOption.mrp.toLocaleString()}
                  </span>
                  {selectedOption.taxPercent && (
                    <span className="text-slate-400 text-xs">· Incl. {selectedOption.taxPercent}% tax</span>
                  )}
                </div>
              </div>

              {/* Buy Button - Changed to "Buy Now" */}
              <button
                disabled={isSoldOut || isPurchasing}
                onClick={handleBuy}
                className={`group relative px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-black rounded-xl uppercase tracking-wide transition-all duration-300 text-base shadow-lg overflow-hidden ${isSoldOut ? 'opacity-30 cursor-not-allowed' : isPurchasing ? 'scale-95' : 'hover:scale-105 hover:shadow-xl'}`}
              >
                {/* Button Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>

                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isPurchasing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : isSoldOut ? (
                    'Sold Out'
                  ) : (
                    <>
                      Buy Now
                    </>
                  )}
                </span>
              </button>
            </div>

            {/* Security Badge */}
            {!isSoldOut && (
              <div className="flex items-center justify-center gap-2 text-slate-400 text-[9px] font-bold uppercase tracking-wider border-t border-slate-200 mt-4 pt-4">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Encrypted & Secure Checkout</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {recommendations.length > 0 && (
        <div className="mt-20 pt-12 border-t border-slate-100">
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {recommendations.map(p => <ProductCard key={p.id} product={p} currency={settings.currencySymbol} />)}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
