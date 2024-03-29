import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import "./../css/login.css";
import { useGoogleLogin } from '@react-oauth/google';
import FacebookLogin from 'react-facebook-login';
import axios from "axios";
import APIService from './APIService';

const Signup = () => {
    const [inputName, setInputName] = useState("");
    const [inputEmail, setInputEmail] = useState("");
    const [inputPassword, setInputPassword] = useState("");
    const [cnfPassword, setCnfPassword] = useState("");

    const [showSignUpError, setShowSignUpError] = useState(false);
    const [showSignUpButton, setShowSignUpButton] = useState(false);
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
        setShowSignUpError(false);
        await delay(500);
        APIService.Register(inputName, inputEmail, inputPassword, cnfPassword)
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

    const updateShowSignUpButton = (inputEmail, inputPassword, cnfPassword) => {
        //validate email
        inputEmail = inputEmail.trim();
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (inputEmail.match(emailPattern) && inputPassword === cnfPassword) {
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
                <Form.Group className="mb-2" controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={inputName}
                        placeholder="Name"
                        onChange={(e) => { setInputName(e.target.value); }}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-2" controlId="email">
                    <Form.Label>Email Id</Form.Label>
                    <Form.Control
                        type="email"
                        value={inputEmail}
                        placeholder="Enter Your Email"
                        onChange={(e) => { setInputEmail(e.target.value); updateShowSignUpButton(e.target.value, inputPassword, cnfPassword); }}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-2" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={inputPassword}
                        placeholder="Password"
                        onChange={(e) => { setInputPassword(e.target.value); updateShowSignUpButton(inputEmail, e.target.value, cnfPassword); }}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-2" controlId="cnfPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={cnfPassword}
                        placeholder="Confirm Password"
                        onChange={(e) => { setCnfPassword(e.target.value); updateShowSignUpButton(inputEmail, inputPassword, e.target.value); }}
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
                {/* )} */}

            </Form>
        </div>
    );
};

export default Signup;
