import React, { useState } from "react";
import { getRequests } from "../../Services/firebase";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import ErrorMessage from "../Components/ErrorMessage";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import RequestCard from "./Components/RequestCard";
import { Snackbar } from "@mui/material";
import ComponentSkeleton from "../Components/ComponentSkeleton";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function RequestScreen() {
  const custom_user = useSelector((state) => state.user.user);
  // const { status, data, refetch } = useQuery({
  //   queryKey: ["requests"],
  //   queryFn: () => getRequests(custom_user.uid),
  // }, { enabled: false });

  const { status, error, data, refetch, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ['requests'],
    queryFn: () => getRequests(custom_user.uid),
    getNextPageParam: (lastpage) => lastpage.nextPage
  })

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
      {status === "error" ? (
        <ErrorMessage
          message={
            "An error has occurred, please refresh the page to try again."
          }
        />
      ) : status === "loading" ? (
        <div className="flex flex-col mx-2 mt-10 justify-center items-center">
          <ComponentSkeleton />
          <ComponentSkeleton />
          <ComponentSkeleton />
        </div>
      ) : (
        <div>
          {data.empty ? (
            <div className="flex flex-col justify-center items-center h-screen text-gray-500">
              <NotificationsOffIcon sx={{ fontSize: 150 }} />
              <span className="mt-3 text-lg text-center font-semibold">
                No one has sent you any requests.
              </span>
            </div>
          ) : (
            <div className="flex mx-2 flex-col items-center justify-center mt-10">
              {data.pages.map((page, index) => (
                <div key={index} className="max-w-lg w-full">
                  {page.requests.docs.map((request) => (
                    <RequestCard openSnackbar={openSnackbar} refetch={refetch} item={request.data()} uid={request.data().senderId} key={index} />
                  ))}
                </div>
              ))}
              {/* {data.pages.map((data, index) => (
         
              ))} */}
              {hasNextPage && (
                <button ></button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
