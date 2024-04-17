import NavBar from './components/NavBar';
import Items from './components/Items';
import Assets from './components/Assets';
import Profiles from './components/Profiles';
import Recordings from './components/Recordings';
import WebPanels from './components/WebPanels';
import Configs from './components/Configs';
import Videos from './components/Videos';
import Footer from './components/Footer';
import Login from './components/Login';
import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from './components/Signup';
import Logout from './components/Logout';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<NavBar />}>
          <Route index element={<Items />} />
          <Route path="assets" element={<Assets />} />
          <Route path="profiles" element={<Profiles />} />
          <Route path="recordings" element={<Recordings />} />
          <Route path="webpanels" element={<WebPanels />} />
          <Route path="configs" element={<Configs />} />
          <Route path="videos" element={<Videos />} />
          <Route path="items" element={<Items />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="logout" element={<Logout />} />
          <Route path="*" element={<Footer />} />
        </Route>
      </Routes>
    </BrowserRouter>
    );
  }
}

export default App;