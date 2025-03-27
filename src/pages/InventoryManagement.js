import React, { useState } from 'react';
import { Card, Row, Col, Table, Button, Badge, Form, Modal, InputGroup } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

function InventoryManagement() {
    const {
        canManageInventory,
        canAdjustInventory,
        canCreateSupplyOrder
    } = useAuth();

    const [showAdjustModal, setShowAdjustModal] = useState(false);
    const [showSupplyModal, setShowSupplyModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [adjustmentQuantity, setAdjustmentQuantity] = useState(0);
    const [adjustmentReason, setAdjustmentReason] = useState('');
    const [supplyQuantity, setSupplyQuantity] = useState(0);

    // 예시 재고 데이터
    const [inventory, setInventory] = useState([
        { id: 1, name: '프리미엄 티셔츠 (화이트)', sku: 'TS-100-WH', currentStock: 124, safetyStock: 30, status: 'normal' },
        { id: 2, name: '클래식 데님 자켓', sku: 'JK-210-BL', currentStock: 8, safetyStock: 20, status: 'low' },
        { id: 3, name: '캐주얼 청바지', sku: 'PT-150-BL', currentStock: 42, safetyStock: 15, status: 'normal' },
        { id: 4, name: '니트 스웨터 (그레이)', sku: 'SW-120-GR', currentStock: 3, safetyStock: 15, status: 'low' },
        { id: 5, name: '가죽 벨트 (블랙)', sku: 'BT-050-BK', currentStock: 0, safetyStock: 10, status: 'out' },
        { id: 6, name: '여성 블라우스 (화이트)', sku: 'BL-090-WH', currentStock: 6, safetyStock: 10, status: 'low' },
        { id: 7, name: '캐주얼 셔츠 (블루)', sku: 'SH-080-BL', currentStock: 5, safetyStock: 12, status: 'low' },
    ]);

    // 재고 부족 제품 필터링
    const lowStockProducts = inventory.filter(item => item.status === 'low' || item.status === 'out');

    // 재고 조정 모달 열기
    const handleOpenAdjustModal = (product) => {
        setCurrentProduct(product);
        setAdjustmentQuantity(0);
        setAdjustmentReason('');
        setShowAdjustModal(true);
    };

    // 발주 모달 열기
    const handleOpenSupplyModal = (product) => {
        setCurrentProduct(product);
        setSupplyQuantity(product.safetyStock - product.currentStock);
        setShowSupplyModal(true);
    };

    // 재고 조정 처리
    const handleAdjustInventory = () => {
        if (!adjustmentReason) {
            alert('재고 조정 사유를 입력해주세요.');
            return;
        }

        // 새 재고 수량 계산
        const newStock = currentProduct.currentStock + parseInt(adjustmentQuantity);
        if (newStock < 0) {
            alert('재고 수량은 0 미만이 될 수 없습니다.');
            return;
        }

        // 재고 상태 결정
        let newStatus = 'normal';
        if (newStock === 0) {
            newStatus = 'out';
        } else if (newStock < currentProduct.safetyStock) {
            newStatus = 'low';
        }

        // 재고 업데이트
        setInventory(inventory.map(item =>
            item.id === currentProduct.id
                ? { ...item, currentStock: newStock, status: newStatus }
                : item
        ));

        alert(`${currentProduct.name}의 재고가 조정되었습니다. (${currentProduct.currentStock} → ${newStock})`);
        setShowAdjustModal(false);
    };

    // 자동 발주 실행
    const handleAutoOrder = () => {
        if (lowStockProducts.length === 0) {
            alert('재고 부족 제품이 없습니다.');
            return;
        }

        if (window.confirm(`${lowStockProducts.length}개의 제품에 대해 자동 발주를 실행하시겠습니까?`)) {
            alert('자동 발주가 실행되었습니다.');
        }
    };

    // 발주 처리
    const handleSupplyOrder = () => {
        if (!supplyQuantity || supplyQuantity <= 0) {
            alert('발주 수량을 올바르게 입력해주세요.');
            return;
        }

        alert(`${currentProduct.name} ${supplyQuantity}개 발주 요청이 생성되었습니다.`);
        setShowSupplyModal(false);
    };

    return (
        <div>
            <h2 className="mb-4">재고 관리</h2>

            {/* 재고 상태 요약 */}
            <Row className="mb-4">
                <Col md={3}>
                    <Card className="h-100 bg-success bg-opacity-10">
                        <Card.Body className="d-flex flex-column">
                            <Card.Title>정상 재고</Card.Title>
                            <div className="mt-auto">
                                <h2>{inventory.filter(item => item.status === 'normal').length}</h2>
                                <small className="text-muted">제품</small>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="h-100 bg-warning bg-opacity-10">
                        <Card.Body className="d-flex flex-column">
                            <Card.Title>재고 부족</Card.Title>
                            <div className="mt-auto">
                                <h2>{inventory.filter(item => item.status === 'low').length}</h2>
                                <small className="text-muted">제품</small>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="h-100 bg-danger bg-opacity-10">
                        <Card.Body className="d-flex flex-column">
                            <Card.Title>품절</Card.Title>
                            <div className="mt-auto">
                                <h2>{inventory.filter(item => item.status === 'out').length}</h2>
                                <small className="text-muted">제품</small>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    {canCreateSupplyOrder() ? (
                        <Card
                            className="h-100 bg-primary cursor-pointer"
                            onClick={handleAutoOrder}
                            style={{ cursor: 'pointer' }}
                        >
                            <Card.Body className="d-flex align-items-center justify-content-center text-white">
                                <h5 className="mb-0">자동 발주 실행</h5>
                            </Card.Body>
                        </Card>
                    ) : (
                        <Card className="h-100 bg-light">
                            <Card.Body className="d-flex align-items-center justify-content-center text-muted">
                                <h5 className="mb-0">발주 권한 없음</h5>
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>

            {/* 전체 재고 목록 */}
            <Card className="mb-4">
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <Card.Title>전체 재고 현황</Card.Title>
                        {canAdjustInventory() && (
                            <Button variant="outline-primary">
                                재고 일괄 업데이트
                            </Button>
                        )}
                    </div>

                    <Table responsive striped hover>
                        <thead>
                        <tr>
                            <th>제품명</th>
                            <th>SKU</th>
                            <th>현재 재고</th>
                            <th>안전 재고</th>
                            <th>상태</th>
                            <th>액션</th>
                        </tr>
                        </thead>
                        <tbody>
                        {inventory.map(product => (
                            <tr key={product.id}>
                                <td>{product.name}</td>
                                <td>{product.sku}</td>
                                <td>
                                    {product.status === 'out' ? (
                                        <Badge bg="danger">품절</Badge>
                                    ) : (
                                        product.currentStock
                                    )}
                                </td>
                                <td>{product.safetyStock}</td>
                                <td>
                                    {product.status === 'normal' && <Badge bg="success">정상</Badge>}
                                    {product.status === 'low' && <Badge bg="warning">부족</Badge>}
                                    {product.status === 'out' && <Badge bg="danger">품절</Badge>}
                                </td>
                                <td>
                                    {canAdjustInventory() && (
                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            className="me-1"
                                            onClick={() => handleOpenAdjustModal(product)}
                                        >
                                            재고조정
                                        </Button>
                                    )}

                                    {canCreateSupplyOrder() && (product.status === 'low' || product.status === 'out') && (
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => handleOpenSupplyModal(product)}
                                        >
                                            발주하기
                                        </Button>
                                    )}

                                    {!canAdjustInventory() && !canCreateSupplyOrder() && (
                                        <Badge bg="secondary">조회만 가능</Badge>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* 재고 부족 제품 목록 */}
            {lowStockProducts.length > 0 && (
                <Card>
                    <Card.Header className="bg-warning bg-opacity-10">
                        <h5 className="mb-0">재고 부족 제품</h5>
                    </Card.Header>
                    <Card.Body>
                        <Table responsive striped hover>
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
                                    <td>
                                        {product.status === 'out' ? (
                                            <Badge bg="danger">품절</Badge>
                                        ) : (
                                            product.currentStock
                                        )}
                                    </td>
                                    <td>{product.safetyStock}</td>
                                    <td>{product.safetyStock - product.currentStock}</td>
                                    <td>
                                        {canCreateSupplyOrder() ? (
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => handleOpenSupplyModal(product)}
                                            >
                                                발주하기
                                            </Button>
                                        ) : (
                                            <Badge bg="secondary">발주 권한 없음</Badge>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            )}

            {/* 재고 조정 모달 */}
            <Modal show={showAdjustModal} onHide={() => setShowAdjustModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>재고 조정 - {currentProduct?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentProduct && (
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>현재 재고</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={currentProduct.currentStock}
                                    disabled
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>조정 수량 (+ 입고, - 출고)</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={adjustmentQuantity}
                                    onChange={(e) => setAdjustmentQuantity(parseInt(e.target.value) || 0)}
                                />
                                <Form.Text className="text-muted">
                                    양수는 입고, 음수는 출고를 의미합니다.
                                </Form.Text>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>조정 후 재고</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={Math.max(0, currentProduct.currentStock + parseInt(adjustmentQuantity || 0))}
                                    disabled
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>조정 사유</Form.Label>
                                <Form.Select
                                    value={adjustmentReason}
                                    onChange={(e) => setAdjustmentReason(e.target.value)}
                                    required
                                >
                                    <option value="">-- 사유 선택 --</option>
                                    <option value="입고">신규 입고</option>
                                    <option value="반품">고객 반품</option>
                                    <option value="불량">제품 불량</option>
                                    <option value="재고조사">재고 실사</option>
                                    <option value="기타">기타</option>
                                </Form.Select>
                            </Form.Group>

                            {adjustmentReason === '기타' && (
                                <Form.Group className="mb-3">
                                    <Form.Label>상세 사유</Form.Label>
                                    <Form.Control as="textarea" rows={2} />
                                </Form.Group>
                            )}
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAdjustModal(false)}>
                        취소
                    </Button>
                    <Button variant="primary" onClick={handleAdjustInventory}>
                        저장
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* 발주 모달 */}
            <Modal show={showSupplyModal} onHide={() => setShowSupplyModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>발주 요청 - {currentProduct?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentProduct && (
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>제품 정보</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={`${currentProduct.name} (${currentProduct.sku})`}
                                    disabled
                                />
                            </Form.Group>

                            <Row className="mb-3">
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>현재 재고</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={currentProduct.currentStock}
                                            disabled
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>안전 재고</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={currentProduct.safetyStock}
                                            disabled
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-3">
                                <Form.Label>발주 수량</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={supplyQuantity}
                                    onChange={(e) => setSupplyQuantity(parseInt(e.target.value) || 0)}
                                    min="1"
                                />
                                <Form.Text className="text-muted">
                                    추천 발주 수량: {currentProduct.safetyStock - currentProduct.currentStock}
                                </Form.Text>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>공급업체</Form.Label>
                                <Form.Select>
                                    <option value="supplier1">대한의류</option>
                                    <option value="supplier2">정품패션</option>
                                    <option value="supplier3">우리원단</option>
                                    <option value="supplier4">한국섬유</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>요청 납기일</Form.Label>
                                <Form.Control
                                    type="date"
                                    defaultValue="2025-04-10"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>발주 비고</Form.Label>
                                <Form.Control as="textarea" rows={2} />
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowSupplyModal(false)}>
                        취소
                    </Button>
                    <Button variant="primary" onClick={handleSupplyOrder}>
                        발주 요청
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default InventoryManagement;