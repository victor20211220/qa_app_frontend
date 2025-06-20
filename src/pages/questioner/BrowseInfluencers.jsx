import React, {useEffect, useState} from 'react';
import {Col, Form, Button, Spinner, Container} from 'react-bootstrap';
import axios from '../../utils/axios';
import {toast} from 'react-toastify';
import {useSearchParams} from 'react-router-dom';
import ListInfluencerCard from "../../components/questioner/ListInfluencerCard.jsx";
import TableCard from "../../components/TableCard.jsx";
import CustomSelect from "../../components/CustomSelect.jsx";

const BrowseInfluencers = () => {
    const [categories, setCategories] = useState([]);
    const [influencers, setInfluencers] = useState([]);
    const [categoryId, setCategoryId] = useState('');
    const [searchName, setSearchName] = useState('');
    const [debouncedName, setDebouncedName] = useState('');
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const limit = 3;

    const [searchParams] = useSearchParams();

    useEffect(() => {
        const catFromQuery = searchParams.get('category_id');
        if (catFromQuery) {
            setCategoryId(catFromQuery);
        }
    }, [searchParams]);

    useEffect(() => {
        const delay = setTimeout(() => {
            setDebouncedName(searchName);
        }, 500);
        return () => clearTimeout(delay);
    }, [searchName]);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchInfluencers();
    }, [debouncedName, categoryId, page]);

    const fetchCategories = async () => {
        try {
            const res = await axios.get('/categories');
            setCategories(res.data);

        } catch {
            toast.error('Failed to load categories');
        }
    };

    const options = [
        {value: '', label: 'All Categories'},
        ...categories.map(cat => ({
            value: cat._id,
            label: cat.category,
        })),
    ];

    const fetchInfluencers = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (debouncedName) params.append('name', debouncedName);
            if (categoryId) params.append('category_id', categoryId);
            params.append('limit', limit);
            params.append('page', page);

            const res = await axios.get(`/answerers?${params.toString()}`);
            setInfluencers(res.data.answerers);
            setTotal(res.data.total);
        } catch {
            toast.error('Failed to load mentors');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-5">
            <h2 className="text-36 mb-4">Browse Mentors</h2>
            <TableCard
                header={
                    <>
                        <Col>
                            <Form.Control
                                type="search"
                                placeholder="Search by name"
                                value={searchName}
                                onChange={(e) => {
                                    setSearchName(e.target.value);
                                    setPage(1);
                                }}
                            />
                        </Col>
                        <Col xs="auto">
                            <CustomSelect
                                options={options}
                                value={options.find(opt => opt.value === categoryId)}
                                onChange={(selected) => {
                                    setCategoryId(selected.value);
                                    setPage(1);
                                }}
                                isSearchable
                                className="basic-single"
                                classNamePrefix="select"
                            />
                        </Col>
                    </>
                }
                body={
                    <>
                        {loading ? (
                            <Spinner animation="border"/>
                        ) : (
                            <>
                                {influencers.map(inf => (
                                    <ListInfluencerCard influencer={inf} key={inf._id}/>
                                ))}
                            </>
                        )}
                    </>
                }
                footer={
                    <>
                        <p className="text-muted mb-0">
                            Showing {Math.min(page * limit, total)} of {total} mentors
                        </p>
                        <div className="d-flex gap-2">
                            <Button
                                variant="outline-secondary border-light-subtle"
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                                className="rounded-3 text-dark me-2"
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline-secondary border-light-subtle"
                                disabled={page * limit >= total}
                                onClick={() => setPage(page + 1)}
                                className="rounded-3 text-dark"
                            >
                                Next
                            </Button>
                        </div>
                    </>
                }
            >
            </TableCard>
        </Container>
    );
};

export default BrowseInfluencers;
