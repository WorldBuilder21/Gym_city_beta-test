import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getUserDataUid } from "../../../Services/firebase";
import InstructorMenu from "./InstructorMenu";
import { useNavigate } from "react-router";
import { Avatar } from "@mui/material";
import { Menu } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { useSelector } from "react-redux";

export default function InstructorCard({
  docId,
  refetch,
  Fragment,
  refetchCount,
}) {
  const { status, data: userData } = useQuery(
    {
      queryKey: ["instructor_user", docId],
      queryFn: () => getUserDataUid(docId),
    },
    { enabled: false }
  );

  const navigate = useNavigate();

  const custom_user = useSelector((state) => state.user.user);

  if (status === "loading") {
    return <></>;
  }
  return (
    <div className="flex relative mb-3 rounded-lg p-3 justify-between items-center shadow">
      <div
        onClick={() => {
          navigate(`/${userData?.docId}`);
        }}
        className="flex items-center"
      >
        <div className="flex">
          <Avatar src={userData?.photoUrl} sx={{ width: 70, height: 70 }} />
          <div className="flex flex-col ml-3 justify-center space-y-2">
            <div>
              <p className="font-semibold text-md text-clip truncate">
                {userData?.fullname}
              </p>
              <p className="text-blue-600 font-semibold truncate">
                @{userData?.username}
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
        <InstructorMenu
          refetch={refetch}
          username={userData?.username}
          MenuFragment={Fragment}
          docId={docId}
          refetchCount={refetchCount}
          uid={custom_user.uid}
        />
      </Menu>
    </div>
  );
}
