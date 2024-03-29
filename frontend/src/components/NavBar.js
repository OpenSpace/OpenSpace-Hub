import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import { useEffect, useState } from 'react';
import axios from 'axios';
import UploadItem from './UploadItem';
import Function from './Functions';
import APIService from './APIService';


const NavBar = () => {
    // const [user, setUser] = useState(null);
    // const [profile, setProfile] = useState(null);
    const [showLogin, setShowLogin] = useState(true);

    const redirectToLogin = () => {
        window.location.href = "/login";
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            APIService.GetUser()
                .then((res) => {
                    if (res.error) {
                        localStorage.clear();
                        // setUser(null);
                        redirectToLogin();
                    }
                    // setUser(res);
                    setShowLogin(false);

                })
                .catch((err) => {
                    console.log(err);
                    localStorage.clear();
                    // setUser(null);
                    redirectToLogin();
                });
        }
    }, []);


    // useEffect(
    //     () => {
    //         if (!user) {
    //             setUser(JSON.parse(localStorage.getItem('user')));
    //         }
    //         if (user && user.access_token) {
    //             axios
    //                 .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
    //                     headers: {
    //                         Authorization: `Bearer ${user.access_token}`,
    //                         Accept: 'application/json'
    //                     }
    //                 })
    //                 .then((res) => {
    //                     // setProfile(res.data);
    //                     localStorage.setItem('profile', JSON.stringify(res.data));
    //                     setShowLogin(false);
    //                 })
    //                 .catch((err) => {
    //                     console.log(err);
    //                     localStorage.clear();
    //                     setUser(null);
    //                     redirectToLogin();
    //                 });
    //         }
    //         if (user && user.username) {
    //             setShowLogin(false);
    //         }
    //         if (user && user.email) {
    //             setShowLogin(false);
    //         }
    //     },
    //     [user, showLogin]
    // );

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
                            <Nav.Link href="items" className="underline-on-active">Assets</Nav.Link>
                            <Nav.Link href="#profiles" className="underline-on-active">Profiles</Nav.Link>
                            <NavDropdown title="Media" id="collapsible-nav-dropdown">
                                <NavDropdown.Item href="#session-recordings" className="underline-on-active">Session Recordings</NavDropdown.Item>
                                <NavDropdown.Item href="#videos" className="underline-on-active">Videos</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#some-other-items">Some other items</NavDropdown.Item>
                            </NavDropdown>
                            <Function />
                        </Nav>
                        {showLogin ? (
                            <Nav>
                                <Nav.Link href="login" className="underline-on-active">Login</Nav.Link>
                                <Nav.Link eventKey={2} href="signup" className="underline-on-active">Sign Up</Nav.Link>
                            </Nav>
                        ) : (
                            <Nav>
                                <UploadItem />
                                <Nav.Link href="profile" className="underline-on-active">Profile</Nav.Link>
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