// src/pages/Dashboard.js
import React from 'react';
import { Card, Row, Col, Table } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
    return (
        <div>
            <h2 className="mb-4">브랜드 대시보드</h2>

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
                            <h2>7</h2>
                            <div className="text-danger">재고 부족 상품</div>
                            <small className="text-muted">확인 필요</small>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="h-100 bg-primary bg-opacity-10">
                        <Card.Body>
                            <Card.Title>주문 처리</Card.Title>
                            <h2>32</h2>
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

            {/* 최근 주문 */}
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
                </Card.Body>
            </Card>
        </div>
    );
}

export default Dashboard;
