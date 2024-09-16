// src/components/RequestCard.js

import React from 'react';
import './RequestCard.css';

function RequestCard({ request, onSelect }) {
  return (
    <div className="request-card" onClick={() => onSelect(request)}>
      <h4>{request.description}</h4>
      <p>Status: {request.status}</p>
      <p>Quantity Requested: {request.quantityRequested}</p>
      <p>Request Made On: {new Date(request.createdAt).toLocaleString()}</p>
    </div>
  );
}

export default RequestCard;
