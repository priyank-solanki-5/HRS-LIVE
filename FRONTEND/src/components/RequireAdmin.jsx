import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated } from "../utils/cookies";

const RequireAdmin = () => {
  const location = useLocation();
  const authed = isAuthenticated();

  if (authed) {
    return <Outlet />;
  }

  const redirect = encodeURIComponent(location.pathname + location.search);
  return <Navigate to={`/admin?redirect=${redirect}`} replace />;
};

export default RequireAdmin;


