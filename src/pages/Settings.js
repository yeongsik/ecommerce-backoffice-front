import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Nav, Tab, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

function Settings() {
    const [validated, setValidated] = useState(false);
    const [currentTab, setCurrentTab] = useState('account');
    const [passwordError, setPasswordError] = useState('');

    // 권한 정보 가져오기
    const {
        canViewSettings,
        canChangeSettings,
        currentUser
    } = useAuth();

    useEffect(() => {
        // 권한에 따라 적절한 탭을 기본 선택
        if (!canChangeSettings() && canViewSettings()) {
            setCurrentTab('account'); // 읽기 전용 사용자는 계정 정보 탭만 볼 수 있음
        }
    }, [canChangeSettings, canViewSettings]);

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();

        // 변경 권한 체크
        if (!canChangeSettings()) {
            alert('설정을 변경할 권한이 없습니다.');
            return;
        }

        if (form.checkValidity() === false) {
            event.stopPropagation();
            setValidated(true);
            return;
        }

        // 비밀번호 변경 폼인 경우 비밀번호 유효성 검사
        if (event.target.id === 'password-form') {
            const currentPassword = form.elements['current-password'].value;
            const newPassword = form.elements['new-password'].value;
            const confirmPassword = form.elements['confirm-password'].value;

            if (newPassword !== confirmPassword) {
                setPasswordError('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
                return;
            }

            const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
            if (newPassword.length < 8 || !specialChars.test(newPassword)) {
                setPasswordError('새 비밀번호는 8자 이상이어야 하며 특수문자를 포함해야 합니다.');
                return;
            }

            // 실제로는 API를 호출하여 비밀번호 변경 요청
            alert('비밀번호가 변경되었습니다.');
            form.reset();
            setPasswordError('');
            return;
        }

        // 일반 폼 제출 처리
        alert('설정이 저장되었습니다.');
        setValidated(false);
    };

    // 권한이 없는 경우 메시지 표시
    if (!canViewSettings()) {
        return (
            <div className="text-center p-5">
                <h3>접근 권한이 없습니다</h3>
                <p className="text-muted">설정 페이지를 볼 수 있는 권한이 없습니다.</p>
                <Button variant="primary" href="/">대시보드로 돌아가기</Button>
            </div>
        );
    }

    return (
        <div>
            <h2 className="mb-4">설정</h2>

            {!canChangeSettings() && (
                <Alert variant="info" className="mb-4">
                    <Alert.Heading>읽기 전용 모드</Alert.Heading>
                    <p className="mb-0">현재 권한으로는 설정을 조회만 할 수 있으며 변경할 수 없습니다. 설정 변경이 필요하시면 관리자에게 문의하세요.</p>
                </Alert>
            )}

            <Tab.Container id="settings-tabs" activeKey={currentTab} onSelect={key => setCurrentTab(key)}>
                <Row>
                    <Col md={3}>
                        <Card className="mb-4 mb-md-0">
                            <Card.Body className="p-0">
                                <Nav variant="pills" className="flex-column">
                                    <Nav.Item>
                                        <Nav.Link eventKey="account">계정 정보</Nav.Link>
                                    </Nav.Item>
                                    {/* 관리자와 매니저만 브랜드 설정에 접근 가능 */}
                                    {['admin', 'manager'].includes(currentUser?.role) && (
                                        <Nav.Item>
                                            <Nav.Link eventKey="brand">브랜드 설정</Nav.Link>
                                        </Nav.Item>
                                    )}
                                    {/* 변경 권한이 있는 사용자만 알림 설정에 접근 가능 */}
                                    {canChangeSettings() && (
                                        <Nav.Item>
                                            <Nav.Link eventKey="notification">알림 설정</Nav.Link>
                                        </Nav.Item>
                                    )}
                                    {/* 관리자만 연동 설정에 접근 가능 */}
                                    {currentUser?.role === 'admin' && (
                                        <Nav.Item>
                                            <Nav.Link eventKey="integration">연동 설정</Nav.Link>
                                        </Nav.Item>
                                    )}
                                    {/* 모든 사용자가 보안 설정에 접근 가능 */}
                                    <Nav.Item>
                                        <Nav.Link eventKey="security">보안 설정</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={9}>
                        <Card>
                            <Card.Body>
                                <Tab.Content>
                                    {/* 계정 정보 설정 */}
                                    <Tab.Pane eventKey="account">
                                        <h4 className="mb-4">계정 정보</h4>
                                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                            <Row className="mb-3">
                                                <Col md={6}>
                                                    <Form.Group controlId="name">
                                                        <Form.Label>이름</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            defaultValue={currentUser?.name || "홍길동"}
                                                            required
                                                            disabled={!canChangeSettings()}
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            이름을 입력해주세요.
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group controlId="email">
                                                        <Form.Label>이메일</Form.Label>
                                                        <Form.Control
                                                            type="email"
                                                            defaultValue={currentUser?.email || "hong@example.com"}
                                                            required
                                                            disabled={!canChangeSettings()}
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            유효한 이메일을 입력해주세요.
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                </Col>
                                            </Row>

                                            <Row className="mb-3">
                                                <Col md={6}>
                                                    <Form.Group controlId="phone">
                                                        <Form.Label>연락처</Form.Label>
                                                        <Form.Control
                                                            type="tel"
                                                            defaultValue="010-1234-5678"
                                                            disabled={!canChangeSettings()}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group controlId="position">
                                                        <Form.Label>직책</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            defaultValue="브랜드 매니저"
                                                            disabled={!canChangeSettings()}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>

                                            {canChangeSettings() && (
                                                <div className="d-flex justify-content-end">
                                                    <Button type="submit" variant="primary">저장</Button>
                                                </div>
                                            )}
                                        </Form>
                                    </Tab.Pane>

                                    {/* 브랜드 설정 */}
                                    <Tab.Pane eventKey="brand">
                                        <h4 className="mb-4">브랜드 설정</h4>
                                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                            <Row className="mb-3">
                                                <Col md={6}>
                                                    <Form.Group controlId="brandName">
                                                        <Form.Label>브랜드명</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            defaultValue="패션 브랜드"
                                                            required
                                                            disabled={!canChangeSettings()}
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            브랜드명을 입력해주세요.
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group controlId="businessNumber">
                                                        <Form.Label>사업자등록번호</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            defaultValue="123-45-67890"
                                                            required
                                                            disabled={!canChangeSettings() || currentUser?.role !== 'admin'}
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            사업자등록번호를 입력해주세요.
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                </Col>
                                            </Row>

                                            <Form.Group className="mb-3" controlId="address">
                                                <Form.Label>주소</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    defaultValue="서울특별시 강남구 테헤란로 123"
                                                    required
                                                    disabled={!canChangeSettings()}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    주소를 입력해주세요.
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="logo">
                                                <Form.Label>로고 이미지</Form.Label>
                                                <Form.Control
                                                    type="file"
                                                    disabled={!canChangeSettings()}
                                                />
                                                <Form.Text className="text-muted">
                                                    PNG, JPG 파일. 최대 크기 2MB
                                                </Form.Text>
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="description">
                                                <Form.Label>브랜드 소개</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={3}
                                                    defaultValue="2022년에 설립된 당사는 고품질의 패션 제품을 제공하는 브랜드입니다."
                                                    disabled={!canChangeSettings()}
                                                />
                                            </Form.Group>

                                            {canChangeSettings() && (
                                                <div className="d-flex justify-content-end">
                                                    <Button type="submit" variant="primary">저장</Button>
                                                </div>
                                            )}
                                        </Form>
                                    </Tab.Pane>

                                    {/* 알림 설정 */}
                                    <Tab.Pane eventKey="notification">
                                        <h4 className="mb-4">알림 설정</h4>
                                        <Form onSubmit={handleSubmit}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>이메일 알림</Form.Label>
                                                <div>
                                                    <Form.Check
                                                        type="switch"
                                                        id="email-order"
                                                        label="새 주문"
                                                        defaultChecked
                                                        className="mb-2"
                                                        disabled={!canChangeSettings()}
                                                    />
                                                    <Form.Check
                                                        type="switch"
                                                        id="email-stock"
                                                        label="재고 부족"
                                                        defaultChecked
                                                        className="mb-2"
                                                        disabled={!canChangeSettings()}
                                                    />
                                                    <Form.Check
                                                        type="switch"
                                                        id="email-return"
                                                        label="반품 요청"
                                                        defaultChecked
                                                        className="mb-2"
                                                        disabled={!canChangeSettings()}
                                                    />
                                                    <Form.Check
                                                        type="switch"
                                                        id="email-report"
                                                        label="일일 리포트"
                                                        className="mb-2"
                                                        disabled={!canChangeSettings()}
                                                    />
                                                </div>
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label>SMS 알림</Form.Label>
                                                <div>
                                                    <Form.Check
                                                        type="switch"
                                                        id="sms-order"
                                                        label="새 주문"
                                                        className="mb-2"
                                                        disabled={!canChangeSettings()}
                                                    />
                                                    <Form.Check
                                                        type="switch"
                                                        id="sms-stock"
                                                        label="재고 부족"
                                                        defaultChecked
                                                        className="mb-2"
                                                        disabled={!canChangeSettings()}
                                                    />
                                                    <Form.Check
                                                        type="switch"
                                                        id="sms-return"
                                                        label="반품 요청"
                                                        className="mb-2"
                                                        disabled={!canChangeSettings()}
                                                    />
                                                </div>
                                            </Form.Group>

                                            {canChangeSettings() && (
                                                <div className="d-flex justify-content-end">
                                                    <Button type="submit" variant="primary">저장</Button>
                                                </div>
                                            )}
                                        </Form>
                                    </Tab.Pane>

                                    {/* 연동 설정 */}
                                    <Tab.Pane eventKey="integration">
                                        <h4 className="mb-4">연동 설정</h4>
                                        <div className="mb-4">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <div>
                                                    <h5>쇼핑몰 연동</h5>
                                                    <p className="text-muted mb-0">온라인 쇼핑몰과 재고 및 주문 데이터를 연동합니다.</p>
                                                </div>
                                                <Form.Check
                                                    type="switch"
                                                    id="shopify-integration"
                                                    defaultChecked
                                                    disabled={!canChangeSettings()}
                                                />
                                            </div>
                                            <Card className="bg-light">
                                                <Card.Body>
                                                    <Form.Group className="mb-3" controlId="shopify-api">
                                                        <Form.Label>API 키</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            defaultValue="sh_a1b2c3d4e5f6g7h8i9j0"
                                                            disabled={!canChangeSettings()}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group controlId="shopify-domain">
                                                        <Form.Label>쇼핑몰 도메인</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            defaultValue="example-store.myshopify.com"
                                                            disabled={!canChangeSettings()}
                                                        />
                                                    </Form.Group>
                                                </Card.Body>
                                            </Card>
                                        </div>

                                        <div className="mb-4">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <div>
                                                    <h5>회계 시스템 연동</h5>
                                                    <p className="text-muted mb-0">회계 시스템과 매출 및 비용 데이터를 연동합니다.</p>
                                                </div>
                                                <Form.Check
                                                    type="switch"
                                                    id="accounting-integration"
                                                    disabled={!canChangeSettings()}
                                                />
                                            </div>
                                            <Card className="bg-light">
                                                <Card.Body>
                                                    <Form.Group className="mb-3" controlId="accounting-api">
                                                        <Form.Label>API 키</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="회계 시스템 API 키 입력"
                                                            disabled={!canChangeSettings()}
                                                        />
                                                    </Form.Group>
                                                </Card.Body>
                                            </Card>
                                        </div>

                                        {canChangeSettings() && (
                                            <div className="d-flex justify-content-end">
                                                <Button type="button" variant="primary">저장</Button>
                                            </div>
                                        )}
                                    </Tab.Pane>

                                    {/* 보안 설정 */}
                                    <Tab.Pane eventKey="security">
                                        <h4 className="mb-4">보안 설정</h4>

                                        {/* 비밀번호 변경 폼 - 모든 사용자 접근 가능 */}
                                        <Form id="password-form" noValidate validated={validated} onSubmit={handleSubmit}>
                                            <Form.Group className="mb-4" controlId="password">
                                                <Form.Label>비밀번호 변경</Form.Label>
                                                {passwordError && (
                                                    <Alert variant="danger">{passwordError}</Alert>
                                                )}
                                                <Row>
                                                    <Col md={12} className="mb-3">
                                                        <Form.Control
                                                            name="current-password"
                                                            type="password"
                                                            placeholder="현재 비밀번호"
                                                            required
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            현재 비밀번호를 입력해주세요.
                                                        </Form.Control.Feedback>
                                                    </Col>
                                                    <Col md={6} className="mb-3">
                                                        <Form.Control
                                                            name="new-password"
                                                            type="password"
                                                            placeholder="새 비밀번호"
                                                            required
                                                            onChange={() => setPasswordError('')}
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            새 비밀번호를 입력해주세요.
                                                        </Form.Control.Feedback>
                                                        <Form.Text className="text-muted">
                                                            8자 이상, 특수문자 포함
                                                        </Form.Text>
                                                    </Col>
                                                    <Col md={6} className="mb-3">
                                                        <Form.Control
                                                            name="confirm-password"
                                                            type="password"
                                                            placeholder="새 비밀번호 확인"
                                                            required
                                                            onChange={() => setPasswordError('')}
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            비밀번호를 다시 입력해주세요.
                                                        </Form.Control.Feedback>
                                                    </Col>
                                                </Row>
                                                <Button variant="primary" type="submit">비밀번호 변경</Button>
                                            </Form.Group>
                                        </Form>

                                        <hr />

                                        {/* 2단계 인증 - 모든 사용자 접근 가능 */}
                                        <Form.Group className="mb-4">
                                            <Form.Label>2단계 인증</Form.Label>
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <div>
                                                    <p className="text-muted mb-0">로그인 시 2단계 인증을 사용합니다.</p>
                                                </div>
                                                <Form.Check
                                                    type="switch"
                                                    id="2fa-toggle"
                                                    defaultChecked
                                                />
                                            </div>
                                            <Button variant="outline-primary" className="mt-2">2단계 인증 재설정</Button>
                                        </Form.Group>

                                        <hr />

                                        {/* 로그인 활동 - 읽기 전용 */}
                                        <Form.Group className="mb-4">
                                            <Form.Label>로그인 활동</Form.Label>
                                            <p className="text-muted">최근 로그인 기록</p>
                                            <div className="bg-light p-3 rounded mb-3">
                                                <div className="d-flex justify-content-between">
                                                    <div>
                                                        <strong>Chrome - Windows</strong>
                                                        <div className="text-muted">서울, 대한민국</div>
                                                    </div>
                                                    <div className="text-muted">오늘 09:45</div>
                                                </div>
                                            </div>
                                            <div className="bg-light p-3 rounded mb-3">
                                                <div className="d-flex justify-content-between">
                                                    <div>
                                                        <strong>Safari - macOS</strong>
                                                        <div className="text-muted">서울, 대한민국</div>
                                                    </div>
                                                    <div className="text-muted">어제 15:32</div>
                                                </div>
                                            </div>
                                            <Button variant="link" className="p-0">모든 세션 종료</Button>
                                        </Form.Group>

                                        <hr />

                                        {/* 계정 삭제 - 관리자만 접근 가능 */}
                                        {currentUser?.role === 'admin' && (
                                            <div className="mt-4">
                                                <h5 className="text-danger">계정 삭제</h5>
                                                <p className="text-muted">
                                                    계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
                                                </p>
                                                <Button
                                                    variant="outline-danger"
                                                    onClick={() => {
                                                        if (window.confirm('정말 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
                                                            alert('계정 삭제가 요청되었습니다.');
                                                        }
                                                    }}
                                                >
                                                    계정 삭제
                                                </Button>
                                            </div>
                                        )}
                                    </Tab.Pane>
                                </Tab.Content>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Tab.Container>
        </div>
    );
}

export default Settings;