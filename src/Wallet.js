import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for routing
import './Main.css'; // Import the CSS file

function Wallet() {
  return (
    <div className="main">
      <header className="main-header">
        <h1>HD Wallet</h1>

        <div className="card">
          <div className="card-header">
            Create a New Wallet
          </div>
          <div className="card-body text-center">
            <Link to="/create-wallet">
              <img
                src="/create.png"
                className="card-img-top"
                alt="Create Wallet"
                style={{ width: '100px', height: 'auto' }}
              />
            </Link>
          </div>
        </div>

        <br />

        <div className="card">
          <div className="card-header">
            Open Existing Wallet
          </div>
          <div className="card-body text-center">
            <Link to="/open-wallet">
              <img
                src="/open.png"
                className="card-img-top"
                alt="Open Wallet"
                style={{ width: '100px', height: 'auto' }}
              />
            </Link>
          </div>
        </div>

        <br />

        <div className="card">
          <div className="card-header">
            Restore Wallet
          </div>
          <div className="card-body text-center">
            <Link to="/restore-wallet">
              <img
                src="/restore.png"
                className="card-img-top"
                alt="Restore Wallet"
                style={{ width: '100px', height: 'auto' }}
              />
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Wallet;
