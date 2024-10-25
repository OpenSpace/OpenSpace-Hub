import NavBar from './components/NavBar';
import Items from './components/Items';
import Assets from './components/Assets';
import Profiles from './components/Profiles';
import Recordings from './components/Recordings';
import WebPanels from './components/WebPanels';
import Configs from './components/Configs';
import Packages from './components/Packages';
import Videos from './components/Videos';
import Footer from './components/Footer';
import SignIn from './components/SignIn';
import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Logout from './components/Logout';
import UserItems from './components/UserItems';
import UserProfile from './components/UserProfile';
import APIService from './components/APIService';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [user, setUser] = useState({});
  const [config, setConfig] = useState();
  const [redAlertMessage, setRedAlertMessage] = useState('');
  const [greenAlertMessage, setGreenAlertMessage] = useState('');

  const redirectToSignin = () => {
    window.location.href = '/signin';
  };

  useEffect(() => {
    const isloggedin = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If user is logged in, get user data
        APIService.GetUser().then((res) => {
          if (res.error) {
            throw new Error(res.error);
          }
          setUser(res);
          setShowLogin(false);
        });
      } else {
        setShowLogin(true);
      }
    });

    return () => isloggedin();
  }, []);

  useEffect(async () => {
    await APIService.GetConfig()
      .then((res) => {
        if (res.error) {
          throw new Error(res.error);
        }
        setConfig(res);
      })
      .catch((err) => {
        console.log('Error: ' + err);
      });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <NavBar
              user={user}
              showLogin={showLogin}
              config={config}
              redAlertMessage={redAlertMessage}
              greenAlertMessage={greenAlertMessage}
              clearRedAlertMessage={() => setRedAlertMessage('')}
              clearGreenAlertMessage={() => setGreenAlertMessage('')}
            />
          }
        >
          <Route
            index
            element={
              <Items
                user={user}
                config={config}
                setRedAlertMessage={setRedAlertMessage}
                setGreenAlertMessage={setGreenAlertMessage}
              />
            }
          />
          <Route
            path="assets"
            element={
              <Assets
                user={user}
                config={config}
                setRedAlertMessage={setRedAlertMessage}
                setGreenAlertMessage={setGreenAlertMessage}
              />
            }
          />
          <Route
            path="profiles"
            element={
              <Profiles
                user={user}
                config={config}
                setRedAlertMessage={setRedAlertMessage}
                setGreenAlertMessage={setGreenAlertMessage}
              />
            }
          />
          <Route
            path="recordings"
            element={
              <Recordings
                user={user}
                config={config}
                setRedAlertMessage={setRedAlertMessage}
                setGreenAlertMessage={setGreenAlertMessage}
              />
            }
          />
          <Route
            path="webpanels"
            element={
              <WebPanels
                user={user}
                config={config}
                setRedAlertMessage={setRedAlertMessage}
                setGreenAlertMessage={setGreenAlertMessage}
              />
            }
          />
          <Route
            path="configs"
            element={
              <Configs
                user={user}
                config={config}
                setRedAlertMessage={setRedAlertMessage}
                setGreenAlertMessage={setGreenAlertMessage}
              />
            }
          />
          <Route
            path="packages"
            element={
              <Packages
                user={user}
                config={config}
                setRedAlertMessage={setRedAlertMessage}
                setGreenAlertMessage={setGreenAlertMessage}
              />
            }
          />
          <Route
            path="videos"
            element={
              <Videos
                user={user}
                config={config}
                setRedAlertMessage={setRedAlertMessage}
                setGreenAlertMessage={setGreenAlertMessage}
              />
            }
          />
          <Route
            path="items"
            element={
              <Items
                user={user}
                config={config}
                setRedAlertMessage={setRedAlertMessage}
                setGreenAlertMessage={setGreenAlertMessage}
              />
            }
          />
          <Route
            path="useritems"
            element={
              <UserItems
                user={user}
                config={config}
                setRedAlertMessage={setRedAlertMessage}
                setGreenAlertMessage={setGreenAlertMessage}
              />
            }
          />
          <Route
            path="userprofile"
            element={
              <UserProfile
                user={user}
                config={config}
                setRedAlertMessage={setRedAlertMessage}
                setGreenAlertMessage={setGreenAlertMessage}
              />
            }
          />
          <Route
            path="signin"
            element={
              <SignIn
                config={config}
                setRedAlertMessage={setRedAlertMessage}
                setGreenAlertMessage={setGreenAlertMessage}
              />
            }
          />
          <Route
            path="logout"
            element={
              <Logout
                config={config}
                setRedAlertMessage={setRedAlertMessage}
                setGreenAlertMessage={setGreenAlertMessage}
              />
            }
          />
          <Route path="*" element={<Footer config={config} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
