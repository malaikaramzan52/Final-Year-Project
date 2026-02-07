import React from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <CartProvider>
<WishlistProvider>
    <App />
  </WishlistProvider>
  </CartProvider>
);



reportWebVitals();
