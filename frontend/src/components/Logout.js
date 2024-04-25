import { useEffect } from "react";
import "./../css/login.css";
import { googleLogout } from '@react-oauth/google';

const Logout = () => {
    const logOut = () => {
        googleLogout();
        localStorage.clear();
        redirectToHome();
    };

    const redirectToHome = () => {
        window.location.href = "/";
    };

    useEffect(() => {
        logOut();
    }, []);

};

export default Logout;