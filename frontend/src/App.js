import NavBar from './components/NavBar';
import Items from './components/Items';
import Assets from './components/Assets';
import Profiles from './components/Profiles';
import Recordings from './components/Recordings';
import WebPanels from './components/WebPanels';
import Configs from './components/Configs';
import Videos from './components/Videos';
import Footer from './components/Footer';
import SignIn from './components/SignIn';
import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Logout from './components/Logout';
import UserItems from './components/UserItems';
import UserProfile from './components/UserProfile';
import APIService from './components/APIService';
import { useEffect, useState } from 'react';


function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [user, setUser] = useState({});
  const [config, setConfig] = useState();

  const redirectToLogin = () => {
    window.location.href = "/login";
  };

  useEffect(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      await APIService.GetUser()
        .then((res) => {
          if (res.error) {
            throw new Error(res.error);
          }
          setUser(res);
          setShowLogin(false);
        })
        .catch((err) => {
          localStorage.clear();
          setShowLogin(true);
          redirectToLogin();
        });
    }

    await APIService.GetConfig()
      .then((res) => {
        if (res.error) {
          throw new Error(res.error);
        }
        setConfig(res);
      })
      .catch((err) => {
        console.log("Error: " + err);
      });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NavBar user={user} showLogin={showLogin} config={config}/>}>
          <Route index element={<Items user={user} config={config} />} />
          <Route path="assets" element={<Assets user={user} config={config} />} />
          <Route path="profiles" element={<Profiles user={user} config={config} />} />
          <Route path="recordings" element={<Recordings user={user} config={config} />} />
          <Route path="webpanels" element={<WebPanels user={user} config={config} />} />
          <Route path="configs" element={<Configs user={user} config={config} />} />
          <Route path="videos" element={<Videos user={user} config={config} />} />
          <Route path="items" element={<Items user={user} config={config} />} />
          <Route path="useritems" element={<UserItems user={user} config={config} />} />
          <Route path="userprofile" element={<UserProfile user={user} config={config} />} />
          <Route path="signin" element={<SignIn config={config}/>} />
          <Route path="logout" element={<Logout config={config} />} />
          <Route path="*" element={<Footer config={config} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;