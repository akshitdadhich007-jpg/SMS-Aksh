import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { normalizeRole } from '../utils/authUtils';

/**
 * ProtectedRoute - wraps a route to require auth + optional role check.
 * 
 * Usage:
 *   <Route element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-primary, #f5f6fa)' }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="loading-spinner" style={{ width: 40, height: 40, border: '4px solid #e0e0e0', borderTop: '4px solid #6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
                    <p style={{ color: '#888', fontSize: 14 }}>Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    const sessionRole = normalizeRole(user.role);

    if (allowedRoles && !allowedRoles.includes(sessionRole)) {
        // Redirect to their own dashboard if wrong role
        const roleRedirects = { admin: '/admin', resident: '/resident', security: '/security' };
        return <Navigate to={roleRedirects[sessionRole] || '/'} replace />;
    }

    return children;
};

export default ProtectedRoute;
