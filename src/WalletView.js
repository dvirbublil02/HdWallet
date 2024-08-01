import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { Networks } from './Networks';
import './Main.css';

function WalletView() {
  const location = useLocation();
  const navigate = useNavigate();
  const walletName = location.state?.walletName;

  const [wallet, setWallet] = useState(null);
  const [balances, setBalances] = useState({});
  const [usdValues, setUsdValues] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        setLoading(true);
        const wallets = JSON.parse(localStorage.getItem('wallets')) || [];
        const currentWallet = wallets.find((wallet) => wallet.walletName === walletName);

        if (!currentWallet) {
          console.error('No wallet found with the given name:', walletName);
          setLoading(false);
          return;
        }

        setWallet(currentWallet);

        const providers = {
          ethereumSepolia: new ethers.providers.JsonRpcProvider(Networks["ethereum-sepolia"].provider),
          arbitrumSepolia: new ethers.providers.JsonRpcProvider(Networks["arbitrum-sepolia"].provider),
          ethereumMainnet: new ethers.providers.JsonRpcProvider(Networks["ethereum-mainnet"].provider),
        };

        const [ethSepoliaBalance, arbSepoliaBalance, ethMainnetBalance] = await Promise.all([
          providers.ethereumSepolia.getBalance(currentWallet.address),
          providers.arbitrumSepolia.getBalance(currentWallet.address),
          providers.ethereumMainnet.getBalance(currentWallet.address),
        ]);

        const formattedBalances = {
          EthereumSepolia: ethers.utils.formatEther(ethSepoliaBalance),
          ArbitrumSepolia: ethers.utils.formatEther(arbSepoliaBalance),
          EthereumMainnet: ethers.utils.formatEther(ethMainnetBalance),
        };
        setBalances(formattedBalances);

        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
          params: {
            ids: 'ethereum,arbitrum',
            vs_currencies: 'usd',
          },
        });

        const usdPrices = response.data;
        const usdValues = {
          EthereumSepolia: usdPrices.ethereum.usd.toFixed(2),
          ArbitrumSepolia: usdPrices.arbitrum.usd.toFixed(2),
          EthereumMainnet: usdPrices.ethereum.usd.toFixed(2),
        };

        setUsdValues(usdValues);
      } catch (error) {
        console.error('Error fetching balances or USD values:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
  }, [walletName]);

  const handleTransfer = () => {
    navigate('/transfer', { state: { wallet } });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const getCoinImage = (coin) => {
    switch (coin) {
      case 'EthereumSepolia':
        return '/coins/EthS.jpg';
      case 'ArbitrumSepolia':
        return '/coins/ArbS.jpg';
      case 'EthereumMainnet':
        return '/coins/Eth.jpg';
      default:
        return '';
    }
  };

  return (
    <div className="main">
      <header className="main-header">
        <h1>Wallet Balances</h1>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card mt-5">
                <div className="card-body">
                  {loading ? (
                    <p>Loading...</p>
                  ) : wallet ? (
                    <>
                      <h4 className="card-title">Wallet: {wallet.walletName}</h4>
                      <p>Address: {wallet.address}</p>
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th scope="col">Coin</th>
                            <th scope="col">Value Of Coin (USD)</th>
                            <th scope="col">Balance</th>
                            <th scope="col">Network</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.keys(balances).map((coin) => (
                            <tr key={coin}>
                              <td className="coin-cell">
                                <img src={getCoinImage(coin)} alt={coin} className="coin-image" />
                                {coin}
                              </td>
                              <td>{usdValues[coin]}</td>
                              <td>{balances[coin]}</td>
                              <td>{coin.includes('Mainnet') ? 'Mainnet' : 'Testnet'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <button className="btn btn-primary btn-block mt-3" onClick={handleTransfer}>
                        Transfer
                      </button>
                      <br/>
                      <button className="btn btn-secondary btn-block mt-3" onClick={handleBack}>
                        Back
                      </button>
                    </>
                  ) : (
                    <p>No wallet found.</p>
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

export default WalletView;
