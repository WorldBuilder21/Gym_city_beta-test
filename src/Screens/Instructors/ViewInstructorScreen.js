import React from "react";
import ErrorMessage from "../Components/ErrorMessage";
import ComponentSkeleton from "../Components/ComponentSkeleton";
import InstructorCard from "./components/InstructorCard";
import GroupIcon from "@mui/icons-material/Group";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { viewInstructors } from "../../Services/firebase";

export default function ViewInstructorScreen() {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.userId.userId);
  const custom_user = useSelector((state) => state.user.user);
  const { data, status, refetch } = useQuery(
    {
      queryKey: ["instructors"],
      queryFn: () => viewInstructors(userId === " " ? custom_user.uid : userId),
    },
    { enabled: false }
  );
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
              View instructors
            </span>
          </div>
        </div>
      </nav>

      {status === "loading" ? (
        <div className="flex mx-2 flex-col justify-center items-center mt-10">
          <ComponentSkeleton />
          <ComponentSkeleton />
          <ComponentSkeleton />
        </div>
      ) : status === "error" ? (
        <ErrorMessage
          message={
            "An error has occured, please refresh the page to try again."
          }
        />
      ) : (
        <div>
          {data.empty ? (
            <div className="flex flex-col justify-center items-center h-screen text-gray-500">
              <GroupIcon sx={{ fontSize: 150 }} />
              <span className="mt-3 text-lg text-center font-semibold">
                There are no users to display.
              </span>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center mt-10">
              {data.doc.map((data, index) => (
                <InstructorCard key={index} />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
