import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import "./../css/login.css";
import { useGoogleLogin } from '@react-oauth/google';
import FacebookLogin from 'react-facebook-login';
import axios from "axios";
import APIService from './APIService';

const Login = () => {
    const [inputEmail, setInputEmail] = useState("");
    const [inputPassword, setInputPassword] = useState("");

    const [showLoginError, setShowLoginError] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(
        () => {
            const token = localStorage.getItem('token');
            if (token) {
                APIService.VerifyToken(token)
                    .then(resp => {
                        if (resp.error) {
                            throw (resp.error);
                        }
                        redirectToHome();
                    })
                    .catch(error => {
                        localStorage.clear();
                        console.log("Error: " + error);
                    });
            }
        },
        []
    );

    const login = useGoogleLogin({
        onSuccess: async (response) => {
            await axios.get(
                `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${response.access_token}`, {
                headers: {
                    Authorization: `Bearer ${response.access_token}`,
                    Accept: 'application/json'
                }
            }).then(async (res) => {
                await APIService.SocialMediaLogin(
                    res.data['given_name'] + " " + res.data['family_name'],
                    response.access_token,
                    res.data['email'],
                    "google", // domain
                    res.data['picture'],
                ).then(resp => {
                    localStorage.setItem('token', resp.token);
                    redirectToHome();
                }).catch((err) => console.log(err));
            }).catch((err) => console.log(err));
        },
        onError: (error) => console.log('Login Failed:', error)
    });


    // Facebook login
    const responseFacebook = async (response) => {
        await APIService.SocialMediaLogin(
            response.name,
            response.accessToken,
            response.email,
            "facebook", // domain
            response.picture.data.url,
        ).then(resp => {
            localStorage.setItem('token', resp.token);
            console.log(resp)
            redirectToHome();
        }).catch((err) => console.log(err));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setShowLoginError(false);
        await delay(500);
        APIService.Login(inputEmail, inputPassword)
            .then(resp => {
                if (resp.error) {
                    throw (resp.error);
                }
                localStorage.setItem('token', resp.token);
                console.log("Authentication Successful")
                redirectToHome();
            })
            .catch(error => {
                alert("Error: " + error);
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
                <Form.Group className="mb-2" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        value={inputEmail}
                        placeholder="Email"
                        onChange={(e) => setInputEmail(e.target.value)}
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
                    <Button variant="outline-primary" size="lg" onClick={login}>Sign in with Google 🚀 </Button>
                </div>

                <FacebookLogin
                    appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                    autoLoad={false}
                    fields="name, email, picture"
                    scope="public_profile,email"
                    callback={responseFacebook}
                    render={(renderProps) => (
                        <Button
                            variant="outline-primary"
                            size="lg"
                            onClick={renderProps.onClick}
                        >Sign in with Facebook
                        </Button>
                    )}
                />
            </Form>
        </div>
    );
};

export default Login;
