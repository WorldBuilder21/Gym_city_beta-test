import React, { Fragment } from "react";
import ViewGymDialogBoxes from "./ViewGymDialogBoxes";
import { AvatarGroup } from "@mui/material";
import { useState } from "react";
import CustomAvatar from "./CustomAvatar";

export default function GymChip({ accountData }) {
  console.log("accountData: ", accountData?.memberships);
  const [openModal, setOpenModal] = useState(false);

  const handleOpen = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };
  return accountData?.memberships?.length === 0 ? (
    <div className="rounded-md border px-4 py-1.5 font-semibold border-black text-center text-sm">
      Un employed
    </div>
  ) : (
    <>
      <div
        onClick={() => {
          handleOpen();
        }}
        className="hover:cursor-pointer hover:bg-gray-200 rounded-md border px-4 py-1.5 font-semibold border-black text-center text-sm"
      >
        <AvatarGroup total={accountData?.memberships?.length}>
          {accountData?.memberships.map((data, index) => (
            <CustomAvatar
              length={accountData?.memberships?.length}
              key={index}
              id={data}
            />
          ))}
        </AvatarGroup>
      </div>
      <ViewGymDialogBoxes
        Fragment={Fragment}
        isOpen={openModal}
        handleClose={handleClose}
        length={accountData?.memberships?.length}
        data={accountData}
      />
    </>
  );
}
