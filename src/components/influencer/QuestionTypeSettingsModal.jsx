import {useEffect, useState} from 'react';
import {
    Modal,
    Button,
    Form,
    Row,
    Col,
    Card
} from 'react-bootstrap';
import axios from '../../utils/axios.js';
import {toast} from 'react-toastify';

const defaultTypes = [
    {type: 2, label: 'Picture Questions', fields: {number_of_picture_options: null}},
    {type: 1, label: 'Multiple Choice Questions', fields: {number_of_choice_options: null}},
    {type: 0, label: 'Text Questions', fields: {}},
];

const QuestionTypeSettingsModal = ({show, onClose, answererId}) => {
    const [types, setTypes] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!show) return;

        const load = async () => {
            try {
                const res = await axios.get('/question-types');
                const mapped = defaultTypes.map((base) => {
                    const existing = res.data.find((q) => q.type === base.type);
                    return {
                        id: existing?._id ?? null,
                        type: base.type,
                        label: base.label,
                        price: existing?.price ?? '',
                        response_time: existing?.response_time ?? '',
                        enabled: existing?.enabled ?? false,
                        ...(base.type === 1 && {number_of_choice_options: existing?.number_of_choice_options ?? null}),
                        ...(base.type === 2 && {number_of_picture_options: existing?.number_of_picture_options ?? null})
                    };
                });
                setTypes(mapped);
            } catch {
                toast.error('Failed to load question types');
            }
        };

        load();
    }, [show]);

    const updateField = (index, key, value) => {
        setTypes((prev) => {
            const next = [...prev];
            next[index][key] = value;
            return next;
        });
    };

    const handleSave = async () => {
        setSubmitting(true);
        try {
            for (const t of types) {
                if (t.enabled) {
                    if (!t.price || Number(t.price) < 0.5) {
                        toast.error(`${t.label}: Price must be greater than 0.5`);
                        setSubmitting(false);
                        return;
                    }
                    if (!t.response_time || Number(t.response_time) <= 0) {
                        toast.error(`${t.label}: Response time must be greater than 0`);
                        setSubmitting(false);
                        return;
                    }
                    if (t.type === 1 && !t.number_of_choice_options) {
                        toast.error(`${t.label}: Please select number of choices`);
                        setSubmitting(false);
                        return;
                    }
                    if (t.type === 2 && !t.number_of_picture_options) {
                        toast.error(`${t.label}: Please select number of picture options`);
                        setSubmitting(false);
                        return;
                    }
                }

                const payload = {
                    type: t.type,
                    price: Number(t.price),
                    response_time: Number(t.response_time),
                    enabled: t.enabled,
                    answerer_id: answererId,
                };

                if (t.type === 1) payload.number_of_choice_options = Number(t.number_of_choice_options);
                if (t.type === 2) payload.number_of_picture_options = Number(t.number_of_picture_options);

                if (t.id) {
                    await axios.put(`/question-types/${t.id}`, payload);
                } else {
                    await axios.post('/question-types', payload);
                }
            }

            toast.success('Question types saved');
            onClose();
        } catch {
            toast.error('Failed to save settings');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal show={show} onHide={onClose} size="lg" centered>
            <Modal.Header closeButton className="py-4">
                <h2 className="mb-0 fw-bold text-dark">Question Types Settings</h2>
            </Modal.Header>
            <Modal.Body>
                {types.map((q, idx) => (
                    <Card key={q.type} className="mb-4 p-4 border-0 shadow-sm rounded-4 bg-light">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="d-flex align-items-center gap-3">
                                <i className={`fa-solid fa-${q.type === 0 ? "align-left" : (q.type === 1 ? "list-ul" : "image")} text-primary fs-5`}></i>
                                <h5 className="text-18 mb-0 fw-semibold text-dark">{q.label}</h5>
                            </div>
                            <Form.Check
                                type="switch"
                                id={`enabled-${q.type}`}
                                className="text-24"
                                label=""
                                checked={q.enabled}
                                onChange={(e) => updateField(idx, 'enabled', e.target.checked)}
                            />
                        </div>

                        {q.type !== 0 && (
                            <Form.Group className="d-block d-lg-flex align-items-center gap-3 mb-4">
                                <Form.Label column="" className="fw-medium text-muted mb-0">
                                    Number of {q.type === 1 ? 'choices' : 'options'}:
                                </Form.Label>
                                <div className="d-flex gap-2 flex-wrap">
                                    {[2, 3, 4, 5, 6].map((num) => {
                                        const isActive =
                                            q.type === 1
                                                ? q.number_of_choice_options === num
                                                : q.number_of_picture_options === num;

                                        return (
                                            <Button
                                                key={num}
                                                variant={isActive ? 'primary' : 'outline-secondary'}
                                                className="rounded-circle p-0 text-center"
                                                style={{width: '32px', height: '32px'}}
                                                onClick={() =>
                                                    updateField(idx, q.type === 1 ? 'number_of_choice_options' : 'number_of_picture_options', num)
                                                }
                                            >
                                                {num}
                                            </Button>
                                        );
                                    })}
                                </div>
                            </Form.Group>
                        )}

                        <Row>
                            <Col md={6}>
                                <Form.Group controlId={`price_${idx}`} className="mb-3">
                                    <Form.Label column="">Fixed price ($)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={q.price}
                                        onChange={(e) => updateField(idx, 'price', e.target.value)}
                                        min={1}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId={`response_time_${idx}`} className="mb-3">
                                    <Form.Label column="">Response time (hours)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={q.response_time}
                                        onChange={(e) => updateField(idx, 'response_time', e.target.value)}
                                        min={1}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Card>
                ))}
            </Modal.Body>
            <Modal.Footer className="bg-white">
                <Button variant="outline-light" onClick={onClose} className="border text-muted">
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSave} disabled={submitting} className="rounded-3">
                    {submitting ? 'Saving...' : 'Save Settings'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default QuestionTypeSettingsModal;
