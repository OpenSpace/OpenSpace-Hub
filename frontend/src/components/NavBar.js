import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import { useEffect, useState } from 'react';
import UploadItem from './UploadItem';
import Function from './Functions';
import APIService from './APIService';
import UserProfile from './UserItems';


const NavBar = ({ user, showLogin }) => {
    return (
        <>
            <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand href="/">
                        <img
                            src="openspace-black-transparent.png"
                            width="90"
                            height="50"
                            className="d-inline-block align-top"
                            alt="OpenSpaceHub logo"
                        />

                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav variant="underline" defaultActiveKey="/home" className="me-auto">
                            <Nav.Link href="items" className="underline-on-active">Home</Nav.Link>
                            <Nav.Link href="assets" className="underline-on-active">Assets</Nav.Link>
                            <Nav.Link href="profiles" className="underline-on-active">Profiles</Nav.Link>
                            <Nav.Link href="webpanels" className="underline-on-active">WebPanels</Nav.Link>
                            <Nav.Link href="configs" className="underline-on-active">Configs</Nav.Link>
                            <NavDropdown title="Media" id="collapsible-nav-dropdown">
                                <NavDropdown.Item href="recordings" className="underline-on-active">Recordings</NavDropdown.Item>
                                <NavDropdown.Item href="videos" className="underline-on-active">Videos</NavDropdown.Item>
                            </NavDropdown>
                            <Function />
                        </Nav>
                        {showLogin ? (
                            <Nav>
                                <Nav.Link href="signin" className="underline-on-active">Sign In</Nav.Link>
                                {/* <Nav.Link eventKey={2} href="signup" className="underline-on-active">Sign Up</Nav.Link> */}
                            </Nav>
                        ) : (
                            <Nav>
                                <UploadItem />
                                <NavDropdown title={user.name} id="collapsible-nav-dropdown">
                                    <NavDropdown.Item href="useritems" className="underline-on-active">View Items</NavDropdown.Item>
                                    <NavDropdown.Item href="userprofile" className="underline-on-active">Profile</NavDropdown.Item>
                                </NavDropdown>
                                <Nav.Link eventKey={2} href="logout" className="underline-on-active">Logout</Nav.Link>
                            </Nav>
                        )}
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Outlet />
            <Footer />
        </>
    )
};
export default NavBar;