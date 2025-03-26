import React, { useState } from 'react';
import { Card, Table, Button, Form, Row, Col, Badge, Tab, Tabs } from 'react-bootstrap';

function SupplyChainManagement() {
    const [key, setKey] = useState('pending');

    // 예시 발주 데이터
    const orders = [
        { id: 'PO-20250327-001', supplier: '대한의류', date: '2025-03-27', deliveryDate: '2025-04-05', items: '클래식 데님 자켓 30pcs', total: 1350000, status: 'pending' },
        { id: 'PO-20250326-005', supplier: '정품패션', date: '2025-03-26', deliveryDate: '2025-04-10', items: '니트 스웨터 25pcs', total: 875000, status: 'confirmed' },
        { id: 'PO-20250325-003', supplier: '우리원단', date: '2025-03-25', deliveryDate: '2025-04-02', items: '가죽 벨트 50pcs', total: 700000, status: 'shipping' },
        { id: 'PO-20250320-010', supplier: '한국섬유', date: '2025-03-20', deliveryDate: '2025-03-30', items: '캐주얼 셔츠 40pcs', total: 1280000, status: 'completed' },
        { id: 'PO-20250315-008', supplier: '서울업체', date: '2025-03-15', deliveryDate: '2025-03-25', items: '여성 블라우스 35pcs', total: 1050000, status: 'completed' }
    ];

    // 선택된 탭에 따라 발주 필터링
    const filteredOrders = orders.filter(order => key === 'all' || order.status === key);

    // 발주 상태에 따른 배지 색상
    const statusBadge = (status) => {
        switch(status) {
            case 'pending':
                return <Badge bg="warning">승인 대기</Badge>;
            case 'confirmed':
                return <Badge bg="primary">주문 확정</Badge>;
            case 'shipping':
                return <Badge bg="info">배송 중</Badge>;
            case 'completed':
                return <Badge bg="success">완료</Badge>;
            default:
                return <Badge bg="secondary">기타</Badge>;
        }
    };

    // 예시 공급업체 데이터
    const suppliers = [
        { name: '대한의류', category: '의류', contactPerson: '김명준', phone: '010-1234-5678', email: 'kim@daehan.com', rating: 4.8 },
        { name: '정품패션', category: '의류', contactPerson: '박서영', phone: '010-2345-6789', email: 'park@jungpum.com', rating: 4.6 },
        { name: '우리원단', category: '액세서리', contactPerson: '이민재', phone: '010-3456-7890', email: 'lee@woori.com', rating: 4.5 },
        { name: '한국섬유', category: '의류', contactPerson: '최지우', phone: '010-4567-8901', email: 'choi@hansik.com', rating: 4.7 },
        { name: '서울업체', category: '의류', contactPerson: '정성민', phone: '010-5678-9012', email: 'jung@seoul.com', rating: 4.3 }
    ];

    return (
        <div>
            <h2 className="mb-4">발주 관리</h2>

            <Row className="mb-4">
                <Col md={4}>
                    <Card className="h-100 bg-info bg-opacity-10">
                        <Card.Body>
                            <Card.Title>승인 대기 발주</Card.Title>
                            <h2>{orders.filter(o => o.status === 'pending').length}</h2>
                            <small className="text-muted">처리 필요</small>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="h-100 bg-primary bg-opacity-10">
                        <Card.Body>
                            <Card.Title>진행중 발주</Card.Title>
                            <h2>{orders.filter(o => o.status === 'confirmed' || o.status === 'shipping').length}</h2>
                            <small className="text-muted">배송 예정</small>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="h-100 bg-success bg-opacity-10">
                        <Card.Body>
                            <Card.Title>총 발주 금액</Card.Title>
                            <h2>₩{orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}</h2>
                            <small className="text-muted">이번 달</small>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Card className="mb-4">
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <Card.Title>발주 목록</Card.Title>
                        <Button variant="primary">+ 새 발주</Button>
                    </div>

                    <Tabs
                        activeKey={key}
                        onSelect={(k) => setKey(k)}
                        className="mb-3"
                    >
                        <Tab eventKey="pending" title="승인 대기" />
                        <Tab eventKey="confirmed" title="주문 확정" />
                        <Tab eventKey="shipping" title="배송 중" />
                        <Tab eventKey="completed" title="완료" />
                        <Tab eventKey="all" title="전체" />
                    </Tabs>

                    <Table responsive striped hover>
                        <thead>
                        <tr>
                            <th>발주번호</th>
                            <th>공급업체</th>
                            <th>발주일</th>
                            <th>예상 입고일</th>
                            <th>품목</th>
                            <th>금액</th>
                            <th>상태</th>
                            <th>액션</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredOrders.map(order => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.supplier}</td>
                                <td>{order.date}</td>
                                <td>{order.deliveryDate}</td>
                                <td>{order.items}</td>
                                <td>₩{order.total.toLocaleString()}</td>
                                <td>{statusBadge(order.status)}</td>
                                <td>
                                    <Button variant="outline-primary" size="sm">상세보기</Button>{' '}
                                    {order.status === 'pending' && <Button variant="success" size="sm">승인</Button>}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <Card>
                <Card.Body>
                    <Card.Title>공급업체 목록</Card.Title>
                    <Table responsive striped hover>
                        <thead>
                        <tr>
                            <th>업체명</th>
                            <th>카테고리</th>
                            <th>담당자</th>
                            <th>연락처</th>
                            <th>이메일</th>
                            <th>평가</th>
                            <th>액션</th>
                        </tr>
                        </thead>
                        <tbody>
                        {suppliers.map(supplier => (
                            <tr key={supplier.name}>
                                <td>{supplier.name}</td>
                                <td>{supplier.category}</td>
                                <td>{supplier.contactPerson}</td>
                                <td>{supplier.phone}</td>
                                <td>{supplier.email}</td>
                                <td>{'★'.repeat(Math.floor(supplier.rating)) + '☆'.repeat(5 - Math.floor(supplier.rating))} ({supplier.rating})</td>
                                <td>
                                    <Button variant="outline-primary" size="sm">상세정보</Button>{' '}
                                    <Button variant="primary" size="sm">발주하기</Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    );
}

export default SupplyChainManagement;