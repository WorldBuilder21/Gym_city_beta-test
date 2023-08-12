import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getUserDataUid } from "../../../../Services/firebase";
import { useNavigate } from "react-router";
import { Avatar } from "@mui/material";
import { unblockUser } from "../../../../Services/firebase";
import { useSelector } from "react-redux";

export default function BlockedUsersCard({ docId, refetch }) {
  const { status, data: userData } = useQuery(
    {
      queryKey: ["blocked_user", docId],
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
    <div className="flex relative mb-3 rounded-lg p-3 items-center shadow">
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
                {userData?.usertype === "Gym"
                  ? userData?.gymname
                  : userData?.fullname}
              </p>
              <p className="text-blue-600 font-semibold truncate">
                @{userData?.username}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
