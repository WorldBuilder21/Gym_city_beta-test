import React, { useState, Fragment } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import BlockIcon from "@mui/icons-material/Block";
import {
  removeMember,
  blockUser,
  addActivity,
} from "../../../Services/firebase";
import CustomDialogBox from "../../Settings/Components/CustomDialogBox";

export default function MemberMenu({
  MemberFragment,
  username,
  refetch,
  uid,
  docId,
  refetchCount,
}) {
  const [openRemoveMemberModal, setRemoveMemberModal] = useState(false);
  const [openBlockMemberModal, setBlockMemberModal] = useState(false);

  const removeMemberFunc = async () => {
    await removeMember(uid, docId);
    addActivity(uid, docId, "Memberremoved");
    refetch();
    refetchCount();
  };

  const blockMemberFunc = async () => {
    await blockUser(uid, docId);
    addActivity(uid, docId, 'Memberblockedandremoved')
    refetch();
    refetchCount();
  };

  const handleOpenMemberModal = () => {
    setRemoveMemberModal(true);
  };

  const handleCloseMemberModal = () => {
    setRemoveMemberModal(false);
  };

  const handleOpenBlockModal = () => {
    setBlockMemberModal(true);
  };

  const handleCloseBlockModal = () => {
    setBlockMemberModal(false);
  };

  return (
    <>
      <CustomDialogBox
        Fragment={Fragment}
        isOpen={openBlockMemberModal}
        handleClose={handleCloseBlockModal}
        handleTask={blockMemberFunc}
        message={`Are you sure you want to block ${username}?`}
      />
      <CustomDialogBox
        Fragment={Fragment}
        isOpen={openRemoveMemberModal}
        handleClose={handleCloseMemberModal}
        handleTask={removeMemberFunc}
        message={`Are you sure you remove ${username} from your gym?`}
      />
      <Transition
        as={MemberFragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          unmount={false}
          className="absolute right-2 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg p-2 ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <div className="px-1 py-1">
            <Menu.Item>
              {({ close }) => (
                <>
                  <button
                    onClick={() => {
                      handleOpenMemberModal();
                      close();
                    }}
                    className={`hover:bg-gray-100 group flex w-full font-semibold items-center rounded-md px-2 py-2 text-sm`}
                  >
                    <PersonRemoveIcon />
                    <p className="ml-3">Remove member</p>
                  </button>
                </>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ close }) => (
                <>
                  <button
                    onClick={() => {
                      handleOpenBlockModal();
                      close();
                    }}
                    className={`hover:bg-gray-100 group flex w-full font-semibold items-center rounded-md px-2 py-2 text-sm text-rose-500`}
                  >
                    <BlockIcon />
                    <p className="ml-3">Block gym</p>
                  </button>
                  {/* <CustomDialogBox /> */}
                </>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </>
  );
}
