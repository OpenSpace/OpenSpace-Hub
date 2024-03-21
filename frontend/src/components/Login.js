import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import "./../css/login.css";
import { useGoogleLogin } from '@react-oauth/google';
import axios from "axios";
import APIService from './APIService';

const Login = () => {
    const [inputUsername, setInputUsername] = useState("");
    const [inputPassword, setInputPassword] = useState("");

    const [showLoginError, setShowLoginError] = useState(false);
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
                if (user.token) {
                    console.log(user.token);
                    APIService.VerifyToken(user.token)
                        .then(resp => {
                            if (resp.error) {
                                throw (resp.error);
                            }
                            console.log("Authentication Successful");
                            redirectToHome();
                        })
                        .catch(error => {
                            localStorage.clear();
                        });

                }
                else if (user.access_token) {
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
            }
        },
        [user]
    );

    // // log out function to log the user out of google and set the profile array to null
    // const logOut = () => {
    //     googleLogout();
    //     localStorage.clear();
    //     setProfile(null);
    //     setUser(null);
    // };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setShowLoginError(false);
        await delay(100);
        APIService.Login(inputUsername, inputPassword)
            .then(resp => {
                if (resp.error) {
                    throw (resp.error);
                }
                localStorage.setItem('user',
                    JSON.stringify({
                        "username": resp.username,
                        "firstname": resp.firstname,
                        "lastname": resp.lastname,
                        "link": resp.link,
                        "thumbnail": resp.thumbnail,
                        "token": resp.token,
                        "institution": resp.institution,
                        "favorites": resp.favorites
                    }));
                console.log("Authentication Successful");
                redirectToHome();
            })
            .catch(error => {
                setShowLoginError(true);
            });
        setLoading(false);
    };

    const redirectToHome = () => {
        window.location.href = "/";
    };

    function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
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
                <div className="h4 mb-2 text-center">Sign In</div>
                {showLoginError ? (
                    <Alert
                        className="mb-2"
                        variant="danger"
                        onClose={() => setShowLoginError(false)}
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
                        onChange={(e) => setInputPassword(e.target.value)}
                        required
                    />
                    {/* <div className="d-grid justify-content-end">
                        <Button
                            className="text-muted px-1"
                            variant="link"
                            onClick={handlePassword}
                        >
                            Forgot password?
                        </Button>
                    </div> */}
                </Form.Group>
                {!loading ? (
                    <Button className="w-100" variant="primary" type="submit">
                        Log In
                    </Button>
                ) : (
                    <Button className="w-100" variant="primary" type="submit" disabled>
                        Logging In...
                    </Button>
                )}
                {/* <div className="text-center mt-2">
                    Don't have an account?{" "}
                    <Button variant="link" href="/signup">
                        Sign Up
                    </Button>
                </div> */}
                <div className="d-grid gap-2 mt-2">
                    {profile ? redirectToHome() : (
                        <Button variant="outline-primary" size="lg" onClick={login}>Sign in with Google 🚀 </Button>
                    )}
                </div>

            </Form>
        </div>
    );
};

export default Login;
