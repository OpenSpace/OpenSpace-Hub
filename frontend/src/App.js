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
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NavBar user={user} showLogin={showLogin}/>}>
          <Route index element={<Items user={user}/>} />
          <Route path="assets" element={<Assets user={user}/>} />
          <Route path="profiles" element={<Profiles user={user}/>} />
          <Route path="recordings" element={<Recordings user={user}/>} />
          <Route path="webpanels" element={<WebPanels user={user}/>} />
          <Route path="configs" element={<Configs user={user}/>} />
          <Route path="videos" element={<Videos user={user}/>} />
          <Route path="items" element={<Items user={user}/>} />
          <Route path="useritems" element={<UserItems user={user}/>} />
          <Route path="userprofile" element={<UserProfile user={user}/>} />
          <Route path="signin" element={<SignIn />} />
          <Route path="logout" element={<Logout />} />
          <Route path="*" element={<Footer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;