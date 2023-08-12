import React, { useState } from "react";
import {
  getInboxCount,
  viewMessages,
} from "../../Services/InboxFirebase/inbox";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import ErrorMessage from "../Components/ErrorMessage";
import MessageSkeleton from "./Components/MessageSkeleton";
import MessageCard from "./Components/MessageCard";
import CustomDialogBox from "../Settings/Components/CustomDialogBox";
import MessageIcon from "@mui/icons-material/Message";

export default function InboxScreen() {
  const custom_user = useSelector((state) => state.user.user);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "right",
    message: "",
    severity: "",
  });
  const { vertical, horizontal, open, message, severity } = state;

  const handleOpenModal = () => {
    setOpenDialog(true);
  };

  const handleCloseModal = () => {
    setOpenDialog(false);
  };

  const handleDeleteMessage = () => {};

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
      queryKey: ["messages"],
      queryFn: (pageParam) =>
        viewMessages(custom_user.uid, pageParam.pageParam),
      getNextPageParam: (lastpage) => lastpage.nextPage,
    },
    { enabled: false, refetchOnWindowFocus: true }
  );

  console.log("messages:", data);

  const {
    status: count_status,
    data: count,
    refetch: refetch_count,
  } = useQuery(
    {
      queryKey: ["count_messages"],
      queryFn: () => getInboxCount({ uid: custom_user.uid }),
    },
    { enabled: false, refetchOnWindowFocus: true }
  );

  const member_count =
    count_status === "loading" ? 0 : count_status === "error" ? 0 : count;

  return (
    <div className="flex flex-col m-3">
      {status === "loading" ? (
        <>
          <div className="flex flex-col items-start">
            <div className="font-semibold text-2xl">Inbox</div>
          </div>
          <div className="w-full mt-2 flex flex-col items-center justify-center">
            <MessageSkeleton />
            <MessageSkeleton />
            <MessageSkeleton />
          </div>
        </>
      ) : status === "error" ? (
        <ErrorMessage
          message={
            "An error has occurred, please refresh the page to try again."
          }
        />
      ) : (
        <>
          <div className="flex flex-col items-start">
            <div className="font-semibold text-2xl">Inbox · {member_count}</div>
            <button
              onClick={() => {
                navigate("/inbox/compose");
              }}
              className="mt-2 disabled:opacity-25 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-10 py-2.5 text-center"
            >
              <div className="flex items-center justify-center">
                <span className="mr-1">Compose a message</span>
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
          </div>
          <div className="mt-2">
            {data?.pages?.map((page, index) =>
              page?.messages?.length === 0 ? (
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
                  className="flex flex-col divide-y divide-slate-200 justify-center items-center"
                >
                  {page?.messages?.map((message, index) => (
                    <div key={index} className="w-full">
                      <MessageCard
                        senderId={message.senderId}
                        key={index}
                        docId={message.id}
                        body={message.body}
                        title={message.title}
                        ts={message.ts}
                        messageData={message}
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
        </>
      )}
    </div>
  );
}
