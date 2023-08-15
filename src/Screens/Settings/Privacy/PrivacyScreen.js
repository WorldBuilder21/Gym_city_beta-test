import React, { useState, Fragment } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Snackbar } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PrivacyDialogBox from "./Components/PrivacyDialogBox";
import MuiAlert from "@mui/material/Alert";
import { getUserDataUid } from "../../../Services/firebase";
import { useQuery } from "@tanstack/react-query";
import ErrorMessage from "../../Components/ErrorMessage";
import InboxPrivacyDIalogBox from "./Components/InboxPrivacyDIalogBox";

// instructors | users
// Public, Friends only, private

// gym
// Public, Members only

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function PrivacyScreen() {
  const navigate = useNavigate();
  const [openPostModal, setOpenPostModal] = useState(false);
  const [openRoutineModal, setOpenRoutineModal] = useState(false);
  const [openInstructorModal, setOpenInstructorModal] = useState(false);
  const [openInboxModal, setOpenInboxModal] = useState(false);
  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "right",
    message: "",
    severity: "",
  });
  const { vertical, horizontal, open, message, severity } = state;

  const custom_user = useSelector((state) => state.user.user);
  const userdoc = useSelector((state) => state.userdoc.userdoc);

  const { status, data, refetch } = useQuery(
    {
      queryKey: ["privacysettings"],
      queryFn: () => getUserDataUid(custom_user.uid),
    },
    { enabled: false }
  );

  const openSnackbar = (newState) => {
    setState({ open: true, ...newState });
  };

  const closeSnackbar = () => {
    setState({ ...state, open: false });
  };

  const handleOpenInboxModal = () => {
    setOpenInboxModal(true);
  };

  const handleCloseInboxModal = () => {
    setOpenInboxModal(false);
  };

  const handleOpenInstructorModal = () => {
    setOpenInstructorModal(true);
  };

  const handleCloseInstructorModal = () => {
    setOpenInstructorModal(false);
  };

  const handleOpenRoutineModal = () => {
    setOpenRoutineModal(true);
  };

  const handleCloseRoutineModal = () => {
    setOpenRoutineModal(false);
  };

  const handleOpenPostModal = () => {
    setOpenPostModal(true);
  };

  const handleClosePostModal = () => {
    setOpenPostModal(false);
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
      <nav className="bg-white px-4 py-4 relative w-full z-20 top-0 left-0 border-b border-gray-200 mb-2 drop-shadow-md">
        <div className="container flex flex-wrap  items-center">
          <div className="flex flex-wrap items-center justify-center">
            <button
              onClick={() => {
                navigate(-1);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="active:stroke-slate-200 -ml-1 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
            </button>
            <span className="text-xl ml-4 font-semibold whitespace-nowrap">
              View privacy settings
            </span>
          </div>
        </div>
      </nav>
      {status === "error" ? (
        <ErrorMessage
          message={
            "An error has occured, please refresh the page to try again."
          }
        />
      ) : status === "loading" ? (
        <div className="flex flex-col justify-center items-center mt-10">
          <div className="p-4 md:mx-5 sm:p-6 md:p-8 md:max-w-2xl  w-full">
            <span className="font-semibold text-3xl">Privacy</span>
            <div className="w-full h-0.5 mt-2 mb-10 bg-gray-100 rounded-full" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center mt-10">
          <div className="p-4 md:mx-5 sm:p-6 md:p-8 md:max-w-2xl  w-full">
            <span className="font-semibold text-3xl">Privacy</span>
            <div className="w-full h-0.5 mt-2 mb-10 bg-gray-100 rounded-full" />
            <div className="mb-10">
              <span className="font-semibold text-md">Post privacy:</span>
              <div className="mt-2 space-y-3">
                <button
                  onClick={handleOpenPostModal}
                  className="flex w-full hover:bg-gray-100 border border-gray-300 p-4 rounded-lg shadow-md items-center justify-between"
                >
                  <div className="items-center justify-center flex">
                    <span className="font-semibold ml-4">
                      {data.postPrivacyStatus}
                    </span>
                  </div>
                  <ArrowForwardIcon />
                </button>
                <PrivacyDialogBox
                  Fragment={Fragment}
                  type={"Posts"}
                  isOpen={openPostModal}
                  handleClose={handleClosePostModal}
                  oldStatus={data.postPrivacyStatus}
                  openSnackbar={openSnackbar}
                  refetch={refetch}
                />
              </div>
            </div>
            <div className="mb-10">
              <span className="font-semibold text-md">Routine privacy:</span>
              <div className="mt-2 space-y-3">
                <button
                  onClick={handleOpenRoutineModal}
                  className="flex w-full hover:bg-gray-100 border border-gray-300 p-4 rounded-lg shadow-md items-center justify-between"
                >
                  <div className="items-center justify-center flex">
                    <span className="font-semibold ml-4">
                      {data.routinePrivacyStatus}
                    </span>
                  </div>
                  <ArrowForwardIcon />
                </button>
                <PrivacyDialogBox
                  Fragment={Fragment}
                  type={"Routines"}
                  isOpen={openRoutineModal}
                  handleClose={handleCloseRoutineModal}
                  openSnackbar={openSnackbar}
                  refetch={refetch}
                  oldStatus={data.routinePrivacyStatus}
                />
              </div>
            </div>
            {userdoc.usertype === "Gym" && (
              <div>
                <span className="font-semibold text-md">Hiring status:</span>
                <div className="mt-2 space-y-3">
                  <button
                    onClick={handleOpenInstructorModal}
                    className="flex w-full hover:bg-gray-100 border border-gray-300 p-4 rounded-lg shadow-md items-center justify-between"
                  >
                    <div className="items-center justify-center flex">
                      <span className="font-semibold ml-4">
                        {
                          // not hiring, hiring
                          data?.hiringStatus
                        }
                      </span>
                    </div>
                    <ArrowForwardIcon />
                  </button>
                  <PrivacyDialogBox
                    Fragment={Fragment}
                    type={"Employment"}
                    isOpen={openInstructorModal}
                    handleClose={handleCloseInstructorModal}
                    openSnackbar={openSnackbar}
                    refetch={refetch}
                    oldStatus={data.hiringStatus}
                  />
                </div>
              </div>
            )}

            <div className="mb-10">
              <span className="font-semibold text-md">Inbox privacy:</span>
              <div className="mt-2 space-y-3">
                <button
                  onClick={handleOpenPostModal}
                  className="flex w-full hover:bg-gray-100 border border-gray-300 p-4 rounded-lg shadow-md items-center justify-between"
                >
                  <div className="items-center justify-center flex">
                    <span className="font-semibold ml-4">
                      {data?.inboxPrivacyStatus}
                    </span>
                  </div>
                  <ArrowForwardIcon />
                </button>
                {/* <PrivacyDialogBox
                  Fragment={Fragment}
                  type={"Posts"}
                  isOpen={openPostModal}
                  handleClose={handleClosePostModal}
                  oldStatus={data.postPrivacyStatus}
                  openSnackbar={openSnackbar}
                  refetch={refetch}
                /> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
