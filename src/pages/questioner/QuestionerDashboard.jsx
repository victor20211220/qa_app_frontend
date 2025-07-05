import React, {useEffect, useState} from 'react';
import {Row, Col, Card, Image, Container} from 'react-bootstrap';
import axios from '../../utils/axios';
import {toast} from 'react-toastify';
import {Link} from 'react-router-dom';
import {getAvatar} from "../../utils/helpers.js";
import FeaturedInfluencerCard from "../../components/questioner/FeaturedInfluencerCard.jsx";
import ClickableLink from "../../components/ClickableLink.jsx";
import TimeAgo from "../../components/TimeAgo.jsx";

const QuestionerDashboard = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get('/questioners/homepage_data');
            setData(res.data);
        } catch {
            toast.error('Failed to load dashboard data');
        }
    };

    if (!data) return null;

    return (
        <Container className="py-5">
            <section id="categories" className="mb-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="h4 fw-bold text-dark">Popular Categories</h2>
                    <Link to="/questioner/browse-mentors" className="text-primary fw-medium cursor-pointer">View
                        All</Link>
                </div>

                <Row className="g-3">
                    {data.popular_categories.map((cat) => (
                        <Col xs={6} md={3} lg={2} key={cat.id}>
                            <ClickableLink to={`/questioner/browse-mentors?category_id=${cat._id}`}>
                                <div
                                    className="text-center p-3 bg-white border rounded-4 h-100 cursor-pointer category-card"
                                >
                                    {/*<i
                                    className={`fa-solid fa-${cat.icon} text-primary mb-2`}
                                    style={{fontSize: '1.5rem'}}
                                ></i>*/}
                                    <p className="text-muted mb-0">{cat.category}</p>
                                </div>
                            </ClickableLink>
                        </Col>
                    ))}
                </Row>
            </section>

            <section id="featured-influencers" className="mb-5">
                <h2 className="h4 fw-bold text-dark mb-4">Featured Mentors</h2>
                <Row className="g-4">
                    {data.featured_answerers.map((inf) => (
                        <FeaturedInfluencerCard influencer={inf} key={inf._id}/>
                    ))}
                </Row>
            </section>
            {/* <section id="recent-questions">
                <h2 className="h4 fw-bold text-dark mb-4">Recent Questions</h2>
                <div className="d-flex flex-column gap-3">
                    {data.recent_questions.map((q) => (
                        <Card key={q.id} className="p-4 border-light-subtle rounded-4 bg-white">
                            <div className="d-flex gap-3 align-items-start">
                                <Image
                                    src={getAvatar(q.questioner.photo)}
                                    alt="User"
                                    roundedCircle
                                    width={40}
                                    height={40}
                                />
                                <div className="flex-grow-1">
                                    <p className="fw-bold text-dark mb-0">{q.questioner.name}</p>
                                    <p className="text-4B5563 mt-2 mb-3">{q.question}</p>
                                    <div className="d-flex gap-4 small text-muted">
                                        <span><TimeAgo dateValue={q.created_at} /></span>
                                        <span>{q.answer_count === 0 ? 'No answers' : `${q.answer_count} answers`}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </section> */}
        </Container>
    );
};

export default QuestionerDashboard;
