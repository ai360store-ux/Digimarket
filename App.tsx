
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SETTINGS } from './store/mockData.ts';
import { Product, Category, AppSettings } from './types.ts';
import { isCloudConnected, fetchFromCloud, saveToCloud } from './utils/supabase.ts';

import Home from './pages/Storefront/Home.tsx';
import ProductDetail from './pages/Storefront/ProductDetail.tsx';
import CategoryListing from './pages/Storefront/CategoryListing.tsx';
import SearchResults from './pages/Storefront/SearchResults.tsx';
import AdminOverview from './pages/Admin/Overview.tsx';
import AdminProductList from './pages/Admin/ProductList.tsx';
import AdminProductForm from './pages/Admin/ProductForm.tsx';
import AdminCategories from './pages/Admin/Categories.tsx';
import AdminSettings from './pages/Admin/AdminSettings.tsx';
import AdminLogin from './pages/Admin/Login.tsx';

import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import AdminLayout from './components/AdminLayout.tsx';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('dm_admin_auth') === 'true');

  useEffect(() => {
    const initData = async () => {
      try {
        // 1. Load Local Fallbacks first
        const localP = localStorage.getItem('dm_products');
        const localC = localStorage.getItem('dm_categories');
        const localS = localStorage.getItem('dm_settings');

        const fallbackProducts = localP ? JSON.parse(localP) : INITIAL_PRODUCTS;
        const fallbackCategories = localC ? JSON.parse(localC) : INITIAL_CATEGORIES;
        const fallbackSettings = localS ? JSON.parse(localS) : INITIAL_SETTINGS;

        // 2. Try Cloud if bridge is active
        if (isCloudConnected()) {
          console.log("Cloud Bridge Active: Syncing components...");
          const [cloudP, cloudC, cloudS] = await Promise.all([
            fetchFromCloud('dm_products'),
            fetchFromCloud('dm_categories'),
            fetchFromCloud('dm_settings')
          ]);

          // Selective Merge: Only use cloud if data actually exists there
          setProducts(cloudP && cloudP.length > 0 ? cloudP : fallbackProducts);
          setCategories(cloudC && cloudC.length > 0 ? cloudC : fallbackCategories);
          
          // CRITICAL: Ensure settings is never undefined
          const finalSettings = (cloudS && cloudS.length > 0 && cloudS[0]) ? cloudS[0] : fallbackSettings;
          setSettings(finalSettings);
        } else {
          setProducts(fallbackProducts);
          setCategories(fallbackCategories);
          setSettings(fallbackSettings);
        }
      } catch (e) {
        console.error("Data Load Failure:", e);
        setProducts(INITIAL_PRODUCTS);
        setCategories(INITIAL_CATEGORIES);
        setSettings(INITIAL_SETTINGS);
      } finally {
        setIsLoading(false);
      }
    };
    initData();
  }, []);

  // Background Sync Logic
  useEffect(() => {
    if (isLoading) return;
    
    // Always keep local storage updated
    localStorage.setItem('dm_products', JSON.stringify(products));
    localStorage.setItem('dm_categories', JSON.stringify(categories));
    localStorage.setItem('dm_settings', JSON.stringify(settings));

    if (isCloudConnected()) {
      const sync = async () => {
        try {
          await Promise.all([
            ...products.map(p => saveToCloud('dm_products', p.id, p)),
            ...categories.map(c => saveToCloud('dm_categories', c.id, c)),
            saveToCloud('dm_settings', 'global-config', settings)
          ]);
        } catch (e) {
          console.error("Auto-sync background error:", e);
        }
      };
      sync();
    }
  }, [products, categories, settings, isLoading]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic">Accessing Repository...</p>
      </div>
    );
  }

  // Final Safety Check
  const safeSettings = settings || INITIAL_SETTINGS;

  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-white selection:bg-blue-600 selection:text-white">
        <Routes>
          <Route path="/" element={
            <>
              <Header categories={categories} products={products} settings={safeSettings} />
              <main className="flex-grow page-content-wrapper"><Home products={products} categories={categories} settings={safeSettings} /></main>
              <Footer settings={safeSettings} />
            </>
          } />
          <Route path="/product/:id" element={
            <>
              <Header categories={categories} products={products} settings={safeSettings} />
              <main className="flex-grow page-content-wrapper">
                <ProductDetail products={products} settings={safeSettings} />
              </main>
              <Footer settings={safeSettings} />
            </>
          } />
          <Route path="/category/:slug" element={
            <>
              <Header categories={categories} products={products} settings={safeSettings} />
              <main className="flex-grow page-content-wrapper"><CategoryListing products={products} categories={categories} settings={safeSettings} /></main>
              <Footer settings={safeSettings} />
            </>
          } />
          <Route path="/search" element={
            <>
              <Header categories={categories} products={products} settings={safeSettings} />
              <main className="flex-grow page-content-wrapper"><SearchResults products={products} settings={safeSettings} /></main>
              <Footer settings={safeSettings} />
            </>
          } />

          <Route path="/admin/login" element={<AdminLogin onLogin={() => {
            setIsAdmin(true);
            localStorage.setItem('dm_admin_auth', 'true');
          }} />} />
          
          <Route path="/admin" element={<ProtectedRoute><AdminOverview products={products} /></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute><AdminProductList products={products} onDelete={handleDeleteProduct} /></ProtectedRoute>} />
          <Route path="/admin/products/add" element={<ProtectedRoute><AdminProductForm onSave={handleAddProduct} categories={categories} settings={safeSettings} /></ProtectedRoute>} />
          <Route path="/admin/products/edit/:id" element={<ProtectedRoute><AdminProductForm products={products} onSave={handleUpdateProduct} categories={categories} settings={safeSettings} /></ProtectedRoute>} />
          <Route path="/admin/categories" element={<ProtectedRoute><AdminCategories categories={categories} setCategories={setCategories} /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings settings={safeSettings} setSettings={setSettings} products={products} setProducts={setProducts} categories={categories} setCategories={setCategories} /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
