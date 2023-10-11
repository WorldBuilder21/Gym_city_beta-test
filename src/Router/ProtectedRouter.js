import React, { useState } from "react";
import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";
import { UserAuth } from "../Context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const custom_user = useSelector((state) => state.user.user);
  const user_doc = useSelector((state) => state.userdoc.userdoc);
  console.log("custom_user_status: ", custom_user);
  console.log("user_doc_status:", user_doc);
  const validator = () => {
    if (custom_user && user_doc) {
      if (!custom_user.emailVerified) {
        return <Navigate to="/" />;
      } else {
        return <Outlet />;
      }
    } else {
      return <Navigate to="/" />;
    }
  };
  // return !user.emailverified ? <Navigate to="/" /> : <Outlet />;
  return validator();
};

export default ProtectedRoute;
