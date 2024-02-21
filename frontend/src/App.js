import NavBar from './components/NavBar';
import Items from './components/Items';
import Footer from './components/Footer';
import Login from './components/Login';
import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<NavBar />}>
          <Route index element={<Items />} />
          <Route path="items" element={<Items />} />
          <Route path="login" element={<Login />} />
          <Route path="*" element={<Footer />} />
        </Route>
      </Routes>
    </BrowserRouter>
    );
  }
}

export default App;