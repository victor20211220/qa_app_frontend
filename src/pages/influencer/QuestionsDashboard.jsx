import React, {useEffect, useState} from 'react';
import axios from '../../utils/axios.js';
import {Row, Col, Card, Spinner, Button, Dropdown, DropdownButton, Container, Form} from 'react-bootstrap';
import {toast} from 'react-toastify';
import InfluencerQuestionCard from '../../components/influencer/InfluencerQuestionCard.jsx';
import StatsCard from "../../components/StatsCard.jsx";
import TableCard from "../../components/TableCard.jsx";
import {questionStatusFilterOptions} from "../../utils/helpers.js";
import CustomSelect from "../../components/CustomSelect.jsx";

const QuestionsDashboard = () => {
    const [stats, setStats] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const limit = 3;

    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        fetchQuestions(page, status);
    }, [page, status]);

    const fetchStats = async () => {
        try {
            const res = await axios.get('/answerers/me/question_stats');
            setStats(res.data);
        } catch (err) {
            toast.error('Failed to load stats');
        }
    };

    const fetchQuestions = async (page, status) => {
        try {
            setLoading(true);
            const query = status !== '' ? `&status=${status}` : '';
            const res = await axios.get(`/questions/received?page=${page}&limit=${limit}${query}`);
            setQuestions(res.data.questions);
            setTotal(res.data.total);
        } catch (err) {
            toast.error('Failed to load questions');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (value) => {
        setPage(1); // reset to first page
        setStatus(value);
    };

    const formatCurrency = (num) => `$${Number(num || 0).toLocaleString()}`;
    const formatPercent = (value) => `${Math.round((value || 0) * 100)}%`;

    if (!stats) return <Spinner animation="border"/>;
    const statsData = [
        {
            label: 'Pending Questions',
            icon: 'fa-clock',
            color: 'text-warning',
            value: stats.pending_count,
        },
        {
            label: 'Answered Today',
            icon: 'fa-check-circle',
            color: 'text-success',
            value: stats.answers_today,
        },
        {
            label: 'Earnings Today',
            icon: 'fa-dollar-sign',
            color: 'text-primary',
            value: formatCurrency(stats.earnings_today),
        },
        {
            label: 'Response Rate',
            icon: 'fa-chart-line',
            color: 'text-info',
            value: formatPercent(stats.response_rate),
        },
    ];

    return (
        <Container className="py-5">
            <h2 className="text-36 mb-4">Questions Dashboard</h2>
            <p className="text-20 mb-0">Manage and respond to questions from your audience</p>
            <div className="mb-4 pb-2"></div>
            <div className="mb-4 pb-2">
                <Row className="g-3">
                    {statsData.map((stat, i) => (
                        <Col key={i} xs={12} md={6} lg={3}>
                            <StatsCard>
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <span className="text-muted">{stat.label}</span>
                                    <i className={`fa-solid ${stat.icon} ${stat.color}`}></i>
                                </div>
                                <h3 className="mt-2 fw-bold text-dark display-6">{stat.value}</h3>
                            </StatsCard>
                        </Col>
                    ))}
                </Row>
            </div>
            <TableCard
                header={
                    <>
                        <Col>
                            <h5 className="fw-bold text-dark mb-0">Recent Questions</h5>
                        </Col>
                        <Col xs="auto">
                            <CustomSelect
                                options={questionStatusFilterOptions}
                                value={questionStatusFilterOptions.find(opt => opt.value === status)}
                                onChange={(selected) => {
                                    setStatus(selected.value);
                                    setPage(1);
                                }}
                                isSearchable
                                className="basic-single"
                                classNamePrefix="select"
                            />
                        </Col>
                    </>
                }
                body={
                    <>
                        {loading ? <Spinner animation="border"/> : questions.map((q) => (
                            <InfluencerQuestionCard key={q._id} question={q}/>
                        ))}
                    </>
                }
                footer={
                    <>
                        <p className="text-muted mb-0">
                            Showing {limit * (page - 1) + questions.length} of {total} questions
                        </p>
                        <div className="d-flex gap-2">
                            <Button
                                variant="outline-secondary border-light-subtle"
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                                className="rounded-3 text-dark me-2"
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline-secondary border-light-subtle"
                                disabled={page * limit >= total}
                                onClick={() => setPage(page + 1)}
                                className="rounded-3 text-dark"
                            >
                                Next
                            </Button>
                        </div>
                    </>
                }
            >
            </TableCard>
        </Container>
    );
};

export default QuestionsDashboard;
