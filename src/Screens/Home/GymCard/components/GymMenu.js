import React, { Fragment, useState } from "react";
import CustomDialogBox from "../../../Settings/Components/CustomDialogBox";
import { Menu, Transition } from "@headlessui/react";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import BlockIcon from "@mui/icons-material/Block";
import { leaveGym, blockGym } from "../../../../Services/firebase";

export default function GymMenu({
  MenuFragment,
  gymname,
  refetch,
  uid,
  docId,
}) {
  const [openLeaveGymModal, setOpenLeaveGymModal] = useState(false);
  const [openBlockModal, setBlockModal] = useState(false);

  const leaveGymFunc = async () => {
    await leaveGym(uid, docId);
    refetch();
  };

  const blockGymFunc = async () => {
    await blockGym(uid, docId);
    refetch();
  };

  const handleOpenLeaveModal = () => {
    setOpenLeaveGymModal(true);
  };

  const handleCloseLeaveModal = () => {
    setOpenLeaveGymModal(false);
  };

  const handleBlockModal = () => {
    setBlockModal(true);
  };

  const handleCloseBlockModal = () => {
    setBlockModal(true);
  };
  return (
    <>
      <CustomDialogBox
        Fragment={Fragment}
        isOpen={openBlockModal}
        handleClose={handleCloseBlockModal}
        handleTask={blockGymFunc}
        message={`Are you sure you want to block ${gymname}`}
      />
      <CustomDialogBox
        Fragment={Fragment}
        isOpen={openLeaveGymModal}
        handleClose={handleCloseLeaveModal}
        handleTask={leaveGymFunc}
        message={`Are you sure you want to leave ${gymname}`}
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
                      handleOpenLeaveModal();
                      close();
                    }}
                    className={`hover:bg-gray-100 group flex w-full font-semibold items-center rounded-md px-2 py-2 text-sm`}
                  >
                    <ExitToAppIcon />
                    <p className="ml-3">Leave gym</p>
                  </button>
                </>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ close }) => (
                <>
                  <button
                    onClick={() => {
                      handleBlockModal();
                      close();
                    }}
                    className={`hover:bg-gray-100 group flex w-full font-semibold items-center rounded-md px-2 py-2 text-sm text-rose-500`}
                  >
                    <BlockIcon />
                    <p className="ml-3">Block member</p>
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
