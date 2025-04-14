// src/context/AppContext.js
import {createContext, useContext, useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

const AppContext = createContext();

export const AppProvider = ({children}) => {
    const [userToken, setUserToken] = useState(null);
    const [userType, setUserType] = useState(null);
    const [user, setUser] = useState(null); // ✅ Add profile info state
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('token') || localStorage.getItem('token');
        const type = sessionStorage.getItem('userType') || localStorage.getItem('userType');
        const storedUser = sessionStorage.getItem('user') || localStorage.getItem('user');

        if (token && type) {
            setUserToken(token);
            setUserType(type);
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        }
    }, []);

    const login = (token, type, remember) => {
        setUserToken(token);
        setUserType(type);

        if (remember) {
            localStorage.setItem('token', token);
            localStorage.setItem('userType', type);
        } else {
            sessionStorage.setItem('token', token);
            sessionStorage.setItem('userType', type);
        }
    };

    const logout = () => {
        setUserToken(null);
        setUserType(null);
        setUser(null);
        localStorage.clear();
        sessionStorage.clear();
        navigate('/');
    };

    // Sync user info to storage
    useEffect(() => {
        if (user) {
            console.log(`user`, user);
            const data = JSON.stringify(user);
            if (localStorage.getItem('token')) {
                localStorage.setItem('user', data);
            } else {
                sessionStorage.setItem('user', data);
            }
        } else {
            localStorage.removeItem('user');
            sessionStorage.removeItem('user');
        }
    }, [user]);

    return (
        <AppContext.Provider value={{userToken, userType, login, logout, user, setUser}}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
