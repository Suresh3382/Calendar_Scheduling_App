import React, { type JSX } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const Token = localStorage.getItem("AccessToken");

  if (!Token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
