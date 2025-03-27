import React, { useState } from 'react';
import { Card, Table, Tab, Tabs, Badge, Button, Form, InputGroup, Modal, Row, Col } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

function OrderManagement() {
    const [key, setKey] = useState('pending');
    const [searchTerm, setSearchTerm] = useState('');
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);

    // 권한 정보 가져오기
    const {
        canProcessOrder,
        canCancelOrder,
        canRefundOrder
    } = useAuth();

    // 예시 주문 데이터
    const [orders, setOrders] = useState([
        { id: 'ORD-20250327-001', date: '2025-03-27 09:45', customer: '김지민', items: '프리미엄 티셔츠 외 2건', total: 112000, status: 'pending', address: '서울시 강남구', phone: '010-1234-5678', paymentMethod: '신용카드' },
        { id: 'ORD-20250327-002', date: '2025-03-27 10:12', customer: '이서준', items: '클래식 데님 자켓', total: 89000, status: 'pending', address: '서울시 송파구', phone: '010-2345-6789', paymentMethod: '카카오페이' },
        { id: 'ORD-20250327-003', date: '2025-03-27 10:30', customer: '박민지', items: '니트 스웨터 (그레이)', total: 45000, status: 'processing', address: '경기도 성남시', phone: '010-3456-7890', paymentMethod: '무통장입금' },
        { id: 'ORD-20250326-015', date: '2025-03-26 15:22', customer: '최영진', items: '가죽 벨트 (블랙)', total: 28000, status: 'completed', address: '인천시 부평구', phone: '010-4567-8901', paymentMethod: '신용카드' },
        { id: 'ORD-20250326-012', date: '2025-03-26 14:10', customer: '정현우', items: '캐주얼 청바지 외 1건', total: 86000, status: 'cancelled', address: '대전시 서구', phone: '010-5678-9012', paymentMethod: '네이버페이' }
    ]);

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
            case 'shipping':
                return <Badge bg="warning">배송중</Badge>;
            case 'completed':
                return <Badge bg="success">완료</Badge>;
            case 'cancelled':
                return <Badge bg="danger">취소</Badge>;
            case 'refunded':
                return <Badge bg="secondary">환불</Badge>;
            default:
                return <Badge bg="secondary">기타</Badge>;
        }
    };

    // 주문 상세 정보 모달 열기
    const handleOpenOrderModal = (order) => {
        setCurrentOrder(order);
        setShowOrderModal(true);
    };

    // 주문 상세 정보 모달 닫기
    const handleCloseOrderModal = () => {
        setShowOrderModal(false);
        setCurrentOrder(null);
    };

    // 주문 상태 변경 처리
    const handleChangeStatus = (orderId, newStatus) => {
        setOrders(orders.map(order =>
            order.id === orderId
                ? { ...order, status: newStatus }
                : order
        ));

        if (currentOrder && currentOrder.id === orderId) {
            setCurrentOrder({ ...currentOrder, status: newStatus });
        }
    };

    // 주문 취소 처리
    const handleCancelOrder = (orderId) => {
        if (window.confirm('정말 이 주문을 취소하시겠습니까?')) {
            handleChangeStatus(orderId, 'cancelled');
        }
    };

    // 주문 환불 처리
    const handleRefundOrder = (orderId) => {
        if (window.confirm('정말 이 주문을 환불하시겠습니까?')) {
            handleChangeStatus(orderId, 'refunded');
        }
    };

    // 주문 처리 시작
    const handleProcessOrder = (orderId) => {
        handleChangeStatus(orderId, 'processing');
        alert(`주문 ${orderId} 처리가 시작되었습니다.`);
    };

    // 배송 시작
    const handleStartShipping = (orderId) => {
        handleChangeStatus(orderId, 'shipping');
        alert(`주문 ${orderId} 배송이 시작되었습니다.`);
    };

    // 주문 완료 처리
    const handleCompleteOrder = (orderId) => {
        handleChangeStatus(orderId, 'completed');
        alert(`주문 ${orderId} 처리가 완료되었습니다.`);
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
                            <Tab eventKey="shipping" title={`배송중 (${orders.filter(o => o.status === 'shipping').length})`} />
                            <Tab eventKey="completed" title={`완료 (${orders.filter(o => o.status === 'completed').length})`} />
                            <Tab eventKey="cancelled" title={`취소 (${orders.filter(o => o.status === 'cancelled').length})`} />
                            <Tab eventKey="refunded" title={`환불 (${orders.filter(o => o.status === 'refunded').length})`} />
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
                                    <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        className="me-1"
                                        onClick={() => handleOpenOrderModal(order)}
                                    >
                                        상세보기
                                    </Button>

                                    {canProcessOrder() && order.status === 'pending' && (
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => handleProcessOrder(order.id)}
                                        >
                                            처리하기
                                        </Button>
                                    )}

                                    {canCancelOrder() && (order.status === 'pending' || order.status === 'processing') && (
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            className="ms-1"
                                            onClick={() => handleCancelOrder(order.id)}
                                        >
                                            취소
                                        </Button>
                                    )}
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

            {/* 주문 상세 정보 모달 */}
            <Modal show={showOrderModal} onHide={handleCloseOrderModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>주문 상세 정보 #{currentOrder?.id}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentOrder && (
                        <>
                            <Row className="mb-3">
                                <Col md={6}>
                                    <h5>주문 정보</h5>
                                    <p><strong>주문번호:</strong> {currentOrder.id}</p>
                                    <p><strong>주문일시:</strong> {currentOrder.date}</p>
                                    <p><strong>상태:</strong> {statusBadge(currentOrder.status)}</p>
                                    <p><strong>결제방법:</strong> {currentOrder.paymentMethod}</p>
                                </Col>
                                <Col md={6}>
                                    <h5>고객 정보</h5>
                                    <p><strong>고객명:</strong> {currentOrder.customer}</p>
                                    <p><strong>연락처:</strong> {currentOrder.phone}</p>
                                    <p><strong>배송주소:</strong> {currentOrder.address}</p>
                                </Col>
                            </Row>
                            <hr />
                            <h5>주문 상품</h5>
                            <p>{currentOrder.items}</p>
                            <div className="text-end">
                                <h5>총 금액: ₩{currentOrder.total.toLocaleString()}</h5>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between">
                                <div>
                                    {canCancelOrder() && (currentOrder.status === 'pending' || currentOrder.status === 'processing') && (
                                        <Button
                                            variant="outline-danger"
                                            onClick={() => {
                                                handleCancelOrder(currentOrder.id);
                                                handleCloseOrderModal();
                                            }}
                                            className="me-2"
                                        >
                                            주문 취소
                                        </Button>
                                    )}

                                    {canRefundOrder() && (currentOrder.status === 'completed' || currentOrder.status === 'shipping') && (
                                        <Button
                                            variant="outline-secondary"
                                            onClick={() => {
                                                handleRefundOrder(currentOrder.id);
                                                handleCloseOrderModal();
                                            }}
                                            className="me-2"
                                        >
                                            환불 처리
                                        </Button>
                                    )}
                                </div>

                                <div>
                                    {canProcessOrder() && currentOrder.status === 'pending' && (
                                        <Button
                                            variant="primary"
                                            onClick={() => {
                                                handleProcessOrder(currentOrder.id);
                                                handleCloseOrderModal();
                                            }}
                                            className="me-2"
                                        >
                                            처리 시작
                                        </Button>
                                    )}

                                    {canProcessOrder() && currentOrder.status === 'processing' && (
                                        <Button
                                            variant="info"
                                            onClick={() => {
                                                handleStartShipping(currentOrder.id);
                                                handleCloseOrderModal();
                                            }}
                                            className="me-2"
                                        >
                                            배송 시작
                                        </Button>
                                    )}

                                    {canProcessOrder() && currentOrder.status === 'shipping' && (
                                        <Button
                                            variant="success"
                                            onClick={() => {
                                                handleCompleteOrder(currentOrder.id);
                                                handleCloseOrderModal();
                                            }}
                                        >
                                            주문 완료
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseOrderModal}>
                        닫기
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default OrderManagement;