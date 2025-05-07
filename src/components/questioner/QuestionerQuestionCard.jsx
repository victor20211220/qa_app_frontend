// src/components/QuestionCard.jsx
import React from 'react';
import {Card, Image, Badge, Button} from 'react-bootstrap';
import {getAvatar} from "../../utils/helpers.js";
import {Link} from "react-router-dom";
import ClickableLink from "../ClickableLink.jsx";
import TimeAgo from "../TimeAgo.jsx";
import {questionStatusBadgeOptions} from "../../utils/helpers.js";

const QuestionerQuestionCard = ({question}) => {
    const {_id: questionId, question: questionText, status, answerer_id: answerer, answer} = question;

    return (
        <ClickableLink to={`/questioner/view-question?question_id=${questionId}`}>
            <div className="p-4 border-bottom hover-bg-light">
                <div className="d-flex gap-3 align-items-start">
                    <Image
                        src={getAvatar(answerer.photo)}
                        roundedCircle
                        width={48}
                        height={48}
                        className="me-2"
                    />
                    <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                                <h6 className="fw-semibold text-dark mb-0">{answerer.name}</h6>
                                <TimeAgo dateValue={question.created_at}/>
                            </div>
                            <Badge bg={questionStatusBadgeOptions[status].variant} className="rounded-pill fw-medium px-3 py-2">
                                {questionStatusBadgeOptions[status].text}
                            </Badge>
                        </div>
                        <Card className="bg-f9fafb shadow-none border-0 p-3 rounded-3 mb-3">
                            <Card.Text
                                className="fst-italic text-374151 mb-0 text-12">{`Your question: ${questionText}`}</Card.Text>
                        </Card>
                        {(answer && !answer.review) && (
                            <Button as={Link} to={`/questioner/review-answer?question_id=${questionId}`}
                                    variant="primary">
                                Review Answer
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </ClickableLink>
    )
};

export default QuestionerQuestionCard;
