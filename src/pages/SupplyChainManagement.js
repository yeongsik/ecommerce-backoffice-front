import React, { useState } from 'react';
import { Card, Table, Button, Form, Row, Col, Badge, Tab, Tabs, Modal } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

function SupplyChainManagement() {
    const [key, setKey] = useState('pending');
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [showSupplierModal, setShowSupplierModal] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [currentSupplier, setCurrentSupplier] = useState(null);

    // 권한 정보 가져오기
    const {
        canViewSupply,
        canCreateSupplyOrder,
        canApproveSupplyOrder
    } = useAuth();

    // 예시 발주 데이터
    const [orders, setOrders] = useState([
        { id: 'PO-20250327-001', supplier: '대한의류', date: '2025-03-27', deliveryDate: '2025-04-05', items: '클래식 데님 자켓 30pcs', total: 1350000, status: 'pending', notes: '긴급 발주입니다.' },
        { id: 'PO-20250326-005', supplier: '정품패션', date: '2025-03-26', deliveryDate: '2025-04-10', items: '니트 스웨터 25pcs', total: 875000, status: 'confirmed', notes: '' },
        { id: 'PO-20250325-003', supplier: '우리원단', date: '2025-03-25', deliveryDate: '2025-04-02', items: '가죽 벨트 50pcs', total: 700000, status: 'shipping', notes: '일부 색상 변경됨' },
        { id: 'PO-20250320-010', supplier: '한국섬유', date: '2025-03-20', deliveryDate: '2025-03-30', items: '캐주얼 셔츠 40pcs', total: 1280000, status: 'completed', notes: '' },
        { id: 'PO-20250315-008', supplier: '서울업체', date: '2025-03-15', deliveryDate: '2025-03-25', items: '여성 블라우스 35pcs', total: 1050000, status: 'completed', notes: '30% 선결제 완료' }
    ]);

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
            case 'cancelled':
                return <Badge bg="danger">취소</Badge>;
            default:
                return <Badge bg="secondary">기타</Badge>;
        }
    };

    // 예시 공급업체 데이터
    const [suppliers, setSuppliers] = useState([
        { id: 1, name: '대한의류', category: '의류', contactPerson: '김명준', phone: '010-1234-5678', email: 'kim@daehan.com', rating: 4.8, address: '서울시 강남구' },
        { id: 2, name: '정품패션', category: '의류', contactPerson: '박서영', phone: '010-2345-6789', email: 'park@jungpum.com', rating: 4.6, address: '서울시 성동구' },
        { id: 3, name: '우리원단', category: '액세서리', contactPerson: '이민재', phone: '010-3456-7890', email: 'lee@woori.com', rating: 4.5, address: '경기도 부천시' },
        { id: 4, name: '한국섬유', category: '의류', contactPerson: '최지우', phone: '010-4567-8901', email: 'choi@hansik.com', rating: 4.7, address: '대구시 중구' },
        { id: 5, name: '서울업체', category: '의류', contactPerson: '정성민', phone: '010-5678-9012', email: 'jung@seoul.com', rating: 4.3, address: '서울시 마포구' }
    ]);

    // 발주 주문 상세 보기
    const handleViewOrder = (order) => {
        setCurrentOrder(order);
        setShowOrderModal(true);
    };

    // 공급업체 상세 보기
    const handleViewSupplier = (supplier) => {
        setCurrentSupplier(supplier);
        setShowSupplierModal(true);
    };

    // 발주 승인 처리
    const handleApproveOrder = (orderId) => {
        if (window.confirm('이 발주를 승인하시겠습니까?')) {
            setOrders(orders.map(order =>
                order.id === orderId ? { ...order, status: 'confirmed' } : order
            ));

            if (currentOrder && currentOrder.id === orderId) {
                setCurrentOrder({ ...currentOrder, status: 'confirmed' });
            }

            alert('발주가 승인되었습니다.');
        }
    };

    // 새 발주 처리
    const handleNewOrder = () => {
        alert('새 발주 작성 페이지로 이동합니다.');
    };

    // 공급업체 발주 처리
    const handleOrderFromSupplier = (supplier) => {
        alert(`${supplier.name}에 새 발주를 작성합니다.`);
    };

    // 권한이 없는 경우 메시지 표시
    if (!canViewSupply()) {
        return (
            <div className="text-center p-5">
                <h3>접근 권한이 없습니다</h3>
                <p className="text-muted">발주 관리 페이지를 볼 수 있는 권한이 없습니다.</p>
                <Button variant="primary" href="/">대시보드로 돌아가기</Button>
            </div>
        );
    }

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
                        {canCreateSupplyOrder() && (
                            <Button variant="primary" onClick={handleNewOrder}>+ 새 발주</Button>
                        )}
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
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        className="me-1"
                                        onClick={() => handleViewOrder(order)}
                                    >
                                        상세보기
                                    </Button>
                                    {canApproveSupplyOrder() && order.status === 'pending' && (
                                        <Button
                                            variant="success"
                                            size="sm"
                                            onClick={() => handleApproveOrder(order.id)}
                                        >
                                            승인
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {filteredOrders.length === 0 && (
                            <tr>
                                <td colSpan="8" className="text-center py-3">
                                    데이터가 없습니다.
                                </td>
                            </tr>
                        )}
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
                            <tr key={supplier.id}>
                                <td>{supplier.name}</td>
                                <td>{supplier.category}</td>
                                <td>{supplier.contactPerson}</td>
                                <td>{supplier.phone}</td>
                                <td>{supplier.email}</td>
                                <td>{'★'.repeat(Math.floor(supplier.rating)) + '☆'.repeat(5 - Math.floor(supplier.rating))} ({supplier.rating})</td>
                                <td>
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        className="me-1"
                                        onClick={() => handleViewSupplier(supplier)}
                                    >
                                        상세정보
                                    </Button>
                                    {canCreateSupplyOrder() && (
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => handleOrderFromSupplier(supplier)}
                                        >
                                            발주하기
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* 발주 상세 모달 */}
            <Modal show={showOrderModal} onHide={() => setShowOrderModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>발주 상세 정보</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentOrder && (
                        <div>
                            <Row className="mb-3">
                                <Col md={6}>
                                    <p><strong>발주번호:</strong> {currentOrder.id}</p>
                                    <p><strong>공급업체:</strong> {currentOrder.supplier}</p>
                                    <p><strong>발주일:</strong> {currentOrder.date}</p>
                                    <p><strong>예상 입고일:</strong> {currentOrder.deliveryDate}</p>
                                </Col>
                                <Col md={6}>
                                    <p><strong>품목:</strong> {currentOrder.items}</p>
                                    <p><strong>금액:</strong> ₩{currentOrder.total.toLocaleString()}</p>
                                    <p><strong>상태:</strong> {statusBadge(currentOrder.status)}</p>
                                    {currentOrder.notes && (
                                        <p><strong>비고:</strong> {currentOrder.notes}</p>
                                    )}
                                </Col>
                            </Row>
                            <hr />
                            <div className="d-flex justify-content-between">
                                <div>
                                    {/* 상태에 따른 추가 버튼 */}
                                    {canApproveSupplyOrder() && currentOrder.status === 'pending' && (
                                        <Button
                                            variant="success"
                                            className="me-2"
                                            onClick={() => {
                                                handleApproveOrder(currentOrder.id);
                                                setShowOrderModal(false);
                                            }}
                                        >
                                            발주 승인
                                        </Button>
                                    )}
                                    {canApproveSupplyOrder() && currentOrder.status === 'confirmed' && (
                                        <Button
                                            variant="primary"
                                            className="me-2"
                                            onClick={() => {
                                                setOrders(orders.map(order =>
                                                    order.id === currentOrder.id ? { ...order, status: 'shipping' } : order
                                                ));
                                                setCurrentOrder({ ...currentOrder, status: 'shipping' });
                                                alert('발주가 배송 중으로 변경되었습니다.');
                                            }}
                                        >
                                            배송 시작
                                        </Button>
                                    )}
                                    {canApproveSupplyOrder() && currentOrder.status === 'shipping' && (
                                        <Button
                                            variant="success"
                                            className="me-2"
                                            onClick={() => {
                                                setOrders(orders.map(order =>
                                                    order.id === currentOrder.id ? { ...order, status: 'completed' } : order
                                                ));
                                                setCurrentOrder({ ...currentOrder, status: 'completed' });
                                                alert('발주가 완료 처리되었습니다.');
                                            }}
                                        >
                                            입고 완료
                                        </Button>
                                    )}
                                </div>
                                {canCreateSupplyOrder() && currentOrder.status !== 'completed' && (
                                    <Button
                                        variant="danger"
                                        onClick={() => {
                                            if (window.confirm('이 발주를 취소하시겠습니까?')) {
                                                setOrders(orders.map(order =>
                                                    order.id === currentOrder.id ? { ...order, status: 'cancelled' } : order
                                                ));
                                                setCurrentOrder({ ...currentOrder, status: 'cancelled' });
                                                alert('발주가 취소되었습니다.');
                                                setShowOrderModal(false);
                                            }
                                        }}
                                    >
                                        발주 취소
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowOrderModal(false)}>
                        닫기
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* 공급업체 상세 모달 */}
            <Modal show={showSupplierModal} onHide={() => setShowSupplierModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>공급업체 상세 정보</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentSupplier && (
                        <div>
                            <h5 className="mb-3">{currentSupplier.name}</h5>
                            <p><strong>카테고리:</strong> {currentSupplier.category}</p>
                            <p><strong>담당자:</strong> {currentSupplier.contactPerson}</p>
                            <p><strong>연락처:</strong> {currentSupplier.phone}</p>
                            <p><strong>이메일:</strong> {currentSupplier.email}</p>
                            <p><strong>주소:</strong> {currentSupplier.address}</p>
                            <p>
                                <strong>평가:</strong> {' '}
                                {'★'.repeat(Math.floor(currentSupplier.rating)) + '☆'.repeat(5 - Math.floor(currentSupplier.rating))} ({currentSupplier.rating})
                            </p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowSupplierModal(false)}>
                        닫기
                    </Button>
                    {canCreateSupplyOrder() && currentSupplier && (
                        <Button
                            variant="primary"
                            onClick={() => {
                                setShowSupplierModal(false);
                                handleOrderFromSupplier(currentSupplier);
                            }}
                        >
                            발주하기
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default SupplyChainManagement;