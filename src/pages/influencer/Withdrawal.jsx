import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from '../../utils/axios';
import {Form, Button, Spinner, Card, Col, Row, Container} from 'react-bootstrap';
import {toast} from 'react-toastify';

const Withdrawal = () => {
    const [form, setForm] = useState({
        amount: '',
        bank_name: '',
        routing_number: '',
        bank_address: '',
        account_number: '',
        account_type: '',
    });

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('/answerers/me');
                if ((res.data.total_earnings || 0) < 100) {
                    toast.error('You must have at least $100 to withdraw.');
                    navigate('/');
                } else {
                    setLoading(false);
                }
            } catch {
                toast.error('Failed to load data.');
                navigate('/');
            }
        };
        fetchStats();
    }, []);

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        for (const key in form) {
            formData.append(key, form[key]);
        }

        try {
            await axios.post('/withdrawals', formData);
            toast.success('Withdrawal request submitted');
            navigate('/');
        } catch (err) {
            toast.error('Failed to submit request');
        }
    };

    if (loading) return <Spinner animation="border"/>;

    return (
        <Container className="py-5">
            <Row>
                <Col lg={{span: 8, offset: 2}}>
                    <div id="profile-header" className="mb-5">
                        <h3 className="text-dark fw-bold mb-3">Request Withdrawal</h3>
                        <p className="text-muted">Request withdrawal your earnings</p>
                    </div>
                    <Card className="p-4 rounded-4 shadow border border-light-subtle bg-white">
                        <Form onSubmit={handleSubmit}>
                            <h2 className="text-20 fw-bold mb-4">Withdrawal Information</h2>
                            <Form.Group controlId="amount" className="mb-3">
                                <Form.Label column="amount">Amount ($)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="amount"
                                    required
                                    value={form.amount}
                                    onChange={handleChange}
                                    min={1}
                                />
                            </Form.Group>

                            <Form.Group controlId="bank_name" className="mb-3">
                                <Form.Label column="bank_name">Bank Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="bank_name"
                                    required
                                    value={form.bank_name}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="routing_number" className="mb-3">
                                <Form.Label column="routing_number">Routing Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="routing_number"
                                    value={form.routing_number}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="bank_address" className="mb-3">
                                <Form.Label column="bank_address">Bank Address</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="bank_address"
                                    value={form.bank_address}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="account_number" className="mb-3">
                                <Form.Label column="account_number">Account Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="account_number"
                                    value={form.account_number}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="account_type" className="mb-3">
                                <Form.Label column="account_type">Account Type</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="account_type"
                                    value={form.account_type}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Button type="submit">Submit Withdrawal</Button>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Withdrawal;
