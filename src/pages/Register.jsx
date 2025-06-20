// src/pages/Register.jsx
import {useState, useEffect} from 'react';
import {Tabs, Tab, Container, Row, Col, Form, Button, Card} from 'react-bootstrap';
import {useNavigate, useSearchParams, Link} from 'react-router-dom';
import axios from '../utils/axios';
import {toast} from 'react-toastify';
import CustomSelect from "../components/CustomSelect.jsx";
import {API_URL, FACEBOOK_CLIENT_ID} from "../utils/helpers.js";

const Register = () => {
    const [searchParams] = useSearchParams();
    const [key, setKey] = useState('user');
    const navigate = useNavigate();
    const [agreedInfluencer, setAgreedInfluencer] = useState(false);
    const [agreedUser, setAgreedUser] = useState(false);
    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        category_id: '',
        instagram: '',
        youtube: '',
        tiktok: '',
    });

    const categoryOptions = categories.map((c) => ({
        value: c._id,
        label: c.category,
    }));

    useEffect(() => {
        const roleParam = searchParams.get('role');
        if (roleParam === 'mentor' || roleParam === 'user') {
            setKey(roleParam);
        }
    }, [searchParams]);

    useEffect(() => {
        if (key === 'mentor') {
            axios.get('/categories').then((res) => setCategories([...res.data, {_id: null, category: 'Choose later'}]));
        }
    }, [key]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({...prevData, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if ((key === 'mentor' && !agreedInfluencer) || (key === 'user' && !agreedUser)) {
            return toast.warn('Please agree to the terms.');
        }
        try {
            const endpoint =
                key === 'mentor'
                    ? '/auth/answerer/register'
                    : '/auth/questioner/register';
            await axios.post(endpoint, formData);
            toast.success('Registered! Please check your email to verify your account.');
            navigate('/');
        } catch (err) {
            toast.error(err?.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <Container className="py-5">
            <Row>
                <Col lg={{span: 10, offset: 1}}>
                    <Tabs activeKey={key} onSelect={(k) => setKey(k)}
                          className="d-flex gap-2 mb-4 custom-tabs border-0">
                        <Tab eventKey="mentor" title={
                            <span className="fw-semibold">
                               <i className="fa-solid fa-star me-2"></i>
                                <span
                                    className={key === 'mentor' ? 'text-primary' : ''}>Register as Mentor</span>
                              </span>
                        }>
                            <Card>
                                <Card.Body>
                                    <Form onSubmit={handleSubmit}>
                                        <Row>
                                            <Col md={6}>
                                                <h2 className="mb-4">Mentor Information</h2>
                                                <Form.Group controlId="name" className="mb-3">
                                                    <Form.Label column="name">Full Name</Form.Label>
                                                    <Form.Control
                                                        name="name"
                                                        type="text"
                                                        placeholder="Enter your full name"
                                                        required
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                    />
                                                </Form.Group>
                                                <Form.Group controlId="email" className="mb-3">
                                                    <Form.Label column="email">Email Address</Form.Label>
                                                    <Form.Control
                                                        name="email"
                                                        type="email"
                                                        placeholder="Enter your email"
                                                        required
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                    />
                                                </Form.Group>
                                                <Form.Group controlId="password" className="mb-3">
                                                    <Form.Label column="password">Password</Form.Label>
                                                    <Form.Control
                                                        name="password"
                                                        type="password"
                                                        placeholder="Create a password"
                                                        required
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                    />
                                                </Form.Group>
                                                <Form.Group controlId="category_id" className="mb-3">
                                                    <Form.Label column="category_id">Category</Form.Label>
                                                    <CustomSelect
                                                        name="category_id"
                                                        options={categoryOptions}
                                                        value={categoryOptions.find((opt) => opt.value === formData.category_id)}
                                                        onChange={(selected) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                category_id: selected?.value || ''
                                                            }))
                                                        }
                                                        placeholder="Select your expertise"
                                                        isClearable
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <h2 className="mb-4">Social Presence</h2>
                                                <Form.Group controlId="instagram" className="mb-3">
                                                    <Form.Label column="instagram"><i
                                                        className="fa-brands fa-instagram me-2"></i>Instagram
                                                        Username</Form.Label>
                                                    <Form.Control
                                                        name="instagram"
                                                        type="text"
                                                        placeholder="@username"
                                                        value={formData.instagram}
                                                        onChange={handleChange}
                                                    />
                                                </Form.Group>
                                                <Form.Group controlId="youtube" className="mb-3">
                                                    <Form.Label column="youtube"><i
                                                        className="fa-brands fa-youtube me-2"></i>Youtube
                                                        Channel</Form.Label>
                                                    <Form.Control
                                                        name="youtube"
                                                        type="url"
                                                        placeholder="Channel URL"
                                                        value={formData.youtube}
                                                        onChange={handleChange}
                                                    />
                                                </Form.Group>
                                                <Form.Group controlId="tiktok" className="mb-3">
                                                    <Form.Label column="tiktok"><i
                                                        className="fa-brands fa-tiktok me-2"></i>TikTok
                                                        Username</Form.Label>
                                                    <Form.Control
                                                        name="tiktok"
                                                        type="text"
                                                        placeholder="@username"
                                                        value={formData.tiktok}
                                                        onChange={handleChange}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Form.Check
                                            className="mb-3"
                                            id="terms_influencer"
                                            type="checkbox"
                                            label="I agree to the Terms of Service and Privacy Policy"
                                            checked={agreedInfluencer}
                                            onChange={(e) => setAgreedInfluencer(e.target.checked)}
                                            required
                                        />

                                        <Button
                                            type="button"
                                            variant="danger"
                                            className="mb-3 w-100 rounded-3"
                                            onClick={() => window.location.href = `${API_URL}/auth/google/answerer`}>
                                            <i className="fa-brands fa-google me-2"></i> Connect with Google
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="info"
                                            className="mb-3 w-100 rounded-3"
                                            onClick={() => window.location.href = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${FACEBOOK_CLIENT_ID}&redirect_uri=${API_URL}/auth/facebook/callback/answerer&scope=email,public_profile`}>
                                            <i className="fa-brands fa-facebook me-2"></i> Connect with Facebook
                                        </Button>
                                        <Button variant="primary" type="submit" className="w-100 rounded-3">
                                            Create Mentor Account
                                        </Button>
                                        <div className="mt-3 text-center">
                                            Already have an account? <Link to="/login?role=mentor" className="text-primary">Sign
                                            in</Link>
                                        </div>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Tab>

                        <Tab eventKey="user" title={
                            <span className="fw-semibold">
                               <i className="fa-solid fa-user me-2"></i>
                                    <span className={key === 'user' ? 'text-primary' : ''}>Register as User</span>
                                  </span>
                        }>
                            <Card>
                                <Card.Body>
                                    <Form onSubmit={handleSubmit}>
                                        <h2>User Information</h2>
                                        <Form.Group controlId="questioner_name" className="mb-3">
                                            <Form.Label column="">Full Name</Form.Label>
                                            <Form.Control
                                                name="name"
                                                type="text"
                                                placeholder="Enter your full name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="questioner_email" className="mb-3">
                                            <Form.Label column="">Email Address</Form.Label>
                                            <Form.Control
                                                name="email"
                                                type="email"
                                                placeholder="Enter your email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="questioner_password" className="mb-3">
                                            <Form.Label column="">Password</Form.Label>
                                            <Form.Control
                                                name="password"
                                                type="password"
                                                placeholder="Create a password"
                                                required
                                                value={formData.password}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                        <Form.Check
                                            className="mb-3"
                                            id="terms_user"
                                            type="checkbox"
                                            label="I agree to the Terms of Service and Privacy Policy"
                                            checked={agreedUser}
                                            onChange={(e) => setAgreedUser(e.target.checked)}
                                            required
                                        />
                                        <Button
                                            type="button"
                                            variant="danger"
                                            className="mb-3 w-100 rounded-3"
                                            onClick={() => window.location.href = `${API_URL}/auth/google/questioner`}>
                                            <i className="fa-brands fa-google me-2"></i> Connect with Google
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="info"
                                            className="mb-3 w-100 rounded-3"
                                            onClick={() => window.location.href = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${FACEBOOK_CLIENT_ID}&redirect_uri=${API_URL}/auth/facebook/callback/questioner&scope=email,public_profile`}>
                                            <i className="fa-brands fa-facebook me-2"></i> Connect with Facebook
                                        </Button>
                                        <Button variant="primary" type="submit" className="w-100 rounded-3">
                                            Create User Account
                                        </Button>
                                        <div className="mt-3 text-center">
                                            Already have an account? <Link to="/login?role=user" className="text-primary">Sign
                                            in</Link>
                                        </div>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Tab>
                    </Tabs>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;
