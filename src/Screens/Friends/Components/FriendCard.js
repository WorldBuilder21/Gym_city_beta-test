import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { getUserDataUid } from "../../../Services/firebase";
import { useSelector } from "react-redux";
import { Avatar } from "@mui/material";
import { useNavigate } from "react-router";
import FriendMenu from "./FriendMenu";
import { Menu } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";

export default function FriendCard({
  docId,
  refetch,
  openSnackbar,
  Fragment,
  refetchCount,
}) {
  const { status, data: userData } = useQuery(
    {
      queryKey: ["friends_user", docId],
      queryFn: () => getUserDataUid(docId),
      enabled: docId != null,
    },
    { enabled: false }
  );

  const custom_user = useSelector((state) => state.user.user);

  const navigate = useNavigate();

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
          <Avatar sx={{ width: 70, height: 70 }} />
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
        <FriendMenu
          refetch={refetch}
          username={userData?.username}
          MenuFragment={Fragment}
          docId={docId}
          uid={custom_user.uid}
          refetchCount={refetchCount}
        />
      </Menu>

      {/* <button
        onClick={handleRemoveFriend}
        className="border py-2 px-4 flex items-center justify-cente rounded-md"
      >
        <p>remove</p>
      </button> */}
    </div>
  );
}
