import React from "react";
import { IconButton } from "@mui/material";
import { Dialog, Transition } from "@headlessui/react";
import { Close } from "@mui/icons-material";

export default function NoticeDialog({ isOpen, Fragment, handleClose }) {
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
              <Dialog.Panel className="max-h-screen mt-4  w-full max-w-md transform overflow-auto rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex flex-row items-center justify-between mb-2">
                  <Dialog.Title as="h3" className="font-semibold text-lg">
                    Notice
                  </Dialog.Title>
                  <IconButton onClick={handleClose}>
                    <Close />
                  </IconButton>
                </div>
                <div className="flex flex-col">
                  <div className="rounded-md flex flex-row border px-4 justify-center  text-red-500 py-1.5 font-semibold border-red-500  text-sm">
                    Developer notice. Creating membership plans will come in the next major update.
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
