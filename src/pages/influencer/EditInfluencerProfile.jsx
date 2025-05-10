import {useEffect, useState} from 'react';
import {Form, Button, Row, Col, Image, Container, Card} from 'react-bootstrap';
import {toast} from 'react-toastify';
import axios from '../../utils/axios.js';
import {useAppContext} from '../../context/AppContext.jsx';
import Educations from '../../components/influencer/Educations.jsx';
import {getAvatar} from "../../utils/helpers.js";
import CustomFileInput from "../../components/CustomFileInput.jsx";
import CreatableSelect from 'react-select/creatable';
import CustomSelect from "../../components/CustomSelect.jsx";

const customStyles = {
    control: (base) => ({
        ...base,
        border: 'none',
        boxShadow: 'none',
        minHeight: 'auto',
        padding: '4px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        fontSize: '14px',
    }),
    multiValue: (base) => ({
        ...base,
        backgroundColor: '#eef2ff',
        borderRadius: '9999px',
        padding: '4px 12px',
        fontWeight: 500,
    }),
    multiValueLabel: (base) => ({
        ...base,
        color: '#4f46e5',
        fontSize: '14px',
    }),
    multiValueRemove: () => ({
        display: 'none',
    }),
    placeholder: (base) => ({
        ...base,
        color: '#4f46e5',
        fontSize: '14px',
    }),
};

const EditInfluencerProfile = () => {
    const {setUser} = useAppContext();
    const [form, setForm] = useState({
        name: '',
        instagram: '',
        youtube: '',
        tiktok: '',
        bio: '',
    });
    const [expertise, setExpertise] = useState([]);
    const [photoPreview, setPhotoPreview] = useState('');
    const [photoFile, setPhotoFile] = useState(null);
    const [categories, setCategories] = useState([]);
    const categoryOptions = categories.map((c) => ({
        value: c._id,
        label: c.category,
    }));

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axios.get('/answerers/me');
            setForm({
                name: res.data.name || '',
                instagram: res.data.instagram || '',
                youtube: res.data.youtube || '',
                tiktok: res.data.tiktok || '',
                bio: res.data.bio || '',
                category_id: res.data.category_id || '',
            });
            setExpertise(res.data.expertise || []);
            setPhotoPreview(getAvatar(res.data.photo) || '');
        } catch {
            toast.error('Failed to load profile');
        }
    };

    useEffect(() => {
        axios.get('/categories').then((res) => setCategories(res.data));
    }, []);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm((prev) => ({...prev, [name]: value}));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhotoFile(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) {
            toast.error('Please fill in all required fields with valid values');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('category_id', form.category_id);
            formData.append('instagram', form.instagram);
            formData.append('youtube', form.youtube);
            formData.append('tiktok', form.tiktok);
            formData.append('bio', form.bio);
            formData.append('expertise', JSON.stringify(expertise));
            if (photoFile) {
                formData.append('photo', photoFile);
            }

            const updated = await axios.put('/answerers/me', formData, {
                headers: {'Content-Type': 'multipart/form-data'},
            });

            setUser(updated.data);

            toast.success('Profile updated');
            setPhotoFile(null);
        } catch {
            toast.error('Failed to save changes');
        }
    };

    return (
        <Container className="py-5">
            <Row>
                <Col lg={{span: 8, offset: 2}}>
                    <div id="profile-header" className="mb-5">
                        <h3 className="text-dark fw-bold mb-3">Edit Profile</h3>
                        <p className="text-muted">Update your profile information to help others know you better</p>
                    </div>
                    <Card className="p-4 rounded-4 shadow border border-light-subtle bg-white">
                        <Form onSubmit={handleSubmit}>
                            <h2 className="text-20 fw-bold mb-4">Basic Information</h2>
                            <Form.Group className="mb-4">
                                {photoPreview && (
                                    <Image src={photoPreview} roundedCircle width={80} height={80} className="me-4"/>
                                )}
                                <CustomFileInput handlePhotoChange={handlePhotoChange}/>
                            </Form.Group>
                            <Row className="g-3 mb-4">
                                <Col md={6}>
                                    <Form.Group controlId="name">
                                        <Form.Label column="name">Full Name *</Form.Label>
                                        <Form.Control
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="category_id">
                                        <Form.Label column="category_id">Category</Form.Label>
                                        <CustomSelect
                                            name="category_id"
                                            options={categoryOptions}
                                            value={categoryOptions.find((opt) => opt.value === form.category_id)}
                                            onChange={(selected) =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    category_id: selected?.value || ''
                                                }))
                                            }
                                            placeholder="Select your expertise"
                                            isClearable
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <div className="mb-3 pb-3"></div>
                            <h2 className="text-20 fw-bold mb-4">Expertise & Rates</h2>
                            <Form.Group controlId="expertise" className="mb-3">
                                <Form.Label column="expertise">Areas of Expertise</Form.Label>
                                <CreatableSelect
                                    isMulti
                                    value={expertise.map((e) => ({label: e, value: e}))}
                                    onChange={(selected) => setExpertise(selected.map((s) => s.value))}
                                    placeholder="+ Add More"
                                    styles={customStyles}
                                />
                            </Form.Group>
                            <Educations/>

                            <div className="mb-3 pb-3"></div>
                            <h2 className="text-20 fw-bold mb-4">Social Media Links</h2>
                            <Row className="g-3 mb-4">
                                <Col md={6}>
                                    <Form.Group controlId="instagram">
                                        <Form.Label column="instagram"><i className="fa-brands fa-instagram me-2"></i>Instagram
                                            Username</Form.Label>
                                        <Form.Control
                                            name="instagram"
                                            placeholder="@username"
                                            value={form.instagram}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="youtube">
                                        <Form.Label column="youtube"><i className="fa-brands fa-youtube me-2"></i>Youtube
                                            Channel</Form.Label>
                                        <Form.Control
                                            type="url"
                                            name="youtube"
                                            placeholder="Channel URL"
                                            value={form.youtube}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="g-3 mb-4">
                                <Col md={6}>
                                    <Form.Group controlId="tiktok">
                                        <Form.Label column="tikok"><i className="fa-brands fa-tiktok me-2"></i>TikTok
                                            Username</Form.Label>
                                        <Form.Control
                                            name="tiktok"
                                            type="text"
                                            placeholder="@username"
                                            value={form.tiktok}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <div className="mb-3 pb-3"></div>
                            <h2 className="text-20 fw-bold mb-4">Bio</h2>
                            <Form.Group className="mb-4">
                                <Form.Control
                                    as="textarea"
                                    name="bio"
                                    rows={5}
                                    placeholder="Tell us about yourself…"
                                    value={form.bio}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <div className="d-flex justify-content-end gap-3">
                                <Button variant="outline-light" onClick={() => fetchProfile()} className="rounded-3">
                                    Cancel
                                </Button>
                                <Button variant="primary" type="submit" className="rounded-3">
                                    Save Changes
                                </Button>
                            </div>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default EditInfluencerProfile;
