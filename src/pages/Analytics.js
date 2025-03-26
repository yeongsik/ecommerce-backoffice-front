import React, { useState } from 'react';
import { Card, Row, Col, Form, Button, Nav } from 'react-bootstrap';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Analytics() {
    const [dateRange, setDateRange] = useState('month');

    // 매출 데이터
    const salesData = [
        { name: '2월', 총매출: 48500000, 순이익: 15200000 },
        { name: '3월', 총매출: 52300000, 순이익: 17800000 },
        { name: '4월', 총매출: 58700000, 순이익: 20100000 },
        { name: '5월', 총매출: 61400000, 순이익: 22500000 },
        { name: '6월', 총매출: 68200000, 순이익: 25900000 },
        { name: '7월', 총매출: 72500000, 순이익: 27800000 },
    ];

    // 카테고리별 판매량 데이터
    const categoryData = [
        { name: '의류', value: 42 },
        { name: '신발', value: 18 },
        { name: '액세서리', value: 15 },
        { name: '가방', value: 14 },
        { name: '홈웨어', value: 11 },
    ];

    // 일별 방문자 데이터
    const visitorData = [
        { name: '3/21', 방문자: 450 },
        { name: '3/22', 방문자: 430 },
        { name: '3/23', 방문자: 520 },
        { name: '3/24', 방문자: 590 },
        { name: '3/25', 방문자: 620 },
        { name: '3/26', 방문자: 590 },
        { name: '3/27', 방문자: 680 },
    ];

    // 상위 판매 제품 데이터
    const topProducts = [
        { name: '클래식 데님 자켓', sales: 89, revenue: 7921000 },
        { name: '프리미엄 티셔츠', sales: 156, revenue: 4992000 },
        { name: '캐주얼 청바지', sales: 121, revenue: 7018000 },
        { name: '니트 스웨터', sales: 105, revenue: 4725000 },
        { name: '슬림핏 셔츠', sales: 98, revenue: 3920000 },
    ];

    // 파이 차트 색상
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD'];

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>통계 분석</h2>

                <div className="d-flex align-items-center">
                    <Form.Select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        style={{ width: '150px' }}
                        className="me-2"
                    >
                        <option value="week">최근 7일</option>
                        <option value="month">최근 30일</option>
                        <option value="quarter">최근 3개월</option>
                        <option value="year">최근 12개월</option>
                    </Form.Select>
                    <Button variant="outline-secondary">내보내기</Button>
                </div>
            </div>

            {/* 요약 카드 */}
            <Row className="mb-4">
                <Col md={3}>
                    <Card className="h-100 bg-success bg-opacity-10">
                        <Card.Body>
                            <Card.Title>총 매출</Card.Title>
                            <h2>₩72.5M</h2>
                            <div className="text-success">+6.3% ↑</div>
                            <small className="text-muted">전월 대비</small>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="h-100 bg-primary bg-opacity-10">
                        <Card.Body>
                            <Card.Title>총 주문</Card.Title>
                            <h2>1,284</h2>
                            <div className="text-success">+8.5% ↑</div>
                            <small className="text-muted">전월 대비</small>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="h-100 bg-info bg-opacity-10">
                        <Card.Body>
                            <Card.Title>방문자</Card.Title>
                            <h2>15,682</h2>
                            <div className="text-success">+12.1% ↑</div>
                            <small className="text-muted">전월 대비</small>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="h-100 bg-warning bg-opacity-10">
                        <Card.Body>
                            <Card.Title>전환율</Card.Title>
                            <h2>8.2%</h2>
                            <div className="text-danger">-0.3% ↓</div>
                            <small className="text-muted">전월 대비</small>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* 매출 차트 */}
            <Row className="mb-4">
                <Col md={8}>
                    <Card className="h-100">
                        <Card.Body>
                            <Card.Title>월별 매출 및 이익</Card.Title>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={salesData}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => `₩${(value/1000000).toFixed(1)}M`} />
                                    <Legend />
                                    <Bar dataKey="총매출" fill="#0d6efd" />
                                    <Bar dataKey="순이익" fill="#20c997" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="h-100">
                        <Card.Body>
                            <Card.Title>카테고리별 판매 비중</Card.Title>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `${value}%`} />
                                </PieChart>
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* 방문자 차트 및 상위 제품 */}
            <Row>
                <Col md={6}>
                    <Card className="h-100">
                        <Card.Body>
                            <Card.Title>일별 방문자</Card.Title>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart
                                    data={visitorData}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="방문자" stroke="#8884d8" activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="h-100">
                        <Card.Body>
                            <Card.Title>상위 판매 제품</Card.Title>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th>제품명</th>
                                        <th className="text-center">판매량</th>
                                        <th className="text-end">매출액</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {topProducts.map((product, index) => (
                                        <tr key={index}>
                                            <td>{product.name}</td>
                                            <td className="text-center">{product.sales}개</td>
                                            <td className="text-end">₩{product.revenue.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default Analytics;