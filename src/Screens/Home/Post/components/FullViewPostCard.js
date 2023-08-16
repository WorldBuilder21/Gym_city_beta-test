import React, { useEffect, useState, Fragment } from "react";
import { Avatar } from "@mui/material";
import { useNavigate } from "react-router";
import { Dialog, Transition } from "@headlessui/react";
import CommentSection from "./CommentSection";
import { useSelector } from "react-redux";
import LazyLoad from "react-lazy-load";
import CustomDialogBox from "../../../Settings/Components/CustomDialogBox";
import { useQuery } from "@tanstack/react-query";
import { getUserDataUid } from "../../../../Services/firebase";
import { formatDistance } from "date-fns";

export default function FullViewPostCard({
  data,
  ts,
  Fragment,
  commentInput,
  docId,
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
      queryKey: ["post user", userId],
      queryFn: () => getUserDataUid(userId),
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
          <div className="flex mb-2 justify-between">
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
              <div className="flex justify-center items-center">
                <Avatar
                  sx={{ width: 50, height: 50 }}
                  src={userData?.photoUrl}
                />
                <div className="flex flex-col ml-2">
                  <p className="font-semibold text-md text-clip truncate">
                    {userData?.usertype === "Gym"
                      ? userData?.gymname
                      : userData?.fullname}
                  </p>
                  <p className="text-blue-600 font-semibold truncate">
                    @{userdoc?.username}
                  </p>
                </div>
              </div>
            )}
            {/* {<div className="flex justify-center items-center">
              <Avatar src={userdata.photoUrl} />
              <div className="ml-2">
                <p className="font-semibold">{userdata.gymname}</p>
              </div>
            </div>} */}
            <button onClick={handleOpen} type="button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="stroke-red-500 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </button>

            {/* <Transition appear show={isOpen} as={Fragment}>
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
                      <div className="mt-2">
                        <p className="text-md text-gray-700">
                          Are you sure you want to delete this post.
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-5 mx-10">
                        <button
                          className="font-semibold text-red-700"
                          onClick={deletePost}
                        >
                          Yes
                        </button>
                        <button className="font-semibold" onClick={handleClose}>
                          No
                        </button>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition> */}
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
              src={data.photoUrl}
              alt={data.caption}
            />
          )}

          <div className="mb-2 mt-2">{data.caption}</div>

          <CommentSection
            commentInput={commentInput}
            docId={docId}
            uid={userId}
          />
        </div>
        <span className="text-sm mt-2 text-slate-500 flex justify-end">
          {formattedDate}
        </span>
      </div>
    </>
  );
}
