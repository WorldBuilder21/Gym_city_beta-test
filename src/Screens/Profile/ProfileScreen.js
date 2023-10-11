import { Avatar } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import StarIcon from "@mui/icons-material/Star";
import { yellow } from "@mui/material/colors";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import AccountModal from "../Home/Components/AccountModal";
import Box from "@mui/material/Box";
import { Tab } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import PostScreen from "../Home/Post/PostScreen";
// import RoutineScreen from "../Home/Routine/RoutineScreen";
import RoutineScreen from "../Home/Routine/RoutineScreen";
import { useNavigate, useParams } from "react-router";
import {
  checkIfInstructor,
  getMaxMembershipLength,
  getUserDataUid,
} from "../../Services/firebase";
import { useQuery } from "@tanstack/react-query";
import ErrorMessage from "../Components/ErrorMessage";
import MemberChip from "./components/MemberChip";
import { Snackbar } from "@mui/material";
import {
  checkIfUserisBlocked,
  checkifFriendOrMember,
  checkAccountsBlocked,
} from "../../Services/firebase";
import BlockIcon from "@mui/icons-material/Block";
import MuiAlert from "@mui/material/Alert";
import { checkIfRequest, sendUserRequest } from "../../Services/firebase";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import FriendChip from "./components/FriendChip";
import GymChip from "./components/GymChip";
import RatingString from "./components/RatingString";
import Tooltip from "@mui/material/Tooltip";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function ProfileScreen() {
  let { id } = useParams();
  const navigate = useNavigate();

  const custom_user = useSelector((state) => state.user.user);
  const user_doc = useSelector((state) => state.userdoc.userdoc);

  const [blocked, setBlocked] = useState(false);
  const [blocker, setBlocker] = useState(false);
  const [blockId, setBlockedId] = useState("");
  const [blockerId, setBlockerId] = useState("");
  const [viewStatus, setViewStatus] = useState(false);

  const [request, setRequest] = useState(false);

  const [isInstructor, setIsInstructor] = useState(false);

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

  const {
    status,
    data: userdoc,
    refetch,
  } = useQuery(
    {
      queryKey: ["user", id !== undefined ? id : custom_user.uid],
      queryFn: () => getUserDataUid(id !== undefined ? id : custom_user.uid),
    },
    { enabled: false }
  );

  useEffect(() => {
    if (id !== undefined) {
      // if the account you are viewing has blocked you.
      // id: id of the account being viewed
      // custom_user.uid: the id of the person viewing
      if (user_doc?.usertype === "Instructor") {
        checkIfInstructor(id, custom_user.uid).then((result) => {
          setIsInstructor(result);
          setViewStatus(result);
        });
      } else if (user_doc?.usertype === "Gym") {
        checkIfInstructor(custom_user.uid, id).then((result) => {
          setIsInstructor(result);
          setViewStatus(result);
        });
      } else {
        checkifFriendOrMember(id, custom_user.uid, userdoc?.usertype).then(
          (result) => {
            setViewStatus(result);
          }
        );
      }
      checkIfRequest(id, custom_user.uid).then((result) => {
        setRequest(result);
      });
      checkAccountsBlocked(custom_user.uid, id).then((result) => {
        setBlocker(result.exists());
        if (result.exists()) {
          setBlockerId(result.id);
        }
      });
      checkIfUserisBlocked(id, custom_user.uid).then((result) => {
        setBlocked(result.exists());
        console.log(result.exists());
        if (result.exists()) {
          // the id of the person who blocked this account.
          setBlockedId(result.id);
          // console.log('uid:', custom_user.uid)
          // console.log('blockerId:', result.data().blockerId)
        }
      });
    }
  }, [custom_user.uid, id, user_doc?.usertype, userdoc?.usertype]);

  // check blocked status of user viewing

  // const userdoc = useSelector((state) => state.userdoc.userdoc);

  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(0);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // send membership and employment request
  const handleRequest = async () => {
    if (id !== undefined) {
      const request_check = await checkIfRequest(id, custom_user.uid);
      if (request_check === false) {
        if (user_doc.usertype === "Instructor") {
          // add a condition to check if the maximum membership length has been exceeded
          const exceeded = await getMaxMembershipLength(custom_user.uid);
          if (isInstructor === true) {
            openSnackbar({
              message: "You are already an Instructor in this gym.",
            });
          } else if (exceeded === true) {
            openSnackbar({
              message:
                "but you have exceeded the maximum membership length, which is limited to a maximum of 5",
              severity: "error",
            });
          } else {
            try {
              sendUserRequest(
                id,
                custom_user.uid,
                "Employment",
                userdoc?.usertype
              );
              openSnackbar({
                message: "Your employment request has been sent.",
              });
            } catch (error) {
              openSnackbar({
                message: "An error occurred while sending your requests.",
                severity: "error",
              });
            }
          }
        } else if (user_doc.usertype === "Gym") {
          // when gyms sending an employment request to instructors
          if (isInstructor === true) {
            openSnackbar({
              message: "This instructor is already an Instructor at your gym.",
              severity: "error",
            });
          } else {
            try {
              sendUserRequest(
                id,
                custom_user.uid,
                "Instructor_Employment",
                userdoc?.usertype
              );
              openSnackbar({
                message: "Your employment request has been sent.",
              });
            } catch (error) {
              openSnackbar({
                message: "An error occurred while sending your requests.",
                severity: "error",
              });
            }
          }
        } else {
          // add condition to check if membership length has been exceeded.
          const exceeded = await getMaxMembershipLength(custom_user.uid);
          if (viewStatus === true) {
            openSnackbar({ message: "You are already a member in the gym." });
          } else if (exceeded === true) {
            openSnackbar({
              message:
                "but you have exceeded the maximum membership length, which is limited to a maximum of 5",
              severity: "error",
            });
          } else {
            try {
              sendUserRequest(
                id,
                custom_user.uid,
                "Membership",
                userdoc?.usertype
              );
              openSnackbar({
                message: "You membership request has been sent.",
              });
            } catch (error) {
              openSnackbar({
                message: "An error occurred while sending your requests.",
                severity: "error",
              });
            }
          }
        }
      } else {
        openSnackbar({
          message: "You have already sent a request.",
          severity: "error",
        });
      }
    }
  };

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <div>{children}</div>
          </Box>
        )}
      </div>
    );
  }

  console.log("usertype: ", userdoc?.usertype);

  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={10000}
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
      {id ? (
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
              {/* <span className="text-xl ml-4 font-semibold whitespace-nowrap"></span> */}
            </div>
          </div>
        </nav>
      ) : (
        <></>
      )}
      <div>
        {status === "loading" ? (
          <div className="flex animate-pulse flex-col ml-2 items-start">
            <div className="flex mt-5 w-full px-2 max-w-lg">
              <svg
                className="h-28 w-28 text-gray-200 dark:text-gray-700"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
              </svg>
              <div className="flex flex-col justify-center items-start ml-3">
                <div className="mb-2 h-2 w-48 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-2.5 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              </div>
            </div>
          </div>
        ) : status === "error" ? (
          <div>
            <ErrorMessage
              message={
                "An error has occurred, please refresh the page to try again."
              }
            />
          </div>
        ) : (
          <div className="flex   flex-col ml-2 items-start">
            <div className="mt-5 w-full px-2 max-w-lg">
              <div className="flex  mb-5 items-center justify-between">
                <div className="flex truncate">
                  <Avatar
                    sx={{ width: 70, height: 70 }}
                    src={blocked || blocker ? "" : userdoc?.photoUrl}
                  />
                  <span className="flex flex-col ml-3 justify-center space-y-2 text-ellipsis overflow-hidden">
                    <div className="truncate ">
                      <p className="font-semibold truncate block text-md md:text-lg ">
                        {userdoc?.usertype !== "Gym"
                          ? userdoc?.fullname
                          : userdoc?.gymname}
                      </p>
                      <p className="text-blue-600 text-sm font-semibold truncate">
                        @{userdoc?.username}
                      </p>
                    </div>
                  </span>
                </div>

                <div>
                  <button
                    onClick={handleOpen}
                    type="button"
                    className="items-center p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  >
                    <EllipsisVerticalIcon className="w-6 h-6" />
                  </button>
                  <AccountModal
                    Fragment={Fragment}
                    isOpen={isOpen}
                    uid={id ? id : custom_user.uid}
                    usertype={userdoc?.usertype}
                    handleClose={handleClose}
                    viewStatus={viewStatus}
                    isblocked={blocked}
                    isblocker={blockerId === custom_user.uid ? true : false}
                    refetch={refetch}
                    openSnackbar={openSnackbar}
                    username={userdoc?.username}
                    userdata={userdoc}
                    request={request}
                    isInstructor={isInstructor}
                    handleRequest={handleRequest}
                  />
                </div>
              </div>

              {blockerId === custom_user.uid ? (
                <div className="flex flex-row max-w-sm w-full">
                  <div className=" mt-2 rounded-md border px-4 py-1.5 font-semibold text-center text-sm  border-rose-500 flex text-red-500 justify-center items-center">
                    <BlockIcon />
                    <span className="ml-1">blocked</span>
                  </div>
                </div>
              ) : (
                <></>
              )}

              {blocked || blocker ? (
                <></>
              ) : (
                <p className="mt-2">{userdoc?.bio}</p>
              )}

              {blocked || blocker ? (
                <></>
              ) : (
                <>
                  {/* sm:flex-row sm:space-x-4 */}
                  {userdoc?.usertype === "Instructor" ? (
                    <div className="flex mt-2 flex-wrap sm:space-x-2">
                      <Tooltip
                        title="This rating represents the level of satisfaction reported by past clients with whom this instructor has worked. Will be added in the next update."
                        arrow
                      >
                        <div className="flex hover:cursor-pointer font-semibold items-center">
                          Client rating: 0
                          <StarIcon sx={{ color: yellow[800], fontSize: 30 }} />
                        </div>
                      </Tooltip>
                      <Tooltip
                        title="This rating represents the level of satifaction reported by past gym's with whom this instructor has worked with. Will be added in the next update"
                        arrow
                      >
                        <div className="flex font-semibold flex-row items-center">
                          Employer rating: 0
                          <StarIcon sx={{ color: yellow[800], fontSize: 30 }} />
                        </div>
                      </Tooltip>
                    </div>
                  ) : userdoc?.usertype === "Gym" ? (
                    <div className="flex mt-2 flex-row space-x-4">
                      <RatingString id={userdoc?.docId} />

                      <MemberChip
                        type={"profile"}
                        id={id ? id : custom_user.uid}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-row mt-2">
                      <FriendChip id={id ? id : custom_user.uid} />
                    </div>
                  )}
                </>
              )}
            </div>

            {blocked || blocker ? (
              <> </>
            ) : (
              <>
                {userdoc?.usertype === "Gym" &&
                userdoc?.hiringStatus === "Hiring" ? (
                  <div className="flex ml-2 mt-1">
                    <div className="rounded-md border px-6 py-1.5 font-semibold text-center text-sm flex justify-center items-center bg-green-500 text-white">
                      <PersonAddIcon />
                      <span className="ml-1">Hiring</span>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
                {userdoc?.usertype === "Instructor" && (
                  <div className="flex ml-2 mt-1 space-x-2">
                    <GymChip accountData={userdoc} />
                    <FriendChip id={userdoc?.docId} />
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {status === "error" ? (
          <></>
        ) : blocked ? (
          <div className="mt-2">
            <Box sx={{ borderBottom: 1, borderColor: "divider" }} />
            <div className="flex text-red-500 flex-col justify-center items-center mt-40">
              <BlockIcon sx={{ fontSize: 150 }} />
              <span className="mt-3 text-lg text-center font-semibold">
                You have been blocked by this user.
              </span>
            </div>
          </div>
        ) : blocker ? (
          <div className="mt-2">
            <Box sx={{ borderBottom: 1, borderColor: "divider" }} />
            <div className="flex text-red-500 flex-col justify-center items-center mt-40">
              <BlockIcon sx={{ fontSize: 150 }} />
              <span className="mt-3 text-lg text-center font-semibold">
                You have blocked this user.
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full mt-2">
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Post" />
                <Tab label="Routines" />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <PostScreen
                viewStatus={viewStatus}
                user_data={userdoc}
                uid={id !== undefined ? id : custom_user.uid}
                handleRequest={handleRequest}
                isInstructor={isInstructor}
              />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <RoutineScreen
                viewStatus={viewStatus}
                data={userdoc}
                uid={id !== undefined ? id : custom_user.uid}
                openSnackbar={openSnackbar}
                handleRequest={handleRequest}
                isInstructor={isInstructor}
              />
            </TabPanel>
          </div>
        )}
      </div>
    </div>
  );
}
