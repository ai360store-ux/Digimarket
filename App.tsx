
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SETTINGS } from './store/mockData';
import { Product, Category, AppSettings } from './types';

// Pages
import Home from './pages/Storefront/Home';
import ProductDetail from './pages/Storefront/ProductDetail';
import CategoryListing from './pages/Storefront/CategoryListing';
import SearchResults from './pages/Storefront/SearchResults';
import AdminOverview from './pages/Admin/Overview';
import AdminProductList from './pages/Admin/ProductList';
import AdminProductForm from './pages/Admin/ProductForm';
import AdminCategories from './pages/Admin/Categories';
import AdminSettings from './pages/Admin/AdminSettings';
import AdminLogin from './pages/Admin/Login';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  // Robust Hydration with Fallback to prevent blank pages
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('dm_products');
      if (!saved) return INITIAL_PRODUCTS;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_PRODUCTS;
    } catch (e) {
      return INITIAL_PRODUCTS;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('dm_categories');
      if (!saved) return INITIAL_CATEGORIES;
      return JSON.parse(saved);
    } catch (e) {
      return INITIAL_CATEGORIES;
    }
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('dm_settings');
      if (!saved) return INITIAL_SETTINGS;
      return JSON.parse(saved);
    } catch (e) {
      return INITIAL_SETTINGS;
    }
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('dm_admin_auth') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('dm_products', JSON.stringify(products));
    localStorage.setItem('dm_categories', JSON.stringify(categories));
    localStorage.setItem('dm_settings', JSON.stringify(settings));
  }, [products, categories, settings]);

  const handleUpdateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [...prev, newProduct]);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
    if (!isAdmin) return <Navigate to="/admin/login" />;
    return <AdminLayout>{children}</AdminLayout>;
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-white selection:bg-blue-600 selection:text-white">
        <Routes>
          <Route path="/" element={
            <>
              <Header categories={categories} products={products} settings={settings} />
              <main className="flex-grow page-content-wrapper"><Home products={products} categories={categories} settings={settings} /></main>
              <Footer settings={settings} />
            </>
          } />
          <Route path="/product/:id" element={
            <>
              <Header categories={categories} products={products} settings={settings} />
              <main className="flex-grow page-content-wrapper">
                <ProductDetail products={products} settings={settings} />
              </main>
              <Footer settings={settings} />
            </>
          } />
          <Route path="/category/:slug" element={
            <>
              <Header categories={categories} products={products} settings={settings} />
              <main className="flex-grow page-content-wrapper"><CategoryListing products={products} categories={categories} settings={settings} /></main>
              <Footer settings={settings} />
            </>
          } />
          <Route path="/search" element={
            <>
              <Header categories={categories} products={products} settings={settings} />
              <main className="flex-grow page-content-wrapper"><SearchResults products={products} settings={settings} /></main>
              <Footer settings={settings} />
            </>
          } />

          <Route path="/admin/login" element={<AdminLogin onLogin={() => {
            setIsAdmin(true);
            localStorage.setItem('dm_admin_auth', 'true');
          }} />} />
          
          <Route path="/admin" element={<ProtectedRoute><AdminOverview products={products} /></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute><AdminProductList products={products} onDelete={handleDeleteProduct} /></ProtectedRoute>} />
          <Route path="/admin/products/add" element={<ProtectedRoute><AdminProductForm onSave={handleAddProduct} categories={categories} settings={settings} /></ProtectedRoute>} />
          <Route path="/admin/products/edit/:id" element={<ProtectedRoute><AdminProductForm products={products} onSave={handleUpdateProduct} categories={categories} settings={settings} /></ProtectedRoute>} />
          <Route path="/admin/categories" element={<ProtectedRoute><AdminCategories categories={categories} setCategories={setCategories} /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings settings={settings} setSettings={setSettings} /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        <a 
          href={`https://wa.me/${settings.whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-[2000] flex items-center gap-3 bg-[#25D366] text-white px-5 py-3.5 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all group"
        >
          <div className="flex flex-col items-end leading-none">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Direct</span>
            <span className="font-black text-[13px] uppercase tracking-tighter">Support</span>
          </div>
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.038 3.284l-.569 2.1c-.149.546.37 1.039.905.868l2.127-.677c.727.427 1.486.634 2.268.635 3.181 0 5.766-2.587 5.768-5.766.001-3.181-2.587-5.77-5.77-5.77zm3.033 8.358c-.145.409-.844.757-1.15.808-.282.047-.648.082-1.047-.113-.245-.121-.555-.262-1.218-.549-1.201-.52-1.956-1.748-2.016-1.828-.06-.081-.486-.647-.486-1.235 0-.589.308-.878.421-1.002.113-.124.248-.155.33-.155s.165 0 .237.004c.075.004.177-.029.277.214.102.243.346.845.376.906.031.061.05.131.01.21-.04.079-.061.131-.121.202-.06.07-.124.156-.177.21-.059.06-.121.125-.053.243.068.118.303.499.65 0.808.448.399.825.522.942.583.117.06.185.05.253-.028.068-.078.293-.342.371-.459.078-.117.157-.098.263-.059.106.039.67.316.786.375.115.059.193.088.221.137.028.049.028.283-.117.691z"/></svg>
        </a>
      </div>
    </Router>
  );
};

export default App;
