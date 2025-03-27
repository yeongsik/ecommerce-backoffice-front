import React, { useState } from 'react';
import { Card, Row, Col, Table, Form, Button, Dropdown } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';

// 차트 데이터
const salesData = [
    { name: '3/20', 매출: 2100000 },
    { name: '3/21', 매출: 2400000 },
    { name: '3/22', 매출: 1800000 },
    { name: '3/23', 매출: 2800000 },
    { name: '3/24', 매출: 3100000 },
    { name: '3/25', 매출: 2700000 },
    { name: '3/26', 매출: 3245000 },
];

function Dashboard() {
    const {
        canProcessOrder,
        canManageInventory,
        canExportReports,
        currentUser
    } = useAuth();

    const [dateRange, setDateRange] = useState('week');

    // 재고 부족 제품 - 실제로는 API에서 가져올 데이터
    const lowStockProducts = [
        { id: 2, name: '클래식 데님 자켓', sku: 'JK-210-BL', currentStock: 8, safetyStock: 20, needed: 12 },
        { id: 4, name: '니트 스웨터 (그레이)', sku: 'SW-120-GR', currentStock: 3, safetyStock: 15, needed: 12 },
        { id: 5, name: '가죽 벨트 (블랙)', sku: 'BT-050-BK', currentStock: 0, safetyStock: 10, needed: 10 },
    ];

    // 미처리 주문 - 실제로는 API에서 가져올 데이터
    const pendingOrders = [
        { id: 'ORD-20250327-001', date: '2025-03-27 09:45', customer: '김지민', total: 112000 },
        { id: 'ORD-20250327-002', date: '2025-03-27 10:12', customer: '이서준', total: 89000 },
        { id: 'ORD-20250327-003', date: '2025-03-27 10:30', customer: '박민지', total: 45000 },
    ];

    // 날짜 범위 변경 핸들러
    const handleDateRangeChange = (e) => {
        setDateRange(e.target.value);
        // 실제로는 여기서 새 데이터를 불러오는 API 호출을 할 수 있음
    };

    // 리포트 내보내기 핸들러
    const handleExportReport = () => {
        alert('대시보드 보고서를 내보냅니다...');
        // 실제로는 여기서 보고서 생성 및 다운로드 로직 구현
    };

    // 주문 처리 핸들러
    const handleProcessOrder = (orderId) => {
        alert(`주문 ${orderId} 처리 페이지로 이동합니다.`);
        // 실제로는 여기서 주문 처리 페이지로 라우팅
    };

    // 재고 보충 핸들러
    const handleRestock = (productId) => {
        alert(`제품 ID ${productId} 발주 페이지로 이동합니다.`);
        // 실제로는 여기서 발주 페이지로 라우팅
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>브랜드 대시보드</h2>
                <div className="d-flex align-items-center">
                    <Form.Select
                        className="me-2"
                        style={{ width: '150px' }}
                        value={dateRange}
                        onChange={handleDateRangeChange}
                    >
                        <option value="today">오늘</option>
                        <option value="week">최근 7일</option>
                        <option value="month">최근 30일</option>
                        <option value="quarter">최근 3개월</option>
                    </Form.Select>
                    {canExportReports() && (
                        <Button variant="outline-primary" onClick={handleExportReport}>
                            보고서 내보내기
                        </Button>
                    )}
                </div>
            </div>

            {/* 개인화된 환영 메시지 */}
            <Card className="mb-4 bg-primary text-white">
                <Card.Body>
                    <h4>안녕하세요, {currentUser?.name}님!</h4>
                    <p className="mb-0">오늘은 2025년 3월 27일 목요일입니다. 중요한 알림이 {pendingOrders.length + lowStockProducts.length}개 있습니다.</p>
                </Card.Body>
            </Card>

            {/* 요약 카드 */}
            <Row className="mb-4">
                <Col md={3}>
                    <Card className="h-100 bg-info bg-opacity-10">
                        <Card.Body>
                            <Card.Title>일일 판매량</Card.Title>
                            <h2>145</h2>
                            <div className="text-success">+12.5% ↑</div>
                            <small className="text-muted">어제 대비</small>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="h-100 bg-success bg-opacity-10">
                        <Card.Body>
                            <Card.Title>일일 매출</Card.Title>
                            <h2>₩3,245,000</h2>
                            <div className="text-success">+8.3% ↑</div>
                            <small className="text-muted">어제 대비</small>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="h-100 bg-danger bg-opacity-10">
                        <Card.Body>
                            <Card.Title>재고 알림</Card.Title>
                            <h2>{lowStockProducts.length}</h2>
                            <div className="text-danger">재고 부족 상품</div>
                            <small className="text-muted">확인 필요</small>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="h-100 bg-primary bg-opacity-10">
                        <Card.Body>
                            <Card.Title>주문 처리</Card.Title>
                            <h2>{pendingOrders.length}</h2>
                            <div className="text-primary">미처리 주문</div>
                            <small className="text-muted">처리 대기 중</small>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* 차트 */}
            <Card className="mb-4">
                <Card.Body>
                    <Card.Title>일별 매출 추이</Card.Title>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={salesData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value) => `₩${value.toLocaleString()}`} />
                            <Legend />
                            <Bar dataKey="매출" fill="#0d6efd" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card.Body>
            </Card>

            {/* 알림 섹션 - 미처리 주문 */}
            {canProcessOrder() && pendingOrders.length > 0 && (
                <Card className="mb-4">
                    <Card.Header className="bg-primary text-white">
                        <h5 className="mb-0">미처리 주문</h5>
                    </Card.Header>
                    <Card.Body>
                        <Table responsive striped>
                            <thead>
                            <tr>
                                <th>주문번호</th>
                                <th>날짜</th>
                                <th>고객</th>
                                <th>금액</th>
                                <th>액션</th>
                            </tr>
                            </thead>
                            <tbody>
                            {pendingOrders.map(order => (
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>{order.date}</td>
                                    <td>{order.customer}</td>
                                    <td>₩{order.total.toLocaleString()}</td>
                                    <td>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => handleProcessOrder(order.id)}
                                        >
                                            처리하기
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                        <div className="text-end">
                            <Button variant="outline-primary" as="a" href="/orders">
                                모든 주문 보기
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            )}

            {/* 알림 섹션 - 재고 부족 */}
            {canManageInventory() && lowStockProducts.length > 0 && (
                <Card>
                    <Card.Header className="bg-warning">
                        <h5 className="mb-0">재고 부족 알림</h5>
                    </Card.Header>
                    <Card.Body>
                        <Table responsive striped>
                            <thead>
                            <tr>
                                <th>제품명</th>
                                <th>SKU</th>
                                <th>현재 재고</th>
                                <th>안전 재고</th>
                                <th>필요 수량</th>
                                <th>액션</th>
                            </tr>
                            </thead>
                            <tbody>
                            {lowStockProducts.map(product => (
                                <tr key={product.id}>
                                    <td>{product.name}</td>
                                    <td>{product.sku}</td>
                                    <td className={product.currentStock === 0 ? "text-danger fw-bold" : ""}>
                                        {product.currentStock === 0 ? "품절" : product.currentStock}
                                    </td>
                                    <td>{product.safetyStock}</td>
                                    <td>{product.needed}</td>
                                    <td>
                                        <Button
                                            variant="warning"
                                            size="sm"
                                            onClick={() => handleRestock(product.id)}
                                        >
                                            발주하기
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                        <div className="text-end">
                            <Button variant="outline-warning" as="a" href="/inventory">
                                재고 관리
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            )}

            {/* 뷰어 권한만 있는 경우 - 최근 주문 */}
            {!canProcessOrder() && !canManageInventory() && (
                <Card>
                    <Card.Body>
                        <Card.Title>최근 주문</Card.Title>
                        <Table responsive striped>
                            <thead>
                            <tr>
                                <th>주문번호</th>
                                <th>날짜</th>
                                <th>고객</th>
                                <th>금액</th>
                                <th>상태</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>ORD-20250327-001</td>
                                <td>2025-03-27 09:45</td>
                                <td>김지민</td>
                                <td>₩112,000</td>
                                <td><span className="badge bg-primary">결제완료</span></td>
                            </tr>
                            <tr>
                                <td>ORD-20250327-002</td>
                                <td>2025-03-27 10:12</td>
                                <td>이서준</td>
                                <td>₩89,000</td>
                                <td><span className="badge bg-primary">결제완료</span></td>
                            </tr>
                            <tr>
                                <td>ORD-20250327-003</td>
                                <td>2025-03-27 10:30</td>
                                <td>박민지</td>
                                <td>₩45,000</td>
                                <td><span className="badge bg-success">배송중</span></td>
                            </tr>
                            </tbody>
                        </Table>
                        <div className="text-center text-muted">
                            <small>조회 권한만 있어 주문 처리 기능은 사용할 수 없습니다.</small>
                        </div>
                    </Card.Body>
                </Card>
            )}
        </div>
    );
}

export default Dashboard;