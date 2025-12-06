import React from 'react';
import "./App.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import {LoginPage,SignupPage} from "./Routes.js";
 import LoginPage from './pages/LoginPage.jsx';   // ✅ FIXED
 import SignupPage from './pages/SignupPage.jsx';
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
