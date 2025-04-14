import React, {useEffect, useState} from 'react';
import {useSearchParams, useNavigate} from 'react-router-dom';
import axios from '../../utils/axios';
import {Form, Button, Image, Spinner, Container, Card} from 'react-bootstrap';
import {toast} from 'react-toastify';
import {getAvatar} from '../../utils/helpers';
import {Rating} from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import BackButton from "../../components/BackButton.jsx";

const AnswererViewQuestion = () => {
    const [searchParams] = useSearchParams();
    const questionId = searchParams.get('question_id');
    const [question, setQuestion] = useState(null);
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const res = await axios.get(`/questions/${questionId}`);
                setQuestion(res.data);
                setAnswer(res.data.answer?.answer || '');
            } catch {
                toast.error('Failed to load question');
            } finally {
                setLoading(false);
            }
        };

        fetchQuestion();
    }, [questionId]);

    const handleSubmit = async () => {
        if (!answer.trim()) {
            toast.error('Answer is required');
            return;
        }

        try {
            await axios.post(`/answers/${questionId}`, {answer});
            toast.success('Answer submitted!');
            navigate('/influencer/questions');
        } catch (err) {
            toast.error('Failed to submit answer');
        }
    };

    if (loading) return <Spinner animation="border"/>;
    if (!question) return null;

    const type = question.question_type_id.type;
    const typeLabel = ['Text', 'Multiple-Choice', 'Pictures'][type];
    const isAnswered = !!question.answer;
    const hasReview = !!question.answer?.review;

    return (
        <Container className="py-5">
            <div className="col-lg-8 offset-lg-2">
                <div className="d-flex align-items-center gap-3 mb-4">
                    <BackButton/>
                    <h2 className="mb-0 pb-2">{`${isAnswered ? "View" : "Answer"} ${typeLabel} Question`}</h2>
                </div>
                <Card className="p-4 rounded-4 border border-light-subtle bg-white mb-4">
                    <div className="d-flex align-items-center gap-3 mb-4">
                        <Image
                            src={getAvatar(question.questioner_id.photo)}
                            roundedCircle
                            width={64}
                            height={64}
                            className="me-1"
                        />
                        <div>
                            <strong>{question.questioner_id.name}</strong>
                        </div>
                    </div>

                    {/* Question Section */}
                    <div className="mb-4">
                        <Form.Group>
                            <Form.Label>Question:</Form.Label>
                            <Form.Control as="textarea" value={question.question} disabled rows={5}/>
                        </Form.Group>

                        {type === 1 && (
                            <div className="mt-3">
                                <Form.Label>Choices:</Form.Label>
                                <ul>
                                    {question.choices.map((choice, idx) => (
                                        <li key={idx}>{choice}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {type === 2 && (
                            <div className="mt-3">
                                <Form.Label>Pictures:</Form.Label>
                                <div className="d-flex flex-wrap gap-3">
                                    {question.pictures.map((pic, i) => (
                                        <Image
                                            key={i}
                                            src={`${import.meta.env.VITE_BACKEND_URL}/${pic}`}
                                            width={120}
                                            height={120}
                                            className="rounded shadow-sm"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Answer Section */}
                    <div className="mb-3">
                        <Form.Label>My Answer:</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            disabled={isAnswered}
                        />
                    </div>

                    {!isAnswered && (
                        <Button onClick={handleSubmit}>Submit Answer</Button>
                    )}

                    {/* Review Section */}
                    {hasReview && (
                        <div className="mt-4 border-top pt-3">
                            <h5>Review</h5>
                            <div className="d-flex align-items-center mb-2">
                                <Image
                                    src={getAvatar(question.questioner_id.photo)}
                                    width={48}
                                    height={48}
                                    roundedCircle
                                    className="me-2"
                                />
                                <div>
                                    <strong>{question.questioner_id.name}</strong>
                                    <div className="text-muted">
                                        <Rating value={question.answer.rate} readOnly style={{maxWidth: 120}}/>
                                    </div>
                                </div>
                            </div>
                            <Card className="bg-f9fafb shadow-none border-0 p-3 rounded-3 mb-3">
                                <Card.Text
                                    className="fst-italic text-374151 mb-0 text-12">{question.answer.review}</Card.Text>
                            </Card>
                        </div>
                    )}
                </Card>
            </div>
        </Container>
    );
};

export default AnswererViewQuestion;
