import { Menu, Transition } from "@headlessui/react";
import React, { useState, Fragment } from "react";
import CustomDialogBox from "../../../Settings/Components/CustomDialogBox";
import { deleteReview } from "../../../../Services/ReviewFirebase/review";
import EditReviewDialogBox from "./EditReviewDialogBox";

export default function ReviewMenu({
  MenuFragment,
  refetch,
  uid,
  senderId,
  refetchCount,
  message,
  rating,
}) {
  const [openEditModal, setEditModal] = useState(false);
  const [openDeleteModal, setDeleteModal] = useState(false);

  console.log(rating);

  const handleCloseDeleteModal = () => {
    setDeleteModal(false);
  };

  const handleOpenDeleteModal = () => {
    setDeleteModal(true);
  };

  const handleOpenEditModal = () => {
    setEditModal(true);
  };

  const handleCloseEditModal = () => {
    setEditModal(false);
  };

  const deleteFunc = async () => {
    await deleteReview({ uid, docId: senderId });
  };
  return (
    <>
      <EditReviewDialogBox
        handleClose={handleCloseEditModal}
        isOpen={openEditModal}
        Fragment={Fragment}
        review_message={message}
        refetch={refetch}
        review_rating={rating}
        uid={uid}
        docId={senderId}
      />
      <CustomDialogBox
        handleClose={handleCloseDeleteModal}
        handleTask={deleteFunc}
        Fragment={Fragment}
        isOpen={openDeleteModal}
        message={`Are you sure you want to delete your review?`}
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
                <button
                  onClick={() => {
                    close();
                    // openEditModal here
                    handleOpenEditModal();
                  }}
                  className={`hover:bg-gray-100 group flex w-full font-semibold items-center rounded-md px-2 py-2 text-sm`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="mr-2 -ml-1 w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                    />
                  </svg>
                  Edit
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ close }) => (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      close();
                      // openDeleteModal
                      handleOpenDeleteModal();
                    }}
                    className={`hover:bg-gray-100 group flex w-full font-semibold items-center rounded-md px-2 py-2  text-sm text-red-600`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="mr-2 -ml-1 w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                    Delete
                  </button>
                </>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </>
  );
}
