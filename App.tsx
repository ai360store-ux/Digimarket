
import React from 'react';
import { Routes, Route, Navigate, HashRouter } from 'react-router-dom';

// 1. Context Provider (The Brain)
import { DigiProvider, useDigiContext } from './context/DigiContext';

// 2. Base Components
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// 3. Pages
import Home from './pages/Storefront/Home';
import ProductDetail from './pages/Storefront/ProductDetail';
import CategoryProducts from './pages/Storefront/CategoryProducts';
import AdminLogin from './pages/Admin/Login';
import AdminOverview from './pages/Admin/Overview';
import AdminProductList from './pages/Admin/ProductList';
import AdminProductForm from './pages/Admin/ProductForm';
import AdminCategories from './pages/Admin/Categories';
import AdminSettings from './pages/Admin/AdminSettings';
import DebugPage from './pages/Admin/Debug';

// --- MAIN CONTENT WRAPPER ---
// Consumes context to handle global UI states (like loading)
const AppContent: React.FC = () => {
  const { isLoading } = useDigiContext();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center space-y-8 p-10 text-center">
        <div className="w-24 h-24 border-t-4 border-r-4 border-blue-600 rounded-full animate-spin"></div>
        <h2 className="text-3xl font-black text-white italic uppercase tracking-widest">Initialising Vault</h2>
        <p className="text-white/30 text-xs font-black uppercase tracking-[0.5em] animate-pulse">Syncing with Global Repository...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-600 selection:text-white">
      <Header />
      <main className="container mx-auto px-4 md:px-8 pt-44 pb-32">
        <Routes>
          {/* Storefront */}
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/category/:slug" element={<CategoryProducts />} />
          <Route path="/search" element={<Home />} />

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute><AdminOverview /></ProtectedRoute>} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/products" element={<ProtectedRoute><AdminProductList /></ProtectedRoute>} />
          <Route path="/admin/products/add" element={<ProtectedRoute><AdminProductForm /></ProtectedRoute>} />
          <Route path="/admin/products/edit/:id" element={<ProtectedRoute><AdminProductForm /></ProtectedRoute>} />
          <Route path="/admin/categories" element={<ProtectedRoute><AdminCategories /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
          <Route path="/admin/debug" element={<DebugPage />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

// --- ROOT APP ---
function App() {
  return (
    <HashRouter>
      <DigiProvider>
        <AppContent />
      </DigiProvider>
    </HashRouter>
  );
}

export default App;
