import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      toast.error("Please login first.");
    }
  }, [token]);

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}