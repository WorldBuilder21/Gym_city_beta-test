import React, { Fragment, useState } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router";
import { logout } from "../../Services/firebase";
import { logoutuser } from "../../utils/store/user/userSlice";
import { useDispatch } from "react-redux";
import { Snackbar } from "@mui/material";
import { clearState } from "../../utils/store/user/userdocDataSlice";
import CustomDialogBox from "./Components/CustomDialogBox";
import ChangePasswordModal from "./Components/ChangePasswordModal";
import ShieldIcon from "@mui/icons-material/Shield";
import BlockIcon from "@mui/icons-material/Block";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function SettingsScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openLogModal, setOpenLogModal] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [openDeleteAccModal, setOpenDeleteAccModal] = useState(false);
  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "right",
    message: "",
    severity: "",
  });
  const { vertical, horizontal, open, message, severity } = state;

  const openSnackbar = (newState) => {
    setState({ open: true, ...newState });
  };

  const closeSnackbar = () => {
    setState({ ...state, open: false });
  };

  const closeLogModal = () => {
    setOpenLogModal(false);
  };

  const openLogModalfunc = () => {
    setOpenLogModal(true);
  };

  const closeDeleteAccModal = () => {
    setOpenDeleteAccModal(false);
  };

  const openDeleteAccModalfunc = () => {
    setOpenDeleteAccModal(true);
  };

  const closeChangePasswordModal = () => {
    setOpenPasswordModal(false);
  };

  const openChangePasswordModal = () => {
    setOpenPasswordModal(true);
  };

  const handleLogout = () => {
    try {
      logout().then((_) => {
        dispatch(logoutuser);
        dispatch(clearState);
      });
      closeLogModal();
    } catch (error) {}
  };
  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={1000}
        onClose={closeSnackbar}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        key={vertical + horizontal}
      >
        <Alert
          onClose={closeSnackbar}
          sx={{ width: "100%" }}
          severity={severity}
        >
          {message}
        </Alert>
      </Snackbar>
      <div className="flex flex-col justify-center items-center mt-10">
        {/* md:rounded-lg md:border md:shadow-md md:border-gray-200 */}
        <div className="p-4 md:mx-5 sm:p-6 md:p-8 md:max-w-2xl  w-full">
          <span className="font-semibold text-xl">Settings</span>
          <div className="mt-2 space-y-3">
            <>
              <button
                onClick={openLogModalfunc}
                className="flex w-full hover:bg-gray-100 border border-gray-300 p-4 rounded-lg shadow-md items-center justify-between"
              >
                <div className="items-center justify-center flex">
                  <LogoutIcon />
                  <span className="font-semibold ml-4">
                    Log out of your account
                  </span>
                </div>
                <ArrowForwardIcon />
              </button>
              <CustomDialogBox
                Fragment={Fragment}
                isOpen={openLogModal}
                handleClose={closeLogModal}
                handleTask={handleLogout}
                message={"Are you sure you want to log out of this account?"}
              />
            </>
            <button
              onClick={openChangePasswordModal}
              className="flex w-full hover:bg-gray-100 border border-gray-300 p-4 rounded-lg shadow-md items-center justify-between"
            >
              <div className="items-center justify-center flex">
                <LockOpenIcon />
                <span className="font-semibold ml-4">Change your password</span>
              </div>
              <ArrowForwardIcon />
            </button>
            <ChangePasswordModal
              Fragment={Fragment}
              isOpen={openPasswordModal}
              handleClose={closeChangePasswordModal}
              openSnackbar={openSnackbar}
            />
            <button
              onClick={() => {
                navigate("/settings/viewProfile");
              }}
              className="flex w-full hover:bg-gray-100 border border-gray-300 p-4 rounded-lg shadow-md items-center justify-between"
            >
              <div className="items-center justify-center flex">
                <AccountCircleIcon />
                <span className="font-semibold ml-4">View your profile</span>
              </div>
              <ArrowForwardIcon />
            </button>
            <button
              onClick={() => {
                navigate("/settings/viewPrivacy");
              }}
              className="flex w-full hover:bg-gray-100 border border-gray-300 p-4 rounded-lg shadow-md items-center justify-between"
            >
              <div className="items-center justify-center flex">
                <ShieldIcon />
                <span className="font-semibold ml-4">
                  View privacy settings
                </span>
              </div>
              <ArrowForwardIcon />
            </button>
            <button
              onClick={() => {
                navigate("/settings/blockedUsers");
              }}
              className="flex w-full hover:bg-gray-100 border border-gray-300 p-4 rounded-lg shadow-md items-center justify-between"
            >
              <div className="items-center justify-center flex">
                <BlockIcon />
                <span className="font-semibold ml-4">View blocked users</span>
              </div>
              <ArrowForwardIcon />
            </button>

            <button
              onClick={openDeleteAccModalfunc}
              className="flex w-full hover:bg-gray-100 border border-gray-300 p-4 rounded-lg shadow-md items-center justify-between"
            >
              <div className="items-center justify-center flex">
                <DeleteIcon className="text-red-500" />
                <span className="font-semibold ml-4 text-red-500">
                  Delete your account
                </span>
              </div>
              <ArrowForwardIcon className="text-red-500" />
            </button>
            <CustomDialogBox
              Fragment={Fragment}
              isOpen={openDeleteAccModal}
              handleClose={closeDeleteAccModal}
              handleTask={() => {
                console.log("account deleted");
                closeDeleteAccModal();
              }}
              message={"Are you sure you want to delete this account?"}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default SettingsScreen;
