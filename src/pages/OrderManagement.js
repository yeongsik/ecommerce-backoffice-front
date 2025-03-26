// src/pages/OrderManagement.js
import React, { useState } from 'react';
import { Card, Table, Tab, Tabs, Badge, Button, Form, InputGroup } from 'react-bootstrap';

function OrderManagement() {
    const [key, setKey] = useState('pending');
    const [searchTerm, setSearchTerm] = useState('');

    // 예시 주문 데이터
    const orders = [
        { id: 'ORD-20250327-001', date: '2025-03-27 09:45', customer: '김지민', items: '프리미엄 티셔츠 외 2건', total: 112000, status: 'pending' },
        { id: 'ORD-20250327-002', date: '2025-03-27 10:12', customer: '이서준', items: '클래식 데님 자켓', total: 89000, status: 'pending' },
        { id: 'ORD-20250327-003', date: '2025-03-27 10:30', customer: '박민지', items: '니트 스웨터 (그레이)', total: 45000, status: 'processing' },
        { id: 'ORD-20250326-015', date: '2025-03-26 15:22', customer: '최영진', items: '가죽 벨트 (블랙)', total: 28000, status: 'completed' },
        { id: 'ORD-20250326-012', date: '2025-03-26 14:10', customer: '정현우', items: '캐주얼 청바지 외 1건', total: 86000, status: 'cancelled' }
    ];

    // 선택된 탭과 검색어에 따라 필터링
    const filteredOrders = orders.filter(order =>
        (key === 'all' || order.status === key) &&
        (order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // 주문 상태에 따른 배지 색상
    const statusBadge = (status) => {
        switch(status) {
            case 'pending':
                return <Badge bg="primary">결제완료</Badge>;
            case 'processing':
                return <Badge bg="info">처리중</Badge>;
            case 'completed':
                return <Badge bg="success">완료</Badge>;
            case 'cancelled':
                return <Badge bg="danger">취소</Badge>;
            default:
                return <Badge bg="secondary">기타</Badge>;
        }
    };

    return (
        <div>
            <h2 className="mb-4">주문 관리</h2>

            <Card>
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <Tabs
                            activeKey={key}
                            onSelect={(k) => setKey(k)}
                            className="mb-3"
                        >
                            <Tab eventKey="pending" title={`미처리 (${orders.filter(o => o.status === 'pending').length})`} />
                            <Tab eventKey="processing" title={`처리중 (${orders.filter(o => o.status === 'processing').length})`} />
                            <Tab eventKey="completed" title={`완료 (${orders.filter(o => o.status === 'completed').length})`} />
                            <Tab eventKey="cancelled" title={`취소 (${orders.filter(o => o.status === 'cancelled').length})`} />
                            <Tab eventKey="all" title="전체" />
                        </Tabs>

                        <InputGroup style={{ width: '300px' }}>
                            <Form.Control
                                placeholder="주문번호 또는 고객명 검색..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Button variant="outline-secondary">검색</Button>
                        </InputGroup>
                    </div>

                    <Table responsive striped hover>
                        <thead>
                        <tr>
                            <th>주문번호</th>
                            <th>주문일시</th>
                            <th>고객명</th>
                            <th>상품</th>
                            <th>금액</th>
                            <th>상태</th>
                            <th>액션</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredOrders.map(order => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.date}</td>
                                <td>{order.customer}</td>
                                <td>{order.items}</td>
                                <td>₩{order.total.toLocaleString()}</td>
                                <td>{statusBadge(order.status)}</td>
                                <td>
                                    <Button variant="primary" size="sm">처리하기</Button>{' '}
                                    <Button variant="outline-secondary" size="sm">상세보기</Button>
                                </td>
                            </tr>
                        ))}
                        {filteredOrders.length === 0 && (
                            <tr>
                                <td colSpan="7" className="text-center py-3">검색 결과가 없습니다.</td>
                            </tr>
                        )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    );
}

export default OrderManagement;
