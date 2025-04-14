// src/pages/Home.tsx
import {Link, useNavigate} from 'react-router-dom';
import {Button, Container, Row, Col, Card} from 'react-bootstrap';
import youtubeImage from '../assets/images/youtube.svg'
import instagramImage from '../assets/images/instagram.svg'
import tiktokImage from '../assets/images/tiktok.svg'
import twitterImage from '../assets/images/twitter.svg'
import socialUnknownImage from '../assets/images/social-unknown.svg'

const Home = () => {
    const navigate = useNavigate();

    return (
        <>
            <Container className="py-5">
                <div className="text-center">
                    <h1 className="col-12 col-lg-7 mx-auto">Connect with Influencers, Get Expert Answers</h1>
                    <p className="text-20 mb-0">The platform where knowledge meets opportunity. Choose your path below.</p>
                    <div className="mb-5 pb-3"></div>
                </div>
                <Row>
                    <Col lg={{span: 5, offset: 1}} className="mb-4">
                        <Card>
                            <Card.Body>
                                <div className="d-flex align-items-center justify-content-center bg-E0E7FF rounded-circle home-image-block mx-auto mb-4">
                                    <i className="fa-solid fa-star text-primary text-36"></i>
                                </div>
                                <div className="text-center">
                                    <h2 className="mb-4">I'm an Influencer</h2>
                                    <p className="mb-4">Share your expertise and earn money by answering questions from
                                        your
                                        audience</p>
                                </div>
                                <div className="mb-3">
                                    <i className="fa-solid fa-check text-success me-3"></i>
                                    <span>Set your own rates</span>
                                </div>
                                <div className="mb-3">
                                    <i className="fa-solid fa-check text-success me-3"></i>
                                    <span>Flexible schedule</span>
                                </div>
                                <div className="mb-3">
                                    <i className="fa-solid fa-check text-success me-3"></i>
                                    <span>Build your personal brand</span>
                                </div>
                                <div className="mb-3"></div>
                                <Button variant="primary" className="d-block" as={Link} to={`/register?role=influencer`}>Join as
                                    Influencer</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={{span: 5}} className="mb-4">
                        <Card>
                            <Card.Body>
                                <div className="d-flex align-items-center justify-content-center bg-EDE9FE rounded-circle home-image-block mx-auto mb-4">
                                    <i className="fa-solid fa-user text-info text-36"></i>
                                </div>
                               <div className="text-center">
                                    <h2 className="mb-4">I Want to Ask Questions</h2>
                                    <p className="mb-4">
                                        Get personalized answers from your favorite influencers and experts
                                    </p>
                                </div>
                                <div className="mb-3">
                                    <i className="fa-solid fa-check text-success me-3"></i>
                                    <span>Direct access to experts</span>
                                </div>
                                <div className="mb-3">
                                    <i className="fa-solid fa-check text-success me-3"></i>
                                    <span>Guaranteed responses</span>
                                </div>
                                <div className="mb-3">
                                    <i className="fa-solid fa-check text-success me-3"></i>
                                    <span>Affordable pricing</span>
                                </div>
                                <div className="mb-3"></div>
                                <Button variant="info" className="d-block" as={Link} to={`/register?role=user`}>
                                    Start Asking Questions
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <div className="text-center bg-f9fafb py-5">
                <div className="py-5">
                    <p className="text-18 mb-5">Trusted by leading influencers and brands</p>
                    <div className="d-block d-lg-flex justify-content-center align-items-center">
                        <img src={youtubeImage} alt="" className="me-5"/>
                        <img src={instagramImage} alt="" className="me-5"/>
                        <img src={tiktokImage} alt="" className="me-5"/>
                        <img src={twitterImage} alt="" className="me-5"/>
                        <img src={socialUnknownImage} alt="" className=""/>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
