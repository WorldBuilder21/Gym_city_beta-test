import { useQuery } from "@tanstack/react-query";
import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { getUserDataUid } from "../../../Services/firebase";
import GymMenu from "./components/GymMenu";
import { useNavigate } from "react-router";
import { Avatar } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import StarIcon from "@mui/icons-material/Star";
import { yellow } from "@mui/material/colors";
import { Menu } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";

export default function GymCard({ refetch, docId }) {
  const custom_user = useSelector((state) => state.user.user);

  const navigate = useNavigate();
  const {
    status: gymStatus,
    data: gymData,
    refetch: gymRefetch,
  } = useQuery(
    {
      queryKey: ["gymData"],
      queryFn: () => getUserDataUid(docId),
    },
    { enabled: false }
  );

  if (gymStatus === "loading") {
    return <></>;
  }

  console.log(gymData);

  if (gymStatus === "error") {
    <div className="mt-2">
      <div className="flex text-red text-red-500 justify-center items-center mt-2 mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-24 h-24 mr-4 stroke-red-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
        An error has occurred while trying to retrieve the routines, please try
        again later.
      </div>
    </div>;
  }
  return (
    <div className="flex flex-col max-w-sm relative mb-5 m-2 rounded-lg p-3  shadow">
      <div className="flex justify-between items-center ">
        <div
          onClick={() => {
            navigate(`/${docId}`);
          }}
          className="flex items-center"
        >
          <div className="flex">
            <Avatar src={gymData?.photoUrl} sx={{ width: 70, height: 70 }} />
            <div className="flex flex-col ml-3 justify-center space-y-2">
              <div>
                <p className="font-semibold text-md text-clip truncate break-all">
                  {gymData?.gymname}
                </p>
                <p className="text-blue-600 font-semibold truncate break-all">
                  @{gymData?.username}
                </p>
              </div>
            </div>
          </div>
        </div>
        <Menu as="div" className="flex md:order-2">
          <div>
            <Menu.Button className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200">
              <EllipsisVerticalIcon className="w-6 h-6" />
            </Menu.Button>
          </div>
          <GymMenu
            MenuFragment={Fragment}
            refetch={gymRefetch}
            gymname={gymData?.gymname}
            uid={custom_user.uid}
            docId={docId}
          />
        </Menu>
      </div>
      <div className="flex flex-row mt-2 space-x-2">
        <div className="rounded-md flex flex-row border px-4 justify-center items-center py-1.5 font-semibold border-black text-center text-sm">
          <GroupIcon />
          Members: 0
        </div>
        <div className="rounded-md flex flex-row border px-4 justify-center items-center py-1.5 font-semibold border-black text-center text-sm">
          Rating: 0
          <StarIcon sx={{ color: yellow[800], fontSize: 30 }} />
        </div>
      </div>
    </div>
  );
}
