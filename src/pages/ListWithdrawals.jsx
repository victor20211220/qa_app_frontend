import {useEffect, useState} from 'react';
import axios from '../utils/axios';
import {Container, Spinner, Button, Table} from 'react-bootstrap';
import {toast} from 'react-toastify';
import {getAvatar, viewInfluencerLink} from '../utils/helpers';
import {Link} from "react-router-dom";

const ListWithdrawals = () => {
    const [withdrawals, setWithdrawals] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const limit = 5;

    const fetchWithdrawals = async (page = 1) => {
        try {
            setLoading(true);
            const res = await axios.get(`/withdrawals?page=${page}&limit=${limit}`);
            setWithdrawals(res.data.withdrawals);
            setTotal(res.data.total);
        } catch (err) {
            toast.error('Failed to load withdrawals');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWithdrawals(page);
    }, [page]);

    const formatCurrency = (num) => `$${Number(num || 0).toLocaleString()}`;

    return (
        <Container className="py-5">
            <h2 className="text-36 mb-4">List Withdrawals</h2>

            {loading ? (
                <Spinner animation="border"/>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                    <tr>
                        <th>Answerer</th>
                        <th>Bank</th>
                        <th>Amount</th>
                        <th>Total Earnings</th>
                        <th>Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    {withdrawals.map((w) => (
                        <tr key={w._id}>
                            <td className="d-flex align-items-center gap-2">
                                <img
                                    src={getAvatar(w.answerer.photo)}
                                    alt=""
                                    width="40"
                                    height="40"
                                    className="rounded-circle"
                                />
                                <Link to={viewInfluencerLink(w.answerer._id)}>{w.answerer.name}</Link>
                            </td>
                            <td>{w.bank_name}</td>
                            <td>{formatCurrency(w.amount)}</td>
                            <td>{formatCurrency(w.total_earnings)}</td>
                            <td>{new Date(w.created_at).toLocaleString()}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            )}

            <div className="d-flex justify-content-between align-items-center mt-4">
                <p className="mb-0">
                    Showing {Math.min(page * limit, total)} of {total} withdrawals
                </p>
                <div>
                    <Button
                        variant="secondary"
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="me-2"
                    >
                        Previous
                    </Button>
                    <Button
                        variant="secondary"
                        disabled={page * limit >= total}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </Container>
    );
};

export default ListWithdrawals;
