import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  top_instructors,
  top_gym,
  getTestUsers,
} from "../../Services/firebase";
import GymSearchCard from "./Components/GymSearchCard";
import InstructorSearchCard from "./Components/InstructorSearchCard";
import UserSearchCard from "./Components/UserSearchCard";
import SearchSkeleton from "./Components/SearchSkeleton";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useSelector } from "react-redux";
import { TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import { IconButton } from "@mui/material";

function Search() {
  const userdoc = useSelector((state) => state.userdoc.userdoc);
  const { data: gym_data, status: gym_status } = useQuery(
    {
      queryKey: ["gym"],
      queryFn: top_gym,
    },
    {
      enabled:
        userdoc.usertype === "User" || userdoc.usertype === "Instructor"
          ? true
          : false,
    }
  );

  const { data: instructor_data, status: instructor_status } = useQuery(
    {
      queryKey: ["instructor"],
      queryFn: top_instructors,
    },
    {
      enabled:
        userdoc.usertype === "User" || userdoc.usertype === "Gym"
          ? true
          : false,
    }
  );

  const { data: user_data, status: user_status } = useQuery(
    {
      queryKey: ["testUsers"],
      queryFn: getTestUsers,
    },
    {
      enabled:
        userdoc.usertype === "User" || userdoc.usertype === "Instructors"
          ? true
          : false,
    }
  );

  return (
    <div className="flex flex-col m-4">
      <div>
        <TextField
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          fullWidth
          label="Search..."
        />
      </div>
      {userdoc.usertype === "User" || userdoc.usertype === "Gym" ? (
        <div className="mt-4">
          <h1 className="font-semibold text-2xl mb-2">Popular instructors</h1>
          {instructor_status === "loading" ? (
            <div className="flex flex-wrap">
              <SearchSkeleton />
              <SearchSkeleton />
              <SearchSkeleton />
            </div>
          ) : instructor_status === "error" ? (
            <div className="flex justify-center items-center">
              <div className="text-red-500 mt-16 mb-16">
                <ErrorOutlineIcon sx={{ fontSize: 70 }} />
                <span className="text-lg text-center ml-3">
                  An error has occured, please refresh the page to try again.
                </span>
              </div>
            </div>
          ) : (
            <div>
              {instructor_data.empty ? (
                <div className="flex justify-center items-center">
                  <span className="text-lg mt-16 mb-16 text-gray-500">
                    There are no instructors to display
                  </span>
                </div>
              ) : (
                <div className="flex flex-wrap">
                  {instructor_data.docs.map((data, index) => (
                    <InstructorSearchCard
                      key={index}
                      fullname={data.data().fullname}
                      username={data.data().username}
                      photoUrl={data.data().photoUrl}
                      docId={data.data().docId}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <></>
      )}
      {userdoc.usertype === "User" || userdoc.usertype === "Instructor" ? (
        <div className="mt-4">
          <h1 className="font-semibold text-2xl mb-2">Popular gyms</h1>
          {gym_status === "loading" ? (
            <div className="flex flex-wrap">
              <SearchSkeleton />
              <SearchSkeleton />
              <SearchSkeleton />
            </div>
          ) : gym_status === "error" ? (
            <div className="flex justify-center items-center">
              <div className="text-red-500 mt-16 mb-16">
                <ErrorOutlineIcon sx={{ fontSize: 70 }} />
                <span className="text-lg text-center ml-3">
                  An error has occured, please refresh the page.
                </span>
              </div>
            </div>
          ) : (
            <div>
              {gym_data.empty ? (
                <div className="flex justify-center items-center">
                  <span className="text-lg mt-16 mb-16 text-gray-500">
                    There are no instructors to display
                  </span>
                </div>
              ) : (
                <div className="flex flex-wrap">
                  {gym_data.docs.map((data, index) => (
                    <GymSearchCard
                      gymName={data.data().gymname}
                      username={data.data().username}
                      key={index}
                      docId={data.data().docId}
                      photoUrl={data.data().photoUrl}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <></>
      )}
      {/* This section is only for testing purposes */}
      {userdoc.usertype === "User" ? (
        <div className="mt-4">
          <h1 className="font-semibold text-2xl mb-2">Test Users</h1>
          {user_status === "loading" ? (
            <div className="flex flex-wrap">
              <SearchSkeleton />
              <SearchSkeleton />
              <SearchSkeleton />
            </div>
          ) : user_status === "error" ? (
            <div className="flex justify-center items-center">
              <div className="text-red-500 mt-16 mb-16">
                <ErrorOutlineIcon sx={{ fontSize: 70 }} />
                <span className="text-lg text-center ml-3">
                  An error has occured, please refresh the page.
                </span>
              </div>
            </div>
          ) : (
            <div>
              {user_data.empty ? (
                <div className="flex justify-center items-center">
                  <span className="text-lg mt-16 mb-16 text-gray-500">
                    There are no instructors to display
                  </span>
                </div>
              ) : (
                <div className="flex flex-wrap">
                  {user_data.docs.map((data, index) => (
                    <UserSearchCard
                      key={index}
                      fullname={data.data().fullname}
                      username={data.data().username}
                      docId={data.data().docId}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Search;
