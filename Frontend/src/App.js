import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import {LoginPage,SignupPage} from "./Routes.js";
import LoginPage from "./pages/LoginPage.jsx"; // ✅ FIXED
import SignupPage from "./pages/SignupPage.jsx";
import ActivationPage from "./pages/ActivationPage";
import HomePage from "./pages/HomePage";
import BestDeals from './components/Root/BestDeals/BestDeals';
import BecomeSeller from "./components/BecomeSeller/BecomeSeller";
import BrowseBooks from "./components/BrowseBooks/BrowseBooks";
import WishlistPage from "./pages/WishlistPage";
import CartPage from "./pages/CartPage";




const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route
          path="/activation/:activationToken"
          element={<ActivationPage />}
        />
        <Route path="/products" element={<BestDeals />} />
        <Route path="/become-seller" element={<BecomeSeller />} />
        <Route path="/browse" element={<BrowseBooks />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/cart" element={<CartPage />} />
</Routes>
</BrowserRouter>

        );
};

        export default App;
