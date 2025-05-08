import React, {useEffect, useState} from 'react';
import {Link, useSearchParams} from 'react-router-dom';
import {Card, Col, Row, Button, Image, Spinner, Container} from 'react-bootstrap';
import {OverlayTrigger, Tooltip} from 'react-bootstrap'; // at the top
import axios from '../../utils/axios.js';
import InfluencerRecentReviews from '../../components/questioner/RecentReviews.jsx';
import {getAvatar, viewInfluencerLink} from "../../utils/helpers.js";
import {useAppContext} from "../../context/AppContext.jsx";

const ViewInfluencer = () => {
    const [searchParams] = useSearchParams();
    const [data, setData] = useState(null);
    const id = searchParams.get('answerer_id');

    useEffect(() => {
        if (id) fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const res = await axios.get(`/answerers/${id}`);
            setData(res.data);
        } catch (err) {
            console.error('Failed to load influencer');
        }
    };

    const formatRating = (rating, reviews) => {
        const formatted = reviews > 999 ? `${(reviews / 1000).toFixed(1)}k` : reviews;
        return `${rating.toFixed(1)} (${formatted} reviews)`;
    };

    const formatResponseTime = (hours) => `Avg. response time: ${Math.round(hours)} hours`;

    const formatQuestionStat = (n) => (n > 999 ? `${Math.floor(n / 1000)}k+` : n) + ' questions answered';

    const formatPrice = (price) => `$${price}`;


    const [copied, setCopied] = useState(false);
    const handleShare = () => {
        const link = window.location.origin + viewInfluencerLink(data._id);
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const {userType, user} = useAppContext();
    const isSelfUser = userType === 'answerer' && !!user && user._id === id;

    if (!data) return <Spinner animation="border"/>;

    return (
        <>
            <Container className="py-5">
                <Card className="rounded-4 shadow-lg border border-light-subtle bg-white p-4 mb-4">
                    <div
                        className="d-flex flex-column flex-md-row gap-4 align-items-center align-items-md-start p-lg-2 mb-4">
                        <Image
                            src={getAvatar(data.photo)}
                            alt="Influencer"
                            roundedCircle
                            width={128}
                            height={128}
                        />

                        <div className="flex-grow-1">
                            <div
                                className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3">
                                <div>
                                    <h1 className="h3 fw-bold text-dark mb-2">{data.name}</h1>
                                    <p className="text-muted mb-0">{data.category_name}</p>
                                </div>

                                <div className="d-flex gap-2 mt-md-0">
                                    <div className="d-flex justify-content-end gap-3">
                                        <Button variant="primary">Follow</Button>
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={
                                                <Tooltip id="share-tooltip">{copied ? 'Copied!' : 'Copy link'}</Tooltip>
                                            }
                                        >
                                            <Button
                                                variant="outline-light"
                                                className="rounded-pill"
                                                onClick={handleShare}
                                            >
                                                Share
                                            </Button>
                                        </OverlayTrigger>
                                    </div>
                                </div>
                            </div>

                            <p className="text-374151 mb-4">
                                {data.bio}
                            </p>
                            <div className="d-flex flex-wrap gap-4">
                                <div className="d-flex align-items-center gap-2">
                                    <i className="fa-solid fa-star text-warning"></i>
                                    <span
                                        className="text-dark">{formatRating(data.rating, data.number_of_reviews)}</span>
                                </div>

                                <div className="d-flex align-items-center gap-2">
                                    <i className="fa-solid fa-message text-primary"></i>
                                    <span
                                        className="text-dark">{formatQuestionStat(data.number_of_questions_answered)}</span>
                                </div>

                                <div className="d-flex align-items-center gap-2">
                                    <i className="fa-solid fa-clock text-success"></i>
                                    <span
                                        className="text-dark">{formatResponseTime(data.average_response_time)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Section 2: Question Types */}
                <section id="question-models">
                    <Row className="g-4">
                        {data.questionTypes.map((q) => {
                            let title = '';
                            let description = "";
                            let details = [];

                            if (q.type === 0) {
                                title = 'Quick Question';
                                description = "Short, specific questions with concise answers. Perfect for quick guidance.";
                                details = [
                                    `${q.response_time}-hour response time`,
                                    'One follow-up question',
                                ];
                            } else if (q.type === 1) {
                                title = 'Multiple Choice Question';
                                description = "Get expert answers from pre-defined options for your specific questions.";
                                details = [
                                    `Up to ${q.number_of_choice_options} answer options`,
                                    'Brief explanation included',
                                    `${q.response_time}-hour response time`
                                ];
                            } else if (q.type === 2) {
                                title = 'Picture Question';
                                description = "Get expert analysis and feedback on visual content or technical screenshots.";
                                details = [
                                    `Upload up to ${q.number_of_picture_options} images`,
                                    'Detailed visual feedback',
                                    'One revision included',
                                    `${q.response_time}-hour response time`
                                ];
                            }

                            return (
                                <Col md={4} key={q.id}>
                                    <Card className="p-4 rounded-4 shadow-lg border border-light-subtle h-100">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h5 className="fw-bold text-dark mb-0">{title}</h5>
                                            <span className="h4 fw-bold text-primary mb-0">{formatPrice(q.price)}</span>
                                        </div>
                                        <p className="text-muted mb-4">{description}</p>
                                        <ul className="list-unstyled mb-4">
                                            {details.map((item, i) => (
                                                <li key={i} className="d-flex align-items-center gap-2 mb-2">
                                                    <i className="fa-solid fa-check text-success"></i>
                                                    <span className="text-dark">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <Button
                                            as={Link}
                                            to={isSelfUser ? '#' : `/questioner/ask-question?answerer_id=${data._id}&question_type_id=${q._id}`}
                                            onClick={(e) => {
                                                if (isSelfUser) {
                                                    e.preventDefault(); // stops navigation
                                                }
                                            }}
                                        >
                                            {q.type === 0
                                                ? 'Ask Question'
                                                : q.type === 1
                                                    ? 'Ask Multiple Choice'
                                                    : 'Ask with Pictures'}
                                        </Button>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                </section>
            </Container>
            {/* Section 3: Reviews */}
            <InfluencerRecentReviews reviews={data.recent_reviews}/>
        </>
    );
};

export default ViewInfluencer;
