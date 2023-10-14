import { Avatar } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";
import MemberChip from "../../Profile/components/MemberChip";
import RatingString from "../../Profile/components/RatingString";
import StarIcon from "@mui/icons-material/Star";
import { yellow } from "@mui/material/colors";

export default function SearchCard({ user }) {
  const navigate = useNavigate();

  const instructor_chips = () => {
    return (
      <div className="flex flex-wrap mt-2 space-x-2">
        <div className="border p-2 rounded-lg text-sm px-4 font-semibold">
          <div className="flex flex-row justify-center items-center space-x-1">
            Employer rating: 0
            <StarIcon sx={{ color: yellow[800], fontSize: 20 }} />
          </div>
        </div>
        <div className="border p-2 rounded-lg text-sm px-4 font-semibold">
          <div className="flex flex-row justify-center items-center space-x-1">
            Client rating: 0
            <StarIcon sx={{ color: yellow[800], fontSize: 20 }} />
          </div>
        </div>
      </div>
    );
  };

  const gym_chips = () => {
    return (
      <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row flex-wrap  mt-2 space-x-0 md:space-x-1">
          <MemberChip id={user.docId} />
        <div className="border p-2 justify-start items-start flex rounded-lg text-sm px-4 font-semibold">
          {/* <div className="flex flex-row justify-center items-center space-x-1">
            Rating: 0
            <StarIcon sx={{ color: yellow[800], fontSize: 20 }} />
          </div> */}
          <RatingString id={user.docId} />
        </div>
      </div>
    );
  };
  return (
    <div className="flex  text-ellipsis  overflow-hidden flex-col w-full hover:border hover:rounded-lg hover:cursor-pointer hover:shadow-md p-4">
      <div
        className="flex truncate "
        onClick={() => {
          navigate(`/${user.docId}`);
        }}
      >
        <Avatar src={user.photoUrl} sx={{ width: 70, height: 70 }} />
        <span className="flex flex-col  truncate text-ellipsis overflow-hidden  ml-3 justify-center items-start">
          <div className="text-ellipsis overflow-hidden truncate">
            <h1 className="block truncate">
              {user.usertype === "Gym" ? user.gymname : user.fullname}
            </h1>
            <p className="text-blue-600 font-semibold truncate">
              @{user.username}
            </p>
          </div>
        </span>
      </div>

      {user.usertype === "Gym" ? (
        gym_chips()
      ) : user.usertype === "Instructor" ? (
        instructor_chips()
      ) : (
        <></>
      )}
    </div>
  );
}
