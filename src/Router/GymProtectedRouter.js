import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, Outlet } from "react-router";

const GymProtectedRouter = ({ children }) => {
  const custom_user = useSelector((state) => state.user.user);
  const user_doc = useSelector((state) => state.userdoc.userdoc);
  const navigate = useNavigate();

  const validator = () => {
    console.log(user_doc);
    if (custom_user && user_doc) {
      if (user_doc.usertype === "Gym") {
        return <Outlet />;
      }
    } else {
      return <Navigate to="/" />;
    }
  };
  return validator();
};

export default GymProtectedRouter;
