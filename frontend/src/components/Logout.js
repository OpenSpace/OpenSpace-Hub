import { useEffect } from "react";
import "./../css/login.css";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const Logout = () => {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        logOut();
      } else {
        console.log("User is logged out. Redirecting to signin page.");
        redirectToSignin();
      }
    });

    return () => unsubscribe();
  }, []);

  const logOut = () => {
    console.log("Logging out", auth.currentUser);
    signOut(auth).then(() => {
      redirectToSignin();
      console.log("User signed out");
    }).catch((error) => {
      console.error(error);
    });
  };

  const redirectToSignin = () => {
    window.location.href = "/signin";
  };
};

export default Logout;
