import React, { createContext, useState, useEffect, useContext } from 'react';

// 권한 정의
export const PERMISSIONS = {
    // 대시보드 관련 권한
    VIEW_DASHBOARD: 'view_dashboard',

    // 제품 관련 권한
    VIEW_PRODUCTS: 'view_products',
    CREATE_PRODUCT: 'create_product',
    EDIT_PRODUCT: 'edit_product',
    DELETE_PRODUCT: 'delete_product',

    // 주문 관련 권한
    VIEW_ORDERS: 'view_orders',
    PROCESS_ORDER: 'process_order',
    CANCEL_ORDER: 'cancel_order',
    REFUND_ORDER: 'refund_order',

    // 재고 관련 권한
    VIEW_INVENTORY: 'view_inventory',
    MANAGE_INVENTORY: 'manage_inventory',
    ADJUST_INVENTORY: 'adjust_inventory',

    // 발주 관련 권한
    VIEW_SUPPLY: 'view_supply',
    CREATE_SUPPLY_ORDER: 'create_supply_order',
    APPROVE_SUPPLY_ORDER: 'approve_supply_order',

    // 통계 관련 권한
    VIEW_ANALYTICS: 'view_analytics',
    EXPORT_REPORTS: 'export_reports',

    // 유저 관련 권한
    VIEW_USERS: 'view_users',
    CREATE_USER: 'create_user',
    EDIT_USER: 'edit_user',
    DELETE_USER: 'delete_user',

    // 설정 관련 권한
    VIEW_SETTINGS: 'view_settings',
    CHANGE_SETTINGS: 'change_settings',
};

// 역할별 권한 정의
const ROLE_PERMISSIONS = {
    admin: [
        ...Object.values(PERMISSIONS), // 관리자는 모든 권한을 가짐
    ],
    manager: [
        PERMISSIONS.VIEW_DASHBOARD,
        PERMISSIONS.VIEW_PRODUCTS, PERMISSIONS.CREATE_PRODUCT, PERMISSIONS.EDIT_PRODUCT,
        PERMISSIONS.VIEW_ORDERS, PERMISSIONS.PROCESS_ORDER, PERMISSIONS.CANCEL_ORDER,
        PERMISSIONS.VIEW_INVENTORY, PERMISSIONS.MANAGE_INVENTORY, PERMISSIONS.ADJUST_INVENTORY,
        PERMISSIONS.VIEW_SUPPLY, PERMISSIONS.CREATE_SUPPLY_ORDER,
        PERMISSIONS.VIEW_ANALYTICS, PERMISSIONS.EXPORT_REPORTS,
        PERMISSIONS.VIEW_USERS,
        PERMISSIONS.VIEW_SETTINGS, PERMISSIONS.CHANGE_SETTINGS,
    ],
    operator: [
        PERMISSIONS.VIEW_DASHBOARD,
        PERMISSIONS.VIEW_PRODUCTS, PERMISSIONS.EDIT_PRODUCT,
        PERMISSIONS.VIEW_ORDERS, PERMISSIONS.PROCESS_ORDER,
        PERMISSIONS.VIEW_INVENTORY, PERMISSIONS.MANAGE_INVENTORY,
        PERMISSIONS.VIEW_SUPPLY, PERMISSIONS.CREATE_SUPPLY_ORDER,
        PERMISSIONS.VIEW_ANALYTICS,
    ],
    viewer: [
        PERMISSIONS.VIEW_DASHBOARD,
        PERMISSIONS.VIEW_PRODUCTS,
        PERMISSIONS.VIEW_ORDERS,
        PERMISSIONS.VIEW_INVENTORY,
        PERMISSIONS.VIEW_SUPPLY,
        PERMISSIONS.VIEW_ANALYTICS,
    ],
};

// 페이지별 필요 권한 정의
const PAGE_PERMISSIONS = {
    '/': [PERMISSIONS.VIEW_DASHBOARD],
    '/products': [PERMISSIONS.VIEW_PRODUCTS],
    '/orders': [PERMISSIONS.VIEW_ORDERS],
    '/inventory': [PERMISSIONS.VIEW_INVENTORY],
    '/supply': [PERMISSIONS.VIEW_SUPPLY],
    '/analytics': [PERMISSIONS.VIEW_ANALYTICS],
    '/users': [PERMISSIONS.VIEW_USERS],
    '/settings': [PERMISSIONS.VIEW_SETTINGS],
};

// 인증 컨텍스트 생성
const AuthContext = createContext(null);

// 인증 제공자 컴포넌트
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userPermissions, setUserPermissions] = useState([]);

    useEffect(() => {
        // 페이지 로드 시 로컬 스토리지에서 인증 정보 확인
        const checkAuth = () => {
            console.log("Checking authentication status...");
            const token = localStorage.getItem('authToken');
            const userData = localStorage.getItem('user');

            console.log("Token:", token);
            console.log("User data:", userData);

            if (token && userData) {
                const user = JSON.parse(userData);
                setCurrentUser(user);
                setIsAuthenticated(true);

                // 사용자 역할에 따른 권한 설정
                if (user.role && ROLE_PERMISSIONS[user.role]) {
                    setUserPermissions(ROLE_PERMISSIONS[user.role]);
                }

                console.log("User is authenticated!");
            } else {
                console.log("User is NOT authenticated!");
                setUserPermissions([]);
            }

            setLoading(false);
        };

        checkAuth();
    }, []);

    // 로그인 함수
    const login = (token, user) => {
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        setCurrentUser(user);
        setIsAuthenticated(true);

        // 사용자 역할에 따른 권한 설정
        if (user.role && ROLE_PERMISSIONS[user.role]) {
            setUserPermissions(ROLE_PERMISSIONS[user.role]);
        }
    };

    // 로그아웃 함수
    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setCurrentUser(null);
        setIsAuthenticated(false);
        setUserPermissions([]);
    };

    // 특정 권한을 가지고 있는지 확인하는 함수
    const hasPermission = (permission) => {
        return userPermissions.includes(permission);
    };

    // 페이지에 접근 권한이 있는지 확인하는 함수
    const canAccessPage = (path) => {
        if (!isAuthenticated) return false;

        // 페이지에 필요한 권한이 정의되어 있지 않으면 접근 가능
        if (!PAGE_PERMISSIONS[path]) return true;

        // 페이지에 필요한 권한 중 하나라도 있으면 접근 가능
        return PAGE_PERMISSIONS[path].some(permission => hasPermission(permission));
    };

    // 권한 관련 함수들
    const canViewDashboard = () => hasPermission(PERMISSIONS.VIEW_DASHBOARD);
    const canViewProducts = () => hasPermission(PERMISSIONS.VIEW_PRODUCTS);
    const canCreateProduct = () => hasPermission(PERMISSIONS.CREATE_PRODUCT);
    const canEditProduct = () => hasPermission(PERMISSIONS.EDIT_PRODUCT);
    const canDeleteProduct = () => hasPermission(PERMISSIONS.DELETE_PRODUCT);
    const canViewOrders = () => hasPermission(PERMISSIONS.VIEW_ORDERS);
    const canProcessOrder = () => hasPermission(PERMISSIONS.PROCESS_ORDER);
    const canCancelOrder = () => hasPermission(PERMISSIONS.CANCEL_ORDER);
    const canRefundOrder = () => hasPermission(PERMISSIONS.REFUND_ORDER);
    const canViewInventory = () => hasPermission(PERMISSIONS.VIEW_INVENTORY);
    const canManageInventory = () => hasPermission(PERMISSIONS.MANAGE_INVENTORY);
    const canAdjustInventory = () => hasPermission(PERMISSIONS.ADJUST_INVENTORY);
    const canViewSupply = () => hasPermission(PERMISSIONS.VIEW_SUPPLY);
    const canCreateSupplyOrder = () => hasPermission(PERMISSIONS.CREATE_SUPPLY_ORDER);
    const canApproveSupplyOrder = () => hasPermission(PERMISSIONS.APPROVE_SUPPLY_ORDER);
    const canViewAnalytics = () => hasPermission(PERMISSIONS.VIEW_ANALYTICS);
    const canExportReports = () => hasPermission(PERMISSIONS.EXPORT_REPORTS);
    const canViewUsers = () => hasPermission(PERMISSIONS.VIEW_USERS);
    const canCreateUser = () => hasPermission(PERMISSIONS.CREATE_USER);
    const canEditUser = () => hasPermission(PERMISSIONS.EDIT_USER);
    const canDeleteUser = () => hasPermission(PERMISSIONS.DELETE_USER);
    const canViewSettings = () => hasPermission(PERMISSIONS.VIEW_SETTINGS);
    const canChangeSettings = () => hasPermission(PERMISSIONS.CHANGE_SETTINGS);

    // 제공할 인증 컨텍스트 값
    const value = {
        currentUser,
        isAuthenticated,
        loading,
        login,
        logout,
        hasPermission,
        canAccessPage,
        // 권한 검사 함수들
        canViewDashboard,
        canViewProducts,
        canCreateProduct,
        canEditProduct,
        canDeleteProduct,
        canViewOrders,
        canProcessOrder,
        canCancelOrder,
        canRefundOrder,
        canViewInventory,
        canManageInventory,
        canAdjustInventory,
        canViewSupply,
        canCreateSupplyOrder,
        canApproveSupplyOrder,
        canViewAnalytics,
        canExportReports,
        canViewUsers,
        canCreateUser,
        canEditUser,
        canDeleteUser,
        canViewSettings,
        canChangeSettings,
        // 권한 상수들
        PERMISSIONS,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// 인증 컨텍스트를 사용하기 위한 커스텀 훅
export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthContext;