import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import UserHomeScreen from "./UserHomeScreen";
import ProfileScreen from "../Profile/ProfileScreen";

function Home() {
  const user_doc = useSelector((state) => state.userdoc.userdoc);
  console.log('user_doc_status_home: ',user_doc);
  return user_doc.usertype === "Gym" ? <ProfileScreen /> : <UserHomeScreen />;
}

export default Home;
