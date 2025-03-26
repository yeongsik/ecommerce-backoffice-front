import React from 'react';
import { Nav, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Sidebar() {
    const location = useLocation();
    const { currentUser, logout } = useAuth();

    // 로그아웃 처리
    const handleLogout = () => {
        logout();
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
            </div>

            <Nav className="flex-column">
                <Nav.Link
                    as={Link}
                    to="/"
                    className={location.pathname === '/' ? 'active bg-primary rounded text-white' : 'text-white'}
                >
                    대시보드
                </Nav.Link>
                <Nav.Link
                    as={Link}
                    to="/products"
                    className={location.pathname === '/products' ? 'active bg-primary rounded text-white' : 'text-white'}
                >
                    제품 관리
                </Nav.Link>
                <Nav.Link
                    as={Link}
                    to="/orders"
                    className={location.pathname === '/orders' ? 'active bg-primary rounded text-white' : 'text-white'}
                >
                    주문 관리
                </Nav.Link>
                <Nav.Link
                    as={Link}
                    to="/inventory"
                    className={location.pathname === '/inventory' ? 'active bg-primary rounded text-white' : 'text-white'}
                >
                    재고 관리
                </Nav.Link>
                <Nav.Link
                    as={Link}
                    to="/supply"
                    className={location.pathname === '/supply' ? 'active bg-primary rounded text-white' : 'text-white'}
                >
                    발주 관리
                </Nav.Link>
                <Nav.Link
                    as={Link}
                    to="/analytics"
                    className={location.pathname === '/analytics' ? 'active bg-primary rounded text-white' : 'text-white'}
                >
                    통계 분석
                </Nav.Link>
                <Nav.Link
                    as={Link}
                    to="/users"
                    className={location.pathname === '/users' ? 'active bg-primary rounded text-white' : 'text-white'}
                >
                    사용자 관리
                </Nav.Link>
                <Nav.Link
                    as={Link}
                    to="/settings"
                    className={location.pathname === '/settings' ? 'active bg-primary rounded text-white' : 'text-white'}
                >
                    설정
                </Nav.Link>
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