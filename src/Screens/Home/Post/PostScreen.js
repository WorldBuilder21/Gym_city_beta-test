import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PostSkeleton from "./components/PostSkeleton";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getPostsDocs } from "../../../Services/firebase";
import ErrorMessage from "../../Components/ErrorMessage";
import MuiAlert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";
import { sendUserRequest } from "../../../Services/firebase";
import PostPlaceholder from "./components/PostPlaceholder";
import SubscriptionCard from "../Components/SubscriptionCard";
import { ref } from "firebase/storage";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function PostScreen({
  uid,
  user_data,
  viewStatus,
  handleRequest,
  isInstructor
}) {
  // used to show the person viewing the profile
  const custom_user = useSelector((state) => state.user.user);
  const userdoc = useSelector((state) => state.userdoc.userdoc);
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

  // const { status, data: posts } = useQuery(
  //   {
  //     queryKey: ["posts"],
  //     queryFn: () => getPostsDocs(uid),
  //   },
  //   { enabled: false }
  // );

  const {
    status,
    error,
    data: posts,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    {
      queryKey: ["posts"],
      queryFn: (pageParam) => getPostsDocs(uid, pageParam.pageParam),
      getNextPageParam: (lastpage) => lastpage.nextPage,
    },
    { enabled: false }
  );

  // data about the user profile being view
  console.log("user:", user_data);

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
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          refetch={refetch}
          isInstructor={isInstructor}
          accountData={user_data}
        />
      );
    } else {
      console.log("switchCase:", user_data?.postPrivacyStatus);

      switch (user_data?.postPrivacyStatus) {
        case "Friends only" && "Members only":
          switch (viewStatus) {
            case true:
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
                  hasNextPage={hasNextPage}
                  isFetchingNextPage={isFetchingNextPage}
                  fetchNextPage={fetchNextPage}
                  refetch={refetch}
                  isInstructor={isInstructor}
                  accountData={user_data}
                />
              );
            case false:
              return (
                <div className="mt-40">
                  <SubscriptionCard
                    handleRequest={handleRequest}
                    data={user_data}
                    userdoc={userdoc}
                  />
                </div>
              );
            default:
              break;
          }
          break;

        case "Private":
          switch (custom_user.uid === uid) {
            case true:
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
                  hasNextPage={hasNextPage}
                  isFetchingNextPage={isFetchingNextPage}
                  fetchNextPage={fetchNextPage}
                  refetch={refetch}
                  isInstructor={isInstructor}
                  accountData={user_data}
                />
              );

            case false:
              return (
                <div className="flex flex-col justify-center items-center mt-40">
                  <span className="text-center font-semibold text-gray-400 mt-2 text-xl">
                    This users posts are private.
                  </span>
                </div>
              );

            default:
              break;
          }
          break;

        case "Public":
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
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
              refetch={refetch}
              isInstructor={isInstructor}
              accountData={user_data}
            />
          );

        default:
          break;
      }
    }
  };

  console.log(user_data?.postPrivacyStatus);
  console.log("user_data:", user_data);

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
