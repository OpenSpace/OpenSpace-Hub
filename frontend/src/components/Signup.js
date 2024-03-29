import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import "./../css/login.css";
import { useGoogleLogin } from '@react-oauth/google';
import FacebookLogin from 'react-facebook-login';
import axios from "axios";
import APIService from './APIService';

const Signup = () => {
    const [inputFirstname, setInputFirstname] = useState("");
    const [inputLastname, setInputLastname] = useState("");
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

    // Facebook login
    const responseFacebook = (response) => {
        console.log(response);
        // setUser(response)

        setUser({
            name: response.name,
            email: response.email,
            picture: response.picture.data.url
        })
        localStorage.setItem('user', JSON.stringify({
            name: response.name,
            email: response.email,
            picture: response.picture.data.url
        }));
        redirectToHome();
    }

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
                        .then(async (res) => {
                            localStorage.setItem('profile', JSON.stringify(res.data));
                            console.log(res.data['email']);
                            await APIService.Register(res.data['given_name'], res.data['family_name'], res.data['email'], user.access_token, user.access_token)
                                .then(resp => {
                                    if (resp.error) {
                                        throw (resp.error);
                                    }
                                    console.log(resp.message);
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
                                    console.log("Authentication Successful")
                                    redirectToHome();
                                })
                                .catch(error => {
                                    setShowSignUpError(true);
                                });
                            setProfile(res.data);
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
        setShowSignUpError(false);
        await delay(500);
        APIService.Register(inputFirstname, inputLastname, inputUsername, inputPassword, cnfPassword)
            .then(resp => {
                if (resp.error) {
                    throw (resp.error);
                }
                console.log(resp.message);
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

    const updateShowSignUpButton = (inputUsername, inputPassword, cnfPassword) => {
        const nonAlphanums = /[^a-z0-9]/i;
        if (!inputUsername.match(nonAlphanums) && inputPassword === cnfPassword) {
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
                <Form.Group className="mb-2" controlId="firstname">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={inputFirstname}
                        placeholder="First Name"
                        onChange={(e) => { setInputFirstname(e.target.value); }}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-2" controlId="lastname">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={inputLastname}
                        placeholder="Last Name"
                        onChange={(e) => { setInputLastname(e.target.value); }}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-2" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        value={inputUsername}
                        placeholder="Username (alphanumeric only)"
                        onChange={(e) => { setInputUsername(e.target.value); updateShowSignUpButton(e.target.value, inputPassword, cnfPassword); }}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-2" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={inputPassword}
                        placeholder="Password"
                        onChange={(e) => { setInputPassword(e.target.value); updateShowSignUpButton(inputUsername, e.target.value, cnfPassword); }}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-2" controlId="cnfPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={cnfPassword}
                        placeholder="Confirm Password"
                        onChange={(e) => { setCnfPassword(e.target.value); updateShowSignUpButton(inputUsername, inputPassword, e.target.value); }}
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
                    {profile ? redirectToHome() : (
                        <Button variant="outline-primary" size="lg" onClick={login}>Sign in with Google 🚀 </Button>
                    )}
                </div>
                {user ? (
                    <div>
                        <img src={user.picture} alt={user.name} />
                        <p>Welcome, {user.name}</p>
                        <p>Email: {user.email}</p>
                    </div>
                ) : (
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
                )}

            </Form>
        </div>
    );
};

export default Signup;
