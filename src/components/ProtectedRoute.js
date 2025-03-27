import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, requiredPermission = null }) {
    const { isAuthenticated, loading, hasPermission, canAccessPage } = useAuth();
    const location = useLocation();

    if (loading) {
        // 인증 상태 확인 중 로딩 표시
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">로딩 중...</span>
                </div>
            </div>
        );
    }

    // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 특정 권한이 필요한 경우 권한 체크
    if (requiredPermission && !hasPermission(requiredPermission)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // 페이지 접근 권한 체크
    if (!canAccessPage(location.pathname)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // 인증되고 권한이 있는 경우 자식 컴포넌트 렌더링
    return children;
}

export default ProtectedRoute;