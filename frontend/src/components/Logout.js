import { useEffect } from "react";
import "./../css/login.css";
import { googleLogout } from '@react-oauth/google';

const Logout = () => {
    // log out function to log the user out of google and set the profile array to null
    const logOut = () => {
        googleLogout();
        localStorage.clear();
        // redirectToLogin();
    };

    const redirectToLogin = () => {
        window.location.href = "/login";
    };

    useEffect(() => {
        logOut();
    }, []);

};

export default Logout;