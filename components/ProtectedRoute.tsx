
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useDigiContext } from '../context/DigiContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAdmin } = useDigiContext();

    if (!isAdmin) {
        return <Navigate to="/admin/login" />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
