
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SETTINGS } from './store/mockData.ts';
import { Product, Category, AppSettings } from './types.ts';
import { isCloudConnected, fetchFromCloud, saveToCloud, deleteFromCloud } from './utils/supabase.ts';

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

  // Add a new state to track setup requirement
  const [setupRequired, setSetupRequired] = useState(false);

  useEffect(() => {
    const initData = async () => {
      try {
        const fallbackProducts = INITIAL_PRODUCTS;
        const fallbackCategories = INITIAL_CATEGORIES;
        const fallbackSettings = INITIAL_SETTINGS;

        if (isCloudConnected()) {
          console.log("Cloud Bridge Active: Syncing components...");

          // Fetch data with error checking
          const [pResult, cResult, sResult] = await Promise.all([
            fetchFromCloud('dm_products'),
            fetchFromCloud('dm_categories'),
            fetchFromCloud('dm_settings')
          ]);

          // CHECK FOR MISSING INFRASTRUCTURE
          if (pResult.error === 'missing-table' || cResult.error === 'missing-table') {
            setSetupRequired(true); // Alert the user!
            // Fallback to defaults so the app doesn't crash, but user knows to fix DB.
            setProducts(fallbackProducts);
            setCategories(fallbackCategories);
            setSettings(fallbackSettings);
          } else {
            const cloudP = pResult.data;
            const cloudC = cResult.data;
            const cloudS = sResult.data;

            setProducts(cloudP && cloudP.length > 0 ? cloudP : fallbackProducts);
            setCategories(cloudC && cloudC.length > 0 ? cloudC : fallbackCategories);
            const finalSettings = (cloudS && cloudS.length > 0 && cloudS[0]) ? cloudS[0] : fallbackSettings;
            setSettings(finalSettings);
          }

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
  // No background sync anymore.

  const handleUpdateProduct = async (updated: Product) => {
    if (isCloudConnected()) {
      try {
        await saveToCloud('dm_products', updated.id, updated);
      } catch (e) {
        console.error("Save Failed:", e);
        alert("CRITICAL ERROR: Could not save changes to database.");
        return;
      }
    }
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const handleAddProduct = async (newProduct: Product) => {
    if (isCloudConnected()) {
      try {
        await saveToCloud('dm_products', newProduct.id, newProduct);
      } catch (e) {
        console.error("Save Failed:", e);
        alert("CRITICAL ERROR: Could not save to database.");
        return;
      }
    }
    setProducts(prev => [...prev, newProduct]);
  };

  const handleDeleteProduct = async (id: string) => {
    if (isCloudConnected()) {
      try {
        await deleteFromCloud('dm_products', id);
      } catch (e) {
        console.error("Delete Failed:", e);
        alert("Could not delete from database.");
        return;
      }
    }
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

      {/* DB SETUP ALERT */}
      {setupRequired && (
        <div className="fixed top-0 left-0 w-full z-[9999] bg-rose-600 text-white px-4 py-3 flex items-center justify-center gap-4 shadow-xl">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="text-sm font-bold uppercase tracking-widest">Database Not Configured</p>
            <p className="text-xs opacity-90">Tables are missing in Supabase. Your changes will NOT be saved.</p>
          </div>
          <Link to="/admin/settings" className="bg-white text-rose-600 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-rose-50 transition-colors">
            Fix This
          </Link>
        </div>
      )}

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
