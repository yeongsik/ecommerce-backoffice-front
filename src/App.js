import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import ProductManagement from './pages/ProductManagement';
import OrderManagement from './pages/OrderManagement';
import InventoryManagement from './pages/InventoryManagement';
import SupplyChainManagement from './pages/SupplyChainManagement';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import UserManagement from './pages/UserManagement';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { PERMISSIONS } from './context/AuthContext';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* 공개 라우트 */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />

                    {/* 보호된 라우트 */}
                    <Route path="/" element={
                        <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_DASHBOARD}>
                            <MainLayout>
                                <Dashboard />
                            </MainLayout>
                        </ProtectedRoute>
                    } />

                    <Route path="/products" element={
                        <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_PRODUCTS}>
                            <MainLayout>
                                <ProductManagement />
                            </MainLayout>
                        </ProtectedRoute>
                    } />

                    <Route path="/orders" element={
                        <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_ORDERS}>
                            <MainLayout>
                                <OrderManagement />
                            </MainLayout>
                        </ProtectedRoute>
                    } />

                    <Route path="/inventory" element={
                        <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_INVENTORY}>
                            <MainLayout>
                                <InventoryManagement />
                            </MainLayout>
                        </ProtectedRoute>
                    } />

                    <Route path="/supply" element={
                        <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_SUPPLY}>
                            <MainLayout>
                                <SupplyChainManagement />
                            </MainLayout>
                        </ProtectedRoute>
                    } />

                    <Route path="/analytics" element={
                        <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_ANALYTICS}>
                            <MainLayout>
                                <Analytics />
                            </MainLayout>
                        </ProtectedRoute>
                    } />

                    <Route path="/settings" element={
                        <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_SETTINGS}>
                            <MainLayout>
                                <Settings />
                            </MainLayout>
                        </ProtectedRoute>
                    } />

                    <Route path="/users" element={
                        <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_USERS}>
                            <MainLayout>
                                <UserManagement />
                            </MainLayout>
                        </ProtectedRoute>
                    } />

                    {/* 기타 경로는 대시보드로 리다이렉트 */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;