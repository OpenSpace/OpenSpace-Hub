import { useEffect } from "react";
import "./../css/login.css";
import { googleLogout } from '@react-oauth/google';

const Logout = () => {
    const logOut = () => {
        googleLogout();
        localStorage.clear();
        redirectToLogin();
    };

    const redirectToLogin = () => {
        window.location.href = "/login";
    };

    useEffect(() => {
        logOut();
    }, []);

};

export default Logout;