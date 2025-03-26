// src/pages/InventoryManagement.js
import React from 'react';
import { Card, Row, Col, Table, Button, Badge } from 'react-bootstrap';

function InventoryManagement() {
    // 예시 재고 부족 제품 데이터
    const lowStockProducts = [
        { id: 2, name: '클래식 데님 자켓', sku: 'JK-210-BL', currentStock: 8, safetyStock: 20, needed: 12 },
        { id: 4, name: '니트 스웨터 (그레이)', sku: 'SW-120-GR', currentStock: 3, safetyStock: 15, needed: 12 },
        { id: 5, name: '가죽 벨트 (블랙)', sku: 'BT-050-BK', currentStock: 0, safetyStock: 10, needed: 10 },
        { id: 7, name: '캐주얼 셔츠 (블루)', sku: 'SH-080-BL', currentStock: 5, safetyStock: 12, needed: 7 },
        { id: 9, name: '여성 블라우스', sku: 'BL-090-WH', currentStock: 6, safetyStock: 10, needed: 4 }
    ];

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
                                <h2>42</h2>
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
                                <h2>7</h2>
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
                                <h2>3</h2>
                                <small className="text-muted">제품</small>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="h-100 bg-primary">
                        <Card.Body className="d-flex align-items-center justify-content-center text-white">
                            <h5 className="mb-0">자동 발주 실행</h5>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* 재고 부족 제품 목록 */}
            <Card>
                <Card.Body>
                    <Card.Title>재고 부족 제품</Card.Title>
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
                                    {product.currentStock === 0 ? (
                                        <Badge bg="danger">품절</Badge>
                                    ) : (
                                        product.currentStock
                                    )}
                                </td>
                                <td>{product.safetyStock}</td>
                                <td>{product.needed}</td>
                                <td>
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

export default InventoryManagement;
