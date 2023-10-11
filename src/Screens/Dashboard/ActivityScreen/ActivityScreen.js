import React, { useState } from "react";
import ActivitySkeleton from "../components/ActivitySkeleton";
import ActivityCard from "./components/ActivityCard";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import moment from "moment";
import { Menu } from "@headlessui/react";
import { CircularProgress } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useNavigate } from "react-router";
import dayjs from "dayjs";
import { pickActivity } from "../../../Services/firebase";
import ErrorMessage from "../../Components/ErrorMessage";
import TaskIcon from "@mui/icons-material/Task";

export default function ActivityScreen() {
  const custom_user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  const d = new Date();
  const formatted = moment(d).format("MMMM YYYY");

  const [pickedDate, setPickedDate] = useState(formatted);

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
      queryKey: [
        "activities",
        new Date(pickedDate).getMonth(),
        new Date(pickedDate).getFullYear(),
      ],
      queryFn: (pageParam) =>
        pickActivity(
          custom_user.uid,
          new Date(pickedDate).getMonth(),
          new Date(pickedDate).getFullYear(),
          pageParam.pageParam
        ),
      getNextPageParam: (lastpage) => lastpage.nextPage,
    },
    { enabled: false }
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
              Activity Tracker
            </span>
          </div>
        </div>
      </nav>
      <div className="m-4">
        <div className="flex flex-col">
          {status === "error" ? (
            <ErrorMessage
              message={
                "An error has occurred, please refresh the page to try again."
              }
            />
          ) : status === "loading" ? (
            <div className="flex flex-col space-y-2 mt-2 justify-center items-center">
              <ActivitySkeleton />
              <ActivitySkeleton />
              <ActivitySkeleton />
            </div>
          ) : (
            <>
              <div className="flex flex-col items-start">
                <div className="font-semibold text-2xl mt-4">Activities</div>
                <div className="w-full h-0.5 mt-2 mb-5 bg-gray-100 rounded-full" />
              </div>

              <DatePicker
                defaultValue={dayjs(formatted)}
                value={dayjs(pickedDate)}
                onChange={(item) => {
                  console.log("dayjs:", dayjs(item));
                  setPickedDate(item);
                }}
                label={'"month and year"'}
                views={["month", "year"]}
              />
              <div className="mt-2">
                {data?.pages?.map((page, index) =>
                  page?.activities?.length === 0 ? (
                    <div
                      key={index}
                      className="flex flex-col justify-center items-center h-screen text-gray-500"
                    >
                      <TaskIcon sx={{ fontSize: 150 }} />
                      <span className="mt-3 text-lg text-center font-semibold">
                        There are no activities to display.
                      </span>
                    </div>
                  ) : (
                    <div key={index} className="flex flex-col ml-2 mt-4">
                      <div>
                        <ol className="relative border-l border-gray-200">
                          {page?.activities?.map((activities, index) => (
                            <div key={index} className="w-full">
                              <ActivityCard data={activities} />
                            </div>
                          ))}
                        </ol>
                      </div>
                    </div>
                  )
                )}
                {hasNextPage && (
                  <div
                    className="flex flex-col
              justify-center items-center w-full hover:cursor-pointer"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                  >
                    {isFetchingNextPage ? (
                      <>
                        <ActivitySkeleton />
                        <ActivitySkeleton />
                        <ActivitySkeleton />
                      </>
                    ) : (
                      <div className="text-center text-blue-500 font-semibold">
                        Load more
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </LocalizationProvider>
  );
}
