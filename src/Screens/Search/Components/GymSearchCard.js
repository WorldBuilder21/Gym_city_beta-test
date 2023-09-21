import React from "react";
import { Avatar } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { yellow } from "@mui/material/colors";
import { useNavigate } from "react-router";
import MemberChip from "../../Profile/components/MemberChip";
import { getAverageRating } from "../../../Queries/RatingQuery";
import RatingString from "../../Profile/components/RatingString";

export default function GymSearchCard({ docId, username, photoUrl, gymName }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        navigate(`/${docId}`);
      }}
      className="flex flex-col max-w-sm w-full m-2 hover:cursor-pointer hover:bg-gray-50 rounded-lg p-4 shadow"
    >
      <div className="flex">
        <Avatar sx={{ width: 75, height: 75 }} src={photoUrl} />
        <div className="flex flex-col ml-3 justify-center items-start">
          <h1>{gymName}</h1>
          <p className="text-blue-600 font-semibold truncate">@{username}</p>
        </div>
      </div>
      <div className="flex mt-2 space-x-2">
        <MemberChip id={docId} />
        <div className="border p-2 rounded-lg text-sm px-4 font-semibold">
          {/* <div className="flex flex-row justify-center items-center space-x-1">
            Rating: 0
            <StarIcon sx={{ color: yellow[800], fontSize: 20 }} />
          </div> */}
          <RatingString id={docId} />
        </div>
      </div>
    </div>
  );
}
