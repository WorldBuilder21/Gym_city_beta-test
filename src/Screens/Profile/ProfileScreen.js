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
import { getUserDataUid } from "../../Services/firebase";
import { useQuery } from "@tanstack/react-query";
import ErrorMessage from "../Components/ErrorMessage";
import GroupIcon from "@mui/icons-material/Group";
import {
  checkIfUserisBlocked,
  checkifFriendOrMember,
} from "../../Services/firebase";
import BlockIcon from "@mui/icons-material/Block";

export default function ProfileScreen() {
  let { id } = useParams();
  const navigate = useNavigate();

  console.log(id);

  const custom_user = useSelector((state) => state.user.user);
  const user_doc = useSelector((state) => state.userdoc.userdoc);

  const [blocked, setBlocked] = useState(false);
  const [viewStatus, setViewStatus] = useState(false);

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
      checkifFriendOrMember(id, custom_user.uid, userdoc?.usertype).then(
        (result) => {
          setViewStatus(result);
        }
      );
    }
  }, [custom_user.uid, id, userdoc?.usertype]);

  useEffect(() => {
    if (id !== undefined) {
      checkIfUserisBlocked(id, custom_user.uid).then((result) => {
        setBlocked(result);
      });
    }
  }, [custom_user.uid, id]);

  console.log("userdoc:", userdoc);

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

  return (
    <div>
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
          <div className="flex flex-col ml-2 items-start">
            <div className="mt-5 w-full px-2 max-w-lg">
              <div className="flex items-center justify-between">
                <div className="flex">
                  <Avatar
                    sx={{ width: 110, height: 110 }}
                    src={blocked ? "" : userdoc?.photoUrl}
                  />
                  <div className="flex flex-col ml-3 justify-center space-y-2">
                    <div>
                      <p className="font-semibold text-md text-clip truncate">
                        {userdoc?.usertype !== "Gym"
                          ? userdoc?.fullname
                          : userdoc?.gymname}
                      </p>
                      <p className="text-blue-600 font-semibold truncate">
                        @{userdoc?.username}
                      </p>
                    </div>
                  </div>
                </div>

                {blocked ? (
                  <></>
                ) : (
                  <>
                    <button
                      onClick={handleOpen}
                      type="button"
                      className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                    >
                      <EllipsisVerticalIcon className="w-6 h-6" />
                    </button>
                    <AccountModal
                      Fragment={Fragment}
                      isOpen={isOpen}
                      uid={id ? id : custom_user.uid}
                      usertype={id ? userdoc.usertype : user_doc.usertype}
                      handleClose={handleClose}
                      viewStatus={viewStatus}
                      isblocked={blocked}
                      refetch={refetch}
                    />
                  </>
                )}
              </div>

              {blocked ? <></> : <p className="mt-2">{userdoc?.bio}</p>}

              {userdoc?.usertype === "Instructor" ? (
                <div className="flex mt-2 flex-row space-x-4">
                  <div className="flex font-semibold flex-row items-center">
                    Client rating: 0
                    <StarIcon sx={{ color: yellow[800], fontSize: 30 }} />
                  </div>
                  <div className="flex font-semibold flex-row items-center">
                    Employer rating: 0
                    <StarIcon sx={{ color: yellow[800], fontSize: 30 }} />
                  </div>
                </div>
              ) : userdoc?.usertype === "Gym" ? (
                <div className="flex mt-2 flex-row space-x-4">
                  <div className="flex font-semibold flex-row items-center">
                    Rating: 0
                    <StarIcon sx={{ color: yellow[800], fontSize: 30 }} />
                  </div>
                  <div className="flex font-semibold flex-row items-center justify-center">
                    Members: 0
                  </div>
                </div>
              ) : (
                // this is for users
                <div className="flex flex-row mt-2">
                  <div className="rounded-md flex flex-row border px-4 justify-center items-center py-1.5 font-semibold border-black text-center text-sm">
                    <GroupIcon />
                    Friends: 0
                  </div>
                </div>
              )}
            </div>

            {userdoc?.usertype === "Instructor" && (
              <div className="flex ml-2 mt-1 space-x-2">
                <div className="rounded-md border px-4 py-1.5 font-semibold border-black text-center text-sm">
                  Un employed
                </div>
                <div className="rounded-md flex flex-row border px-4 justify-center items-center py-1.5 font-semibold border-black text-center text-sm">
                  <GroupIcon />
                  Friends: 0
                </div>
              </div>
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
                uid={id ? id : custom_user.uid}
              />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <RoutineScreen
                viewStatus={viewStatus}
                data={userdoc}
                uid={id ? id : custom_user.uid}
              />
            </TabPanel>
          </div>
        )}
      </div>
    </div>
  );
}