import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 경로 수정

function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        // 인증 상태 확인 중 로딩 표시
        return <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">로딩 중...</span>
            </div>
        </div>;
    }

    if (!isAuthenticated) {
        // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 인증된 경우 자식 컴포넌트 렌더링
    return children;
}

export default ProtectedRoute;