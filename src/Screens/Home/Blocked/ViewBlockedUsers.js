import React from "react";
import ComponentSkeleton from "../../Components/ComponentSkeleton";
import { viewBlockedUsers } from "../../../Services/firebase";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import ErrorMessage from "../../Components/ErrorMessage";
import BlockIcon from "@mui/icons-material/Block";
import BlockedUsersCard from "./components/BlockedUsersCard";
import { useNavigate } from "react-router";

export default function ViewBlockedUsers() {
  const custom_user = useSelector((state) => state.user.user);
  const { status, data, refetch } = useQuery({
    queryKey: ["blockedUsers"],
    queryFn: () => viewBlockedUsers(custom_user.uid),
  });
  const navigate = useNavigate();
  return (
    <>
      <nav className="bg-white px-4 py-4 relative w-full z-20 top-0 left-0 border-b border-gray-200 mb-2 drop-shadow-md">
        <div className="container flex flex-wrap  items-center">
          <div className="flex flex-wrap items-center justify-center">
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
            <span className="text-xl ml-4 font-semibold whitespace-nowrap">
              View blocked users
            </span>
          </div>
        </div>
      </nav>
      <div>
        {status === "error" ? (
          <ErrorMessage
            message={
              "An error has occurred, please refresh the page to try again."
            }
          />
        ) : status === "loading" ? (
          <div className="flex flex-col mx-2 mt-10 justify-center items-center">
            <ComponentSkeleton />
            <ComponentSkeleton />
            <ComponentSkeleton />
          </div>
        ) : (
          <div>
            {data.empty ? (
              <div className="flex flex-col justify-center items-center h-screen text-gray-500">
                <BlockIcon sx={{ fontSize: 150 }} />
                <span className="mt-3 text-lg text-center font-semibold">
                  You have not blocked any users.
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center mt-10">
                {data.docs.map((data, index) => (
                  <BlockedUsersCard key={index} />
                ))}
                <BlockedUsersCard />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
