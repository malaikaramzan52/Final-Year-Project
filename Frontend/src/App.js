import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import {LoginPage,SignupPage} from "./Routes.js";
import LoginPage from "./pages/LoginPage.jsx"; // ✅ FIXED
import SignupPage from "./pages/SignupPage.jsx";
import ActivationPage from "./pages/ActivationPage";
import HomePage from "./pages/HomePage";

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
      </Routes>
    </BrowserRouter>
  );
};

export default App;
