// src/layouts/MainLayout.jsx
import {Outlet} from 'react-router-dom';
import Header from './Header.jsx';
import Footer from "./Footer.jsx";
import {Container} from 'react-bootstrap';

const MainLayout = () => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Header/>
            <main className="flex-grow-0">
                <Outlet/>
            </main>
            <Footer/>
        </div>
    );
};

export default MainLayout;
