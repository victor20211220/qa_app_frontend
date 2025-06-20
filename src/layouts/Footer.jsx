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
                                <Link to={"/"} className="mb-2 text-secondary d-block">Careers</Link>
                                <Link to={"/"} className="mb-2 text-secondary d-block">Press</Link>
                            </Col>
                            <Col lg={4}>
                                <p className="text-white fw-bold mb-3">Resources</p>
                                <Link to={"/"} className="mb-2 text-secondary d-block">Blog</Link>
                                <Link to={"/"} className="mb-2 text-secondary d-block">Help Center</Link>
                                <Link to={"/"} className="mb-2 text-secondary d-block">Guidelines</Link>
                            </Col>
                            <Col lg={4}>
                                <p className="text-white fw-bold mb-3">Legal</p>
                                <Link to={"/"} className="mb-2 text-secondary d-block">Privacy</Link>
                                <Link to={"/"} className="mb-2 text-secondary d-block">Terms</Link>
                                <Link to={"/"} className="mb-2 text-secondary d-block">Cookie Policy</Link>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
            <div className="mb-3 pb-3"></div>
            <p className="text-center text-14 text-secondary">© 2025 AskPro. All rights reserved.</p>
        </footer>
    )
};

export default Footer;
