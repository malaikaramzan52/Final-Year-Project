import React, { useEffect } from "react";
import "./App.css";
import { useDispatch } from "react-redux";
import { loadUser } from "./redux/reducers/user.js";
import AppRoutes from "./routes/AppRoutes.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const dispatch = useDispatch(); // ✅ get the dispatch function

  // ✅ load logged-in user on app start
  useEffect(() => {
    dispatch(loadUser());

    // ✅ Sync login/logout across tabs
    const handleStorageChange = (e) => {
      if (e.key === "token") {
        if (e.newValue) {
          dispatch(loadUser());
        } else {
          window.location.reload(); // Refresh to clear state on logout
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [dispatch]);

  return (
    <>
      <AppRoutes />
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
    </>
  );
};

export default App;