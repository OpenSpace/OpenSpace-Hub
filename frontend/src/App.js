import NavBar from './components/NavBar';
import Items from './components/Items';
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