import React from "react";
import { Avatar } from "@mui/material";
import { useNavigate } from "react-router";

export default function UserSearchCard({
  docId,
  username,
  fullname,
  photoUrl,
}) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        navigate(`/${docId}`);
      }}
      className="flex flex-col max-w-sm w-full m-2 hover:cursor-pointer hover:bg-gray-50 rounded-lg p-2 shadow"
    >
      <div className="flex">
        <Avatar sx={{ width: 75, height: 75 }} src={photoUrl} />
        <div className="flex flex-col ml-3 justify-center items-start">
          <h1>{fullname}</h1>
          <p className="text-blue-600 font-semibold truncate">@{username}</p>
        </div>
      </div>
    </div>
  );
}
