import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getUserDataUid } from "../../../../Services/firebase";
import { Avatar, Chip } from "@mui/material";
import { useNavigate } from "react-router";

export default function UserChip({ data }) {
  const navigate = useNavigate();

  const { status, data: userdata } = useQuery(
    {
      queryKey: ["gym_activities", data?.senderId],
      queryFn: () => getUserDataUid(data?.senderId),
    },
    { enabled: false }
  );

  if (status === "loading") {
    return <div></div>;
  }

  return (
    <span
      onClick={() => {
        navigate(`/${data?.senderId}`);
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
  );
}
