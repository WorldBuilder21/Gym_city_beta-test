import { Dialog, Transition } from "@headlessui/react";
import React from "react";
import { IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import GymCardHolder from "./GymCardHolder";

export default function ViewGymDialogBoxes({
  isOpen,
  Fragment,
  handleClose,
  length,
  data,
}) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => {
          handleClose();
        }}
      >
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
              <Dialog.Panel className="w-full mt-16 max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex flex-row items-center justify-between mb-2">
                  <Dialog.Title as="h3" className="font-semibold text-lg">
                    Memberships · {length}
                  </Dialog.Title>
                  <IconButton
                    onClick={() => {
                      handleClose();
                    }}
                  >
                    <Close />
                  </IconButton>
                </div>
                <div className="flex flex-col w-full items-center justify-center">
                  {data?.memberships?.map((data, index) => (
                    <GymCardHolder key={index} id={data}/>
                  ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
