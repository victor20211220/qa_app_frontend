// src/components/QuestionCard.jsx
import React from 'react';
import {Card, Image, Badge, Button} from 'react-bootstrap';
import {getAvatar} from "../../utils/helpers.js";
import {Link} from "react-router-dom";
import ClickableLink from "../ClickableLink.jsx";
import TimeAgo from "../TimeAgo.jsx";
import {questionStatusBadgeOptions} from "../../utils/helpers.js";

const InfluencerQuestionCard = ({question}) => {
    const {questioner, created_at, question: questionText, status, answer} = question;

    return (
        <ClickableLink to={`/mentor/view-question?question_id=${question._id}`}>
            <div className="p-4 border-bottom hover-bg-light">
                <div className="d-flex gap-3 align-items-start">
                    <Image
                        src={getAvatar(questioner.photo)}
                        roundedCircle
                        width={48}
                        height={48}
                        className="me-2"
                    />
                    <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                                <h6 className="fw-semibold text-dark mb-0">{questioner.name}</h6>
                                <TimeAgo dateValue={created_at}/>
                            </div>
                            <Badge bg={questionStatusBadgeOptions[status].variant} className="rounded-pill fw-medium px-3 py-2">
                                {questionStatusBadgeOptions[status].text}
                            </Badge>
                        </div>
                        <p className="text-374151 mb-3">{questionText}</p>
                        {status === 0 && (
                            <Button as={Link} to={`/mentor/view-question?question_id=${question._id}`}
                                    variant="primary">Answer Question</Button>
                        )}
                        {answer && (
                            <Card className="bg-f9fafb shadow-none border-0 p-3 rounded-3 mb-3">
                                <Card.Text className="fst-italic text-374151 mb-0 text-12">{`Your answer: ${answer.answer}`}</Card.Text>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </ClickableLink>
    )
};

export default InfluencerQuestionCard;
