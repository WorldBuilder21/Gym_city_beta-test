import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import SubscriptionCard from "./SubscriptionCard";
import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";

export default function SubscriptionDialogBox({
  data,
  userdoc,
  handleRequest,
  isOpen,
  handleClose,
  Fragment,
}) {
  return (
    <Transition as={Fragment} appear show={isOpen}>
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
          <div className="mb-10" />
          <div className="flex min-h-full items-center justify-center p-4 text-center ">
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
                {/* <div
                  className="
                flex flex-row justify-end items-end"
                >
                  <IconButton onClick={handleClose}>
                    <Close />
                  </IconButton>
                </div> */}
                <SubscriptionCard
                  userdoc={userdoc}
                  handleRequest={handleRequest}
                  data={data}
                />
              </Dialog.Panel>
            </Transition.Child>
          </div>
          <div className="mt-10" />
        </div>
      </Dialog>
    </Transition>
  );
}
