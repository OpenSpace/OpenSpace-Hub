import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import "./../css/login.css";
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { useLinkedIn } from 'react-linkedin-login-oauth2';
import APIService from './APIService';

//Firebase auth
import { signInWithPopup, GoogleAuthProvider, GithubAuthProvider, onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';


const SignIn = ({ config }) => {
    const [ageVerified, setAgeVerified] = useState(false);
    const provider = new GoogleAuthProvider();

    const redirectToSignin = () => {
        window.location.href = "/signin";
    };

    useEffect(() => {
        const isloggedin = onAuthStateChanged(auth, (user) => {
            if (user) {
                redirectToHome(user, auth);
            } else {
                console.log("User is not logged in.");
            }
        });

        return () => isloggedin();
    }, []);

    // google login
    const googleLogin = async () => {
        await signInWithPopup(auth, provider)
            .then(async(result) => {
                const user = result.user;
                await APIService.SocialMediaLogin().then(resp => {
                    redirectToHome();
                }).catch((err) => console.log(err));
            }).catch((error) => {
                console.log(error);
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.customData.email;
                const credential = GoogleAuthProvider.credentialFromError(error);
            });
    }

    // github login
    const githubLogin = async () => {
        await signInWithPopup(auth, provider)
            .then(async(result) => {
                const user = result.user;
                await APIService.SocialMediaLogin().then(resp => {
                    localStorage.setItem('token', resp.token);
                    redirectToHome();
                }).catch((err) => console.log(err));
            }).catch((error) => {
                console.log(error);
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.customData.email;
                const credential = GoogleAuthProvider.credentialFromError(error);
            });
    }


    // Facebook login
    const responseFacebook = async (response) => {
        await APIService.SocialMediaLogin().then(resp => {
            localStorage.setItem('token', resp.token);
            console.log(resp)
            redirectToHome();
        }).catch((err) => console.log(err));
    }

    // linkedin login
    const { linkedInLogin } = useLinkedIn({
        clientId: process.env.REACT_APP_LINKEDIN_CLIENT_ID,
        redirectUri: `${window.location.origin}`,
        onSuccess: (code) => {
            console.log(code);
        },
        onError: (error) => {
            console.log(error);
        },
    });

    // useEffect(() => {
    //     const handleGitHubCallback = async () => {
    //         const queryString = window.location.search;
    //         const urlParams = new URLSearchParams(queryString);
    //         const code = urlParams.get('code');

    //         if (code) {
    //             try {
    //                 // Exchange the code for an access token
    //                 const GITHUB_CLIENT_ID = process.env.REACT_APP_GITHUB_CLIENT_ID;
    //                 const GITHUB_CLIENT_SECRET = process.env.REACT_APP_GITHUB_CLIENT_SECRET;
    //                 const formData = new FormData();
    //                 formData.append("client_id", GITHUB_CLIENT_ID);
    //                 formData.append("client_secret", GITHUB_CLIENT_SECRET);
    //                 formData.append("code", code);
    //                 const data = await fetch('https://github.com/login/oauth/access_token', {
    //                     method: 'POST',
    //                     body: formData,
    //                     headers: {
    //                         'Access-Control-Allow-Origin': '*',
    //                         'Access-Control-Allow-Headers': 'X-Requested-With'

    //                     }
    //                 }).then((response) => response.json());

    //                 const accessToken = data.access_token;

    //                 // Fetch the user's GitHub profile
    //                 const userProfile = await fetch('https://api.github.com/user', {
    //                     headers: {
    //                         'Authorization': `Bearer ${accessToken}`,
    //                         'User-Agent': 'Your-App-Name'
    //                     }
    //                 });

    //                 // Handle the user profile data (e.g., store it in your database and log the user in)
    //                 console.log(`Welcome, ${userProfile.data.name}!`);
    //                 // Redirect to home or perform other actions upon successful login
    //             } catch (error) {
    //                 console.error(error);
    //             }
    //         }
    //     };

    //     handleGitHubCallback();
    // }, []);

    // useEffect(() => {
    //     const queryString = window.location.search;
    //     const urlParams = new URLSearchParams(queryString);
    //     const code = urlParams.get('code');
    //     console.log(code);
    // }, []);


    // const githubLogin = () => {
    //     const GITHUB_CLIENT_ID = process.env.REACT_APP_GITHUB_CLIENT_ID;
    //     const GITHUB_CLIENT_SECRET = process.env.REACT_APP_GITHUB_CLIENT_SECRET;
    //     const GITHUB_CALLBACK_URL = process.env.REACT_APP_GITHUB_REDIRECT_URI;
    //     const githubOAuthURL = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=user`;
    //     window.location.href = githubOAuthURL;
    // };


    const redirectToHome = (user, auth) => {
        window.location.href = "/";
    };

    function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    return (
        <div className="sign-in__wrapper">
            <div className="sign-in__backdrop"></div>
            <Form className="shadow p-4 bg-white rounded">
                <img
                    className="img-thumbnail mx-auto d-block mb-2"
                    src="openspace-horizontal-color-on-black.png"
                    alt="logo"
                    style={{ width: '120px', height: 'auto' }}
                />
                <div className="h4 mb-2 text-center">Sign In</div>
                {config && config.config.signin ? (
                    <>
                        <Form.Group className="mb-2" controlId="formBasicCheckbox">
                            <Form.Check
                                type="checkbox"
                                label="I confirm I am 13 years of age or older"
                                onChange={(e) => setAgeVerified(e.target.checked)}
                            />
                        </Form.Group>
                        <div className="d-grid gap-2 mt-2">
                            <Button variant="outline-primary" size="lg" onClick={googleLogin} disabled={!ageVerified}>Sign in with Google 🚀 </Button>
                        </div>
                        <div className="d-grid gap-2 mt-2">
                            <Button variant="outline-primary" size="lg" onClick={githubLogin} disabled={!ageVerified}>Sign in with Github 🚀 </Button>
                        </div>

                        <FacebookLogin
                            appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                            autoLoad={false}
                            fields="name, email, picture"
                            scope="public_profile,email"
                            callback={responseFacebook}
                            render={(renderProps) => (
                                <div className="d-grid gap-2 mt-2">
                                    <Button variant="outline-primary" size="lg" onClick={renderProps.onClick} disabled={!ageVerified}>Sign in with Facebook 🚀 </Button>
                                </div>
                            )}
                        />

                        <div className="d-grid gap-2 mt-2">
                            <Button variant="outline-primary" size="lg" onClick={linkedInLogin} disabled={!ageVerified}>Sign in with LinkedIn 🚀 </Button>
                        </div>

                        {/* <div className="d-grid gap-2 mt-2">
                            <Button variant="outline-primary" size="lg" onClick={githubLogin} disabled={!ageVerified}>Sign in with Github 🚀 </Button>
                        </div> */}
                    </>
                ) : (
                    <Alert variant="danger">
                        Sign in is disabled by the administrator
                    </Alert>
                )}
            </Form>
        </div>
    );
};

export default SignIn;
