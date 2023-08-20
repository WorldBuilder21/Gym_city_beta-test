import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  acceptRequest,
  getUserDataUid,
  declineRequest,
} from "../../../Services/firebase";
import { Avatar } from "@mui/material";
import { useNavigate } from "react-router";
import Chip from "@mui/material/Chip";
import { useSelector } from "react-redux";

export default function RequestCard({
  item,
  uid,
  refetch,
  refetchCount,
  openSnackbar,
}) {
  const navigate = useNavigate();
  const custom_user = useSelector((state) => state.user.user);
  const [isLoading, setIsLoading] = useState(false)

  const { status, data: userdata } = useQuery(
    {
      queryKey: ["user_request", uid],
      queryFn: () => getUserDataUid(uid),
    },
    { enabled: false }
  );

  if (status === "loading") {
    return <div></div>;
  }

  const handleAccept = async () => {
    setIsLoading(true)
    try {
      console.log("item:", item?.requestType);
      console.log("uid:", uid);
      console.log(custom_user.uid);
    
      await acceptRequest(custom_user.uid, uid, item?.requestType);
      openSnackbar({ message: "Request accepted." });
      refetch();
      refetchCount();
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log(error);
      openSnackbar({ message: "An error has occured.", severity: "error" });
    }
  };

  const handleDecline = async () => {
    setIsLoading(true)
    await declineRequest(custom_user.uid, uid);
    openSnackbar({ message: "Request declined.", severity: "error" });
    refetch();
    setIsLoading(false)
    refetchCount();
  };

  const displayMessage = () => {
    if (item.requestType === "friend") {
      return "has sent you a friend request.";
    } else if (item.requestType === "Membership") {
      return "wants to be a member of your gym.";
    } else if (item.requestType === "Employment") {
      return "wants to be an instructor at your gym.";
    }
  };

  return (
    <div className="flex flex-col mb-5  m-2 hover:cursor-pointer  rounded-lg p-3 shadow">
      {/* <p className='flex items-center'>
      <span onClick={() => {navigate(`/${uid}`)}} className='flex border w-fit hover:bg-gray-100 p-1 rounded-full'>
        <Avatar sx={{width:30, height: 30}} src={userdata?.photoUrl}/>
        <div className='flex flex-col ml-1 mr-2 justify-center items-start'>
            <p className='font-semibold text-md text-clip truncate'>{userdata?.fullname}</p>
        </div>
      </span>
      <p className='ml-2'>{displayMessage()}</p>
      </p> */}
      <div className="flex">
        {/* <span className="inline">
          <Avatar sx={{ width: 30, height: 30 }} src={userdata?.photoUrl} />
        </span> */}
        <div>
          <span
            onClick={() => {
              navigate(`/${uid}`);
            }}
          >
            <Chip
              className="hover:bg-gray-200 hover:cursor-pointer"
              avatar={<Avatar src={userdata?.photoUrl} />}
              label={<div className="font-semibold">{userdata?.fullname}</div>}
              variant="outlined"
            />
          </span>
          <span className="break-all ml-2">{displayMessage()}</span>
        </div>
      </div>
      <div className="flex items-end justify-end mt-3 mr-2 space-x-4">
        <button
        disabled={isLoading}
          onClick={handleAccept}
          className="border disabled:opacity-25 hover:bg-blue-600 bg-blue-500 rounded-md px-8 py-2 justify-center items-center font-semibold text-white text-center text-sm"
        >
          Accept
        </button>
        <button
        disabled={isLoading}
          onClick={handleDecline}
          className="border disabled:opacity-25 border-black rounded-md px-8 py-2 justify-center hover:text-rose-500 hover:border-red-500 items-center font-semibold text-center text-sm"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
