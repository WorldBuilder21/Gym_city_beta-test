import React, { useEffect, useState } from "react";
import { Drawer, IconButton, Divider } from "@mui/material";
import { Close } from "@mui/icons-material";
import { Menu } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { Outlet } from "react-router";
import UserMenuList from "./UserMenuList";
import GymMenuList from "./GymMenuList";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

function UserDrawer() {
  const [open, setOpen] = useState(false);
  const userdoc = useSelector((state) => state.userdoc.userdoc);
  const navigate = useNavigate();

  const location = useLocation();
  const pathname = location.pathname;

  // useEffect(() => {
  //   setPathname(location.pathname);
  // }, [location.pathname]);

  const handleDrawerOpen = () => {
    // console.log(userdoc);
    console.log(pathname);
    console.log("Drawer: ", location.pathname);
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {/* sticky */}
      <nav className="bg-white px-4 py-2.5 relative  w-full z-50 top-0 left-0 border-b border-gray-200 drop-shadow-md">
        <div className="flex justify-between items-center">
          <div className="flex justify-center items-center">
            <IconButton
              onClick={handleDrawerOpen}
              size="large"
              edge="start"
              sx={{ mr: 2 }}
            >
              <Menu />
            </IconButton>
            <span className="text-2xl text-gray-700 font-semibold whitespace-nowrap">
              {pathname.toString().slice(1).charAt(0).toUpperCase() +
                pathname.slice(2)}
            </span>
          </div>
        </div>
      </nav>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="temporary"
        anchor="left"
        open={open}
        onClose={handleDrawerClose}
      >
        <div className="flex p-4 justify-between items-center">
          <div className="font-semibold text-xl">Gym city</div>
          <IconButton onClick={handleDrawerClose}>
            <Close />
          </IconButton>
        </div>

        <Divider />
        {/* -------------------------------------- */}

        {userdoc.usertype === "User" || userdoc.usertype === "Instructor" ? (
          <UserMenuList
            handleDrawerClose={handleDrawerClose}
            location={pathname}
          />
        ) : (
          <GymMenuList
            handleDrawerClose={handleDrawerClose}
            location={pathname}
          />
        )}
      </Drawer>
      <Outlet />
    </div>
  );
}

export default UserDrawer;
