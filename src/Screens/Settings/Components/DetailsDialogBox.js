import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { CircularProgressbar } from "react-circular-progressbar";

export default function DetailsDialogBox({ isOpen, Fragment, handleClose }) {
  const d = new Date();
  return (
    <Transition appear show={isOpen} as={Fragment}>
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
        <div className="fixed inset-0 overflow-auto">
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
                <div className="flex flex-row items-center justify-between mb-2">
                  <Dialog.Title as="h3" className="font-semibold text-lg">
                    Details
                  </Dialog.Title>
                  <IconButton onClick={handleClose}>
                    <Close />
                  </IconButton>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <div className="w-[40%]">
                    <CircularProgressbar value={66} text={"66%"} />
                  </div>
                </div>
                <div className="flex flex-col mt-4 space-y-2">
                  <div className="flex">
                    <h1 className="font-semibold text-md">Objective:</h1>
                    <p className="ml-2">Lossing weight</p>
                  </div>
                  <div className="flex">
                    <h1 className="font-semibold text-md">
                      Weight lost this week:
                    </h1>
                    <p className="ml-2">2 kg</p>
                  </div>
                  <div className="flex">
                    <h1 className="font-semibold text-md">
                      Weight gained this week:
                    </h1>
                    <p className="ml-2">0 kg</p>
                  </div>
                  <div className="flex">
                    <h1 className="font-semibold text-md">
                      Percentage increase:
                    </h1>
                    <p className="ml-2 text-green-500 font-semibold">+ 2%</p>
                  </div>
                  <div className="flex">
                    <h1 className="font-semibold text-md">
                      Percentage decrease:
                    </h1>
                    <p className="ml-2 text-red-500 font-semibold">0%</p>
                  </div>
                  {/* <div className="flex">
                    <h1 className="font-semibold text-md">Weight to loss:</h1>
                    <p className="ml-2"></p>
                  </div> */}
                  <div className="flex">
                    <h1 className="font-semibold text-md">Current week:</h1>
                    <p className="ml-2">3/12</p>
                  </div>
                  <div className="flex">
                    <h1 className="font-semibold text-md text-red-500">
                      Deadline:
                    </h1>
                    <p className="ml-2 text-red-500">Tue Jul 25 2023</p>
                  </div>
                  <div className="flex">
                    <h1 className="font-semibold text-md">Last enrty date:</h1>
                    <p className="ml-2">
                      {d.toDateString()} , {d.toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                {/* (currentWeight - targettedWeight) / weeksRemaining */}
                <div className="w-full bg-red-500 text-white border rounded-md p-4 text-md mt-4">
                  You need to loss <span className="font-semibold">0.33kg</span>{" "}
                  each week in order to gain your desired weight
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
