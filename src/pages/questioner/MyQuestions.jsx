import React, {useEffect, useState} from 'react';
import axios from '../../utils/axios';
import {Button, Spinner, Row, Col, Container} from 'react-bootstrap';
import {useSearchParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import {questionStatusFilterOptions} from "../../utils/helpers.js";
import StatsCard from "../../components/StatsCard.jsx";
import TableCard from "../../components/TableCard.jsx";
import QuestionerQuestionCard from "../../components/questioner/QuestionerQuestionCard.jsx";
import CustomSelect from "../../components/CustomSelect.jsx";


const MyQuestions = () => {
    const [stats, setStats] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [total, setTotal] = useState(0);
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const limit = 3;
    const [searchParams] = useSearchParams();

    const checkPaymentStatus = () => {
        const payment = searchParams.get('payment');
        if (payment) {
            if (payment === "success") {
                toast.success('Payment successful!');
            }
            if (payment === "cancel") {
                toast.error("Payment failed!");
            }
            window.history.replaceState({}, '', window.location.pathname);
        }
    }

    const fetchStats = async () => {
        const res = await axios.get('/questioners/me/stats');
        setStats(res.data);
        checkPaymentStatus();
    }

    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        fetchQuestions();
    }, [page, statusFilter]);


    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const params = {
                page,
                limit,
            };
            if (statusFilter !== null) params.status = statusFilter;
            const res = await axios.get('/questions/asked', {params});
            setQuestions(res.data.questions);
            setTotal(res.data.total);
        } catch (err) {
            toast.error(err ?? 'Failed to load your questions');
        }
        setLoading(false);
    };

    if (!stats) return <Spinner animation="border"/>;
    const statsData = [
        {
            label: 'Total Questions',
            icon: 'fa-question',
            color: 'text-success',
            value: stats.total_questions,
        },
        {
            label: 'Total Answers',
            icon: 'fa-check-circle',
            color: 'text-success',
            value: stats.total_answers,
        },
        {
            label: 'Answers Today',
            icon: 'fa-calendar-day',
            color: 'text-primary',
            value: stats.answers_today,
        },
        {
            label: 'Total Reviews',
            icon: 'fa-star',
            color: 'text-info',
            value: stats.total_reviews,
        },
    ];

    return (
        <Container className="py-5">
            <h2 className="text-36 mb-4">Questions Dashboard</h2>
            <p className="text-20 mb-0">View questions and review answers from your mentors</p>
            <div className="mb-4 pb-2"></div>
            <div className="mb-4 pb-2">
                <Row className="g-3">
                    {statsData.map((stat, i) => {
                        return <Col key={i} xs={12} md={6} lg={3}>
                            <StatsCard>
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <span className="text-muted">{stat.label}</span>
                                    <i className={`fa-solid ${stat.icon} ${stat.color}`}></i>
                                </div>
                                <h3 className="mt-2 fw-bold text-dark display-6">{stat.value}</h3>
                            </StatsCard>
                        </Col>
                    })}
                </Row>
            </div>
            <TableCard
                header={
                    <>
                        <Col>
                            <h5 className="fw-bold text-dark mb-0">My Questions</h5>
                        </Col>
                        <Col xs="auto">
                            <CustomSelect
                                options={questionStatusFilterOptions}
                                value={questionStatusFilterOptions.find(opt => opt.value === statusFilter)}
                                onChange={(selected) => {
                                    setStatusFilter(selected.value);
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
                            <QuestionerQuestionCard key={q._id} question={q}/>
                        ))}
                    </>
                }
                footer={
                    <>
                        <p className="text-muted mb-0">
                            Showing {Math.min(page * limit, total)} of {total} questions
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

export default MyQuestions;
