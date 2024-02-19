// import { Button, Stack, Container } from 'react-bootstrap';
import NavBar from './components/NavBar';
import Items from './components/Items';
import Footer from './components/Footer';
import './App.css';
import React from 'react';

class App extends React.Component {
  render() {
    return (
      <div>
        <NavBar />
        <Items />
        <Footer style={{ position: "fixed", bottom: 0, left: 0, right: 0 }} />
      </div>
    );
  }
}

export default App;
