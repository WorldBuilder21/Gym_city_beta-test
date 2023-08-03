import React, { useState, Fragment } from "react";
import Selector from "../../../Auth/Components/Selector";
import { Dialog, Transition } from "@headlessui/react";
import { useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { updatePrivacyStatus } from "../../../../Services/firebase";

export default function PrivacyDialogBox({
  ScreenFragment,
  isOpen,
  handleClose,
  type,
  openSnackbar,
  refetch,
  oldStatus,
}) {
  const custom_user = useSelector((state) => state.user.user);
  const userdoc = useSelector((state) => state.userdoc.userdoc);
  const privacyTypes = [
    { name: "Public" },
    { name: userdoc.usertype === "Gym" ? "Members only" : "Friends only" },
    userdoc.usertype !== "Gym" && { name: "Private" },
  ];
  const [selectedType, setSelectedType] = useState({ name: oldStatus });
  // privacyTypes[privacyTypes.indexOf({ name: oldStatus })].name

  const statusMutation = useMutation({
    mutationFn: updatePrivacyStatus,
    onError: () => {
      openSnackbar({ message: "An error has occurred.", severity: "error" });
      handleClose();
    },
    onSuccess: (data) => {
      openSnackbar({ message: "Updated!" });
      refetch();
    },
  });

  const handleMutation = () => {
    if (oldStatus !== selectedType.name) {
      handleClose();
      statusMutation.mutate({
        uid: custom_user.uid,
        type,
        oldStatus,
        newStatus: selectedType.name,
      });
    } else {
      handleClose();
    }
  };
  return (
    <Transition as={ScreenFragment} appear show={isOpen}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="font-semibold text-lg mb-2">
                  Change privacy mode · {type}
                </Dialog.Title>
                <div className="flex flex-col justify-center items-center">
                  <div className="w-full">
                    <Selector
                      selectedType={selectedType}
                      setSelectedType={setSelectedType}
                      list={privacyTypes}
                      Fragment={Fragment}
                    />
                  </div>
                  <span className="mt-4 p-4 text-white border rounded-md w-full bg-rose-500">
                    {selectedType.name === "Public"
                      ? `Everybody can view your ${type.toLowerCase()} regardless of if they are in ur friends list or not.`
                      : selectedType.name === "Friends only"
                      ? `Only users in your friends list can view your ${type.toLowerCase()}.`
                      : `You are the only one that can view your ${type.toLowerCase()}.`}
                    {/* Everybody can see your post regardless of if they are in ur
                    friends list or not. */}
                  </span>
                  <button
                    onClick={handleMutation}
                    type="button"
                    className="w-full mt-4 disabled:opacity-25 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  >
                    Done
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
