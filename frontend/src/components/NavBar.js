import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

const NavBar = () => (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
        <Container>
            <Navbar.Brand href="#home">OpenSpaceHub</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav variant="underline" defaultActiveKey="/home" className="me-auto">
                    <Nav.Link href="#assets" className="underline-on-active">Assets</Nav.Link>
                    <Nav.Link href="#profiles" className="underline-on-active">Profiles</Nav.Link>
                    <NavDropdown title="Media" id="collapsible-nav-dropdown">
                        <NavDropdown.Item href="#session-recordings" className="underline-on-active">Session Recordings</NavDropdown.Item>
                        <NavDropdown.Item href="#videos" className="underline-on-active">Videos</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#some-other-items">Some other items</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                <Nav>
                    <Nav.Link href="#login" className="underline-on-active">Login</Nav.Link>
                    <Nav.Link eventKey={2} href="#Signup" className="underline-on-active">Sign Up</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>
)
export default NavBar;