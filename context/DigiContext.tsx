
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, AppSettings } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SETTINGS } from '../store/mockData';
import {
    isCloudConnected, fetchFromCloud, saveToCloud, deleteFromCloud, initSupabase
} from '../utils/supabase';

interface DigiContextType {
    products: Product[];
    categories: Category[];
    settings: AppSettings;
    isAdmin: boolean;
    isLoading: boolean;
    isLive: boolean;
    refreshData: () => Promise<void>;
    updateProduct: (product: Product) => Promise<void>;
    addProduct: (product: Product) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    addCategory: (category: Category) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;
    updateSettings: (settings: AppSettings) => Promise<void>;
    login: () => void;
    logout: () => void;
}

const DigiContext = createContext<DigiContextType | undefined>(undefined);

export const DigiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS);
    const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('dm_admin_auth') === 'true');
    const [isLoading, setIsLoading] = useState(true);
    const [isLive, setIsLive] = useState(false);

    const refreshData = async () => {
        if (!isCloudConnected()) {
            setProducts(INITIAL_PRODUCTS);
            setCategories(INITIAL_CATEGORIES);
            setIsLoading(false);
            return;
        }

        try {
            const [p, c, s] = await Promise.all([
                fetchFromCloud('dm_products'),
                fetchFromCloud('dm_categories'),
                fetchFromCloud('dm_settings')
            ]);

            setProducts(p.data?.length ? p.data : INITIAL_PRODUCTS);
            setCategories(c.data?.length ? c.data : INITIAL_CATEGORIES);
            if (s.data?.length) setSettings(s.data[0]);
            setIsLive(true);
        } catch (e) {
            console.error("Fetch failed", e);
            setIsLive(false);
            // Fallback to defaults on total failure
            setProducts(INITIAL_PRODUCTS);
            setCategories(INITIAL_CATEGORIES);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        initSupabase();
        refreshData();
    }, []);

    // --- Actions ---

    const updateProduct = async (product: Product) => {
        setProducts(prev => prev.map(p => p.id === product.id ? product : p));
        try {
            await saveToCloud('dm_products', product.id, product);
            alert("✓ Success: Product updated in database.");
        } catch (e: any) {
            alert("❌ Sync Error: " + e.message);
        }
    };

    const addProduct = async (product: Product) => {
        setProducts(prev => [...prev, product]);
        try {
            await saveToCloud('dm_products', product.id, product);
            alert("✓ Success: New product added to database.");
        } catch (e: any) {
            alert("❌ Sync Error: " + e.message);
        }
    };

    const deleteProduct = async (id: string) => {
        setProducts(prev => prev.filter(p => p.id !== id));
        try {
            await deleteFromCloud('dm_products', id);
            alert("✓ Success: Product removed from database.");
        } catch (e: any) {
            alert("❌ Sync Error: " + e.message);
        }
    };

    const addCategory = async (category: Category) => {
        setCategories(prev => [...prev, category]);
        try {
            await saveToCloud('dm_categories', category.id, category);
            alert("✓ Success: Category added to database.");
        } catch (e: any) {
            alert("❌ Sync Error: " + e.message);
        }
    };

    const deleteCategory = async (id: string) => {
        setCategories(prev => prev.filter(c => c.id !== id));
        try {
            await deleteFromCloud('dm_categories', id);
            alert("✓ Success: Category removed from database.");
        } catch (e: any) {
            alert("❌ Sync Error: " + e.message);
        }
    };

    const updateSettings = async (newSettings: AppSettings) => {
        setSettings(newSettings);
        try {
            await saveToCloud('dm_settings', 'global-config', newSettings);
            alert("✓ Success: Global settings saved to database.");
        } catch (e: any) {
            alert("❌ Sync Error: " + e.message);
        }
    };

    const login = () => {
        setIsAdmin(true);
        localStorage.setItem('dm_admin_auth', 'true');
    };

    const logout = () => {
        setIsAdmin(false);
        localStorage.removeItem('dm_admin_auth');
    };

    return (
        <DigiContext.Provider value={{
            products, categories, settings, isAdmin, isLoading, isLive,
            refreshData, updateProduct, addProduct, deleteProduct,
            addCategory, deleteCategory, updateSettings,
            login, logout
        }}>
            {children}
        </DigiContext.Provider>
    );
};

export const useDigiContext = () => {
    const context = useContext(DigiContext);
    if (!context) throw new Error("useDigiContext must be used within DigiProvider");
    return context;
};
