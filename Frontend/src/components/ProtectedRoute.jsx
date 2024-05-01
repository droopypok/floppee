import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import UserContext from "../context/User.jsx";

const ProtectedRoute = () => {
  const { accessToken } = React.useContext(UserContext);

  return accessToken ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
