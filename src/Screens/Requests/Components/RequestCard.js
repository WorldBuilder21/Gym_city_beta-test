import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState, Fragment } from "react";
import {
  acceptRequest,
  getUserDataUid,
  declineRequest,
} from "../../../Services/firebase";
import { Avatar } from "@mui/material";
import { useNavigate } from "react-router";
import Chip from "@mui/material/Chip";
import { useDispatch, useSelector } from "react-redux";
import { formatDistance } from "date-fns";
import DraftPostDialogBox from "./DraftPostDialogBox";
import { getRoutineData } from "../../../utils/store/routine/routineSlice";

export default function RequestCard({
  item,
  docId,
  senderId,
  refetch,
  refetchCount,
  openSnackbar,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const custom_user = useSelector((state) => state.user.user);
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleOpen = () => {
    setOpenModal(true);
  };

  const date = new Date(
    item?.ts?.seconds * 1000 + item?.ts?.nanoseconds / 1000000
  );
  const formattedDate = formatDistance(date, new Date());

  const { status, data: userdata } = useQuery(
    {
      queryKey: ["user_request", docId],
      queryFn: () => getUserDataUid(senderId),
    },
    { enabled: false }
  );

  if (status === "loading") {
    return <div></div>;
  }

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      console.log("item:", item?.requestType);
      console.log(custom_user.uid);

      await acceptRequest(custom_user.uid, senderId, item?.requestType);
      openSnackbar({ message: "Request accepted." });
      refetch();
      refetchCount();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      openSnackbar({ message: "An error has occured.", severity: "error" });
    }
  };

  const handleDecline = async () => {
    setIsLoading(true);
    await declineRequest(custom_user.uid, docId);
    openSnackbar({ message: "Request declined.", severity: "error" });
    refetch();
    setIsLoading(false);
    refetchCount();
  };

  const displayMessage = () => {
    if (item?.requestType === "friend") {
      return "has sent you a friend request.";
    } else if (item?.requestType === "Membership") {
      return "wants to be a member of your gym.";
    } else if (item?.requestType === "Employment") {
      return "wants to be an instructor at your gym.";
    } else if (item?.requestType === "PostDraft") {
      return "is seeking approval for a created post.";
    } else if (item?.requestType === "RoutineDraft") {
      return "is seeking approval for a create routine.";
    } else if (item?.requestType === "Instructor_Employment") {
      return "wants to hire you to be their instructor.";
    }
  };

  console.log("item:", item);

  return (
    <>
      <DraftPostDialogBox
        openSnackbar={openSnackbar}
        isOpen={openModal}
        handleClose={handleClose}
        Fragment={Fragment}
        refetch={refetch}
        refetchCount={refetchCount}
        handleDecline={handleDecline}
        item={item}
      />
      <div className="flex flex-col mb-5  m-2 hover:cursor-pointer  rounded-lg p-3 shadow">
        <div className="flex">
          {/* <span className="inline">
          <Avatar sx={{ width: 30, height: 30 }} src={userdata?.photoUrl} />
        </span> */}
          <div>
            <span
              onClick={() => {
                navigate(`/${senderId}`);
              }}
            >
              <Chip
                className="hover:bg-gray-200 hover:cursor-pointer"
                avatar={<Avatar src={userdata?.photoUrl} />}
                label={
                  <div className="font-semibold">
                    {userdata?.usertype === "Gym"
                      ? userdata?.gymname
                      : userdata?.fullname}
                  </div>
                }
                variant="outlined"
              />
            </span>
            <span className="break-all ml-2">{displayMessage()}</span>
          </div>
        </div>

        {item?.requestType === "RoutineDraft" ? (
          <div className="flex mt-3 justify-center items-center">
            <button
              onClick={() => {
                navigate("/requests/viewRoutine");
                dispatch(getRoutineData(item));
              }}
              className="border hover:border-blue-400 hover:text-blue-400 w-full rounded-md py-3"
            >
              <span>View routine</span>
            </button>
          </div>
        ) : (
          <></>
        )}
        {item?.requestType === "PostDraft" ? (
          <div className="flex mt-3 justify-center items-center">
            <button
              onClick={handleOpen}
              className="border hover:border-blue-400 hover:text-blue-400 w-full rounded-md py-3"
            >
              <span>View post</span>
            </button>
          </div>
        ) : (
          <></>
        )}
        {item?.requestType === "PostDraft" ||
        item?.requestType === "RoutineDraft" ? (
          <></>
        ) : (
          <div className={`flex items-end justify-end mt-3 mr-2 space-x-4`}>
            <button
              disabled={isLoading}
              onClick={handleAccept}
              className="border disabled:opacity-25 hover:bg-blue-600 bg-blue-500 rounded-full px-8 py-2 justify-center items-center font-semibold text-white text-center text-sm"
            >
              Accept
            </button>
            <button
              disabled={isLoading}
              onClick={handleDecline}
              className="border disabled:opacity-25 border-black rounded-full px-8 py-2 justify-center hover:text-rose-500 hover:border-red-500 items-center font-semibold text-center text-sm"
            >
              Decline
            </button>
          </div>
        )}
        <span className="text-gray-400 justify-end items-end mt-1 flex flex-row">
          {formattedDate}
        </span>
      </div>
    </>
  );
}
