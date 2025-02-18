
import React from 'react';
import './App.css';
import Greeting from './Greeting'; // Ensure the path matches where you saved Greeting.jsx

function Inbound() {
  return (
    <div className="App">
      <header className="App-header">
        <Greeting />
      </header>
    </div>
  );
}

export default Inbound;
