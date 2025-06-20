import {useState, useEffect} from 'react';
import {Container, Row, Col, Form, Button, Card} from 'react-bootstrap';
import {Link, useNavigate, useLocation} from 'react-router-dom';
import axios from '../utils/axios';
import {toast} from 'react-toastify';
import {useAppContext} from '../context/AppContext';
import {API_URL, FACEBOOK_CLIENT_ID} from "../utils/helpers.js";

const Login = () => {
    const navigate = useNavigate();
    const {login} = useAppContext();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const role = queryParams.get('role');  // Get role from query parameter

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

    // Show the appropriate form based on the role query param or the button clicked
    const [currentForm, setCurrentForm] = useState(role || 'mentor');  // Default to 'mentor'

    useEffect(() => {
        if (role) {
            setCurrentForm(role);
        }
    }, [role]);

    return (
        <Container className="py-5">
            <div className="d-flex justify-content-center align-items-center gap-2 mb-4">
                <Button
                    variant="primary"
                    onClick={() => setCurrentForm('mentor')} // Show Mentor form
                >
                    <i className="fa-solid fa-star text-white me-2"></i>Mentor Login
                </Button>
                <Button
                    variant="info"
                    onClick={() => setCurrentForm('user')} // Show User form
                >
                    <i className="fa-solid fa-user text-white me-2"></i>User Login
                </Button>
            </div>

            <Row>
                <Col lg={{span: 4, offset: 4}} className="mb-4">
                    <Card>
                        <Card.Body>
                            {currentForm === 'mentor' ? (
                                <>
                                    <div
                                        className="d-flex align-items-center justify-content-center bg-E0E7FF rounded-circle home-image-block mx-auto mb-4">
                                        <i className="fa-solid fa-star text-primary text-36"></i>
                                    </div>
                                    <div className="text-center">
                                        <h2 className="mb-2">Mentor Login</h2>
                                        <p className="mb-4">Access your mentor dashboard</p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="danger"
                                        className="mb-3 w-100 rounded-3"
                                        onClick={() => window.location.href = `${API_URL}/auth/google/answerer`}
                                    >
                                        <i className="fa-brands fa-google me-2"></i> Login with Google
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="info"
                                        className="mb-3 w-100 rounded-3"
                                        onClick={() =>
                                            window.location.href = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${FACEBOOK_CLIENT_ID}&redirect_uri=${API_URL}/auth/facebook/callback/answerer&scope=email,public_profile`
                                        }
                                    >
                                        <i className="fa-brands fa-facebook me-2"></i> Login with Facebook
                                    </Button>
                                    <Form onSubmit={(e) => handleSubmit(e, true)}>
                                        <Form.Group controlId="email" className="mb-3">
                                            <Form.Label column="">Email</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                placeholder="your@email.com"
                                                required
                                                value={influencer.email}
                                                onChange={(e) => handleChange(e, true)}
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="password" className="mb-3">
                                            <Form.Label column="">Password</Form.Label>
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
                                                type="checkbox"
                                                id="influencer_remember_me"
                                                label="Remember me"
                                                name="remember_me"
                                                checked={influencer.remember_me}
                                                onChange={(e) => handleChange(e, true)}
                                            />
                                            <Link to="/answerer-forgot-password" className="text-primary">
                                                Forgot password?
                                            </Link>
                                        </div>
                                        <Button type="submit" variant="primary" className="w-100 rounded-3">
                                            Sign In
                                        </Button>
                                    </Form>
                                </>
                            ) : <>
                                <div
                                    className="d-flex align-items-center justify-content-center bg-EDE9FE rounded-circle home-image-block mx-auto mb-4">
                                    <i className="fa-solid fa-user text-info text-36"></i>
                                </div>
                                <div className="text-center">
                                    <h2 className="mb-2">User Login</h2>
                                    <p className="mb-4">Connect with your favorite mentors</p>
                                </div>
                                <Button
                                    type="button"
                                    variant="danger"
                                    className="mb-3 w-100 rounded-3"
                                    onClick={() => window.location.href = `${API_URL}/auth/google/questioner`}
                                >
                                    <i className="fa-brands fa-google me-2"></i> Login with Google
                                </Button>
                                <Button
                                    type="button"
                                    variant="info"
                                    className="mb-3 w-100 rounded-3"
                                    onClick={() =>
                                        window.location.href = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${FACEBOOK_CLIENT_ID}&redirect_uri=${API_URL}/auth/facebook/callback/questioner&scope=email,public_profile`
                                    }
                                >
                                    <i className="fa-brands fa-facebook me-2"></i> Login with Facebook
                                </Button>
                                <Form onSubmit={(e) => handleSubmit(e, false)}>
                                    <Form.Group controlId="user_email" className="mb-3">
                                        <Form.Label column="">Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            placeholder="your@email.com"
                                            required
                                            value={user.email}
                                            onChange={(e) => handleChange(e, false)}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="user_password" className="mb-3">
                                        <Form.Label column="">Password</Form.Label>
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
                                            type="checkbox"
                                            id="user_remember_me"
                                            label="Remember me"
                                            name="remember_me"
                                            checked={user.remember_me}
                                            onChange={(e) => handleChange(e, false)}
                                        />
                                        <Link to="/questioner-forgot-password" className="text-info">
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <Button type="submit" variant="info" className="w-100 rounded-3">
                                        Sign In
                                    </Button>
                                </Form>
                            </>}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <div className="mt-3 text-center">
                Don't have an account? <Link to={`/register?role=${currentForm}`} className="text-primary">Sign up</Link>
            </div>
        </Container>
    );
};

export default Login;
