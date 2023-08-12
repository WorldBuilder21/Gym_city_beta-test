import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getUserDataUid } from "../../../Services/firebase";
import { useNavigate } from "react-router";
import { Avatar } from "@mui/material";
import { Menu } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import MemberMenu from "./MemberMenu";
import { useSelector } from "react-redux";

export default function MemberCard({ docId, refetch, Fragment, refetchCount }) {
  const { status, data: userData } = useQuery(
    {
      queryKey: ["members_user", docId],
      queryFn: () => getUserDataUid(docId),
    },
    { enabled: false }
  );

  const custom_user = useSelector((state) => state.user.user);

  const navigate = useNavigate();

  if (status === "loading") {
    return <></>;
  }
  return (
    <div className="flex relative mb-5 m-2 rounded-lg p-3 justify-between items-center shadow">
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
        <MemberMenu
          refetch={refetch}
          username={userData?.username}
          refetchCount={refetchCount}
          MemberFragment={Fragment}
          docId={docId}
          uid={custom_user.uid}
        />
      </Menu>
    </div>
  );
}
