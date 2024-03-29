import React from "react";
import { useSelector } from "react-redux";
import { Avatar } from "@mui/material";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import EditIcon from "@mui/icons-material/Edit";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { yellow } from "@mui/material/colors";
import StarIcon from "@mui/icons-material/Star";
import GroupIcon from "@mui/icons-material/Group";
import ReviewsIcon from "@mui/icons-material/Reviews";
import {
  bmiCalaculator,
  bmiTextStatus,
  bmiBorderColor,
  bmiBorderStatus,
} from "../../Services/bmiChecker";
import { useNavigate } from "react-router";
import RatingString from "./components/RatingString";
import GymChip from "./components/GymChip";
import { useQuery } from "@tanstack/react-query";
import { getUserDataUid } from "../../Services/firebase";
import Tooltip from "@mui/material/Tooltip";

export default function ViewProfieScreen() {
  const userdoc = useSelector((state) => state.userdoc.userdoc);
  const navigate = useNavigate();

  const {
    status,
    data: user_data,
    refetch,
  } = useQuery(
    {
      queryKey: ["profiledata"],
      queryFn: () => getUserDataUid(userdoc.docId),
    },
    { enabled: false }
  );

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
              View profile
            </span>
          </div>
        </div>
      </nav>
      <div className="flex flex-col items-center">
        <div className="mt-16 w-full px-5 max-w-lg md:max-w-xl md:mx-2">
          <div className="flex flex-wrap">
            <Avatar className="mr-4 mb-2" sx={{ width: 90, height: 90 }} src={userdoc.photoUrl} />
            <div className="flex flex-col  justify-center space-y-2">
              <div>
                <p className="font-semibold text-md truncate">
                  {userdoc.usertype === "Gym"
                    ? userdoc.gymname
                    : userdoc.fullname}
                </p>
                <p className="text-blue-600 text-sm font-semibold truncate">
                  @{userdoc.username}
                </p>
              </div>
            </div>
          </div>
          {userdoc.usertype === "Gym" ? (
            <div className="flex mt-2 flex-row">
              <RatingString id={userdoc.docId} />
            </div>
          ) : userdoc.usertype === "Instructor" ? (
            <div className="flex mt-2 flex-row space-x-4">
              <Tooltip
                title="This rating represents the level of satisfaction reported by past clients with whom this instructor has worked. Will be added in the next update."
                arrow
              >
                <div className="flex hover:cursor-pointer font-semibold flex-row items-center">
                  Client rating: 0
                  <StarIcon sx={{ color: yellow[800], fontSize: 30 }} />
                </div>
              </Tooltip>

              <Tooltip
                title="This rating represents the level of satifaction reported by past gym's with whom this instructor has worked with. Will be added in the next update"
                arrow
              >
                <div className="flex hover:cursor-pointer font-semibold flex-row items-center">
                  Employer rating: 0
                  <StarIcon sx={{ color: yellow[800], fontSize: 30 }} />
                </div>
              </Tooltip>
            </div>
          ) : (
            <></>
          )}
          <p className="mt-2">{userdoc.bio}</p>
          {userdoc.usertype !== "Gym" && (
            <div className="mt-2 mb-2 md:mb-0 justify-center items-center md:justify-between flex flex-col md:flex-row space-y-2 md:space-y-0">
              <div className="rounded-md border ml-2 px-4 py-1.5 font-semibold border-black md:border-none text-center text-sm w-full">
                <div className="flex items-center">
                  <p className="text-md md:text-lg">Weight:</p>
                  <p className="ml-1 md:ml-2 font-semibold text-lg md:text-xl">
                    {userdoc.weight}kg
                  </p>
                </div>
              </div>

              <div className="rounded-md border ml-2 px-4 py-1.5 font-semibold border-black md:border-none text-center text-sm w-full">
                <div className="flex items-center">
                  <p className="text-md md:text-lg">Height:</p>
                  <p className="ml-1 md:ml-2 font-semibold text-lg md:text-xl">
                    {userdoc.height}cm
                  </p>
                </div>
              </div>

              <div className="rounded-md border ml-2 px-4 py-1.5 font-semibold border-black md:border-none text-center text-sm w-full">
                <div className="flex items-center">
                  <p className="text-md md:text-lg">BMI:</p>
                  <div className="infline-flex items-center justify-center">
                    <p
                      className={`ml-1 md:ml-2 font-semibold text-lg md:text-xl ${bmiTextStatus(
                        userdoc.height,
                        userdoc.weight
                      )}`}
                    >
                      {bmiCalaculator(userdoc.height, userdoc.weight)}
                      kg/m<sup>2</sup>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {userdoc.usertype !== "Gym" && (
            <div className="flex flex-col md:flex-row justify-center items-start md:mt-0 md:justify-between md:items-end">
              <div className="flex mt-2 items-end md:items-center">
                <p className="text-md md:text-lg">BMI status: </p>
                <div
                  className={`${bmiBorderColor(
                    userdoc.height,
                    userdoc.weight
                  )} ml-2 font-medium text-md px-2.5 py-0.5 rounded border`}
                >
                  {bmiBorderStatus(userdoc.height, userdoc.weight)}
                </div>
              </div>
              {/* <button className="w-full md:w-auto mt-5 disabled:opacity-25 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-10 py-2.5 text-center">
                View workouts
              </button> */}
            </div>
          )}

          <div className="mt-4 space-y-3">
            {userdoc.usertype !== "Gym" && (
              <button
                onClick={() => {
                  navigate("/settings/viewProfile/weightTracker");
                }}
                className="flex w-full hover:bg-gray-100 border border-gray-300 p-4 rounded-lg shadow-md items-center justify-between truncate"
              >
                <div className="items-center justify-center flex text-ellipsis overflow-hidden">
                  <AnalyticsIcon />
                  <span className="font-semibold ml-4 truncate">Track your weight</span>
                </div>
                <ArrowForwardIcon />
              </button>
            )}
            {userdoc.usertype === "Instructor" && (
              <Tooltip title="Will be available in the next update." arrow>
                <button
                  onClick={() => {
                    // navigate("/settings/viewProfile/editProfile");
                    console.log("Hello World");
                  }}
                  className="flex w-full hover:bg-gray-100 border border-gray-300 p-4 rounded-lg shadow-md items-center justify-between truncate"
                >
                  <div className="text-ellipsis overflow-hidden items-center justify-center flex">
                    <ReviewsIcon />
                    <span className="font-semibold ml-4 truncate">View reviews</span>
                  </div>
                  <ArrowForwardIcon />
                </button>
              </Tooltip>
            )}
            {userdoc.usertype === "Instructor" && (
              <Tooltip title="Will be available in the next update." arrow>
                <button
                  onClick={() => {
                    // navigate("/settings/viewProfile/editProfile");
                    console.log("Hello World");
                  }}
                  className="flex w-full hover:bg-gray-100 border border-gray-300 p-4 rounded-lg shadow-md items-center justify-between truncate"
                >
                  <div className="items-center justify-center flex text-ellipsis overflow-hidden">
                    <GroupIcon />
                    <span className="font-semibold ml-4 truncate">View Clients</span>
                  </div>
                  <ArrowForwardIcon />
                </button>
              </Tooltip>
            )}
            {userdoc.usertype === "Gym" && (
              <button
                className="flex w-full hover:bg-gray-100 border border-gray-300 p-4 rounded-lg shadow-md items-center justify-between truncate"
                onClick={() => {
                  navigate("/settings/viewProfile/reviews");
                }}
              >
                <div className="items-center justify-center flex text-ellipsis overflow-hidden">
                  <ReviewsIcon />
                  <span className="font-semibold ml-4 truncate">View your reviews</span>
                </div>
                <ArrowForwardIcon />
              </button>
            )}

            <button
              onClick={() => {
                navigate("/settings/viewProfile/editProfile");
              }}
              className="flex w-full hover:bg-gray-100 border border-gray-300 p-4 rounded-lg shadow-md items-center justify-between truncate"
            >
              <div className="items-center justify-center flex text-ellipsis overflow-hidden">
                <EditIcon />
                <span className="font-semibold ml-4 truncate">Edit your profile</span>
              </div>
              <ArrowForwardIcon />
            </button>

            {userdoc.usertype === "Instructor" && (
              <>
                {status === "loading" ? (
                  <div></div>
                ) : (
                  <div className="flex space-x-3 items-center">
                    <div className="font-semibold">Employment status:</div>
                    {user_data?.memberships?.length === 0 ? (
                      <div className="rounded-md border ml-2 px-4 py-1.5 font-semibold border-black mt-1 text-center text-sm">
                        No memberships
                      </div>
                    ) : (
                      <GymChip accountData={user_data} />
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="mb-10"></div>
    </div>
  );
}
