import React, {useEffect, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import axios from '../../utils/axios';
import {Button, Card, Container, Form, Image, Spinner} from 'react-bootstrap';
import {toast} from 'react-toastify';
import {getAvatar} from '../../utils/helpers.js';
import ImageUploader from '../../components/questioner/ImageUploader';
import BackButton from "../../components/BackButton.jsx";
import InfluencerRecentReviews from "../../components/questioner/RecentReviews.jsx";

const AskQuestion = () => {
    const [searchParams] = useSearchParams();

    const answererId = searchParams.get('answerer_id');
    const questionTypeId = searchParams.get('question_type_id');

    const [answerer, setAnswerer] = useState(null);
    const [questionType, setQuestionType] = useState(null);
    const [formData, setFormData] = useState({
        question: '',
        choices: [],
        pictures: [],
        readonly: false,
    });
    const [loading, setLoading] = useState(false);

    const typeMap = ['Text Question', 'Multiple Choice Question', 'Picture Question'];

    useEffect(() => {
        const fetchAnswerer = async () => {
            try {
                const res = await axios.get(`/answerers/${answererId}`);
                setAnswerer(res.data);
                const selected = res.data.questionTypes.find(q => q._id === questionTypeId);
                setQuestionType(selected);
            } catch {
                toast.error('Failed to load data');
            }
        };
        fetchAnswerer();
    }, []);

    const handleSubmit = () => {
        // basic validation
        if (!formData.question.trim()) {
            toast.error('Please enter your question.');
            return;
        }

        if (
            questionType.type === 1 &&
            (formData.choices.length === 0 || formData.choices.every((c) => c.trim() === ''))
        ) {
            toast.error('Please add at least one answer option.');
            return;
        }

        if (questionType.type === 2 && formData.pictures.length === 0) {
            toast.error('Please upload at least one image.');
            return;
        }

        setFormData({...formData, readonly: true});
    };

    const handlePayment = async () => {
        try {
            setLoading(true); // disable the button
            const payload = new FormData();
            payload.append('question', formData.question);
            payload.append('answerer_id', answererId);
            payload.append('question_type_id', questionTypeId);
            payload.append('price', questionType.price);
            if (questionType.type === 1) payload.append('choices', JSON.stringify(formData.choices));
            if (questionType.type === 2) {
                formData.pictures.forEach(p => payload.append('pictures', p));
            }
            const res = await axios.post('/questions', payload);
            if(res.data.id){
                const res1 = await axios.get(`/questions/${res.data.id}/stripe-session`);
                window.location.href = res1.data.url; // Redirect to Stripe
            }
        } catch {
            toast.error('Failed to submit');
            setLoading(false); // re-enable on error
        }
    };

    if (!answerer || !questionType) return <Spinner animation="border"/>;

    const label = typeMap[questionType.type];

    return (
        <>
            <Container className="py-5">
                <div className="col-lg-8 offset-lg-2">
                    <div className="d-flex align-items-center gap-3 mb-4">
                        <BackButton/>
                        <h1 className="h4 fw-bold text-dark mb-0">Ask {label}</h1>
                    </div>
                    <Card className="p-5 rounded-4 shadow-lg border border-light-subtle bg-white">
                        {/* Header */}
                        <div className="d-flex align-items-center gap-3 mb-4">
                            <Image
                                src={getAvatar(answerer.photo)}
                                alt="Mentor"
                                roundedCircle
                                width={48}
                                height={48}
                            />
                            <div>
                                <h5 className="fw-bold text-dark mb-1">{answerer.name}</h5>
                                <p className="text-muted small mb-0">{answerer.category_name}</p>
                            </div>
                        </div>

                        <Form>
                            {/* Question Textarea */}
                            <Form.Group controlId="question" className="mb-4">
                                <Form.Label column="question" className="fw-medium text-muted">Your Question</Form.Label>
                                <Form.Control
                                    name="question"
                                    as="textarea"
                                    rows={5}
                                    placeholder=""
                                    value={formData.question}
                                    disabled={formData.readonly}
                                    onChange={e => setFormData({...formData, question: e.target.value})}
                                    className="rounded-4 border text-dark"
                                />
                            </Form.Group>

                            {questionType.type === 1 && (
                                <div className="mb-4">
                                    <Form.Label column="" className="fw-medium text-muted mb-2 d-block">Answer
                                        Options(upto {questionType.number_of_choice_options})</Form.Label>
                                    {formData.choices.map((c, idx) => (
                                        <div key={idx} className="d-flex mb-3">
                                            <Form.Control
                                                value={c}
                                                disabled={formData.readonly}
                                                placeholder={`Option ${idx + 1}`}
                                                onChange={e => {
                                                    const updated = [...formData.choices];
                                                    updated[idx] = e.target.value;
                                                    setFormData({...formData, choices: updated});
                                                }}
                                            />
                                            {!formData.readonly && (
                                                <Button
                                                    variant="link" className="text-muted text-hover-danger px-3"
                                                    onClick={() => setFormData({
                                                        ...formData,
                                                        choices: formData.choices.filter((_, i) => i !== idx)
                                                    })}
                                                > <i className="fa-solid fa-trash"></i>
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    {!formData.readonly && formData.choices.length < questionType.number_of_choice_options && (
                                        <Button variant="link"
                                                className="text-primary d-flex align-items-center gap-2 px-0"
                                                onClick={() => setFormData({
                                                    ...formData,
                                                    choices: [...formData.choices, '']
                                                })}>
                                            <i className="fa-solid fa-plus"></i> Add Option
                                        </Button>
                                    )}
                                    <input type="hidden" name="choices" value={JSON.stringify(formData.choices)}/>

                                </div>
                            )}

                            {questionType.type === 2 && (
                                <>
                                    <label className="form-label">Your Images ({formData.pictures.length})</label>
                                    <ImageUploader
                                        files={formData.pictures || []}
                                        setFiles={images => setFormData({...formData, pictures: images})}
                                        maxFiles={questionType.number_of_picture_options}
                                        readonly={formData.readonly}
                                    />

                                </>
                            )}

                            <input type="hidden" name="answerer_id" value={answererId}/>
                            <input type="hidden" name="question_type_id" value={questionTypeId}/>
                            <input type="hidden" name="price" value={questionType.price}/>

                            {/*Price Summary*/}
                            <div className="bg-light rounded-4 p-4 mt-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span className="text-374151">{label} Fee</span>
                                    <span className="fw-bold text-dark">{questionType.price.toFixed(2)}</span>
                                </div>
                                {formData.readonly ? (
                                    <>
                                        <div className="d-flex gap-3">
                                            <Button variant="light"
                                                    className="flex-fill light border-light-subtle me-2 text-374151"
                                                    onClick={() => setFormData({...formData, readonly: false})}
                                                    disabled={loading}
                                            >
                                                Edit Question
                                            </Button>
                                            <Button onClick={handlePayment} className="flex-fill" disabled={loading}>
                                                {loading ? 'Confirming...' : 'Confirm & Pay'}</Button>
                                        </div>
                                    </>
                                ) : (
                                    <Button onClick={handleSubmit} className="w-100 mt-3">Submit Question</Button>
                                )}
                            </div>
                        </Form>
                    </Card>
                </div>
            </Container>
            {/* Section 3: Reviews */}
            <InfluencerRecentReviews reviews={answerer.recent_reviews}/>
        </>
    );
};

export default AskQuestion;
