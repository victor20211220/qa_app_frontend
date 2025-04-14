import React from 'react';
import {Card, Col, Container, Image, Row} from 'react-bootstrap';
import {Rating} from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import {getAvatar} from "../../utils/helpers.js";

const InfluencerRecentReviews = ({reviews}) => {
    if (!reviews || reviews.length === 0) return null;

    return (
        <section id="reviews" className="py-5 bg-f9fafb">
            <Container>
                <h2 className="h4 fw-bold text-dark mb-4">Recent Reviews</h2>
                <Row className="g-4">
                    {reviews.map((r) => (
                        <Col md={6} key={r.id}>
                            <Card className="p-4 rounded-4 shadow-sm border-0 bg-white">
                                <div className="d-flex align-items-center gap-3 mb-3">
                                    <Image
                                        src={getAvatar(r.questioner.photo)}
                                        alt={r.questioner.name}
                                        roundedCircle
                                        width={48}
                                        height={48}
                                    />
                                    <div>
                                        <p className="fw-bold text-dark mb-1">{r.questioner.name}</p>
                                        <div className="text-warning d-flex gap-1">
                                            <Rating style={{maxWidth: 100}} value={r.rate} readOnly={true}/>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-4B5563 mb-0">{r.review}</p>
                            </Card>
                        </Col>))}
                </Row>
            </Container>
        </section>
    );
};

export default InfluencerRecentReviews;
