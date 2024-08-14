import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import './Main.css';

function RestoreWallet() {
  const [mnemonic, setMnemonic] = useState('');
  const [password, setPassword] = useState('');
  const [walletName, setWalletName] = useState('');
  const [error, setError] = useState('');
  const [restoredWallet, setRestoredWallet] = useState(null);
  const navigate = useNavigate();

  const handleRestore = async (event) => {
    event.preventDefault();

    if (!mnemonic || !password || !walletName) {
      setError('All fields are required.');
      return;
    }

    const wallets = JSON.parse(localStorage.getItem('wallets')) || [];
    if (wallets.some(wallet => wallet.walletName === walletName)) {
      setError('Wallet with this name already exists.');
      return;
    }

    try {
      const hdNode = ethers.utils.HDNode.fromMnemonic(mnemonic);
      const restoredWallet = {
        walletName,
        address: hdNode.address,
        privateKey: hdNode.privateKey,
        mnemonic,
        password: hashPassword(password),
      };

      // Store the restored wallet
      wallets.push(restoredWallet);
      localStorage.setItem('wallets', JSON.stringify(wallets));

      setRestoredWallet(restoredWallet);
      setError('');
    } catch (error) {
      console.error('Error restoring wallet:', error);
      setError('Invalid mnemonic or other error.');
    }
  };

  const handleFinish = () => {
    navigate('/wallet', { state: { walletName } });
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="main">
      <header className="main-header">
        <h1>Restore Wallet</h1>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-4">
              <div className="card mt-5">
                <div className="card-body">
                  {restoredWallet ? (
                    <>
                      <div className="alert alert-success">
                        <h4 className="alert-heading">Wallet Restored Successfully!</h4>
                        <p>Your wallet has been restored. Address:</p>
                        <pre>{restoredWallet.address}</pre>
                        <div className="text-center mt-3">
                          <button
                            type="button"
                            className="btn btn-primary btn-block"
                            onClick={handleFinish}
                          >
                            Finish
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {error && <div className="alert alert-danger">{error}</div>}
                      <form onSubmit={handleRestore}>
                        <div className="form-group">
                          <label htmlFor="mnemonic">Mnemonic</label>
                          <textarea
                            className="form-control"
                            id="mnemonic"
                            value={mnemonic}
                            onChange={(e) => setMnemonic(e.target.value)}
                            placeholder="Enter your mnemonic"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="spassword">New Password</label>
                          <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter New password"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="walletName">New Wallet Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="walletName"
                            value={walletName}
                            onChange={(e) => setWalletName(e.target.value)}
                            placeholder="Enter New wallet name"
                          />
                        </div>
                        <button type="submit" className="btn btn-primary btn-block">
                          Restore Wallet
                        </button>
                        <div className="text-center mt-3">
                          <button
                            type="button"
                            className="btn btn-secondary btn-block"
                            onClick={handleBack}
                          >
                            Back
                          </button>
                        </div>
                      </form>
                    </>
                  )}
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

export default RestoreWallet;
