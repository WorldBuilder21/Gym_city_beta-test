import React from "react";
import { Avatar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import CommentIcon from "@mui/icons-material/Comment";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getCommentCount, getLikeCount } from "../../../../Services/firebase";
import { getUserId } from "../../../../utils/store/user/getUserIdSlice";
import { formatDistance } from "date-fns";

export default function PostCard({ data, uid }) {
  const user_doc = useSelector((state) => state.userdoc.userdoc);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  console.log("userdoc:", user_doc);

  console.log("docId:", data?.docId);

  console.log(uid);

  // comment counter
  // uid, postId
  const {
    status: count_status_comment,
    data: count_comment,
    refetch: refetch_count,
  } = useQuery(
    {
      queryKey: ["count_comments"],
      queryFn: () => getCommentCount(data?.docId, uid),
    },
    { enabled: false }
  );

  // like counter
  const {
    status: count_status_likes,
    data: count_likes,
    refetch: refetch_likes,
  } = useQuery(
    {
      queryKey: ["count_likes"],
      queryFn: () => getLikeCount(data?.docId, uid),
    },
    { enabled: false }
  );

  console.log("count likes: ", count_likes);
  console.log("count_comment: ", count_comment);

  const like_counter =
    count_status_likes === "loading"
      ? 0
      : count_status_likes === "error"
      ? 0
      : count_likes;

  const comment_counter =
    count_status_comment === "loading"
      ? 0
      : count_status_comment === "error"
      ? 0
      : count_comment;

  console.log(data);

  const date = new Date(
    data?.ts?.seconds * 1000 + data?.ts?.nanoseconds / 1000000
  );
  const formattedDate = formatDistance(date, new Date());

  return (
    <div className="p-2 relative w-full max-w-sm mb-4 md:mr-4 rounded-lg border-gray-200 shadow">
      <div className="flex flex-col">
        <button
          type="button"
          onClick={() => {
            navigate(`/home/${data?.docId}`);
            dispatch(getUserId(uid));
          }}
          className="mt-2 mb-2"
        >
          <div className="bg-black items-center justify-center flex rounded-md">
            <img
              className="rounded-md object-contain h-80"
              src={data?.photoUrl}
              alt={data?.caption}
            />
          </div>
        </button>
        <div className="mt-2 flex items-center space-x-4">
          <div className="flex items-center">
            <CommentIcon />
            <div className="ml-1">{comment_counter}</div>
          </div>
          <div className="flex items-center">
            <FavoriteBorderIcon />
            <div className="ml-1">{like_counter}</div>
          </div>
        </div>
        <span className="text-sm text-slate-500 flex justify-end">
          {formattedDate}
        </span>
      </div>
    </div>
  );
}
