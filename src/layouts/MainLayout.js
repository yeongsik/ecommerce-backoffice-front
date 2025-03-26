// src/layouts/MainLayout.js
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from './Sidebar';

function MainLayout({ children }) {
    return (
        <Container fluid className="p-0">
            <Row className="vh-100 m-0">
                <Col xs={2} md={3} lg={2} className="bg-dark text-white p-0" style={{ minHeight: '100vh' }}>
                    <Sidebar />
                </Col>
                <Col xs={10} md={9} lg={10} className="p-3 bg-light">
                    {children}
                </Col>
            </Row>
        </Container>
    );
}

export default MainLayout;
