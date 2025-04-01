import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import { AuthProvider, PERMISSIONS } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// 로딩 컴포넌트 - 필요하다면 별도 파일로 분리할 수 있습니다
const LoadingSpinner = () => (
    <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    </div>
);

// React.lazy를 사용한 컴포넌트 지연 로딩
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const ProductManagement = React.lazy(() => import('./pages/ProductManagement'));
const OrderManagement = React.lazy(() => import('./pages/OrderManagement'));
const InventoryManagement = React.lazy(() => import('./pages/InventoryManagement'));
const SupplyChainManagement = React.lazy(() => import('./pages/SupplyChainManagement'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
const Settings = React.lazy(() => import('./pages/Settings'));
const UserManagement = React.lazy(() => import('./pages/UserManagement'));

// 라우트 구성을 데이터로 정의
const routes = [
    { path: '/', component: Dashboard, permission: PERMISSIONS.VIEW_DASHBOARD },
    { path: '/products', component: ProductManagement, permission: PERMISSIONS.VIEW_PRODUCTS },
    { path: '/orders', component: OrderManagement, permission: PERMISSIONS.VIEW_ORDERS },
    { path: '/inventory', component: InventoryManagement, permission: PERMISSIONS.VIEW_INVENTORY },
    { path: '/supply', component: SupplyChainManagement, permission: PERMISSIONS.VIEW_SUPPLY },
    { path: '/analytics', component: Analytics, permission: PERMISSIONS.VIEW_ANALYTICS },
    { path: '/settings', component: Settings, permission: PERMISSIONS.VIEW_SETTINGS },
    { path: '/users', component: UserManagement, permission: PERMISSIONS.VIEW_USERS },
];

// 보호된 라우트 컴포넌트 생성
const ProtectedPage = ({ component: Component, permission }) => (
    <ProtectedRoute requiredPermission={permission}>
        <MainLayout>
            <Component />
        </MainLayout>
    </ProtectedRoute>
);

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                        {/* 공개 라우트 */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/unauthorized" element={<Unauthorized />} />

                        {/* 보호된 라우트 동적 생성 */}
                        {routes.map(({ path, component, permission }) => (
                            <Route
                                key={path}
                                path={path}
                                element={<ProtectedPage component={component} permission={permission} />}
                            />
                        ))}

                        {/* 기타 경로는 대시보드로 리다이렉트 */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Suspense>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;