// src/index.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { TransactionProvider } from './context/TransactionContext'; // Import the provider
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    {/* Wrap the entire App with the TransactionProvider */}
    <TransactionProvider>
      <App />
    </TransactionProvider>
  </React.StrictMode>
);

reportWebVitals();