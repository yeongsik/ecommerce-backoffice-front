import React from 'react';
import { Nav, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Sidebar() {
    const location = useLocation();
    const {
        currentUser,
        logout,
        canViewDashboard,
        canViewProducts,
        canViewOrders,
        canViewInventory,
        canViewSupply,
        canViewAnalytics,
        canViewUsers,
        canViewSettings
    } = useAuth();

    // 로그아웃 처리
    const handleLogout = () => {
        logout();
    };

    // 활성 메뉴 클래스
    const getNavLinkClass = (path) => {
        return location.pathname === path ? 'active bg-primary rounded text-white' : 'text-white';
    };

    return (
        <div className="sidebar p-3 d-flex flex-column h-100">
            <div className="text-center mb-4">
                <h4 className="text-white">브랜드 로고</h4>
            </div>

            {/* 사용자 정보 */}
            <div className="bg-dark bg-opacity-50 rounded p-3 mb-4 text-center">
                <div className="text-white mb-2">{currentUser?.name}</div>
                <small className="text-light">{currentUser?.email}</small>
                <div>
                    <small className="badge bg-info">{currentUser?.role}</small>
                </div>
            </div>

            <Nav className="flex-column">
                {canViewDashboard() && (
                    <Nav.Link
                        as={Link}
                        to="/"
                        className={getNavLinkClass('/')}
                    >
                        대시보드
                    </Nav.Link>
                )}

                {canViewProducts() && (
                    <Nav.Link
                        as={Link}
                        to="/products"
                        className={getNavLinkClass('/products')}
                    >
                        제품 관리
                    </Nav.Link>
                )}

                {canViewOrders() && (
                    <Nav.Link
                        as={Link}
                        to="/orders"
                        className={getNavLinkClass('/orders')}
                    >
                        주문 관리
                    </Nav.Link>
                )}

                {canViewInventory() && (
                    <Nav.Link
                        as={Link}
                        to="/inventory"
                        className={getNavLinkClass('/inventory')}
                    >
                        재고 관리
                    </Nav.Link>
                )}

                {canViewSupply() && (
                    <Nav.Link
                        as={Link}
                        to="/supply"
                        className={getNavLinkClass('/supply')}
                    >
                        발주 관리
                    </Nav.Link>
                )}

                {canViewAnalytics() && (
                    <Nav.Link
                        as={Link}
                        to="/analytics"
                        className={getNavLinkClass('/analytics')}
                    >
                        통계 분석
                    </Nav.Link>
                )}

                {canViewUsers() && (
                    <Nav.Link
                        as={Link}
                        to="/users"
                        className={getNavLinkClass('/users')}
                    >
                        사용자 관리
                    </Nav.Link>
                )}

                {canViewSettings() && (
                    <Nav.Link
                        as={Link}
                        to="/settings"
                        className={getNavLinkClass('/settings')}
                    >
                        설정
                    </Nav.Link>
                )}
            </Nav>

            {/* 로그아웃 버튼 - 하단에 배치 */}
            <div className="mt-auto">
                <Button variant="outline-light" className="w-100" onClick={handleLogout}>
                    로그아웃
                </Button>
            </div>
        </div>
    );
}

export default Sidebar;