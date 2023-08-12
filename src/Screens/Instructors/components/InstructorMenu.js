import React, { Fragment, useState } from "react";
import CustomDialogBox from "../../Settings/Components/CustomDialogBox";
import { removeInstructor, blockInstructor } from "../../../Services/firebase";
import { Menu, Transition } from "@headlessui/react";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import BlockIcon from "@mui/icons-material/Block";

export default function InstructorMenu({
  MenuFragment,
  username,
  refetch,
  uid,
  docId,
  refetchCount,
}) {
  const [openRemoveInstructorModal, setRemoveInstructorModal] = useState(false);
  const [openBlockInstructorModal, setBlockInstructorModal] = useState(false);

  const removeFunc = async () => {
    await removeInstructor(uid, docId);
    refetch();
    refetchCount();
  };

  const blockFunc = async () => {
    await blockInstructor(uid, docId);
    refetch();
    refetchCount();
  };

  const handleOpenInstructorModal = () => {
    setRemoveInstructorModal(true);
  };

  const handleCloseInstructorModal = () => {
    setRemoveInstructorModal(false);
  };

  const handleOpenBlockModal = () => {
    setBlockInstructorModal(true);
  };

  const handleCloseBlockModal = () => {
    setBlockInstructorModal(false);
  };

  return (
    <>
      <CustomDialogBox
        Fragment={Fragment}
        isOpen={openBlockInstructorModal}
        handleClose={handleCloseBlockModal}
        handleTask={blockFunc}
        message={`Are you sure you want to block ${username}?`}
      />
      <CustomDialogBox
        Fragment={Fragment}
        isOpen={openRemoveInstructorModal}
        handleClose={handleCloseInstructorModal}
        handleTask={removeFunc}
        message={`Are you sure you want to remove ${username} from your gym?`}
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
                      handleOpenInstructorModal();
                      close();
                    }}
                    className={`hover:bg-gray-100 group flex w-full font-semibold items-center rounded-md px-2 py-2 text-sm`}
                  >
                    <PersonRemoveIcon />
                    <p className="ml-3">Remove instructor</p>
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
                    <p className="ml-3">Block instructor</p>
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
