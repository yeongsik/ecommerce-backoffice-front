// src/pages/ProductManagement.js
import React, { useState } from 'react';
import { Card, Table, Form, InputGroup, Button, Badge } from 'react-bootstrap';

function ProductManagement() {
    const [searchTerm, setSearchTerm] = useState('');

    // 예시 제품 데이터
    const products = [
        { id: 1, name: '프리미엄 티셔츠 (화이트)', sku: 'TS-100-WH', price: 32000, stock: 124, status: 'active' },
        { id: 2, name: '클래식 데님 자켓', sku: 'JK-210-BL', price: 89000, stock: 8, status: 'low_stock' },
        { id: 3, name: '캐주얼 청바지', sku: 'PT-150-BL', price: 58000, stock: 42, status: 'active' },
        { id: 4, name: '니트 스웨터 (그레이)', sku: 'SW-120-GR', price: 45000, stock: 3, status: 'low_stock' },
        { id: 5, name: '가죽 벨트 (블랙)', sku: 'BT-050-BK', price: 28000, stock: 0, status: 'out_of_stock' }
    ];

    // 검색어에 따라 필터링
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 상태에 따른 배지 색상
    const statusBadge = (status) => {
        switch(status) {
            case 'active':
                return <Badge bg="success">판매중</Badge>;
            case 'low_stock':
                return <Badge bg="warning">재고부족</Badge>;
            case 'out_of_stock':
                return <Badge bg="danger">품절</Badge>;
            default:
                return <Badge bg="secondary">기타</Badge>;
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>제품 관리</h2>
                <Button variant="primary">+ 제품 추가</Button>
            </div>

            <Card className="mb-4">
                <Card.Body>
                    <InputGroup className="mb-3">
                        <Form.Control
                            placeholder="제품명 또는 SKU로 검색..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button variant="outline-secondary">검색</Button>
                    </InputGroup>

                    <Table responsive striped hover>
                        <thead>
                        <tr>
                            <th>이미지</th>
                            <th>제품명</th>
                            <th>SKU</th>
                            <th>가격</th>
                            <th>재고</th>
                            <th>상태</th>
                            <th>관리</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredProducts.map(product => (
                            <tr key={product.id}>
                                <td>
                                    <div className="placeholder-img" style={{ width: '40px', height: '40px', backgroundColor: '#eee', borderRadius: '4px' }}></div>
                                </td>
                                <td>{product.name}</td>
                                <td>{product.sku}</td>
                                <td>₩{product.price.toLocaleString()}</td>
                                <td>{product.stock}</td>
                                <td>{statusBadge(product.status)}</td>
                                <td>
                                    <Button variant="outline-primary" size="sm">편집</Button>{' '}
                                    <Button variant="outline-danger" size="sm">삭제</Button>
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

export default ProductManagement;
