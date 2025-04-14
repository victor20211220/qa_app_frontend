import {useEffect, useState} from 'react';
import axios from '../../utils/axios.js';
import {Button, Modal, Form, Row, Col, Card} from 'react-bootstrap';
import Select from 'react-select';
import {toast} from 'react-toastify';
import Swal from 'sweetalert2';

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({length: 50}, (_, i) => {
    const y = currentYear - i;
    return {value: y, label: y.toString()};
});

const defaultForm = {
    id: null,
    title: '',
    university: '',
    from_year: null,
    to_year: null,
};

const Educations = () => {
    const [educations, setEducations] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState(defaultForm);

    const fetchEducations = async () => {
        try {
            const res = await axios.get('/educations/me');
            setEducations(res.data);
        } catch {
            toast.error('Failed to load educations');
        }
    };

    useEffect(() => {
        fetchEducations();
    }, []);

    const openModal = (edu = defaultForm) => {
        setForm({
            id: edu._id || null,
            title: edu.title || '',
            university: edu.university || '',
            from_year: edu.from_year ? {value: edu.from_year, label: edu.from_year} : null,
            to_year: edu.to_year ? {value: edu.to_year, label: edu.to_year} : null,
        });
        setShowModal(true);
    };

    const handleSubmit = async () => {
        if (!form.title || !form.university || !form.from_year || !form.to_year) {
            toast.error('All fields are required');
            return;
        }
        if (form.to_year.value < form.from_year.value) {
            toast.error('To year must be after From year');
            return;
        }

        const payload = {
            title: form.title,
            university: form.university,
            from_year: form.from_year.value,
            to_year: form.to_year.value,
        };

        try {
            if (form.id) {
                await axios.put(`/educations/${form.id}`, payload);
                toast.success('Education updated');
            } else {
                await axios.post('/educations', payload);
                toast.success('Education added');
            }
            setShowModal(false);
            fetchEducations();
        } catch {
            toast.error('Failed to save education');
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This will permanently delete the education entry.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`/educations/${id}`);
                    toast.success('Education deleted');
                    fetchEducations();
                } catch {
                    toast.error('Failed to delete');
                }
            }
        });
    };

    return (
        <>
            <div className="mb-3 pb-3"></div>
            <h2 className="text-20 fw-bold mb-4">Education</h2>
            {educations.map((edu) => (
                    <Card className="p-4 border shadow-none rounded-4 mb-3" key={edu._id}>
                        <Row className="justify-content-between align-items-start mb-3">
                            <Col>
                                <p className="fw-bold text-dark mb-1">{edu.title}</p>
                                <p className="text-muted mb-0">{edu.university}</p>
                            </Col>
                            <Col xs="auto">
                                <Button variant="link" className="text-muted p-0 me-3" onClick={() => openModal(edu)}>
                                    <i className="fa-solid fa-pen"></i>
                                </Button>
                                <Button variant="link" className="text-muted p-0" onClick={() => handleDelete(edu._id)}>
                                    <i className="fa-solid fa-trash text-danger"></i>
                                </Button>
                            </Col>
                        </Row>
                        <div className="d-flex align-items-center text-muted small">
                            <i className="fa-regular fa-calendar me-2"></i>
                            <span>{edu.from_year} - {edu.to_year}</span>
                        </div>
                    </Card>

                )
            )}
            <Button variant="link" onClick={() => openModal()}
                    className="d-flex align-items-center text-primary fw-semibold p-0 text-decoration-none">
                <i className="fa-solid fa-plus me-2"></i>Add Education
            </Button>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{form.id ? 'Edit Education' : 'Add Education'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-2">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                value={form.title}
                                onChange={(e) => setForm({...form, title: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>University</Form.Label>
                            <Form.Control
                                value={form.university}
                                onChange={(e) => setForm({...form, university: e.target.value})}
                            />
                        </Form.Group>
                        <Row>
                            <Col>
                                <Form.Label>From Year</Form.Label>
                                <Select
                                    options={yearOptions}
                                    value={form.from_year}
                                    onChange={(val) => setForm({...form, from_year: val})}
                                />
                            </Col>
                            <Col>
                                <Form.Label>To Year</Form.Label>
                                <Select
                                    options={yearOptions}
                                    value={form.to_year}
                                    onChange={(val) => setForm({...form, to_year: val})}
                                />
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <div className="d-flex justify-content-end gap-3">
                        <Button variant="outline-light" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button onClick={handleSubmit} className="rounded-3">Save</Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
        ;
};

export default Educations;
