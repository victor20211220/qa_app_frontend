import {Button, Dropdown, Image, Nav} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {useAppContext} from '../context/AppContext.jsx';
import {getAvatar, viewInfluencerLink} from '../utils/helpers.js';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

import logoImage from '../assets/images/logo.svg';

const influencerLinks = [
    {
        to: "/", title: "Dashboard",
    },
    {
        to: "/influencer/questions", title: "Questions",
    },
    {
        to: "/", title: "Analytics",
    },
];

const questionerLinks = [
    {
        to: "/questioner/browse-influencers", title: "Browse Influencers",
    },
    {
        to: "/questioner/my-questions", title: "My Questions",
    },
    {
        to: "/", title: "Support ",
    },
]
const publicLinks = [
    {
        to: "/", title: "How it works"
    },
    {
        to: "/", title: "Features"
    },
    {
        to: "/", title: "Success Stories"
    },
]


const Header = () => {
    const {logout, userType, user} = useAppContext();
    const isQuestioner = userType === 'questioner';
    const isLoggedIn = !!user;
    const links = isLoggedIn ? (isQuestioner ? questionerLinks : influencerLinks) : publicLinks;

    return (
        <header>
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
                        <Nav className="mx-auto">
                            {
                                links.map((link) => {
                                    return <Nav.Link as={Link} to={link.to}>{link.title}</Nav.Link>
                                })
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
                                                   to={(isQuestioner ? `/questioner/edit-profile` : `/influencer/edit-profile`)}>Edit
                                        Profile</Dropdown.Item>
                                    {!isQuestioner &&
                                        <>
                                            <Dropdown.Item as={Link} to={viewInfluencerLink(user._id)}>View
                                                Profile</Dropdown.Item>
                                            <Dropdown.Item as={Link} to={`/influencer/withdrawal`}>Withdrawal</Dropdown.Item>
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
