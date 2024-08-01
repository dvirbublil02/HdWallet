import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Wallet from './Wallet'; 
import CreateWallet from './CreateWallet';
import RestoreWallet from './RestoreWallet';
import OpenWallet from './OpenWallet';
import WalletView from './WalletView';
import Transfer from './Transfer';
import './index.css';

ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/wallet" element={<Wallet />} /> 
      <Route path="/create-wallet" element={<CreateWallet />} />
      <Route path="/open-wallet" element={<OpenWallet />} />
      <Route path="/restore-wallet" element={<RestoreWallet />} />
      <Route path="/wallet-view" element={<WalletView />} /> 
      <Route path="/transfer" element={<Transfer />} /> 
    </Routes>
  </Router>,
  document.getElementById('root')
);