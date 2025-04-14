import {useEffect} from 'react';
import {Outlet, useNavigate} from 'react-router-dom';
import axios from '../utils/axios';
import {useAppContext} from '../context/AppContext';
import {toast} from 'react-toastify';

const AnswererLayout = () => {
    const {user, setUser, logout} = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await axios.get('/answerers/me');
                setUser({...res.data, type: 'answerer'});
            } catch {
                toast.error('Session expired');
                logout();
                navigate('/login');
            }
        };
        fetch();
    }, []);

    if (!user) return null;

    return (
        <Outlet context={{influencer: user}}/>
    );
};

export default AnswererLayout;
