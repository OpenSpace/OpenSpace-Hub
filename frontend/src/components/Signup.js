import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Nav } from "react-bootstrap";
import "./../css/login.css";
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import axios from "axios";
import APIService from './APIService';

const Signup = () => {
    const [inputUsername, setInputUsername] = useState("");
    const [inputPassword, setInputPassword] = useState("");
    const [cnfPassword, setCnfPassword] = useState("");

    const [showSignUpError, setShowSignUpError] = useState(false);
    const [showSignUpButton, setShowSignUpButton] = useState(false);
    const [loading, setLoading] = useState(false);

    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);

    const login = useGoogleLogin({
        onSuccess: (response) => {
            setUser(response);
            localStorage.setItem('user', JSON.stringify(response));
        },
        onError: (error) => console.log('Login Failed:', error)
    });

    useEffect(
        () => {
            if (!user) {
                setUser(JSON.parse(localStorage.getItem('user')));
            }
            if (user) {
                axios
                    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json'
                        }
                    })
                    .then((res) => {
                        setProfile(res.data);
                        localStorage.setItem('profile', JSON.stringify(res.data));
                    })
                    .catch((err) => console.log(err));
            }
        },
        [user]
    );

    // log out function to log the user out of google and set the profile array to null
    const logOut = () => {
        googleLogout();
        localStorage.clear();
        setProfile(null);
        setUser(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setShowSignUpError(false);
        await delay(500);
        APIService.Register(inputUsername, inputPassword, cnfPassword)
            .then(resp => {
                if (resp.error) {
                    throw (resp.error);
                }
                localStorage.setItem('user', JSON.stringify({ "username": inputUsername }));
                console.log("Authentication Successful")
                redirectToHome();
            })
            .catch(error => {
                setShowSignUpError(true);
            });
        setLoading(false);
    };

    const redirectToHome = () => {
        window.location.href = "/";
    };

    function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    const updateShowSignUpButton = (inputPassword, cnfPassword) => {
        if (inputPassword === cnfPassword) {
            setShowSignUpButton(true);
        } else {
            setShowSignUpButton(false);
        }
    }

    return (
        <div
            className="sign-in__wrapper"
        //   style={{ backgroundImage: `url(${BackgroundImage})` }}
        >
            <div className="sign-in__backdrop"></div>
            <Form className="shadow p-4 bg-white rounded" onSubmit={handleSubmit}>
                <img
                    className="img-thumbnail mx-auto d-block mb-2"
                    src="openspace-horizontal-color-on-black.png"
                    alt="logo"
                    style={{ width: '120px', height: 'auto' }}
                />
                <div className="h4 mb-2 text-center">Sign Up</div>
                {showSignUpError ? (
                    <Alert
                        className="mb-2"
                        variant="danger"
                        onClose={() => setShowSignUpError(false)}
                        dismissible
                    >
                        Incorrect username or password.
                    </Alert>
                ) : (
                    <div />
                )}
                <Form.Group className="mb-2" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        value={inputUsername}
                        placeholder="Username"
                        onChange={(e) => setInputUsername(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-2" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={inputPassword}
                        placeholder="Password"
                        onChange={(e) => {setInputPassword(e.target.value); updateShowSignUpButton(e.target.value, cnfPassword);}}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-2" controlId="cnfPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={cnfPassword}
                        placeholder="Confirm Password"
                        onChange={(e) => {setCnfPassword(e.target.value); updateShowSignUpButton(inputPassword, e.target.value);}}
                        required
                    />
                </Form.Group>
                {inputPassword !== cnfPassword ? (
                    <Alert
                        className="mb-2"
                        variant="danger"
                    >
                        Password and Confirm Password do not match.
                    </Alert>
                ) : (
                    <div />
                )}
                {!loading ?
                    showSignUpButton ? (
                        <Button className="w-100" variant="primary" type="submit">
                            Sign Up
                        </Button>
                    ) : (
                        <Button className="w-100" variant="primary" type="submit" disabled>
                            Sign Up
                        </Button>
                    )
                    :
                    (
                        <Button className="w-100" variant="primary" type="submit" disabled>
                            Signing up...
                        </Button>
                    )
                }
                {/* <div className="text-center mt-2">
                    Don't have an account?{" "}
                    <Button variant="link" href="/signup">
                        Sign Up
                    </Button>
                </div> */}
                <div className="d-grid gap-2 mt-2">
                    {profile ? (
                        <div>
                            <script>console.log(profile)</script>
                            <img src={profile.picture} alt="" />
                            <h5>Welcome {profile.name} !</h5>
                            <p>Email Address: {profile.email}</p>
                            <Button onClick={logOut}>Log out</Button>
                        </div>
                    ) : (
                        <Button variant="outline-primary" size="lg" onClick={login}>Sign in with Google 🚀 </Button>
                    )}
                </div>

            </Form>
        </div>
    );
};

export default Signup;
