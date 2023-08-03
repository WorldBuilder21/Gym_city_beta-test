import React, { useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FullViewPostCard from "./components/FullViewPostCard";
import { useSelector } from "react-redux";
import { getPostData } from "../../../Services/firebase";
import ErrorMessage from "../../Components/ErrorMessage";
import { useQuery } from "@tanstack/react-query";
import SkeletonFullView from "./components/SkeletonFullView";

export default function ViewPostScreen() {
  let { id } = useParams();
  const user_doc = useSelector((state) => state.userdoc.userdoc);
  const custom_user = useSelector((state) => state.user.user);
  const commentInput = useRef(null);

  const navigate = useNavigate();
  const { status, data: postData } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPostData(custom_user.uid, id),
  });

  return (
    <div>
      <div>
        <nav className="bg-white px-4 py-4 relative w-full z-20 top-0 left-0 border-b border-gray-200 mb-2 drop-shadow">
          <div className="container flex flex-wrap items-center">
            <button
              onClick={() => {
                navigate(-1);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="active:stroke-slate-200 -ml-1 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
            </button>
          </div>
        </nav>

        {status === "error" ? (
          <ErrorMessage message={"This post could not be retrieved"} />
        ) : status === "loading" ? (
          <div className="flex flex-col mt-10 items-center">
            <SkeletonFullView />
          </div>
        ) : (
          <div className="flex mx-2 md:mx-0 flex-col mt-10 items-center">
            <FullViewPostCard
              commentInput={commentInput}
              data={postData}
              userdata={user_doc}
              docId={id}
            />
          </div>
        )}
        <div className="mb-4"></div>
      </div>
    </div>
  );
}
