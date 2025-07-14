import {Button, Dropdown, Image, Nav} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {useAppContext} from '../context/AppContext.jsx';
import {getAvatar, viewInfluencerLink} from '../utils/helpers.js';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { useEffect } from 'react';

import logoImage from '../assets/images/logo.svg';

const influencerLinks = [
    {
        to: "/", title: "Dashboard",
    },
    {
        to: "/mentor/questions", title: "Questions",
    },
    {
        to: "/how-it-works1", title: "How it works",
    },
];

const questionerLinks = [
    {
        to: "/questioner/browse-mentors", title: "Browse Mentors",
    },
    {
        to: "/questioner/my-questions", title: "My Questions",
    },
    {
        to: "/how-it-works2", title: "How it works",
    },
]

const Header = () => {
    const {logout, userType, user} = useAppContext();
    const isQuestioner = userType === 'questioner';
    const isLoggedIn = !!user;
    const links = isLoggedIn ? (isQuestioner ? questionerLinks : influencerLinks) : [];
    
    useEffect(() => {
        // Load the gtag.js script
        const script = document.createElement('script');
        script.src = 'https://www.googletagmanager.com/gtag/js?id=AW-17077652987';
        script.async = true;
        document.head.appendChild(script);

        // Inject the inline gtag init script
        const inlineScript = document.createElement('script');
        inlineScript.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-17077652987');
        `;
        document.head.appendChild(inlineScript);
    }, []);
    
    return (
        <header>
            <!-- Google tag (gtag.js) -->
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-5GZDW70HJ0"></script>
                <script>
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', 'G-5GZDW70HJ0');
             </script>
            <Navbar expand="lg" className="bg-white py-3">
                <Container>
                    <Navbar.Brand as={Link} to="/">
                        <img
                            alt=""
                            src={logoImage}
                            height="50"
                            className="d-inline-block align-top"
                        />
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="navbarScroll"/>
                    <Navbar.Collapse id="navbarScroll">
                        <Nav className="mx-auto align-items-center">
                            {
                                isLoggedIn ? (
                                    links.map((link) => {
                                        return <Nav.Link as={Link} to={link.to}>{link.title}</Nav.Link>
                                    })
                                ) : <>
                                    <Nav.Link as={Link} to="/">Home</Nav.Link>
                                    <Dropdown align="end">
                                        <Dropdown.Toggle variant="light"
                                                         className="d-flex align-items-center gap-2 border-0 bg-white px-3 py-2 pe-0">
                                            <Nav.Link className="p-0">How it works</Nav.Link>
                                            <i className="fas fa-chevron-down text-muted"/>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item as={Link} to="/how-it-works1">Mentor</Dropdown.Item>
                                            <Dropdown.Item as={Link} to="/how-it-works2">User</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </>
                            }
                        </Nav>
                        {isLoggedIn ? (
                            <Dropdown align="end">
                                <Dropdown.Toggle variant="light"
                                                 className="d-flex align-items-center gap-2 border-0 bg-white"
                                                 id="profile-dropdown">
                                    <Image
                                        src={getAvatar(user.photo)}
                                        roundedCircle
                                        width={40}
                                        height={40}
                                        className="me-3"
                                    />
                                    <div className="text-start">
                                        <div className="fw-semibold text-end mb-1">{user.name}</div>
                                        <div className="text-muted small">{user.email}</div>
                                    </div>
                                    <i className="fas fa-chevron-down ms-2 text-muted"/>
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item as={Link}
                                                   to={(isQuestioner ? `/questioner/edit-profile` : `/mentor/edit-profile`)}>Edit
                                        Profile</Dropdown.Item>
                                    {!isQuestioner &&
                                        <>
                                            <Dropdown.Item as={Link} to={viewInfluencerLink(user._id)}>View
                                                Profile</Dropdown.Item>
                                            <Dropdown.Item as={Link}
                                                           to={`/mentor/withdrawal`}>Withdrawal</Dropdown.Item>
                                        </>
                                    }
                                    <Dropdown.Divider/>
                                    <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login" className={"me-3"}>Sign in</Nav.Link>
                                <Button variant="primary" as={Link} to={""} className={"d-block d-lg-inline-block"}>Get
                                    Started</Button>
                            </>
                        )}
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
};

export default Header;
