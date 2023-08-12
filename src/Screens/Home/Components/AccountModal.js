import React, { useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Divider } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { getUserId } from "../../../utils/store/user/getUserIdSlice";
import {
  blockUser,
  sendUserRequest,
  unblockUser,
} from "../../../Services/firebase";
import CustomDialogBox from "../../Settings/Components/CustomDialogBox";
import SubscriptionDialogBox from "./SubscriptionDialogBox";
import { checkIfRequest } from "../../../Services/firebase";
import { checkifFriendOrMember } from "../../../Services/firebase";
import { checkIfUserisBlocked } from "../../../Services/firebase";

export default function AccountModal({
  Fragment,
  isOpen,
  handleClose,
  uid,
  usertype,
  viewStatus,
  isblocked,
  isblocker,
  refetch,
  openSnackbar,
  username,
  userdata,
  request,
  isInstructor,
  handleRequest,
}) {
  const userdoc = useSelector((state) => state.userdoc.userdoc);
  const custom_user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // openModal, blocking modal
  const [openModal, setOpenModal] = useState(false);
  const [unblockModal, setUnblockModal] = useState(false);
  const [subscriptionModal, setSubscriptionModal] = useState(false);

  const location = useLocation();
  const pathname = location.pathname;

  // for the blocking modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Sending friend request
  const handleFriendRequest = async () => {
    const request_check = await checkIfRequest(uid, custom_user.uid);
    if (request_check === false) {
      if (viewStatus === true) {
        openSnackbar({
          message: "You are already in this user's friends list.",
          severity: "error",
        });
      } else if (request === true) {
        openSnackbar({
          message: "You have already sent this user a friend request.",
          severity: "error",
        });
      } else {
        sendUserRequest(uid, custom_user.uid, "friend", userdoc?.usertype);
        handleClose();
        openSnackbar({ message: "Your friend request has been sent." });
      }
    } else {
      openSnackbar({
        message: "You have already sent a request.",
        severity: "error",
      });
    }
    handleClose();
  };

  const handleOpenSubscriptionModal = () => {
    handleClose();
    setSubscriptionModal(true);
  };

  const handleCloseSubscriptionModal = () => {
    setSubscriptionModal(false);
  };

  // for the blocking modal
  const handleOpen = () => {
    setOpenModal(true);
  };

  const handleOpenUnblockModal = () => {
    setUnblockModal(true);
  };

  const handleCloseUnblockModal = () => {
    setUnblockModal(false);
  };

  const taskHandler = () => {
    blockUser(custom_user.uid, uid);
    refetch();
    openSnackbar({
      message: `You have blocked ${
        userdata?.usertype === "Gym" ? userdata?.gymname : userdata?.fullname
      }.`,
      severity: "error",
    });
    handleClose();
  };

  console.log();

  const handleUnblock = () => {
    unblockUser(custom_user.uid, uid);
    refetch();
    openSnackbar({
      message: `You have unblocked ${
        userdata?.usertype === "Gym" ? userdata?.gymname : userdata?.fullname
      }.`,
    });
    handleCloseModal();
    handleClose();
  };

  console.log("usertype: ", userdoc.usertype);
  const displayMessage = () => {
    if (userdata?.usertype === "Gym") {
      if (userdoc?.usertype === "Instructor") {
        return "Send employment request";
      } else {
        return "Become A member";
      }
    } else {
      return "Send friend request";
    }
  };

  const displayBlockButton = () => {
    if (custom_user.uid !== uid) {
      if (!isblocker) {
        return (
          <>
            <button
              onClick={handleOpen}
              className="flex border justify-center items-center py-2.5 w-full px-2 rounded-lg text-white bg-red-500 hover:bg-red-600"
            >
              Block user
            </button>
            <CustomDialogBox
              Fragment={Fragment}
              isOpen={openModal}
              handleClose={handleCloseModal}
              handleTask={taskHandler}
              message={"Are you sure you want to block this user?"}
            />
          </>
        );
      } else {
        return (
          <>
            <button
              onClick={handleOpenUnblockModal}
              className="flex border justify-center items-center py-2.5 w-full px-2 rounded-lg text-white bg-red-500 hover:bg-red-600"
            >
              {" "}
              Unblock user
            </button>
            <CustomDialogBox
              Fragment={Fragment}
              isOpen={unblockModal}
              handleClose={handleCloseUnblockModal}
              handleTask={handleUnblock}
              message={"Are you sure you want to unblock this user?"}
            />
          </>
        );
      }
    } else {
      return <></>;
    }
  };

  const handleDisabled = () => {
    if (userdoc?.usertype === "Instructor") {
      if (userdata?.hiringStatus === "hiring") {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  };

  console.log("hiringStatus:", userdata);

  return (
    <>
      <SubscriptionDialogBox
        data={userdata}
        userdoc={userdoc}
        handleRequest={() => {
          handleRequest();
          handleCloseSubscriptionModal();
          handleClose();
        }}
        isOpen={subscriptionModal}
        handleClose={handleCloseSubscriptionModal}
        Fragment={Fragment}
      />
      <Transition as={Fragment} appear show={isOpen}>
        <Dialog as="div" className="relative z-10" onClose={handleClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                  {/* member: send friend request (member)
                    instructor: send friends request(member), send employment request, (gym)
                    gym: recieve membership request(member), send employment request to gym(instructor), recieve employment request(instructor)
                    // block users 
                */}
                  <div className="flex flex-col space-y-2 items-center justify-center">
                    {usertype === "Gym" ? (
                      // if user is not a member of instructor, send memeber ship request
                      <>
                        {custom_user.uid === uid ? (
                          <button className="flex border justify-center items-center py-2.5 w-full px-2 rounded-lg  hover:bg-gray-100 hover:text-blue-700 ">
                            Edit profile
                          </button>
                        ) : (
                          <></>
                        )}
                        <button
                          onClick={() => {
                            if (pathname === "/profile") {
                              navigate("/profile/members");
                              dispatch(getUserId(" "));
                            } else {
                              navigate(`/${uid}/members`);
                              dispatch(getUserId(uid));
                            }
                          }}
                          className="flex border justify-center items-center py-2.5 w-full px-2 rounded-lg  hover:bg-gray-100 hover:text-blue-700 "
                        >
                          View members
                        </button>

                        <button
                          onClick={() => {
                            if (pathname === "/profile") {
                              navigate("/profile/instructors");
                              dispatch(getUserId(" "));
                            } else {
                              navigate(`/${uid}/instructors`);
                              dispatch(getUserId(uid));
                            }
                          }}
                          className="flex border justify-center items-center py-2.5 w-full px-2 rounded-lg  hover:bg-gray-100 hover:text-blue-700 "
                        >
                          View instructors
                        </button>

                        <button className="flex border justify-center items-center py-2.5 w-full px-2 rounded-lg  hover:bg-gray-100 hover:text-blue-700 ">
                          View reviews
                        </button>
                      </>
                    ) : usertype === "Instructor" ? (
                      <>
                        {custom_user.uid === uid ? (
                          <button className="flex border justify-center items-center py-2.5 w-full px-2 rounded-lg  hover:bg-gray-100 hover:text-blue-700 ">
                            Edit profile
                          </button>
                        ) : (
                          <></>
                        )}
                        <button className="flex border justify-center items-center py-2.5 w-full px-2 rounded-lg  hover:bg-gray-100 hover:text-blue-700 ">
                          View reviews
                        </button>
                        <button
                          onClick={() => {
                            if (pathname === "/profile") {
                              navigate("/profile/friends");
                              dispatch(getUserId(" "));
                            } else {
                              navigate(`/${uid}/friends`);
                              dispatch(getUserId(uid));
                            }
                          }}
                          className="flex border justify-center items-center py-2.5 w-full px-2 rounded-lg  hover:bg-gray-100 hover:text-blue-700 "
                        >
                          View friends
                        </button>

                        {custom_user.uid === uid ? (
                          <button className="flex border justify-center items-center py-2.5 w-full px-2 rounded-lg  hover:bg-gray-100 hover:text-blue-700 ">
                            View clients
                          </button>
                        ) : (
                          <></>
                        )}
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            if (pathname === "/profile") {
                              navigate("/profile/friends");
                              dispatch(getUserId(" "));
                            } else {
                              navigate(`/${uid}/friends`);
                              dispatch(getUserId(uid));
                            }
                          }}
                          className="flex border justify-center items-center py-2.5 w-full px-2 rounded-lg  hover:bg-gray-100 hover:text-blue-700 "
                        >
                          View friends
                        </button>

                        {custom_user.uid === uid ? (
                          <button className="flex border justify-center items-center py-2.5 w-full px-2 rounded-lg  hover:bg-gray-100 hover:text-blue-700 ">
                            Edit profile
                          </button>
                        ) : (
                          <></>
                        )}
                      </>
                    )}

                    {custom_user.uid !== uid &&
                      (isblocker !== true && isblocked !== true ? (
                        <>
                          {isInstructor === true || viewStatus === true ? (
                            <></>
                          ) : userdoc.usertype === "Gym" ? (
                            <></>
                          ) : (
                            <>
                              <button
                                // disabled={() => {
                                //   if (userdata?.usertype === "Gym") {
                                //     if (userdoc.usertype === "Instructor") {
                                //       if (userdata?.hiringStatus === "Hiring") {
                                //         return false;
                                //       }
                                //     }
                                //   }
                                // }}
                                // disabled={
                                //   userdoc.usertype === "Instructor" &&
                                //   userdata?.hiringStatus !== "Hiring"
                                // }
                                disabled={
                                  handleDisabled()
                                  // userdata?.hiringStatus === "hiring"
                                  //   ? true
                                  //   : false;
                                }
                                onClick={() => {
                                  if (userdata?.usertype === "Gym") {
                                    handleOpenSubscriptionModal();
                                  } else {
                                    handleFriendRequest();
                                    // for sending friend request
                                  }
                                }}
                                className="disabled:opacity-40 disabled:hover:bg-inherit disabled:hover:text-inherit flex border justify-center items-center py-2.5 w-full px-2 rounded-lg  hover:bg-gray-100 hover:text-blue-700"
                              >
                                {displayMessage()}
                              </button>
                            </>
                          )}
                        </>
                      ) : (
                        <></>
                      ))}

                    {/* {custom_user.uid !== uid &&
                    !isblocker ? <>
                    <button onClick={handleOpen} className="flex border justify-center items-center py-2.5 w-full px-2 rounded-lg text-white bg-red-500 hover:bg-red-600">
                      Block user
                    </button>
                    <CustomDialogBox Fragment={Fragment} isOpen={openModal} handleClose={handleCloseModal} handleTask={taskHandler} message={'Are you sure you want to block this user?'} />
                  </> : <>
                    <button onClick={handleOpenUnblockModal} className="flex border justify-center items-center py-2.5 w-full px-2 rounded-lg text-white bg-red-500 hover:bg-red-600"> Unblock user</button>
                    <CustomDialogBox Fragment={Fragment} isOpen={unblockModal} handleClose={handleCloseUnblockModal} handleTask={handleUnblock} message={'Are you sure you want to unblock this user?'} />
                  </>} */}
                    {displayBlockButton()}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
