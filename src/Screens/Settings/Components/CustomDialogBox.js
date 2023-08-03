import React, { useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function CustomDialogBox({
  Fragment,
  isOpen,
  handleClose,
  handleTask,
  message,
}) {
  let completeButtonRef = useRef(null);
  return (
    <Transition as={Fragment} appear show={isOpen}>
      <Dialog
        initialFocus={completeButtonRef}
        as="div"
        className="relative z-10"
        onClose={handleClose}
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* <div className="mt-2">
                  <p className="text-md text-gray-700"> */}
                <Dialog.Description>{message}</Dialog.Description>
                {/* <Dialog.Description>{message}</Dialog.Description> */}
                {/* </p>
                </div> */}
                <div
                  ref={completeButtonRef}
                  className="flex items-center justify-between mt-5 mx-10"
                >
                  <button className="font-semibold " onClick={handleTask}>
                    Yes
                  </button>
                  <button
                    className="font-semibold text-red-700"
                    onClick={handleClose}
                  >
                    No
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
