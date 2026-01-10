
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, AppSettings } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SETTINGS } from '../store/mockData';
import { fetchFromCloud, saveToCloud, deleteFromCloud, isCloudConnected } from '../utils/supabase';

interface DigiContextType {
    products: Product[];
    categories: Category[];
    settings: AppSettings;
    isAdmin: boolean;
    isLoading: boolean;
    refreshData: () => Promise<void>;
    updateProduct: (product: Product) => Promise<void>;
    addProduct: (product: Product) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
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

    const refreshData = async () => {
        setIsLoading(true);
        try {
            if (isCloudConnected()) {
                const [p, c, s] = await Promise.all([
                    fetchFromCloud('dm_products'),
                    fetchFromCloud('dm_categories'),
                    fetchFromCloud('dm_settings')
                ]);

                // Supabase returns { data, error }. If error is missing-table, we might want to alert, but here we just fallback/empty.
                // Important: If data is empty array, it means empty DB.

                setProducts(p?.data?.length ? p.data : (p?.error ? INITIAL_PRODUCTS : []));
                setCategories(c?.data?.length ? c.data : (c?.error ? INITIAL_CATEGORIES : []));
                setSettings(s?.data?.length ? s.data[0] : INITIAL_SETTINGS);
            } else {
                // Fallback to mock if no connection (or local dev mode)
                console.warn("No Supabase connection.");
                setProducts(INITIAL_PRODUCTS);
                setCategories(INITIAL_CATEGORIES);
                setSettings(INITIAL_SETTINGS);
            }
        } catch (e) {
            console.error("Context Refresh Failed", e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshData();
    }, []);

    const login = () => {
        localStorage.setItem('dm_admin_auth', 'true');
        setIsAdmin(true);
    };

    const logout = () => {
        localStorage.removeItem('dm_admin_auth');
        setIsAdmin(false);
    };

    const updateProduct = async (product: Product) => {
        // Optimistic Update
        setProducts(prev => prev.map(p => p.id === product.id ? product : p));
        if (isCloudConnected()) {
            await saveToCloud('dm_products', product.id, product);
        }
    };

    const addProduct = async (product: Product) => {
        setProducts(prev => [...prev, product]);
        if (isCloudConnected()) {
            await saveToCloud('dm_products', product.id, product);
        }
    };

    const deleteProduct = async (id: string) => {
        setProducts(prev => prev.filter(p => p.id !== id));
        if (isCloudConnected()) {
            await deleteFromCloud('dm_products', id);
        }
    };

    const updateSettings = async (newSettings: AppSettings) => {
        setSettings(newSettings);
        if (isCloudConnected()) {
            await saveToCloud('dm_settings', 'global-settings', newSettings);
        }
    };

    return (
        <DigiContext.Provider value={{
            products, categories, settings, isAdmin, isLoading,
            refreshData, updateProduct, addProduct, deleteProduct, updateSettings,
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
