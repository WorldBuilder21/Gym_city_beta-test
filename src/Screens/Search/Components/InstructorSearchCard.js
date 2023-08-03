import React from "react";
import { Avatar } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { yellow } from "@mui/material/colors";
import { useNavigate } from "react-router";

export default function InstructorSearchCard({
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
      className="flex flex-col rounded-lg hover:cursor-pointer hover:bg-gray-50 shadow border m-2 p-2 w-full max-w-sm"
    >
      <div className="flex">
        <Avatar sx={{ width: 75, height: 75 }} src={photoUrl} />
        <div className="flex flex-col ml-3 justify-center items-start">
          <h1>{fullname}</h1>
          <p className="text-blue-600 font-semibold truncate">@{username}</p>
        </div>
      </div>
      <div className="flex mt-2 space-x-2">
        <div className="border p-2 rounded-lg text-sm px-4 font-semibold">
          <div className="flex flex-row justify-center items-center space-x-1">
            Employer rating: 0
            <StarIcon sx={{ color: yellow[800], fontSize: 20 }} />
          </div>
        </div>
        <div className="border p-2 rounded-lg text-sm px-4 font-semibold">
          <div className="flex flex-row justify-center items-center space-x-1">
            Client rating: 0
            <StarIcon sx={{ color: yellow[800], fontSize: 20 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
