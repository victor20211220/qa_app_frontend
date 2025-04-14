import React from 'react';
import {Card, Button, Image, Col} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {getAvatar} from "../../utils/helpers.js";

const formatRating = (rating, reviews) => {
    const formatted = reviews > 999 ? `${(reviews / 1000).toFixed(1)}k` : reviews;
    return `⭐ ${rating.toFixed(1)} (${formatted} reviews)`;
};

const formatPrice = (price) => `$${price}/question`;

const FeaturedInfluencerCard = ({influencer}) => {
    return (
        <Col md={6} lg={4}>
            <Card className="p-4 border border-light-subtle rounded-4 shadow-sm h-100 hover-shadow">
                <div className="d-flex gap-3 align-items-start">
                    <Image
                        src={getAvatar(influencer.photo)}
                        alt={influencer.name}
                        roundedCircle
                        width={64}
                        height={64}
                        className="me-3"
                    />
                    <div className="flex-grow-1">
                        <h5 className="fw-bold text-dark mb-1">{influencer.name}</h5>
                        <p className="text-muted small mb-2">{influencer.category_name}</p>
                        <div className="d-flex flex-wrap align-items-center gap-2">
                            <span className="">
                              {formatRating(influencer.rating, influencer.number_of_reviews)}
                            </span>
                            <span
                                className="badge bg-success-subtle text-success fw-medium px-2 py-1 rounded-pill small">{formatPrice(influencer.hourly_rate)}</span>
                        </div>
                    </div>
                    <Button as={Link} to={`/questioner/view-influencer?answerer_id=${influencer._id}`}
                            variant="primary">
                        Ask
                    </Button>
                </div>
            </Card>
        </Col>
    );
};

export default FeaturedInfluencerCard;
