import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux"; // ✅ useDispatch hook
import { loadUser } from "./redux/reducers/user.js"; // ✅ correct import

import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import ActivationPage from "./pages/ActivationPage";
import HomePage from "./pages/HomePage";
import BestDeals from './components/Root/BestDeals/bestdeals';
import BecomeSeller from "./components/BecomeSeller/BecomeSeller";
import BrowseBooks from "./components/BrowseBooks/BrowseBooks";
import WishlistPage from "./pages/WishlistPage";
import CartPage from "./pages/CartPage";
import ProductDetailsPage from "./pages/ProductDetailsPage.jsx";
import ProfilePage from "./pages/ProfilePage";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const dispatch = useDispatch(); // ✅ get the dispatch function

  // ✅ load logged-in user on app start
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route path="/activation/:activationToken" element={<ActivationPage />} />
        <Route path="/products" element={<BestDeals />} />
        <Route path="/become-seller" element={<BecomeSeller />} />
        <Route path="/browse" element={<BrowseBooks />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>

      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </BrowserRouter>
  );
};

export default App;