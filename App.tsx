
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
  // Robust Hydration logic to prevent Vercel blank pages
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('dm_products');
      if (!saved) return INITIAL_PRODUCTS;
      const parsed = JSON.parse(saved);
      // Ensure we actually have an array of products
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_PRODUCTS;
    } catch (e) {
      console.error("Hydration Error:", e);
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
      </div>
    </Router>
  );
};

export default App;
