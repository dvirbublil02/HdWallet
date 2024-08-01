import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { Networks } from './Networks'; // Import Networks for accessing network details
import './Main.css';

function RestoreWallet() {
  const [walletName, setWalletName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const [error, setError] = useState('');
  const [isRestored, setIsRestored] = useState(false);
  const [walletInfo, setWalletInfo] = useState(null);
  const navigate = useNavigate();

  const handleRestore = async (event) => {
    event.preventDefault();

    if (!walletName || !password || !confirmPassword || !mnemonic) {
      setError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const restoredWallet = ethers.Wallet.fromMnemonic(mnemonic);
      const address = restoredWallet.address;

      // Fetch balances for all networks
      const walletBalances = await fetchBalances(address);

      setWalletInfo({
        address,
        balances: walletBalances
      });

     
       const wallets = JSON.parse(localStorage.getItem('wallets')) || [];
       wallets.push({ walletName, address });
       localStorage.setItem('wallets', JSON.stringify(wallets));

      setIsRestored(true);
    } catch (err) {
      console.error('Error restoring wallet:', err);
      setError('Failed to restore wallet.');
    }
  };

  const fetchBalances = async (address) => {
    const balances = {};
    for (const key in Networks) {
      const network = Networks[key];
      const provider = new ethers.providers.JsonRpcProvider(network.provider);
      const balance = await provider.getBalance(address);
      balances[network.name] = ethers.utils.formatEther(balance);
    }
    return balances;
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
            <div className="col-md-6">
              <div className="card mt-5">
                <div className="card-body">
                  {isRestored ? (
                    <div>
                      <h3 className="card-title text-center">Wallet Restored Successfully</h3>
                      <p className="text-center">
                        <strong>Wallet Address:</strong> {walletInfo?.address}
                      </p>
                      <div className="text-center mt-3">
                        <h4>Balances</h4>
                        <ul>
                          {walletInfo?.balances &&
                            Object.entries(walletInfo.balances).map(([networkName, balance]) => (
                              <li key={networkName}>
                                <strong>{networkName}:</strong> {balance} ETH
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleRestore}>
                      <div className="form-group">
                        <label htmlFor="walletName">Wallet Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="walletName"
                          value={walletName}
                          onChange={(e) => setWalletName(e.target.value)}
                          placeholder="Enter your wallet name"
                          required
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
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                          type="password"
                          className="form-control"
                          id="confirmPassword"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm your password"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="mnemonic">Mnemonic Phrase</label>
                        <textarea
                          className="form-control"
                          id="mnemonic"
                          value={mnemonic}
                          onChange={(e) => setMnemonic(e.target.value)}
                          placeholder="Enter your mnemonic phrase"
                          required
                        />
                      </div>
                      {error && <div className="alert alert-danger mt-3">{error}</div>}
                      <button type="submit" className="btn btn-primary btn-block">
                        Restore
                      </button>
                    </form>
                  )}
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

export default RestoreWallet;
