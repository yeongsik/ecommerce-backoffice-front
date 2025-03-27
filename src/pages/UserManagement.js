import React, { useState } from 'react';
import { Card, Table, Button, Form, Modal, Row, Col, Badge, InputGroup, FormControl } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

function UserManagement() {
    // 권한 정보 가져오기
    const {
        canViewUsers,
        canCreateUser,
        canEditUser,
        canDeleteUser,
        currentUser
    } = useAuth();

    const [users, setUsers] = useState([
        { id: 1, name: '홍길동', email: 'hong@example.com', role: 'admin', department: '경영관리', status: 'active', lastActive: '2025-03-27 10:15' },
        { id: 2, name: '김민수', email: 'kim@example.com', role: 'manager', department: '마케팅', status: 'active', lastActive: '2025-03-26 16:22' },
        { id: 3, name: '이영희', email: 'lee@example.com', role: 'operator', department: '재고관리', status: 'active', lastActive: '2025-03-27 09:35' },
        { id: 4, name: '박철수', email: 'park@example.com', role: 'operator', department: '고객서비스', status: 'active', lastActive: '2025-03-25 14:45' },
        { id: 5, name: '정지훈', email: 'jung@example.com', role: 'viewer', department: '재무', status: 'inactive', lastActive: '2025-03-20 11:18' },
    ]);

    const [showModal, setShowModal] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [passwordError, setPasswordError] = useState('');

    // 역할에 따른 배지 색상
    const roleBadge = (role) => {
        switch(role) {
            case 'admin':
                return <Badge bg="danger">관리자</Badge>;
            case 'manager':
                return <Badge bg="primary">매니저</Badge>;
            case 'operator':
                return <Badge bg="success">운영자</Badge>;
            case 'viewer':
                return <Badge bg="secondary">조회자</Badge>;
            default:
                return <Badge bg="light">기타</Badge>;
        }
    };

    // 상태에 따른 배지 색상
    const statusBadge = (status) => {
        switch(status) {
            case 'active':
                return <Badge bg="success">활성</Badge>;
            case 'inactive':
                return <Badge bg="secondary">비활성</Badge>;
            default:
                return <Badge bg="light">기타</Badge>;
        }
    };

    // 유저 생성 또는 수정
    const handleSaveUser = (event) => {
        event.preventDefault();
        const form = event.target;

        // 새 사용자 추가 시 비밀번호 검증
        if (!editUser) {
            if (form.password.value.length < 8) {
                setPasswordError('비밀번호는 8자 이상이어야 합니다.');
                return;
            }
            if (form.password.value !== form.confirmPassword.value) {
                setPasswordError('비밀번호가 일치하지 않습니다.');
                return;
            }
            const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
            if (!specialChars.test(form.password.value)) {
                setPasswordError('비밀번호에는 특수 문자가 포함되어야 합니다.');
                return;
            }
        }

        const userData = {
            name: form.name.value,
            email: form.email.value,
            role: form.role.value,
            department: form.department.value,
            status: form.status.value,
            lastActive: editUser ? editUser.lastActive : new Date().toLocaleString()
        };

        if (editUser) {
            // 기존 사용자 수정
            setUsers(users.map(user => user.id === editUser.id ? { ...userData, id: editUser.id } : user));
        } else {
            // 새 사용자 추가
            const newId = Math.max(...users.map(user => user.id)) + 1;
            setUsers([...users, { ...userData, id: newId }]);
        }

        setShowModal(false);
        setEditUser(null);
        setPasswordError('');
    };

    // 유저 편집 모달 열기
    const handleEditUser = (user) => {
        // 자신보다 높은 권한의 사용자는 편집 불가능
        if (currentUser.role !== 'admin' && user.role === 'admin') {
            alert('관리자 계정은 수정할 수 없습니다.');
            return;
        }

        setEditUser(user);
        setShowModal(true);
    };

    // 새 유저 추가 모달 열기
    const handleAddUser = () => {
        setEditUser(null);
        setPasswordError('');
        setShowModal(true);
    };

    // 유저 삭제
    const handleDeleteUser = (userId) => {
        const userToDelete = users.find(user => user.id === userId);

        // 관리자는 삭제 불가
        if (userToDelete.role === 'admin') {
            alert('관리자 계정은 삭제할 수 없습니다.');
            return;
        }

        // 자기 자신은 삭제 불가
        if (currentUser.id === userId) {
            alert('자신의 계정은 삭제할 수 없습니다.');
            return;
        }

        if (window.confirm('정말 이 사용자를 삭제하시겠습니까?')) {
            setUsers(users.filter(user => user.id !== userId));
        }
    };

    // 검색에 따른 유저 필터링
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 사용자가 볼 수 있는 권한이 없는 경우
    if (!canViewUsers()) {
        return (
            <div className="text-center p-5">
                <h3>접근 권한이 없습니다</h3>
                <p className="text-muted">사용자 관리 페이지를 볼 수 있는 권한이 없습니다.</p>
                <Button variant="primary" href="/">대시보드로 돌아가기</Button>
            </div>
        );
    }

    return (
        <div>
            <h2 className="mb-4">사용자 관리</h2>

            <Card className="mb-4">
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <Card.Title>사용자 목록</Card.Title>
                        <div className="d-flex">
                            <InputGroup className="me-2" style={{ width: '300px' }}>
                                <FormControl
                                    placeholder="이름, 이메일 또는 부서로 검색..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Button variant="outline-secondary">검색</Button>
                            </InputGroup>
                            {canCreateUser() && (
                                <Button variant="primary" onClick={handleAddUser}>
                                    <i className="bi bi-plus"></i> 사용자 추가
                                </Button>
                            )}
                        </div>
                    </div>

                    <Table responsive striped hover>
                        <thead>
                        <tr>
                            <th>이름</th>
                            <th>이메일</th>
                            <th>역할</th>
                            <th>부서</th>
                            <th>상태</th>
                            <th>마지막 활동</th>
                            <th>관리</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{roleBadge(user.role)}</td>
                                <td>{user.department}</td>
                                <td>{statusBadge(user.status)}</td>
                                <td>{user.lastActive}</td>
                                <td>
                                    {canEditUser() && (
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={() => handleEditUser(user)}
                                            className="me-1"
                                            disabled={user.role === 'admin' && currentUser.role !== 'admin'}
                                        >
                                            편집
                                        </Button>
                                    )}
                                    {canDeleteUser() && (
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleDeleteUser(user.id)}
                                            disabled={user.role === 'admin' || user.id === currentUser.id}
                                        >
                                            삭제
                                        </Button>
                                    )}
                                    {!canEditUser() && !canDeleteUser() && (
                                        <Badge bg="secondary">권한 없음</Badge>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {filteredUsers.length === 0 && (
                            <tr>
                                <td colSpan="7" className="text-center py-3">
                                    검색 결과가 없습니다.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <Row className="mb-4">
                <Col md={4}>
                    <Card className="h-100 bg-info bg-opacity-10">
                        <Card.Body>
                            <Card.Title>사용자 통계</Card.Title>
                            <div className="mt-3">
                                <div className="d-flex justify-content-between mb-2">
                                    <span>전체 사용자</span>
                                    <strong>{users.length}</strong>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>활성 사용자</span>
                                    <strong>{users.filter(user => user.status === 'active').length}</strong>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>비활성 사용자</span>
                                    <strong>{users.filter(user => user.status === 'inactive').length}</strong>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="h-100 bg-primary bg-opacity-10">
                        <Card.Body>
                            <Card.Title>역할별 분포</Card.Title>
                            <div className="mt-3">
                                <div className="d-flex justify-content-between mb-2">
                                    <span>관리자</span>
                                    <strong>{users.filter(user => user.role === 'admin').length}</strong>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>매니저</span>
                                    <strong>{users.filter(user => user.role === 'manager').length}</strong>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>운영자</span>
                                    <strong>{users.filter(user => user.role === 'operator').length}</strong>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>조회자</span>
                                    <strong>{users.filter(user => user.role === 'viewer').length}</strong>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="h-100 bg-success bg-opacity-10">
                        <Card.Body>
                            <Card.Title>부서별 분포</Card.Title>
                            <div className="mt-3">
                                {Array.from(new Set(users.map(user => user.department))).map(dept => (
                                    <div className="d-flex justify-content-between mb-2" key={dept}>
                                        <span>{dept}</span>
                                        <strong>{users.filter(user => user.department === dept).length}</strong>
                                    </div>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* 사용자 추가/편집 모달 */}
            <Modal show={showModal} onHide={() => {setShowModal(false); setPasswordError('');}}>
                <Form onSubmit={handleSaveUser}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editUser ? '사용자 편집' : '새 사용자 추가'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="mb-3">
                            <Col>
                                <Form.Group controlId="name">
                                    <Form.Label>이름</Form.Label>
                                    <Form.Control
                                        type="text"
                                        defaultValue={editUser ? editUser.name : ''}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="email">
                                    <Form.Label>이메일</Form.Label>
                                    <Form.Control
                                        type="email"
                                        defaultValue={editUser ? editUser.email : ''}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col>
                                <Form.Group controlId="role">
                                    <Form.Label>역할</Form.Label>
                                    <Form.Select
                                        defaultValue={editUser ? editUser.role : 'operator'}
                                        disabled={currentUser.role !== 'admin' && (editUser?.role === 'admin' || editUser?.role === 'manager')}
                                    >
                                        {/* 관리자만 관리자와 매니저 역할 할당 가능 */}
                                        {currentUser.role === 'admin' && (
                                            <>
                                                <option value="admin">관리자</option>
                                                <option value="manager">매니저</option>
                                            </>
                                        )}
                                        <option value="operator">운영자</option>
                                        <option value="viewer">조회자</option>
                                    </Form.Select>
                                    {currentUser.role !== 'admin' && editUser?.role === 'admin' && (
                                        <Form.Text className="text-muted">
                                            관리자 계정의 역할은 변경할 수 없습니다.
                                        </Form.Text>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="department">
                                    <Form.Label>부서</Form.Label>
                                    <Form.Select defaultValue={editUser ? editUser.department : '재고관리'}>
                                        <option value="경영관리">경영관리</option>
                                        <option value="마케팅">마케팅</option>
                                        <option value="재고관리">재고관리</option>
                                        <option value="고객서비스">고객서비스</option>
                                        <option value="재무">재무</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group controlId="status" className="mb-3">
                            <Form.Label>상태</Form.Label>
                            <Form.Select
                                defaultValue={editUser ? editUser.status : 'active'}
                                disabled={currentUser.role !== 'admin' && editUser?.role === 'admin'}
                            >
                                <option value="active">활성</option>
                                <option value="inactive">비활성</option>
                            </Form.Select>
                            {currentUser.role !== 'admin' && editUser?.role === 'admin' && (
                                <Form.Text className="text-muted">
                                    관리자 계정의 상태는 변경할 수 없습니다.
                                </Form.Text>
                            )}
                        </Form.Group>

                        {!editUser && (
                            <div>
                                <hr />
                                <h6>초기 비밀번호 설정</h6>
                                {passwordError && (
                                    <div className="alert alert-danger">{passwordError}</div>
                                )}
                                <Form.Group controlId="password" className="mb-3">
                                    <Form.Label>비밀번호</Form.Label>
                                    <Form.Control
                                        type="password"
                                        required={!editUser}
                                        onChange={() => setPasswordError('')}
                                    />
                                    <Form.Text className="text-muted">
                                        8자 이상, 특수문자 포함
                                    </Form.Text>
                                </Form.Group>
                                <Form.Group controlId="confirmPassword">
                                    <Form.Label>비밀번호 확인</Form.Label>
                                    <Form.Control
                                        type="password"
                                        required={!editUser}
                                        onChange={() => setPasswordError('')}
                                    />
                                </Form.Group>
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => {setShowModal(false); setPasswordError('');}}>
                            취소
                        </Button>
                        <Button variant="primary" type="submit">
                            저장
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            <Card>
                <Card.Body>
                    <Card.Title>접근 권한 설명</Card.Title>
                    <Table responsive>
                        <thead>
                        <tr>
                            <th>역할</th>
                            <th>설명</th>
                            <th>접근 가능한 기능</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{roleBadge('admin')}</td>
                            <td>시스템의 모든 부분에 접근할 수 있는 최고 권한</td>
                            <td>모든 기능, 사용자 관리, 시스템 설정</td>
                        </tr>
                        <tr>
                            <td>{roleBadge('manager')}</td>
                            <td>일상적인 모든 운영 작업 수행 및 보고서 접근 가능</td>
                            <td>대시보드, 제품/주문/재고 관리, 통계, 일부 설정</td>
                        </tr>
                        <tr>
                            <td>{roleBadge('operator')}</td>
                            <td>일상적인 작업 수행 가능하나 중요 설정 변경 불가</td>
                            <td>제품/주문/재고 관리, 일부 통계</td>
                        </tr>
                        <tr>
                            <td>{roleBadge('viewer')}</td>
                            <td>정보 조회만 가능, 어떤 데이터도 수정 불가</td>
                            <td>대시보드, 제품/주문/재고 조회(읽기 전용)</td>
                        </tr>
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    );
}

export default UserManagement;