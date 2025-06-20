import {useEffect, useState} from 'react';
import {Container, Row, Col, Button, Card} from 'react-bootstrap';
import axios from '../../utils/axios.js'
import {Link} from 'react-router-dom';
import {toast} from 'react-toastify';
import QuestionTypeSettingsModal from '../../components/influencer/QuestionTypeSettingsModal.jsx';
import StatsCard from "../../components/StatsCard.jsx";

const InfluencerDashboard = () => {
    const [influencer, setInfluencer] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get('/answerers/me');
                setInfluencer(res.data);
            } catch (err) {
                toast.error('Failed to load profile');
            }
        };
        fetchProfile();
    }, []);

    if (!influencer) return null;

    return (
        <>
            <Container className="py-5">
                <div className="text-center">
                    <h2 className="text-36 mb-4">Welcome to Your Dashboard</h2>
                    <p className="text-20 mb-0">Choose what you'd like to do next</p>
                    <div className="mb-5 pb-3"></div>
                </div>
                <section className="col-12 col-lg-10 mx-auto questioner-dashboard-blocks">
                    <Row>
                        <Col lg={{span: 4}} className="mb-4">
                            <Card>
                                <Card.Body>
                                    <div
                                        className="d-flex align-items-center justify-content-center bg-DBEAFE rounded-circle home-image-block mx-auto mb-4">
                                        <i className="fa-solid fa-user-pen text-2563EB text-36"></i>
                                    </div>
                                    <div className="text-center">
                                        <h2 className="mb-4">Update Your Bio</h2>
                                        <p className="mb-4">Complete your profile to attract more questions</p>
                                    </div>
                                    <div className="mb-3">
                                        <i className="fa-solid fa-check text-success me-3"></i>
                                        <span>Add expertise areas</span>
                                    </div>
                                    <div className="mb-3">
                                        <i className="fa-solid fa-check text-success me-3"></i>
                                        <span>Set your own rates</span>
                                    </div>
                                    <div className="mb-3"></div>
                                    <Button className="d-block bg-2563EB" as={Link} to={`/mentor/edit-profile`}>Edit
                                        Profile</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={{span: 4}} className="mb-4">
                            <Card>
                                <Card.Body>
                                    <div
                                        className="d-flex align-items-center justify-content-center bg-E0E7FF rounded-circle home-image-block mx-auto mb-4">
                                        <i className="fa-solid fa-question text-primary text-36"></i>
                                    </div>
                                    <div className="text-center">
                                        <h2 className="mb-4">Setup Questions</h2>
                                        <p className="mb-4">Set up questions your audience can choose from</p>
                                    </div>
                                    <div className="mb-3">
                                        <i className="fa-solid fa-check text-success me-3"></i>
                                        <span>Define categories</span>
                                    </div>
                                    <div className="mb-3">
                                        <i className="fa-solid fa-check text-success me-3"></i>
                                        <span>Set pricing tiers</span>
                                    </div>
                                    <div className="mb-3"></div>
                                    <Button variant="primary" className="d-block w-100"
                                            onClick={() => setShowModal(true)}>Setup
                                        Questions</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={{span: 4}} className="mb-4">
                            <Card>
                                <Card.Body>
                                    <div
                                        className="d-flex align-items-center justify-content-center bg-EDE9FE rounded-circle home-image-block mx-auto mb-4">
                                        <i className="fa-solid fa-inbox text-info text-36"></i>
                                    </div>
                                    <div className="text-center">
                                        <h2 className="mb-4">Asked Questions</h2>
                                        <p className="mb-4">View and respond to questions from your audience</p>
                                    </div>
                                    <div className="mb-3">
                                        <i className="fa-solid fa-check text-success me-3"></i>
                                        <span>Manage responses</span>
                                    </div>
                                    <div className="mb-3">
                                        <i className="fa-solid fa-check text-success me-3"></i>
                                        <span>Track earnings</span>
                                    </div>
                                    <div className="mb-3"></div>
                                    <Button variant="info" className="d-block" as={Link} to={`/mentor/questions`}>View
                                        Questions</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </section>
                {/* ✅ Question Type Modal */}
                <QuestionTypeSettingsModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    answererId={influencer._id}
                />
            </Container>
            <section className="py-5 bg-f9fafb">
                <Container className="py-3">
                    <Row className="text-center g-4">
                        <Col md={3}>
                            <StatsCard>
                                <h3 className="text-primary fw-bold mb-2">{influencer.total_questions_received || 0}</h3>
                                <p className="text-muted mb-0">Questions Received</p>
                            </StatsCard>
                        </Col>
                        <Col md={3}>
                            <StatsCard>
                                <h3 className="text-primary fw-bold mb-2">${influencer.total_earnings?.toFixed(2) || '0'}</h3>
                                <p className="text-muted mb-0">Total Earnings</p>
                            </StatsCard>
                        </Col>
                        <Col md={3}>
                            <StatsCard>
                                <h3 className="text-primary fw-bold mb-2">{influencer.total_questions_answered || 0}</h3>
                                <p className="text-muted mb-0">Questions Answered</p>
                            </StatsCard>
                        </Col>
                        <Col md={3}>
                            <StatsCard>
                                <h3 className="text-primary fw-bold mb-2">{Math.round((influencer.response_rate || 0) * 100)}%</h3>
                                <p className="text-muted mb-0">Response Rate</p>
                            </StatsCard>
                        </Col>
                    </Row>
                </Container>
            </section>
        </>
    );
};

export default InfluencerDashboard;
