import React from "react";
import InboxIcon from "@mui/icons-material/Inbox";
import FaceIcon from "@mui/icons-material/Face";
import SettingsIcon from "@mui/icons-material/Settings";
import SearchIcon from "@mui/icons-material/Search";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import DashboardIcon from "@mui/icons-material/Dashboard";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { useNavigate } from "react-router";

export default function GymMenuList({ handleDrawerClose, location }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-start space-y-2 mx-2">
      <button
        onClick={() => {
          navigate("/home");
          handleDrawerClose();
        }}
        type="button"
        className={`py-2.5 w-full flex items-center font-semibold text-lg mt-5 px-5 mb-2 font-meduim ${
          location === "/home"
            ? "text-blue-700 bg-gray-100"
            : "text-gray-900 bg-white"
        }  rounded-lg focus:border focus:border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200`}
      >
        <HomeRoundedIcon sx={{ fontSize: 30 }} />
        <span className="ml-2 text-lg">Home</span>
      </button>
      <button
        onClick={() => {
          navigate("/inbox");
          handleDrawerClose();
        }}
        type="button"
        className={`${
          location === "/inbox"
            ? "text-blue-700 bg-gray-100"
            : "text-gray-900 bg-white"
        } py-2.5 w-full flex items-center font-semibold text-lg mt-5 px-5 mb-2 font-meduim rounded-lg focus:border focus:border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200`}
      >
        <InboxIcon sx={{ fontSize: 30 }} />
        <span className="ml-2 text-lg">Inbox</span>
      </button>
      <button
        type="button"
        onClick={() => {
          navigate("/search");
          handleDrawerClose();
        }}
        className={`${
          location === "/search"
            ? "text-blue-700 bg-gray-100"
            : "text-gray-900 bg-white"
        } py-2.5 w-full flex items-center font-semibold text-lg mt-5 px-5 mb-2 font-meduim rounded-lg focus:border focus:border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200`}
      >
        <SearchIcon sx={{ fontSize: 30 }} />
        <span className="ml-2 text-lg">Search</span>
      </button>

      <button
        type="button"
        onClick={() => {
          navigate("/dashboard");
          handleDrawerClose();
        }}
        className={`${
          location === "/dashboard"
            ? "text-blue-700 bg-gray-100"
            : "text-gray-900 bg-white"
        } py-2.5 w-full flex items-center font-semibold text-lg mt-5 px-5 mb-2 font-meduim rounded-lg focus:border focus:border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200`}
      >
        <DashboardIcon sx={{ fontSize: 30 }} />
        <span className="ml-2 text-lg">Dashboards</span>
      </button>
      <button
        type="button"
        className={`${
          location === "/notifications"
            ? "text-blue-700 bg-gray-100"
            : "text-gray-900 bg-white"
        } py-2.5 w-full flex items-center font-semibold text-lg mt-5 px-5 mb-2 font-meduim rounded-lg focus:border focus:border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200`}
        onClick={() => {
          navigate("/notifications");
          handleDrawerClose();
        }}
      >
        <NotificationsActiveIcon sx={{ fontSize: 30 }} />
        <span className="ml-2 text-lg">Notifications</span>
      </button>
      <button
        type="button"
        onClick={() => {
          navigate("/settings");
          handleDrawerClose();
        }}
        className={`${
          location === "/settings"
            ? "text-blue-700 bg-gray-100"
            : "text-gray-900 bg-white"
        } py-2.5 w-full flex items-center font-semibold text-lg mt-5 px-5 mb-2 font-meduim rounded-lg focus:border focus:border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200`}
      >
        <SettingsIcon sx={{ fontSize: 30 }} />
        <span className="ml-2 text-lg">Settings</span>
      </button>
    </div>
  );
}
