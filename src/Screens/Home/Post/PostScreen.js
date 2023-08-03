import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PostSkeleton from "./components/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { getPostsDocs } from "../../../Services/firebase";
import ErrorMessage from "../../Components/ErrorMessage";
import MuiAlert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";
import { checkifFriendOrMember } from "../../../Services/firebase";
import PostPlaceholder from "./components/PostPlaceholder";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function PostScreen({ uid, user_data, viewStatus }) {
  // used to show the person viewing the profile
  const custom_user = useSelector((state) => state.user.user);
  // the person viewing
  const [openModal, setOpenModal] = useState(false);
  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "right",
    message: "",
    severity: "",
  });
  const { vertical, horizontal, open, message, severity } = state;
  // const [viewStatus, setViewStatus] = useState(false);

  const { status, data: posts } = useQuery(
    {
      queryKey: ["posts"],
      queryFn: () => getPostsDocs(uid),
    },
    { enabled: false }
  );

  // data about the user profile being view
  console.log("user:", user_data);

  // useEffect(() => {
  //   if (
  //     user_data?.postPrivacyStatus === "Friends only" ||
  //     user_data?.postPrivacyStatus === "Members only"
  //   ) {
  //     checkifFriendOrMember(uid, custom_user.uid, user_data?.usertype).then(
  //       (result) => {
  //         setViewStatus(result);
  //       }
  //     );
  //   }
  // }, [custom_user.uid, uid, user_data?.postPrivacyStatus, user_data?.usertype]);

  const closeModal = () => {
    setOpenModal(false);
  };

  const openPostModal = () => {
    setOpenModal(true);
  };

  const openSnackbar = (newState) => {
    setState({ open: true, ...newState });
  };

  const closeSnackbar = () => {
    setState({ ...state, open: false });
  };

  const displayFunction = () => {
    if (user_data?.postPrivacyStatus === "Private") {
      if (custom_user.uid === uid) {
        return (
          <PostPlaceholder
            posts={posts}
            custom_user={custom_user}
            Fragment={Fragment}
            openModal={openModal}
            openSnackbar={openSnackbar}
            closeModal={closeModal}
            openPostModal={openPostModal}
            uid={uid}
          />
        );
      } else {
        return (
          <div className="flex flex-col justify-center items-center mt-40">
            <span className="text-center font-semibold text-gray-400 mt-2 text-xl">
              This users posts are private.
            </span>
          </div>
        );
      }
    } else if (
      user_data?.postPrivacyStatus === "Friends only" ||
      user_data?.postPrivacyStatus === "Members only"
    ) {
      console.log("Hello???");
      if (viewStatus === true) {
        return (
          <PostPlaceholder
            posts={posts}
            custom_user={custom_user}
            Fragment={Fragment}
            openModal={openModal}
            openSnackbar={openSnackbar}
            closeModal={closeModal}
            openPostModal={openPostModal}
            uid={uid}
          />
        );
      } else {
        return user_data?.usertype !== "Gym" ? (
          <div className="flex flex-col mt-40 justify-center items-center">
            <span className="text-center font-semibold text-gray-400 mt-2 text-xl">
              Only the users friends can view this post.
            </span>
          </div>
        ) : (
          <div className="flex flex-col mt-40 justify-center items-center">
            <div className="flex max-w-lg w-full flex-col border rounded-md p-4">
              <span className="font-semibold">Membership plan</span>
              <div className="flex flex-col justify-center items-center text-6xl font-bold mt-4">
                Free
              </div>
            </div>
          </div>
        );
      }
    } else if (user_data?.postPrivacyStatus === "Public") {
      return (
        <PostPlaceholder
          posts={posts}
          custom_user={custom_user}
          Fragment={Fragment}
          openModal={openModal}
          openSnackbar={openSnackbar}
          closeModal={closeModal}
          openPostModal={openPostModal}
          uid={uid}
        />
      );
    } else {
      return (
        <></>
        // <div className="flex flex-col mt-40 justify-center items-center">
        //   <span className="text-center font-semibold text-red-500 mt-2 text-xl">
        //     Invalid privacy status
        //   </span>
        // </div>
      );
    }
  };

  console.log(user_data?.postPrivacyStatus);

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
      <div className="h-screen">
        {status === "loading" ? (
          <div>
            <PostSkeleton />
          </div>
        ) : status === "error" ? (
          <ErrorMessage
            message="An error has occured please check your internet connection and try
          again"
          />
        ) : (
          <div>{displayFunction()}</div>
        )}
      </div>
    </>
  );
}
