import React from 'react';
import { Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          To use our wallet press the link below
        </p>
        <Link
          className="App-link"
          to="/wallet"
        >
          Wallet Main Page
        </Link>
      </header>
    </div>
  );
}

export default App;
