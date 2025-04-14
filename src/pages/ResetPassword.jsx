import {useSearchParams, useNavigate} from 'react-router-dom';
import {useState} from 'react';
import axios from '../utils/axios';
import {toast} from "react-toastify";
import {Button, Card, Container, Form} from "react-bootstrap";

export default function ResetPassword() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const token = params.get('token');
    const [password, setPassword] = useState('');

    const submit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/auth/reset-password', {token, password});
            toast.success('Password changed');
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Error');
        }
    };

    return (
        <Container className="py-4">
            <Card className="col-lg-6 offset-lg-3">
                <Form onSubmit={submit}>
                    <Form.Group controlId="password" className="mb-3">
                        <Form.Label>Reset Password</Form.Label>
                        <Form.Control
                            name="password"
                            type="password"
                            placeholder="New password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button type="submit">Reset</Button>
                </Form>
            </Card>
        </Container>
    );
}
