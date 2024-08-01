import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useNavigate, useLocation } from 'react-router-dom';
import { Networks } from './Networks';
import TransactionModal from './TransactionModal'; // Import the modal component
import './Main.css';

function Transfer() {
  const location = useLocation();
  const navigate = useNavigate();
  const wallet = location.state?.wallet;

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [transactionStatus, setTransactionStatus] = useState('');
  const [network, setNetwork] = useState('ethereum-sepolia');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDetails, setModalDetails] = useState('');

  const handleTransfer = async (event) => {
    event.preventDefault();

    if (!recipient || !amount || !network) {
      setError('Recipient, amount, and Coin are required.');
      return;
    }

    if (!ethers.utils.isAddress(recipient)) {
      setError('Invalid recipient address.');
      return;
    }

    try {
      let provider;
      let walletSigner;

      if (network === 'ethereum-mainnet') {
        provider = new ethers.providers.JsonRpcProvider(Networks["ethereum-mainnet"].provider);
      } else if (network === 'ethereum-sepolia') {
        provider = new ethers.providers.JsonRpcProvider(Networks["ethereum-sepolia"].provider);
      } else if (network === 'arbitrum-sepolia') {
        provider = new ethers.providers.JsonRpcProvider(Networks["arbitrum-sepolia"].provider);
      } else {
        throw new Error('Unsupported network');
      }

      walletSigner = new ethers.Wallet(wallet.privateKey, provider);

      const tx = {
        to: recipient,
        value: ethers.utils.parseEther(amount),
      };

      setTransactionStatus('Transaction in progress...');
      const txResponse = await walletSigner.sendTransaction(tx);
      await txResponse.wait();

      const txDetails = `
        <div>Transaction Hash: ${txResponse.hash}</div>
        <div>From: ${txResponse.from}</div>
        <div>To: ${txResponse.to}</div>
        <div>Amount: ${ethers.utils.formatEther(txResponse.value)} ETH</div>
        <div>Coin: ${network}</div>
        <div>Time: ${new Date().toLocaleString()}</div>
        <div>Arbitrum Transaction Details:<a href="https://sepolia.arbiscan.io/tx/${txResponse.hash}" target="_blank" rel="noopener noreferrer">Check on Arbiscan</a></div>
        <div>Ethereum Transaction Details:<a href="https://sepolia.etherscan.io/tx/${txResponse.hash}" target="_blank" rel="noopener noreferrer">Check on Etherscan</a></div>
      `;

      setModalDetails(txDetails);
      setIsModalOpen(true);
      setTransactionStatus('Transaction successful!');
      console.log('Transaction successful:', txResponse);
    } catch (error) {
      console.error('Error during transaction:', error);
      setError('Transaction failed.');
    }
  };

  const handleBack = () => {
    navigate('/wallet');
  };

  return (
    <div className="main">
      <header className="main-header">
        <h1>Transfer Funds</h1>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card mt-5">
                <div className="card-body">
                  {error && <div className="alert alert-danger">{error}</div>}
                  {transactionStatus && <div className="alert alert-info">{transactionStatus}</div>}
                  <form onSubmit={handleTransfer}>
                    <div className="form-group">
                      <label htmlFor="recipient">Recipient Address</label>
                      <input
                        type="text"
                        className="form-control"
                        id="recipient"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        placeholder="Enter recipient address"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="amount">Amount (ETH)</label>
                      <input
                        type="text"
                        className="form-control"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="network">Coin</label>
                      <select
                        id="network"
                        className="form-control"
                        value={network}
                        onChange={(e) => setNetwork(e.target.value)}
                      >
                        <option value="ethereum-sepolia">Ethereum Sepolia</option>
                        <option value="arbitrum-sepolia">Arbitrum Sepolia</option>
                        <option value="ethereum-mainnet">Ethereum Mainnet</option>
                      </select>
                    </div>
                    <button type="submit" className="btn btn-primary btn-block">
                      Transfer
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} details={modalDetails} />
    </div>
  );
}

export default Transfer;
