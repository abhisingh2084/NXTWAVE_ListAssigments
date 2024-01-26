// src/Card.js

import React from 'react';

const Card = ({ children }) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px', borderRadius: '5px' }}>
      {children}
    </div>
  );
};

export default Card;
