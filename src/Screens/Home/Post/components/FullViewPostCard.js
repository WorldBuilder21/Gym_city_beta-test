import React, { useEffect, useState, Fragment } from "react";
import { Avatar } from "@mui/material";
import { useNavigate } from "react-router";
import { Dialog, Transition } from "@headlessui/react";
import CommentSection from "./CommentSection";
import { useSelector } from "react-redux";
import LazyLoad from "react-lazy-load";
import CustomDialogBox from "../../../Settings/Components/CustomDialogBox";
import { useQuery } from "@tanstack/react-query";
import {
  checkIfUserisBlocked,
  getUserDataUid,
} from "../../../../Services/firebase";
import { formatDistance } from "date-fns";

export default function FullViewPostCard({
  data,
  ts,
  Fragment,
  commentInput,
  docId,
  refetchBlockedStatus,
  gymId,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const custom_user = useSelector((state) => state.user.user);
  const userdoc = useSelector((state) => state.userdoc.userdoc);

  const userId = useSelector((state) => state.userId.userId);

  const date = new Date(ts?.seconds * 1000 + ts?.nanoseconds / 1000000);
  const formattedDate = formatDistance(date, new Date());

  const { status, data: userData } = useQuery(
    {
      queryKey: ["post user", data?.creatorId],
      queryFn: () => getUserDataUid(data?.creatorId),
    },
    { enabled: false }
  );

  useEffect(() => {
    const handleImageLoad = () => {
      setIsLoading(false);
    };

    const image = new Image();
    image.addEventListener("load", handleImageLoad);
    image.src = data.photoUrl;

    return () => {
      image.removeEventListener("load", handleImageLoad);
    };
  }, [data.photoUrl]);

  const deletePost = () => {};

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <>
      <CustomDialogBox
        message={`Are you sure you want to delete this post?`}
        Fragment={Fragment}
        isOpen={isOpen}
        handleTask={deletePost}
        handleClose={handleClose}
      />
      <div className="p-4 w-full relative max-w-2xl mb-4 md:mr-4 rounded-lg border-gray-200 shadow">
        <div className="flex flex-col">
          <div className="flex mb-2 justify-between text-ellipsis overflow-hidden">
            {status === "loading" ? (
              <div className="flex">
                <svg
                  className="h-14 w-14 text-gray-200 dark:text-gray-700"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                </svg>
                <div className="ml-3 flex flex-col items-start justify-center">
                  <div className="mb-2 h-2 w-48 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  <div className="h-2.5 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center mr-2 items-center">
                <Avatar
                  sx={{ width: 50, height: 50 }}
                  src={userData?.photoUrl}
                />
                <div className="flex flex-col ml-2">
                  {/* <span className="w-full text-ellipsis overflow-hidden"> */}
                  <p className="font-semibold text-sm block  truncate">
                    {userData?.usertype === "Gym"
                      ? userData?.gymname
                      : userData?.fullname}
                  </p>

                  <p className="text-blue-600 text-xs font-semibold truncate">
                    @{userdoc?.username}
                  </p>
                  {/* </span> */}
                </div>
              </div>
            )}
            {/* className="stroke-red-500 w-5 h-5" */}

            <button
              className="absolute rounded-full p-0.5 bg-white right-0 m-2"
              onClick={handleOpen}
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="fill-red-500 w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {isLoading ? (
            <div className="mb-2 mt-2 animate-pulse flex h-80 items-center justify-center rounded bg-gray-300 dark:bg-gray-700">
              <svg
                className="h-10 w-10 text-gray-200 dark:text-gray-600"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 16 20"
              >
                <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
              </svg>
            </div>
          ) : (
            <img
              className="rounded-md bg-black mb-2 mt-2"
              src={data?.photoUrl}
              alt={data?.caption}
            />
          )}

          <div className="mb-2 mt-2">{data?.caption}</div>

          <CommentSection
            commentInput={commentInput}
            docId={docId}
            uid={userId}
            refetchBlockedStatus={refetchBlockedStatus}
          />
        </div>
        <span className="text-sm mt-2 text-slate-500 flex justify-end">
          {formattedDate}
        </span>
      </div>
    </>
  );
}
