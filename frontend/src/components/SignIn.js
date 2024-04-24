import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import "./../css/login.css";
import { useGoogleLogin } from '@react-oauth/google';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { useLinkedIn } from 'react-linkedin-login-oauth2';
import linkedin from 'react-linkedin-login-oauth2/assets/linkedin.png';
import axios from "axios";
import APIService from './APIService';

const SignIn = () => {
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

    // google login
    const googleLogin = useGoogleLogin({
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

    // linkedin login
    const { linkedInLogin } = useLinkedIn({
        clientId: '78j5hyrf2wrp4z',
        redirectUri: `${window.location.origin}`, // for Next.js, you can use `${typeof window === 'object' && window.location.origin}/linkedin`
        onSuccess: (code) => {
            console.log(code);
        },
        onError: (error) => {
            console.log(error);
        },
    });



    const redirectToHome = () => {
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
                <div className="d-grid gap-2 mt-2">
                    <Button variant="outline-primary" size="lg" onClick={googleLogin}>Sign in with Google 🚀 </Button>
                </div>

                <FacebookLogin
                    appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                    autoLoad={false}
                    fields="name, email, picture"
                    scope="public_profile,email"
                    callback={responseFacebook}
                    render={(renderProps) => (
                        <div className="d-grid gap-2 mt-2">
                            <Button variant="outline-primary" size="lg" onClick={renderProps.onClick}>Sign in with Facebook 🚀 </Button>
                            </div>
                    )}
                />

                <div className="d-grid gap-2 mt-2">
                    <Button variant="outline-primary" size="lg" onClick={linkedInLogin}>Sign in with LinkedIn 🚀 </Button>
                </div>
            </Form>
        </div>
    );
};

export default SignIn;
