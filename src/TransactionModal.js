// src/components/TransactionModal.js
import React from 'react';
import './TransactionModal.css'; // For modal styles

const TransactionModal = ({ isOpen, onClose, details }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>Transaction Successful!</h2>
        <div dangerouslySetInnerHTML={{ __html: details }} />
      </div>
    </div>
  );
};

export default TransactionModal;
