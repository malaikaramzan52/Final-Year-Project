import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

import LoginPage from "../pages/LoginPage.jsx";
import SignupPage from "../pages/SignupPage.jsx";
import ActivationPage from "../pages/ActivationPage";
import HomePage from "../pages/HomePage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "../pages/ResetPasswordPage.jsx";
import BestDeals from "../components/Root/BestDeals/BestDeals.jsx";
import BecomeSeller from "../components/BecomeSeller/BecomeSeller";
import BrowseBooks from "../components/BrowseBooks/BrowseBooks";
import WishlistPage from "../pages/WishlistPage";
import CartPage from "../pages/CartPage";
import ProductDetailsPage from "../pages/ProductDetailsPage.jsx";
import ProfilePage from "../pages/ProfilePage";
import CheckoutPage from "../pages/CheckoutPage.jsx";

const AdminPlaceholder = () => <div>Admin Panel</div>;

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/sign-up" element={<SignupPage />} />
      <Route path="/activation/:activationToken" element={<ActivationPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:userId/:token" element={<ResetPasswordPage />} />
      <Route path="/products" element={<BestDeals />} />
      <Route path="/become-seller" element={<BecomeSeller />} />
      <Route path="/browse" element={<BrowseBooks />} />
      <Route path="/product/:id" element={<ProductDetailsPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminPlaceholder />} />
      </Route>

      <Route path="*" element={<HomePage />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
