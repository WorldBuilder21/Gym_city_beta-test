import React from "react";
import { Avatar } from "@mui/material";
import { useSelector } from "react-redux";
import CommentIcon from "@mui/icons-material/Comment";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useNavigate } from "react-router";

export default function PostCard({ data }) {
  const user_doc = useSelector((state) => state.userdoc.userdoc);
  const navigate = useNavigate();

  console.log(data);

  return (
    <div className="p-4 relative w-full max-w-sm mb-4 md:mr-4 rounded-lg border-gray-200 shadow">
      <div className="flex flex-col">
        <div className="flex justify-between">
          <div className="flex justify-center items-center">
            <Avatar src={user_doc.photoUrl} />
            <div className="ml-2">
              <p>{user_doc.gymname}</p>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            navigate(`/home/${data.docId}`);
          }}
          className="mt-2"
        >
          <img className="rounded-md" src={data.photoUrl} alt={data.caption} />
        </button>
        <div className="mt-2 flex items-center space-x-4">
          <div className="flex items-center">
            <CommentIcon />
            <div className="ml-1">0</div>
          </div>
          <div className="flex items-center">
            <FavoriteBorderIcon />
            <div className="ml-1">0</div>
          </div>
        </div>
      </div>
    </div>
  );
}
