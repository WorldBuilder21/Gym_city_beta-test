import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { viewMembers, getMemberCount } from "../../Services/firebase";
import ComponentSkeleton from "../Components/ComponentSkeleton";
import MemberCard from "./components/MemberCard";
import GroupIcon from "@mui/icons-material/Group";
import ErrorMessage from "../Components/ErrorMessage";

export default function MemberScreen() {
  // members, blocked, requestCount
  const navigate = useNavigate();
  const userId = useSelector((state) => state.userId.userId);
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
      queryKey: ["members"],
      queryFn: () => viewMembers(userId === " " ? custom_user.uid : userId),
      getNextPageParam: (lastpage) => lastpage.nexPage,
    },
    { enabled: false }
  );

  const {
    status: count_status,
    data: count,
    refetch: refetch_count,
  } = useQuery(
    {
      queryKey: ["count_member"],
      queryFn: () => getMemberCount(custom_user.uid),
    },
    { enabled: false }
  );

  console.log(data?.pages);

  const member_count =
    count_status === "loading" ? 0 : count_status === "error" ? 0 : count;
  return (
    <div>
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
              View member
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
          <div className="flex mx-2 flex-col justify-center items-center mt-10">
            <div className="w-full max-w-lg">
              <span className="font-semibold text-2xl">
                Members · {member_count}
              </span>
              <div className="w-full h-0.5 mt-2 mb-5 bg-gray-100 rounded-full" />
            </div>
            {data?.pages?.map((page, index) =>
              page?.members.length === 0 ? (
                <div
                  key={index}
                  className="flex flex-col justify-center items-center h-screen text-gray-500"
                >
                  <GroupIcon sx={{ fontSize: 150 }} />
                  <span className="mt-3 text-lg text-center font-semibold">
                    There are no users to display.
                  </span>
                </div>
              ) : (
                <div key={index} className="max-w-lg w-full">
                  {page?.members.map((member, index) => (
                    <MemberCard
                      key={index}
                      refetch={refetch}
                      refetchCount={refetch_count}
                      Fragment={Fragment}
                      docId={member?.id}
                    />
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
  );
}
