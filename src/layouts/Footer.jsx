import Container from 'react-bootstrap/Container';
import footerLogoImage from '../assets/images/footer-logo.svg';
import {Col, Row} from "react-bootstrap";
import {Link} from "react-router-dom";

const Footer = () => {

    return (
        <footer className="bg-dark py-5 mt-auto">
            <Container className="border-bottom border-1f2937 pb-5">
                <Row>
                    <Col lg={3}>
                        <Link to="/">
                            <img src={footerLogoImage} alt="" height="50"/>
                        </Link>
                        <div className="mb-3 pb-3"></div>
                        <p className="text-secondary text-14">Connect with mentors and get expert answers to your
                            questions.</p>
                    </Col>
                    <Col lg={9}>
                        <Row>
                            <Col lg={4}>
                                <p className="text-white fw-bold mb-3">Company</p>
                                <Link to={"/"} className="mb-2 text-secondary d-block">About</Link>
                            </Col>
                            <Col lg={4}>
                                <p className="text-white fw-bold mb-3">Resources</p>
                                <Link to={"https://youmentor.me/blog-list"} className="mb-2 text-secondary d-block">Blog</Link>
                            </Col>
                            <Col lg={4}>
                                <p className="text-white fw-bold mb-3">Legal</p>
                                <Link to={"https://youmentor.me/privacy-policy"} className="mb-2 text-secondary d-block">Privacy</Link>
                                <Link to={"https://youmentor.me/terms-and-conditions"} className="mb-2 text-secondary d-block">Terms</Link>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
            <div className="mb-3 pb-3"></div>
            <p className="text-center text-14 text-secondary">© 2025 YouMentor.Me. All rights reserved.</p>
        </footer>
    )
};

export default Footer;
