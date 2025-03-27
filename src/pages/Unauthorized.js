import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Unauthorized() {
    const navigate = useNavigate();

    return (
        <Container className="vh-100 d-flex align-items-center justify-content-center">
            <Row className="w-100 justify-content-center">
                <Col xs={12} md={8} lg={6} xl={5}>
                    <Card className="shadow-lg">
                        <Card.Body className="p-5 text-center">
                            <div className="mb-4">
                                <i className="bi bi-lock-fill text-danger" style={{ fontSize: '3rem' }}></i>
                                <h2 className="mt-3 mb-2">접근 권한이 없습니다</h2>
                                <p className="text-muted">
                                    이 페이지를 볼 수 있는 권한이 없습니다.
                                    <br />
                                    접근 권한이 필요하시면 관리자에게 문의하세요.
                                </p>
                            </div>
                            <div className="d-grid gap-2">
                                <Button variant="primary" onClick={() => navigate('/')}>
                                    대시보드로 돌아가기
                                </Button>
                                <Button variant="outline-secondary" onClick={() => navigate(-1)}>
                                    이전 페이지로 돌아가기
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Unauthorized;