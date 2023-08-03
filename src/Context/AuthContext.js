import React, { createContext, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { getUserData } from "../utils/store/user/userSlice";
import {
  createUser,
  createGym,
  signIn,
  logout,
  forgotPassword,
  emailVerification,
  googleSignIn,
} from "../Services/firebase";
import { useNavigate } from "react-router";

const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      dispatch(getUserData(currentUser));
    });
    return () => {
      unsubscribe();
    };
  }, [dispatch]);
  return (
    <UserContext.Provider
      value={{
        user,
        createUser,
        logout,
        signIn,
        googleSignIn,
        forgotPassword,
        emailVerification,
        createGym,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(UserContext);
};
