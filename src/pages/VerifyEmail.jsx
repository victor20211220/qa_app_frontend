import {useEffect, useState} from 'react';
import {useSearchParams, Link} from 'react-router-dom';
import axios from '../utils/axios';
import {Spinner, Alert, Button} from 'react-bootstrap';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const type = searchParams.get('type') || 'answerer';

    const [status, setStatus] = useState('loading');

    useEffect(() => {
        const verify = async () => {
            try {
                await axios.get(`/auth/verify-email?token=${token}&type=${type}`);
                setStatus('success');
            } catch {
                setStatus('error');
            }
        };

        verify();
    }, [token, type]);

    if (status === 'loading') return <Spinner animation="border"/>;

    return (
        <div className="mt-5 text-center">
            {status === 'success' ? (
                <Alert variant="success">
                    ✅ Email verified! You can now <Link to="/login">Sign In</Link>.
                </Alert>
            ) : (
                <Alert variant="danger">
                    ❌ Verification failed. Please double-check your link.
                </Alert>
            )}
            <Button as={Link} to="/">Back to Home</Button>
        </div>
    );
};

export default VerifyEmail;
