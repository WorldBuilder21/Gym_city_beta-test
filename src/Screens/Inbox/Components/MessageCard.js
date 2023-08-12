import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { getUserDataUid } from "../../../Services/firebase";
import { Avatar } from "@mui/material";
import { formatDistance } from "date-fns";
import VerifiedIcon from "@mui/icons-material/Verified";
import { blue } from "@mui/material/colors";
import { getMessageData } from "../../../utils/store/inbox/inboxSlice";

export default function MessageCard({
  senderId,
  recieverId,
  refetch,
  Fragment,
  refetchCount,
  ts,
  docId,
  body,
  title,
  messageData,
}) {
  const navigate = useNavigate();
  const custom_user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const { status, data: userData } = useQuery(
    {
      queryKey: ["message_sender", docId],
      queryFn: () => getUserDataUid(senderId),
    },
    { enabled: false }
  );

  if (status === "loading") {
    return <></>;
  }

  console.log(messageData);

  const date = new Date(ts?.seconds * 1000 + ts?.nanoseconds / 1000000);
  const formattedDate = formatDistance(date, new Date());

  return (
    <div className="flex flex-col relative w-full hover:border hover:rounded-lg hover:cursor-pointer hover:shadow-md  p-5 ">
      <div className="flex items-center justify-between">
        <div className="flex items-center overflow-hidden text-ellipsis truncate">
          <div
            onClick={() => {
              dispatch(
                getMessageData({ message: messageData, user: userData })
              );
              navigate("/inbox/viewMessage");
            }}
            className="flex w-full"
          >
            <Avatar src={userData?.photoUrl} sx={{ width: 50, height: 50 }} />
            <div className="flex flex-col ml-3 justify-center space-y-2 text-clip overflow-hidden truncate break-all">
              <div>
                <div className="flex items-center">
                  <p className="text-xs mr-2 truncate font-semibold">
                    {userData?.usertype === "Gym"
                      ? userData?.gymname
                      : userData?.fullname}
                  </p>
                  {userData?.usertype === "Gym" && (
                    <VerifiedIcon sx={{ fontSize: 17, color: blue[600] }} />
                  )}
                </div>
                <p className="font-semibold text-lg ">{title}</p>
                <p
                  // style={{ whiteSpace: "nowrap", textOverflow: "ellipsis" }}
                  className="text-gray-500"
                >
                  {body}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          {custom_user.uid === senderId && (
            <svg
              onClick={() => {}}
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
          )}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="flex items-center text-slate-500 text-sm mt-1">
          {messageData?.attachments?.length}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5 ml-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
            />
          </svg>
        </span>

        <span className="text-sm text-slate-500">{formattedDate}</span>
      </div>
    </div>
  );
}
