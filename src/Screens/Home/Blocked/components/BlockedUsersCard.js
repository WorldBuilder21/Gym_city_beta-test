import { useQuery } from "@tanstack/react-query";
import React, { useState, Fragment } from "react";
import { getUserDataUid } from "../../../../Services/firebase";
import { useNavigate } from "react-router";
import { Avatar } from "@mui/material";
import { unblockUser } from "../../../../Services/firebase";
import { useSelector } from "react-redux";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import CustomDialogBox from "../../../Settings/Components/CustomDialogBox";

export default function BlockedUsersCard({
  docId,
  refetch,
  refetch_count,
  user,
}) {
  const { status, data: userData } = useQuery(
    {
      queryKey: ["blocked_user", docId],
      queryFn: () => getUserDataUid(docId),
    },
    { enabled: false }
  );

  const [unblockModal, setUnblockModal] = useState(false);

  const handleUnblockUser = () => {
    setUnblockModal(true);
  };

  const handleTask = async () => {
    await unblockUser(custom_user.uid, docId);
    refetch();
    refetch_count();
  };

  const closeModal = () => {
    setUnblockModal(false);
  };

  const navigate = useNavigate();
  const custom_user = useSelector((state) => state.user.user);

  if (status === "loading") {
    return <></>;
  }

  return (
    <>
      <CustomDialogBox
        Fragment={Fragment}
        handleClose={closeModal}
        handleTask={handleTask}
        message={`Are you sure you want to unblock ${
          userData?.usertype === "Gym" ? userData?.gymname : userData?.fullname
        }`}
        isOpen={unblockModal}
      />
      <div className="flex justify-between relative mb-3 rounded-lg p-3 items-center shadow">
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
        <div
          onClick={handleUnblockUser}
          className="p-4 text-red-500 hover:text-red-300 hover:cursor-pointer"
        >
          <PersonRemoveIcon />
        </div>
      </div>
    </>
  );
}
