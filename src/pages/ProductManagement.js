import React, { useState } from 'react';
import { Card, Table, Form, InputGroup, Button, Badge, Modal, Row, Col } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

function ProductManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddEditModal, setShowAddEditModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);

    // 권한 정보 가져오기
    const {
        canCreateProduct,
        canEditProduct,
        canDeleteProduct
    } = useAuth();

    // 예시 제품 데이터
    const [products, setProducts] = useState([
        { id: 1, name: '프리미엄 티셔츠 (화이트)', sku: 'TS-100-WH', price: 32000, stock: 124, status: 'active', category: '의류' },
        { id: 2, name: '클래식 데님 자켓', sku: 'JK-210-BL', price: 89000, stock: 8, status: 'low_stock', category: '의류' },
        { id: 3, name: '캐주얼 청바지', sku: 'PT-150-BL', price: 58000, stock: 42, status: 'active', category: '의류' },
        { id: 4, name: '니트 스웨터 (그레이)', sku: 'SW-120-GR', price: 45000, stock: 3, status: 'low_stock', category: '의류' },
        { id: 5, name: '가죽 벨트 (블랙)', sku: 'BT-050-BK', price: 28000, stock: 0, status: 'out_of_stock', category: '액세서리' }
    ]);

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

    // 모달 열기 - 추가 또는 편집
    const handleOpenModal = (product = null) => {
        setCurrentProduct(product);
        setShowAddEditModal(true);
    };

    // 모달 닫기
    const handleCloseModal = () => {
        setShowAddEditModal(false);
        setCurrentProduct(null);
    };

    // 제품 저장
    const handleSaveProduct = (event) => {
        event.preventDefault();
        const form = event.currentTarget;

        // 폼 데이터 가져오기
        const productData = {
            name: form.productName.value,
            sku: form.sku.value,
            price: parseInt(form.price.value),
            stock: parseInt(form.stock.value),
            status: form.status.value,
            category: form.category.value
        };

        if (currentProduct) {
            // 기존 제품 수정
            setProducts(products.map(p =>
                p.id === currentProduct.id ? { ...productData, id: currentProduct.id } : p
            ));
        } else {
            // 새 제품 추가
            const newId = Math.max(...products.map(p => p.id)) + 1;
            setProducts([...products, { ...productData, id: newId }]);
        }

        handleCloseModal();
    };

    // 제품 삭제
    const handleDeleteProduct = (id) => {
        if (window.confirm('정말 이 제품을 삭제하시겠습니까?')) {
            setProducts(products.filter(p => p.id !== id));
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>제품 관리</h2>
                {canCreateProduct() && (
                    <Button variant="primary" onClick={() => handleOpenModal()}>+ 제품 추가</Button>
                )}
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
                            <th>카테고리</th>
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
                                <td>{product.category}</td>
                                <td>₩{product.price.toLocaleString()}</td>
                                <td>{product.stock}</td>
                                <td>{statusBadge(product.status)}</td>
                                <td>
                                    {canEditProduct() && (
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            className="me-1"
                                            onClick={() => handleOpenModal(product)}
                                        >
                                            편집
                                        </Button>
                                    )}
                                    {canDeleteProduct() && (
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleDeleteProduct(product.id)}
                                        >
                                            삭제
                                        </Button>
                                    )}
                                    {!canEditProduct() && !canDeleteProduct() && (
                                        <Button variant="outline-secondary" size="sm">상세보기</Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {filteredProducts.length === 0 && (
                            <tr>
                                <td colSpan="8" className="text-center py-3">검색 결과가 없습니다.</td>
                            </tr>
                        )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* 제품 추가/편집 모달 */}
            <Modal show={showAddEditModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {currentProduct ? '제품 편집' : '새 제품 추가'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSaveProduct}>
                    <Modal.Body>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group controlId="productName">
                                    <Form.Label>제품명</Form.Label>
                                    <Form.Control
                                        type="text"
                                        defaultValue={currentProduct?.name || ''}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="sku">
                                    <Form.Label>SKU</Form.Label>
                                    <Form.Control
                                        type="text"
                                        defaultValue={currentProduct?.sku || ''}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group controlId="category">
                                    <Form.Label>카테고리</Form.Label>
                                    <Form.Select
                                        defaultValue={currentProduct?.category || '의류'}
                                        required
                                    >
                                        <option value="의류">의류</option>
                                        <option value="신발">신발</option>
                                        <option value="액세서리">액세서리</option>
                                        <option value="가방">가방</option>
                                        <option value="홈웨어">홈웨어</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="price">
                                    <Form.Label>가격</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text>₩</InputGroup.Text>
                                        <Form.Control
                                            type="number"
                                            defaultValue={currentProduct?.price || ''}
                                            required
                                            min="0"
                                        />
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group controlId="stock">
                                    <Form.Label>재고 수량</Form.Label>
                                    <Form.Control
                                        type="number"
                                        defaultValue={currentProduct?.stock || 0}
                                        required
                                        min="0"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="status">
                                    <Form.Label>상태</Form.Label>
                                    <Form.Select
                                        defaultValue={currentProduct?.status || 'active'}
                                        required
                                    >
                                        <option value="active">판매중</option>
                                        <option value="low_stock">재고부족</option>
                                        <option value="out_of_stock">품절</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group controlId="productImage" className="mb-3">
                            <Form.Label>제품 이미지</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                            />
                            <Form.Text className="text-muted">
                                이미지는 500x500 픽셀 이상의 크기를 권장합니다.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="description">
                            <Form.Label>제품 설명</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                defaultValue={currentProduct?.description || ''}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            취소
                        </Button>
                        <Button variant="primary" type="submit">
                            저장
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
}

export default ProductManagement;