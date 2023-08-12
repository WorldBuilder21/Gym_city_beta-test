import React, { useState, Fragment } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import BlockIcon from "@mui/icons-material/Block";
import { blockFriend, removeFriend } from "../../../Services/firebase";

import CustomDialogBox from "../../Settings/Components/CustomDialogBox";

export default function FriendMenu({
  MenuFragment,
  username,
  refetch,
  uid,
  docId,
  refetchCount,
}) {
  const [openRemoveFriendModal, setRemoveFriendModal] = useState(false);
  const [openBlockFriendModal, setBlockFriendModal] = useState(false);

  const removeFunc = async () => {
    await removeFriend(uid, docId);
    refetch();
    refetchCount();
  };

  const blockFunc = async () => {
    await blockFriend(uid, docId);
    refetch();
    refetchCount();
  };

  const handleOpenFriendModal = () => {
    setRemoveFriendModal(true);
  };
  const handleCloseFriendModal = () => {
    setRemoveFriendModal(false);
  };

  const handleOpenBlockModal = () => {
    setBlockFriendModal(true);
  };

  const handleCloseBlockModal = () => {
    setBlockFriendModal(false);
  };

  return (
    <>
      <CustomDialogBox
        Fragment={Fragment}
        isOpen={openBlockFriendModal}
        handleClose={handleCloseBlockModal}
        handleTask={blockFunc}
        message={`Are you sure you want to block ${username}?`}
      />
      <CustomDialogBox
        Fragment={Fragment}
        isOpen={openRemoveFriendModal}
        handleClose={handleCloseFriendModal}
        handleTask={removeFunc}
        message={`Are you sure you want to remove ${username} from your friends list?`}
      />
      <Transition
        as={MenuFragment}
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
                      handleOpenFriendModal();
                      close();
                    }}
                    className={`hover:bg-gray-100 group flex w-full font-semibold items-center rounded-md px-2 py-2 text-sm`}
                  >
                    <PersonRemoveIcon />
                    <p className="ml-3">Remove friend</p>
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
                    <p className="ml-3">Block friend</p>
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
