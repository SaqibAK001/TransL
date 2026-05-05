import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";

import PostLoad from "./pages/Postload";
import RegisterTruck from "./pages/RegisterTruck";
import Matches from "./pages/Matches";
import Profile from "./pages/Profile";
import MatchDetails from "./pages/MatchDetails";

import PrivateRoute from "./components/PrivateRoute";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />

      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/shipper"
            element={
              <PrivateRoute>
                <PostLoad />
              </PrivateRoute>
            }
          />

          <Route
            path="/truck"
            element={
              <PrivateRoute>
                <RegisterTruck />
              </PrivateRoute>
            }
          />

          <Route
            path="/match"
            element={
              <PrivateRoute>
                <Matches />
              </PrivateRoute>
            }
          />

          <Route
            path="/match/:cargoId"
            element={
              <PrivateRoute>
                <MatchDetails />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Landing />} />
        </Routes>
      </Router>
    </>
  );
}