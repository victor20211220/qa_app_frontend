// src/pages/Register.jsx
import {useState, useEffect} from 'react';
import {Tabs, Tab, Container, Row, Col, Form, Button, Card} from 'react-bootstrap';
import {useNavigate, useSearchParams, Link} from 'react-router-dom';
import axios from '../utils/axios';
import {toast} from 'react-toastify';
import Select from "react-select";
import CustomSelect from "../components/CustomSelect.jsx";

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
        hourly_rate: '',
    });

    const categoryOptions = categories.map((c) => ({
        value: c._id,
        label: c.category,
    }));

    useEffect(() => {
        const roleParam = searchParams.get('role');
        if (roleParam === 'influencer' || roleParam === 'user') {
            setKey(roleParam);
        }
    }, [searchParams]);

    useEffect(() => {
        if (key === 'influencer') {
            axios.get('/categories').then((res) => setCategories(res.data));
        }
    }, [key]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({...prevData, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if ((key === 'influencer' && !agreedInfluencer) || (key === 'user' && !agreedUser)) {
            return toast.warn('Please agree to the terms.');
        }
        try {
            const endpoint =
                key === 'influencer'
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
                        <Tab eventKey="influencer" title={
                            <span className="fw-semibold">
                               <i className="fa-solid fa-star me-2"></i>
                                <span
                                    className={key === 'influencer' ? 'text-primary' : ''}>Register as Influencer</span>
                              </span>
                        }>
                            <Card>
                                <Card.Body>
                                    <Form onSubmit={handleSubmit}>
                                        <Row>
                                            <Col md={6}>
                                                <h2 className="mb-4">Influencer Information</h2>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Full Name</Form.Label>
                                                    <Form.Control
                                                        name="name"
                                                        type="text"
                                                        placeholder="Enter your full name"
                                                        required
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                    />
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Email Address</Form.Label>
                                                    <Form.Control
                                                        name="email"
                                                        type="email"
                                                        placeholder="Enter your email"
                                                        required
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                    />
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Password</Form.Label>
                                                    <Form.Control
                                                        name="password"
                                                        type="password"
                                                        placeholder="Create a password"
                                                        required
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                    />
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Category</Form.Label>
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
                                                        required={true}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <h2 className="mb-4">Social Presence</h2>
                                                <Form.Group className="mb-3">
                                                    <Form.Label><i className="fa-brands fa-instagram me-2"></i>Instagram Username</Form.Label>
                                                    <Form.Control
                                                        name="instagram"
                                                        type="text"
                                                        placeholder="@username"
                                                        value={formData.instagram}
                                                        onChange={handleChange}
                                                    />
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label><i className="fa-brands fa-youtube me-2"></i>Youtube Channel</Form.Label>
                                                    <Form.Control
                                                        name="youtube"
                                                        type="url"
                                                        placeholder="Channel URL"
                                                        value={formData.youtube}
                                                        onChange={handleChange}
                                                    />
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label><i className="fa-brands fa-tiktok me-2"></i>TikTok Username</Form.Label>
                                                    <Form.Control
                                                        name="tiktok"
                                                        type="text"
                                                        placeholder="@username"
                                                        value={formData.tiktok}
                                                        onChange={handleChange}
                                                    />
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Hourly Rate ($)</Form.Label>
                                                    <Form.Control
                                                        name="hourly_rate"
                                                        type="number"
                                                        placeholder="Enter your hourly rate"
                                                        required
                                                        value={formData.hourly_rate}
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
                                        <Button variant="primary" type="submit" className="w-100 rounded-3">
                                            Create Influencer Account
                                        </Button>
                                        <div className="mt-3 text-center">
                                            Already have an account? <Link to="/login" className="text-primary">Sign in</Link>
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
                                        <Form.Group className="mb-3">
                                            <Form.Label>Full Name</Form.Label>
                                            <Form.Control
                                                name="name"
                                                type="text"
                                                placeholder="Enter your full name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Email Address</Form.Label>
                                            <Form.Control
                                                name="email"
                                                type="email"
                                                placeholder="Enter your email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Password</Form.Label>
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
                                        <Button variant="primary" type="submit" className="w-100 rounded-3">
                                            Create User Account
                                        </Button>
                                        <div className="mt-3 text-center">
                                            Already have an account? <Link to="/login" className="text-primary">Sign in</Link>
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
