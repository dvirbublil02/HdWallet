import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Main.css';

function OpenWallet() {
  const [walletName, setWalletName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();

    const wallets = JSON.parse(localStorage.getItem('wallets')) || [];
    const wallet = wallets.find(wallet => wallet.walletName === walletName);

    if (!wallet) {
      setError('Wallet not found.');
      return;
    }
    if (wallet.password !== hashPassword(password)) {
      setError('Invalid password.');
      return;
    }

    // Navigate to the wallet view with wallet information
    navigate('/wallet-view', { state: { walletName } });
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="main">
      <header className="main-header">
        <h1>Open Wallet</h1>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-4">
              <div className="card mt-5">
                <div className="card-body">
                  <form onSubmit={handleLogin}>
                    <div className="form-group">
                      <label htmlFor="walletName">Wallet Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="walletName"
                        value={walletName}
                        onChange={(e) => setWalletName(e.target.value)}
                        placeholder="Enter your wallet name"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                      />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block">
                      Login
                    </button>
                    {error && <div className="alert alert-danger mt-3">{error}</div>}
                  </form>
                  <div className="text-center mt-3">
                    <button
                      type="button"
                      className="btn btn-secondary btn-block"
                      onClick={handleBack}
                    >
                      Back
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

// Simple hash function for passwords (use a real hash function in production)
const hashPassword = (password) => {
  return btoa(password); // Base64 encoding as a simple hash
};

export default OpenWallet;
