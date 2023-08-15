import { useQuery } from "@tanstack/react-query";
import React, { Fragment, useState } from "react";
import { getUserDataUid } from "../../../Services/firebase";
import { Avatar } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import { blue } from "@mui/material/colors";
import { useSelector } from "react-redux";
import convertSize from "convert-size";
import { formatDistance } from "date-fns";
import CustomDialogBox from "../../Settings/Components/CustomDialogBox";

export default function RepliesCard({ senderId, repliesData, docId }) {
  const custom_user = useSelector((state) => state.user.user);
  const [openModal, setOpenModal] = useState(false);
  const { status, data } = useQuery(
    {
      queryKey: ["reply_sender", docId],
      queryFn: () => getUserDataUid(senderId),
    },
    { enabled: false }
  );

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleDelete = () => {};

  if (status === "loading") {
    return <></>;
  }

  const ts = repliesData.ts;
  const date = new Date(ts?.seconds * 1000 + ts?.nanoseconds / 1000000);
  const formattedDate = formatDistance(date, new Date());

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center overflow-hidden text-ellipsis truncate">
          <Avatar src={data?.photoUrl} sx={{ width: 70, height: 70 }} />
          <div className="flex flex-col justify-center ml-3">
            <div className="flex items-center">
              <p className="font-semibold mr-2 truncate">
                {data?.usertype === "Gym" ? data.gymname : data.fullname}
              </p>
              {data?.usertype === "Gym" && (
                <VerifiedIcon sx={{ fontSize: 17, color: blue[600] }} />
              )}
            </div>
            <p className="text-blue-600 font-semibold truncate">
              @{data?.username}
            </p>
          </div>
        </div>
        {custom_user.uid === senderId && (
          <>
            <svg
              onClick={handleOpenModal}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 hover:cursor-pointer hover:stroke-red-600 stroke-red-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
            <CustomDialogBox
              Fragment={Fragment}
              isOpen={openModal}
              handleClose={handleCloseModal}
              handleTask={handleDelete}
              message={"Are you sure you want to delete this message?"}
            />
          </>
        )}
      </div>
      <div className="mt-2">{repliesData?.message}</div>
      {repliesData.attachments.length > 0 ? (
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
            <span>Attachments • {repliesData.attachments.length}</span>
          </span>
          <div className="flex flex-wrap lg:space-x-2">
            {repliesData.attachments.map((data, index) => {
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
                      <div className="text-sm text-slate-500">{fileSize}</div>
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
    </div>
  );
}
