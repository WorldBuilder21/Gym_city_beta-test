import React from "react";
import ComponentSkeleton from "../../Components/ComponentSkeleton";
import { viewBlockedUsers } from "../../../Services/firebase";
import { useSelector } from "react-redux";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import ErrorMessage from "../../Components/ErrorMessage";
import BlockIcon from "@mui/icons-material/Block";
import BlockedUsersCard from "./components/BlockedUsersCard";
import GroupIcon from "@mui/icons-material/Group";
import { useNavigate } from "react-router";

export default function ViewBlockedUsers() {
  const custom_user = useSelector((state) => state.user.user);

  const {
    status,
    error,
    data,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    {
      queryKey: ["blocked_users"],
      queryFn: () => viewBlockedUsers(custom_user.uid),
      getNextPageParam: (lastpage) => lastpage.nextPage,
    },
    { enabled: false }
  );

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
            <div className="flex mx-2 flex-col justify-center items-center mt-10">
              {data?.pages.map((page, index) =>
                page?.blockedUsers.length === 0 ? (
                  <div
                    key={index}
                    className="flex flex-col justify-center items-center h-screen text-gray-500"
                  >
                    <BlockIcon sx={{ fontSize: 150 }} />
                    <span className="mt-3 text-lg text-center font-semibold">
                      You have not blocked anybody
                    </span>
                  </div>
                ) : (
                  <div key={index} className="max-w-lg w-full">
                    {page?.blockedUsers.map((user, index) => (
                      <BlockedUsersCard key={index} />
                    ))}
                  </div>
                )
              )}
              {hasNextPage && (
                <div
                  className="flex flex-col
              justify-center items-center max-w-lg w-full hover:cursor-pointer"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? (
                    <>
                      <ComponentSkeleton />
                      <ComponentSkeleton />
                      <ComponentSkeleton />
                    </>
                  ) : (
                    <div className="text-center text-blue-500 font-semibold">
                      Load more
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
