import {useState} from 'react';
import axios from '../../utils/axios';
import {toast} from 'react-toastify';
import {Button, Card, Container, Form} from "react-bootstrap";

const AnswererForgotPassword = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/auth/forgot-password', {
                email,
                role: 'answerer',
            });
            toast.success('Reset email sent! Please check your inbox.');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to send reset email');
        }
    };

    return (
        <Container className="py-4">
            <Card className="col-lg-6 offset-lg-3">
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="email" className="mb-3">
                        <Form.Label>Forgot Password (Mentor)</Form.Label>
                        <Form.Control
                            name="email"
                            type="email"
                            placeholder="Your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control mb-2"
                            required="true"
                        />
                    </Form.Group>
                    <Button className="btn btn-primary" type="submit">
                        Send Reset Email
                    </Button>
                </Form>
            </Card>
        </Container>
    );
};

export default AnswererForgotPassword;
