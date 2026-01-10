
import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useDigiContext, DigiProvider } from './context/DigiContext';

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
import DebugPage from './pages/Admin/Debug';

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

const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { isAdmin } = useDigiContext();
  if (!isAdmin) return <Navigate to="/admin/login" />;
  return <AdminLayout>{children}</AdminLayout>;
};

const AppContent: React.FC = () => {
  // We use the context to get data and pass it to components that are not yet refactored.
  // This preserves the UI while changing the "brain".
  const { products, categories, settings, isAdmin, deleteProduct, login, isLoading } = useDigiContext();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Loading Repository</p>
        </div>
      </div>
    );
  }

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

          <Route path="/admin/login" element={<AdminLogin onLogin={login} />} />

          <Route path="/admin" element={<ProtectedRoute><AdminOverview products={products} /></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute><AdminProductList products={products} onDelete={deleteProduct} /></ProtectedRoute>} />

          {/* Note: ProductForm will use Context internally for Actions */}
          <Route path="/admin/products/add" element={<ProtectedRoute><AdminProductForm /></ProtectedRoute>} />
          <Route path="/admin/products/edit/:id" element={<ProtectedRoute><AdminProductForm /></ProtectedRoute>} />

          <Route path="/admin/categories" element={<ProtectedRoute><AdminCategories categories={categories} setCategories={() => { }} /></ProtectedRoute>} />
          <Route path="/admin/debug" element={<DebugPage products={products} categories={categories} settings={settings} />} />
          <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings settings={settings} /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <DigiProvider>
      <AppContent />
    </DigiProvider>
  );
};

export default App;
