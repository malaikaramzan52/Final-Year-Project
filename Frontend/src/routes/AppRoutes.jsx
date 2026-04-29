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
import ProductsPage from "../pages/ProductsPage.jsx";
import AboutPage from "../pages/AboutPage.jsx";
import BecomeSeller from "../components/BecomeSeller/BecomeSeller";
import BrowseBooks from "../components/BrowseBooks/BrowseBooks";
import WishlistPage from "../pages/WishlistPage";
import CartPage from "../pages/CartPage";
import ProductDetailsPage from "../pages/ProductDetailsPage.jsx";
import ProfilePage from "../pages/ProfilePage";
import CheckoutPage from "../pages/CheckoutPage.jsx";
import ExchangePage from "../pages/ExchangePage.jsx";
import AdminLayout from "../pages/admin/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminBooks from "../pages/admin/AdminBooks";
import AdminCategories from "../pages/admin/AdminCategories";
import AdminExchange from "../pages/admin/AdminExchange";
import AdminOrders from "../pages/admin/AdminOrders";
import AdminReports from "../pages/admin/AdminReports";
import AdminComplaints from "../pages/admin/AdminComplaints";
import AdminProfile from "../pages/admin/AdminProfile";



const AppRoutes = () => (

  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/sign-up" element={<SignupPage />} />

      <Route path="/activation/:activationToken" element={<ActivationPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:userId/:token" element={<ResetPasswordPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/become-seller" element={<BecomeSeller />} />
      <Route path="/browse" element={<BrowseBooks />} />
      <Route path="/product/:id" element={<ProductDetailsPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/exchange/:id" element={<ExchangePage />} />
      </Route>

      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="books" element={<AdminBooks />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="exchange-requests" element={<AdminExchange />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="complaints" element={<AdminComplaints />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="reports" element={<AdminReports />} />

        </Route>
      </Route>

      <Route path="*" element={<HomePage />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
