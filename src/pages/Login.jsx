// src/pages/Login.jsx
import {useState} from 'react';
import {Container, Row, Col, Form, Button, Card} from 'react-bootstrap';
import {Link, useNavigate} from 'react-router-dom';
import axios from '../utils/axios';
import {toast} from 'react-toastify';
import {useAppContext} from '../context/AppContext';

const Login = () => {
    const navigate = useNavigate();
    const {login} = useAppContext();

    const [influencer, setInfluencer] = useState({email: '', password: '', remember_me: false});
    const [user, setUser] = useState({email: '', password: '', remember_me: false});

    const handleChange = (e, isInfluencer) => {
        const {name, value, checked, type} = e.target;
        const updated = type === 'checkbox' ? checked : value;
        if (isInfluencer) {
            setInfluencer((prev) => ({...prev, [name]: updated}));
        } else {
            setUser((prev) => ({...prev, [name]: updated}));
        }
    };

    const handleSubmit = async (e, isInfluencer) => {
        e.preventDefault();
        const data = isInfluencer ? influencer : user;
        const endpoint = isInfluencer ? '/auth/answerer/login' : '/auth/questioner/login';
        try {
            const res = await axios.post(endpoint, data);
            const token = res.data.token;
            const type = isInfluencer ? 'answerer' : 'questioner';

            login(token, type, data.remember_me);
            toast.success('Login successful!');
            navigate('/');
        } catch (err) {
            toast.error(err?.response?.data?.error || 'Login failed');
        }
    };

    return (
        <Container className="py-5">
            <div className="d-flex justify-content-center align-items-center gap-2 mb-4">
                <Button variant="primary">
                    <i className="fa-solid fa-star text-white me-2"></i>Influencer Login
                </Button>
                <Button variant="info">
                    <i className="fa-solid fa-user text-white me-2"></i>User Login
                </Button>
            </div>
            <Row>
                <Col lg={{span: 4, offset: 2}} className="mb-4">
                    <Card>
                        <Card.Body>
                            <div
                                className="d-flex align-items-center justify-content-center bg-E0E7FF rounded-circle home-image-block mx-auto mb-4">
                                <i className="fa-solid fa-star text-primary text-36"></i>
                            </div>
                            <div className="text-center">
                                <h2 className="mb-2">Influencer Login</h2>
                                <p className="mb-4">
                                    Access your influencer dashboard
                                </p>
                            </div>
                            <Form onSubmit={(e) => handleSubmit(e, true)}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        placeholder="your@email.com"
                                        required
                                        value={influencer.email}
                                        onChange={(e) => handleChange(e, true)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        required
                                        value={influencer.password}
                                        onChange={(e) => handleChange(e, true)}
                                    />
                                </Form.Group>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <Form.Check
                                        className=""
                                        type="checkbox"
                                        id="influencer_remember_me"
                                        label="Remember me"
                                        name="remember_me"
                                        checked={influencer.remember_me}
                                        onChange={(e) => handleChange(e, true)}
                                    />
                                    <Link to="/answerer-forgot-password" className="text-primary">Forgot
                                        password?</Link>
                                </div>
                                <Button type="submit" variant="primary" className="w-100 rounded-3">
                                    Sign In
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={{span: 4}} className="mb-4">
                    <Card>
                        <Card.Body>
                            <div
                                className="d-flex align-items-center justify-content-center bg-EDE9FE rounded-circle home-image-block mx-auto mb-4">
                                <i className="fa-solid fa-user text-info text-36"></i>
                            </div>
                            <div className="text-center">
                                <h2 className="mb-2">User Login</h2>
                                <p className="mb-4">
                                    Connect with your favorite influencers
                                </p>
                            </div>
                            <Form onSubmit={(e) => handleSubmit(e, false)}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        placeholder="your@email.com"
                                        required
                                        value={user.email}
                                        onChange={(e) => handleChange(e, false)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        required
                                        value={user.password}
                                        onChange={(e) => handleChange(e, false)}
                                    />
                                </Form.Group>

                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <Form.Check
                                        className=""
                                        type="checkbox"
                                        id="user_remember_me"
                                        label="Remember me"
                                        name="remember_me"
                                        checked={user.remember_me}
                                        onChange={(e) => handleChange(e, false)}
                                    />
                                    <Link to="/questioner-forgot-password" className="text-info">Forgot password?</Link>
                                </div>
                                <Button type="submit" variant="info" className="w-100 rounded-3">
                                    Sign In
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <div className="mt-3 text-center">
                Don't have an account? <Link to="/register?role=influencer" className="text-primary">Sign up</Link>
            </div>
        </Container>
    );
};

export default Login;
