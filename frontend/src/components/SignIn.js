import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import "./../css/login.css";
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { useLinkedIn } from 'react-linkedin-login-oauth2';
import APIService from './APIService';

//Firebase auth
import { signInWithPopup, GoogleAuthProvider, GithubAuthProvider, FacebookAuthProvider, TwitterAuthProvider, onAuthStateChanged, fetchSignInMethodsForEmail, linkWithCredential } from "firebase/auth";
import { auth } from '../firebase';


const SignIn = ({ config }) => {
    const [ageVerified, setAgeVerified] = useState(false);
    const googleAuthprovider = new GoogleAuthProvider();
    const githubAuthprovider = new GithubAuthProvider();
    const facebookAuthprovider = new FacebookAuthProvider();
    const twitterAuthprovider = new TwitterAuthProvider();

    const providers = {
        google: {
            provider: new GoogleAuthProvider(),
            credentialFromError: GoogleAuthProvider.credentialFromError,
        },
        github: {
            provider: new GithubAuthProvider(),
            credentialFromError: GithubAuthProvider.credentialFromError,
        },
        facebook: {
            provider: new FacebookAuthProvider(),
            credentialFromError: FacebookAuthProvider.credentialFromError,
        },
        twitter: {
            provider: new TwitterAuthProvider(),
            credentialFromError: TwitterAuthProvider.credentialFromError,
        },
    };

    const handleLogin = async (providerKey) => {
        const { provider, credentialFromError } = providers[providerKey];

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            await APIService.SocialMediaLogin().then(resp => {
                redirectToHome();
            }).catch((err) => console.log(err));
        } catch (error) {
            if (error.code === 'auth/account-exists-with-different-credential') {
                const email = error.customData.email;
                const credential = credentialFromError(error);
                const methods = await fetchSignInMethodsForEmail(auth, email);

                if (methods.length > 0) {
                    const linkedProviderKey = methods[0].split('.')[0];
                    const linkedProvider = providers[linkedProviderKey].provider;
                    const linkedResult = await signInWithPopup(auth, linkedProvider);
                    await linkWithCredential(linkedResult.user, credential);
                    redirectToHome();
                } else {
                    console.log("No other providers");
                }
            } else {
                console.error("Error:", error);
            }
        }
    };

    // const redirectToSignin = () => {
    //     window.location.href = "/signin";
    // };

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
                        {Object.keys(providers).map((key) => (
                            <div className="d-grid gap-2 mt-2">
                            <Button
                                key={key}
                                variant="outline-primary"
                                size="lg"
                                disabled={!ageVerified}
                                onClick={() => handleLogin(key)}
                            >
                                Sign in with {key.charAt(0).toUpperCase() + key.slice(1)} 🚀
                            </Button>
                            </div>
                        ))}
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
