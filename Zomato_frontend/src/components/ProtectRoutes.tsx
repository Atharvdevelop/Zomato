import React from 'react'
import { useLocation, Navigate } from 'react-router-dom';

type ProtectRoutesProps = {
    isloggedIn: boolean;
    children: React.ReactNode;
}

function ProtectRoutes({ isloggedIn, children }: ProtectRoutesProps) {
    const location = useLocation();
    
    if (!isloggedIn) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    return <>{children}</>;
}

export default ProtectRoutes;