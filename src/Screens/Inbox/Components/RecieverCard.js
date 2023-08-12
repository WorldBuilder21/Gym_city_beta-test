import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useNavigate } from "react-router";
import { getUserDataUid } from "../../../Services/firebase";
import { Chip, Avatar } from "@mui/material";

export default function RecieverCard({ recieverId }) {
  const navigate = useNavigate();

  console.log(recieverId);

  const { status, data } = useQuery(
    {
      queryKey: ["reciever_name", recieverId],
      queryFn: () => getUserDataUid(recieverId),
    },
    { enabled: false }
  );

  if (status === "loading") {
    return <></>;
  }

  return (
    <div className="flex mt-4 items-center">
      <span className="mr-2">to:</span>
      <span
        onClick={() => {
          navigate(`/${recieverId}`);
        }}
      >
        <Chip
          className="hover:bg-gray-200 hover:cursor-pointer"
          avatar={<Avatar src={data?.photoUrl} />}
          label={<div className="font-semibold">{data?.fullname}</div>}
          variant="outlined"
        />
      </span>
    </div>
  );
}
