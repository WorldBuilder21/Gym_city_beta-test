import { Avatar } from "@mui/material";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import RecieverCard from "./Components/RecieverCard";
import convertSize from "convert-size";
import VerifiedIcon from "@mui/icons-material/Verified";
import { blue } from "@mui/material/colors";
import { formatDistance } from "date-fns";
import {
  getRepliesCount,
  viewReplies,
} from "../../Services/InboxFirebase/inbox";
import { Snackbar } from "@mui/material";
import MessageSkeleton from "./Components/MessageSkeleton";
import RepliesCard from "./Components/RepliesCard";
import MessageIcon from "@mui/icons-material/Message";
import ComposeReplyDialog from "./Components/ComposeReplyDialog";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function ViewMessage() {
  const inboxData = useSelector((state) => state.message.message);
  const navigate = useNavigate();

  console.log(inboxData);

  const ts = inboxData.message.ts;
  const date = new Date(ts?.seconds * 1000 + ts?.nanoseconds / 1000000);
  const formattedDate = formatDistance(date, new Date());

  const [openDialog, setOpenDialog] = useState(false);

  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "right",
    message: "",
    severity: "",
  });
  const { vertical, horizontal, open, message, severity } = state;

  const dispatch = useDispatch();

  const closeSnackbar = () => {
    setState({ ...state, open: false });
  };

  const openSnackbar = (newState) => {
    setState({ open: true, ...newState });
  };

  const custom_user = useSelector((state) => state.user.user);

  const {
    status,
    error,
    data,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    {
      queryKey: ["replies"],
      queryFn: (pageParam) =>
        viewReplies(inboxData.message.id, pageParam.pageParam),
      getNextPageParam: (lastpage) => lastpage.nextPage,
    },
    { enabled: false }
  );

  const {
    status: count_status,
    data: count,
    refetch: refetch_count,
  } = useQuery(
    {
      queryKey: ["count_replie"],
      queryFn: () => getRepliesCount({ docId: inboxData.message.id }),
    },
    { enabled: false }
  );

  const handleOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const replies_count =
    count_status === "loading" ? 0 : count_status === "error" ? 0 : count;

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
      <nav className="bg-white px-4 py-4 relative  z-20 top-0 left-0 border-b border-gray-200 mb-2 drop-shadow-md">
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
              View message
            </span>
          </div>
        </div>
      </nav>
      <div className="flex flex-col m-5">
        <div className="flex flex-col">
          <div className="flex">
            <Avatar
              src={inboxData.user.photoUrl}
              sx={{ width: 70, height: 70 }}
            />

            <div className="flex flex-col justify-center ml-3">
              <div className="flex items-center">
                <p className="font-semibold mr-2 truncate">
                  {inboxData.user.usertype === "Gym"
                    ? inboxData.user.gymname
                    : inboxData.user.fullname}
                </p>
                {inboxData.user.usertype === "Gym" && (
                  <VerifiedIcon sx={{ fontSize: 17, color: blue[600] }} />
                )}
              </div>
              <p className="text-blue-600 font-semibold truncate">
                @{inboxData.user.username}
              </p>
            </div>
          </div>
          <RecieverCard recieverId={inboxData.message.recieverId} />
          <div className="mt-4 font-semibold text-2xl">
            {inboxData.message.title}
          </div>
          <p className="mt-2">{inboxData.message.body}</p>
          {inboxData.message.attachments.length > 0 ? (
            <div className="flex flex-col">
              <span className="flex items-center text-slate-500 text-lg mt-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
                  />
                </svg>
                <span>
                  Attachments • {inboxData.message.attachments.length}
                </span>
              </span>
              <div className="flex flex-wrap lg:space-x-2">
                {inboxData.message.attachments.map((data, index) => {
                  const fileSize = convertSize(data["fileSize"], {
                    accuracy: 0,
                  });
                  return (
                    <div
                      onClick={() => {
                        window.open(data["url"], "_blank", "noreferrer");
                      }}
                      key={index}
                      className="flex mt-2 mb-2 hover:cursor-pointer justify-between rounded-md border p-2 max-w-sm w-full hover:bg-gray-200"
                    >
                      <div className="flex ml-2 truncate">
                        <div className="flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
                            />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm truncate font-semibold">
                            {data["fileName"]}
                          </div>
                          <div className="text-sm text-slate-500">
                            {fileSize}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <></>
          )}
          <div className="w-full text-slate-500 flex justify-end text-sm items-end">
            {formattedDate}
          </div>
          <div className="w-full rounded-full mt-2 border bg-gray-300 h-0.5" />
          <div className=" mt-4">
            <div className="font-semibold text-2xl">
              Replies · {replies_count}
            </div>
            <button
              onClick={handleOpen}
              className="mt-2 disabled:opacity-25 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-12 py-2.5 text-center"
            >
              <div className="flex items-center justify-center">
                <span className="mr-1">Compose a reply</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                  />
                </svg>
              </div>
            </button>
            <ComposeReplyDialog
              isOpen={openDialog}
              Fragment={Fragment}
              handleClose={handleClose}
              inboxId={inboxData.message.id}
              openSnackbar={openSnackbar}
              refetch={refetch}
              refetchCount={refetch_count}
            />
            <div className="mt-2">
              {data?.pages?.map((page, index) =>
                page?.replies?.length === 0 ? (
                  <div
                    key={index}
                    className="flex flex-col justify-center items-center h-screen text-gray-500"
                  >
                    <MessageIcon sx={{ fontSize: 150 }} />
                    <span className="mt-3 text-lg text-center font-semibold">
                      There are no messages to display.
                    </span>
                  </div>
                ) : (
                  <div
                    key={index}
                    className="flex pt-4 flex-col divide-y divide-slate-200 justify-center items-center"
                  >
                    {page?.replies?.map((reply, index) => (
                      <div key={index} className="w-full">
                        <RepliesCard
                          docId={reply.id}
                          repliesData={reply}
                          senderId={reply?.senderId}
                        />
                      </div>
                    ))}
                  </div>
                )
              )}
              {hasNextPage && (
                <div
                  className="flex flex-col
              justify-center items-center w-full hover:cursor-pointer"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? (
                    <>
                      <MessageSkeleton />
                      <MessageSkeleton />
                      <MessageSkeleton />
                    </>
                  ) : (
                    <div className="text-center text-blue-500 font-semibold">
                      Load more
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
