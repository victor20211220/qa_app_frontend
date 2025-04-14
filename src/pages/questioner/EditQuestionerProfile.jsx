import React, {useEffect, useState} from 'react';
import {Form, Button, Card, Spinner, Image, Container, Row, Col} from 'react-bootstrap';
import axios from '../../utils/axios';
import {toast} from 'react-toastify';
import {useAppContext} from '../../context/AppContext.jsx';
import {getAvatar} from "../../utils/helpers.js";
import CustomFileInput from "../../components/CustomFileInput.jsx";

const EditQuestionerProfile = () => {
    const {setUser} = useAppContext();

    const [photo, setPhoto] = useState(null);
    const [preview, setPreview] = useState(null);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axios.get('/questioners/me');
            setName(res.data.name);
            setPreview(getAvatar(res.data.photo));
        } catch (err) {
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error('Full name is required');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        if (photo) formData.append('photo', photo);

        try {
            const updated = await axios.put('/questioners/me', formData);
            setUser(updated.data);
            toast.success('Profile updated');

        } catch (err) {
            toast.error('Failed to update profile');
        }
    };

    if (loading) return <Spinner animation="border"/>;

    return (
        <Container className="py-5">
            <Row>
                <Col lg={{span: 6, offset: 3}}>
                    <div id="profile-header" className="mb-5">
                        <h3 className="text-dark fw-bold mb-3">Edit Profile</h3>
                        <p className="text-muted">Update your profile information to help others know you better</p>
                    </div>
                    <Card className="p-4 rounded-4 shadow border border-light-subtle bg-white">
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Photo</Form.Label>
                                <div className="d-flex align-items-center">
                                    {preview && (
                                        <Image
                                            src={preview}
                                            roundedCircle
                                            width={64}
                                            height={64}
                                            className="me-3"
                                        />
                                    )}
                                    <CustomFileInput handlePhotoChange={handlePhotoChange}/>
                                </div>
                            </Form.Group>

                            <Form.Group controlId="name" className="mb-3">
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control
                                    name="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <div className="mb-3 pb-3"></div>
                            <div className="d-flex justify-content-start gap-3">
                                <Button variant="outline-light" onClick={() => fetchProfile()}
                                        className="rounded-3">
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
    )
};

export default EditQuestionerProfile;
