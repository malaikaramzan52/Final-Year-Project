import React from "react";
import ReactDOM from "react-dom/client"; // notice '/client' in React 18
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext";
import { Provider } from "react-redux";
import Store from "./redux/store";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={Store}>
    <CartProvider>
      <WishlistProvider>
        <App />
      </WishlistProvider>
    </CartProvider>
  </Provider>
);

reportWebVitals();