import React, {useState} from 'react';
import {Container, Row, Col, Card, Form, Button, Alert} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import {useAuth} from "../context/AuthContext";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const {login} = useAuth();

    // 로그인 처리 함수
    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('이메일과 비밀번호를 모두 입력해주세요.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // 여기서는 가상의 로그인 처리를 합니다.
            // 실제 구현에서는 API 요청을 통해 인증을 처리해야 합니다.
            await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 지연으로 로딩 상태 시뮬레이션

            // 테스트 계정 정보 (실제 구현에서는 API 응답으로 대체)
            const testAccounts = [
                { email: 'admin@example.com', password: 'password', role: 'admin', name: '관리자', id: 1 },
                { email: 'manager@example.com', password: 'password', role: 'manager', name: '매니저', id: 2 },
                { email: 'operator@example.com', password: 'password', role: 'operator', name: '운영자', id: 3 },
                { email: 'viewer@example.com', password: 'password', role: 'viewer', name: '조회자', id: 4 }
            ];

            // 계정 찾기
            const account = testAccounts.find(acc => acc.email === email && acc.password === password);

            if (account) {
                // 로그인 성공
                const userData = {
                    id: account.id,
                    name: account.name,
                    email: account.email,
                    role: account.role
                };
                // AuthContext의 login 함수 사용
                login('example-auth-token', userData);
                // 대시보드로 리다이렉트
                navigate('/');
            } else {
                // 로그인 실패
                setError('이메일 또는 비밀번호가 올바르지 않습니다.');
            }
        } catch (err) {
            setError('로그인 과정에서 오류가 발생했습니다. 다시 시도해주세요.');
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container className="vh-100 d-flex align-items-center justify-content-center">
            <Row className="w-100 justify-content-center">
                <Col xs={12} md={8} lg={6} xl={5}>
                    <Card className="shadow-lg">
                        <Card.Body className="p-5">
                            <div className="text-center mb-4">
                                <h2 className="fw-bold">브랜드 관리자</h2>
                                <p className="text-muted">계정 정보로 로그인하세요</p>
                            </div>

                            {error && <Alert variant="danger">{error}</Alert>}

                            <Form onSubmit={handleLogin}>
                                <Form.Group className="mb-3" controlId="email">
                                    <Form.Label>이메일</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="이메일을 입력하세요"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4" controlId="password">
                                    <Form.Label>비밀번호</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="비밀번호를 입력하세요"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <Form.Check
                                        type="checkbox"
                                        id="rememberMe"
                                        label="로그인 상태 유지"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <a href="#" className="text-primary text-decoration-none">비밀번호 찾기</a>
                                </div>

                                <div className="d-grid">
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        size="lg"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? '로그인 중...' : '로그인'}
                                    </Button>
                                </div>
                            </Form>

                            <div className="text-center mt-4">
                                <small className="text-muted">
                                    계정 문제가 있으신가요? <a href="#" className="text-primary">관리자에게 문의하세요</a>
                                </small>
                            </div>

                            {/* 테스트 계정 정보 (개발용) */}
                            <div className="mt-4 p-3 bg-light rounded">
                                <p className="mb-2 fw-bold">테스트 계정:</p>
                                <ul className="mb-0 ps-3">
                                    <li>관리자: admin@example.com / password</li>
                                    <li>매니저: manager@example.com / password</li>
                                    <li>운영자: operator@example.com / password</li>
                                    <li>조회자: viewer@example.com / password</li>
                                </ul>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;