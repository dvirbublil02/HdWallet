import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import Modal from './Modal'; // Import the Modal component
import './Main.css';

function CreateWallet() {
  const [walletName, setWalletName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [mnemonic, setMnemonic] = useState('');
  const [isWalletGenerated, setIsWalletGenerated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [hdNodeAddress, setHdNodeAddress] = useState(''); // State for HDNode address
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(password);
  };

  const handleCreate = async (event) => {
    event.preventDefault();

    if (!walletName || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.');
      setIsPasswordValid(false);
      return;
    }

    const wallets = JSON.parse(localStorage.getItem('wallets')) || [];
    if (wallets.some(wallet => wallet.walletName === walletName)) {
      setError('Wallet with this name already exists.');
      return;
    }

    // Generate HD Wallet
    const mnemonic = ethers.utils.entropyToMnemonic(ethers.utils.randomBytes(16));
    const hdNode = ethers.utils.HDNode.fromMnemonic(mnemonic);

    const newWallet = {
      walletName,
      password: hashPassword(password),
      mnemonic,
      address: hdNode.address,
      privateKey: hdNode.privateKey,
      coins: [
        { name: 'Ethereum', address: hdNode.address },
        { name: 'Arbitrum', address: hdNode.address },
      ]
    };

    wallets.push(newWallet);
    localStorage.setItem('wallets', JSON.stringify(wallets));
    setMnemonic(mnemonic);
    setIsWalletGenerated(true);
    setHdNodeAddress(hdNode.address); // Set the HDNode address for the modal
    setIsModalOpen(true); // Open the modal
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
        <h1>Create Wallet</h1>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-4">
              <div className="card mt-5">
                <div className="card-body">
                  {!isWalletGenerated ? (
                    <>
                      {error && <div className="alert alert-danger">{error}</div>}
                      <form onSubmit={handleCreate}>
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
                            className={`form-control ${!isPasswordValid ? 'is-invalid' : ''}`}
                            id="password"
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              setIsPasswordValid(validatePassword(e.target.value));
                            }}
                            placeholder="Enter your password"
                          />
                          <div className="invalid-feedback">
                            Password must be at least 6 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.
                          </div>
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
                          />
                        </div>
                        <button type="submit" className="btn btn-primary btn-block">
                          Create Wallet
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
                  ) : (
                    <>
                      <div className="alert alert-success">
                        <h4 className="alert-heading">Wallet Created Successfully!</h4>
                        <p>Your wallet has been created. Make sure to save the following mnemonic:</p>
                        <pre>{mnemonic}</pre>
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
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Wallet Created!</h2>
        <p>Your wallet has been created! Please visit the following links to fund it (testnet), or use any other source you have:</p>
        <ul>
          <li>
            Ethereum Sepolia:
            <a href="https://faucet.triangleplatform.com/ethereum/sepolia" target="_blank" rel="noopener noreferrer">
              https://faucet.triangleplatform.com/ethereum/sepolia
            </a>
            ,
            <a href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia" target="_blank" rel="noopener noreferrer">
              https://cloud.google.com/application/web3/faucet/ethereum/sepolia
            </a>
          </li>
          <li>
            Arbitrum Sepolia:
            <a href="https://faucet.triangleplatform.com/arbitrum/sepolia" target="_blank" rel="noopener noreferrer">
              https://faucet.triangleplatform.com/arbitrum/sepolia
            </a>
            ,
            <a href="https://blastapi.io/faucets/arbitrum-sepolia" target="_blank" rel="noopener noreferrer">
            https://blastapi.io/faucets/arbitrum-sepolia
            </a>
          </li>
        </ul>
        <p>Use the address of your wallet: {hdNodeAddress}</p>
      </Modal>
    </div>
  );
}

// Simple hash function for passwords (use a real hash function in production)
const hashPassword = (password) => {
  return btoa(password); // Base64 encoding as a simple hash
};

export default CreateWallet;
