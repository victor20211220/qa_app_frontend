import React from 'react';
import {Card, Button, Image} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {getAvatar} from "../../utils/helpers.js";

const formatRating = (rating, reviews) => {
    const formatted = reviews > 999 ? `${(reviews / 1000).toFixed(1)}k` : reviews;
    return `${rating.toFixed(1)} (${formatted} reviews)`;
};

const formatResponseTime = (hours) => `Avg. response time: ${Math.round(hours)} hours`;
const formatQuestionStat = (n) => (n > 999 ? `${Math.floor(n / 1000)}k+` : n) + ' questions answered';
const formatPrice = (price) => `$${price}`;

const InfluencerCard = ({influencer}) => {
    return (
        <div className="p-4 border-bottom hover-bg-light">
            <div className="d-flex flex-column flex-md-row gap-4 align-items-center align-items-md-start mb-4">
                <Image
                    src={getAvatar(influencer.photo)}
                    alt="Influencer"
                    roundedCircle
                    width={128}
                    height={128}
                />

                <div className="flex-grow-1">
                    <div
                        className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3">
                        <div>
                            <h1 className="h3 fw-bold text-dark mb-2">{influencer.name}</h1>
                            <p className="text-muted mb-0">{influencer.category_name}</p>
                        </div>

                        <div className="d-flex gap-2 mt-3 mt-md-0">
                            <Button as={Link} to={`/questioner/view-influencer?answerer_id=${influencer._id}`}
                                    variant="primary">
                                Ask
                            </Button>
                        </div>
                    </div>

                    <p className="text-374151 mb-4">
                        {influencer.bio}
                    </p>
                    <div className="d-flex flex-wrap gap-4">
                        <div className="d-flex align-items-center gap-2">
                            <i className="fa-solid fa-star text-warning"></i>
                            <span
                                className="text-dark">{formatRating(influencer.rating, influencer.number_of_reviews)}</span>
                        </div>

                        <div className="d-flex align-items-center gap-2">
                            <i className="fa-solid fa-message text-primary"></i>
                            <span
                                className="text-dark">{formatQuestionStat(influencer.number_of_questions_answered)}</span>
                        </div>

                        <div className="d-flex align-items-center gap-2">
                            <i className="fa-solid fa-clock text-success"></i>
                            <span
                                className="text-dark">{formatResponseTime(influencer.average_response_time)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfluencerCard;
