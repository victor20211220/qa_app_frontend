import React, {useEffect, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import axios from '../../utils/axios';
import {Form, Button, Image, Spinner, Container, Card} from 'react-bootstrap';
import {Rating} from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import {toast} from 'react-toastify';
import {getAvatar} from "../../utils/helpers.js";
import BackButton from "../../components/BackButton.jsx";

const QuestionerViewQuestion = () => {
    const [searchParams] = useSearchParams();
    const questionId = searchParams.get('question_id');
    const [question, setQuestion] = useState(null);
    const [rate, setRate] = useState(0);
    const [review, setReview] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchQuestion = async () => {
        try {
            const res = await axios.get(`/questions/${questionId}`);
            setQuestion(res.data);
            setRate(res.data.answer?.rate || 0);
            setReview(res.data.answer?.review || '');
        } catch {
            toast.error('Failed to load question');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestion();
    }, [questionId]);

    const handleSubmit = async () => {
        if (!review.trim()) {
            toast.error('Review is required');
            return;
        }

        try {
            await axios.post(`/answers/${question.answer._id}/review`, {rate, review});
            toast.success('Review submitted!');
            fetchQuestion(); // refresh to show updated review
        } catch {
            toast.error('Failed to submit review');
        }
    };

    if (loading) return <Spinner animation="border"/>;
    if (!question) return null;

    const type = question.question_type_id.type;
    const typeLabel = ['Text', 'Multiple Choice', 'Pictures'][type];

    const alreadyReviewed = question.answer?.rate !== undefined || question.answer?.review;
    const hasAnswer = question.answer !== null

    return (
        <Container className="py-5">
            <div className="col-lg-8 offset-lg-2">
                <div className="d-flex align-items-center gap-3 mb-4">
                    <BackButton/>
                    <h2 className="mb-0 pb-2">{hasAnswer && !alreadyReviewed ? "Review Answer" : "View Question"}</h2>
                </div>
                <Card className="p-4 rounded-4 border border-light-subtle bg-white mb-4">

                    {/* Question */}
                    <Form.Group className="mb-3">
                        <Form.Label>Your {typeLabel} Question:</Form.Label>
                        <Form.Control as="textarea" rows={5} value={question.question} disabled/>
                    </Form.Group>

                    {type === 1 && question.choices.length > 0 && (
                        <>
                            <Form.Label>Choices:</Form.Label>
                            <ul>
                                {question.choices.map((choice, idx) => (
                                    <li key={idx}>{choice}</li>
                                ))}
                            </ul>
                        </>
                    )}

                    {type === 2 && question.pictures.length > 0 && (
                        <>
                            <Form.Label>Pictures:</Form.Label>
                            <div className="d-flex flex-wrap gap-3 mb-3">
                                {question.pictures.map((pic, i) => (
                                    <Image
                                        key={i}
                                        src={getAvatar(pic)}
                                        width={120}
                                        height={120}
                                        className="rounded shadow-sm"
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    {/* Answer */}
                    <div className="mb-4">
                        <div className="d-flex align-items-center mb-2">
                            <Image
                                src={getAvatar(question.answerer_id.photo)}
                                width={48}
                                height={48}
                                roundedCircle
                                className="me-2"
                            />
                            <div>
                                <strong>{question.answerer_id.name}</strong><br/>
                                <small className="text-muted">{question.answerer_id.category_name}</small>
                            </div>
                        </div>

                        {hasAnswer && <>
                            <Form.Label>Answer:</Form.Label>
                            <Form.Control as="textarea" rows={5} value={question.answer.answer} disabled/>
                            <small
                                className="text-muted">{new Date(question.answer.created_at).toLocaleString()}</small>
                        </>
                        }
                    </div>

                    {hasAnswer && <>
                        {/* Review Form */}

                        <Form.Group className="mb-3">
                            <Form.Label>Rate:</Form.Label>
                            <div>
                                <Rating
                                    style={{maxWidth: 160}}
                                    value={rate}
                                    onChange={setRate}
                                    readOnly={alreadyReviewed}
                                />
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Review:</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                disabled={alreadyReviewed}
                            />
                        </Form.Group>

                        {!alreadyReviewed && (
                            <Button onClick={handleSubmit}>Leave Review</Button>
                        )}
                    </>}
                </Card>
            </div>
        </Container>
    );
};

export default QuestionerViewQuestion;
