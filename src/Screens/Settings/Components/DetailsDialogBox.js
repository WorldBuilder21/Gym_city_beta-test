import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { CircularProgressbar } from "react-circular-progressbar";
import moment from "moment";

export default function DetailsDialogBox({
  isOpen,
  Fragment,
  handleClose,
  data,
  lastEntryDate,
  getCurrentWeek,
}) {
  function getLastDayOfMonth(year, month) {
    const nextMonthFirstDay = new Date(year, month + 1, 1);
    const lastDay = new Date(nextMonthFirstDay - 1);
    return lastDay;
  }

  // function getCurrentWeek(currentDate, startDate, endDate) {
  //   const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;
  //   const totalWeeks = Math.ceil((endDate - startDate) / millisecondsPerWeek);
  //   const weeksElapsed = Math.ceil(
  //     (currentDate - startDate) / millisecondsPerWeek
  //   );
  //}

  //   return `${weeksElapsed} / ${totalWeeks}`;

  function getCurrentWeeksRemaining(currentDate, startDate, endDate) {
    const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;
    const totalWeeks = Math.ceil((endDate - startDate) / millisecondsPerWeek);
    const weeksElapsed = Math.ceil(
      (currentDate - startDate) / millisecondsPerWeek
    );
    return {
      totalWeeks,
      weeksElapsed,
    };
  }

  const weightToLoseOrGainWeekly = () => {
    const startTs = data?.startDate;
    const ts = data?.deadline;
    const date = new Date(ts.seconds * 1000 + ts.nanoseconds / 1000000);
    const deadline = getLastDayOfMonth(date.getFullYear(), date.getMonth());

    const startDate = new Date(
      startTs.seconds * 1000 + startTs.nanoseconds / 1000000
    );

    const numberOfWeeksRemaining = getCurrentWeeksRemaining(
      date,
      startDate,
      deadline
    );

    const weeksRemaining =
      numberOfWeeksRemaining.totalWeeks - numberOfWeeksRemaining.weeksElapsed;

    const weightGainOrLose =
      (data?.currentWeight - data?.targetWeight) / weeksRemaining;

    return Math.abs(weightGainOrLose);
  };

  const displayCurrentWeek = () => {
    const ts = data?.deadline;
    const startTs = data?.startDate;
    const d = new Date();

    const date = new Date(ts.seconds * 1000 + ts.nanoseconds / 1000000);

    const deadline = getLastDayOfMonth(date.getFullYear(), date.getMonth());

    const startDate = new Date(
      startTs.seconds * 1000 + startTs.nanoseconds / 1000000
    );

    return getCurrentWeek(d, startDate, deadline);
  };

  const getDeadlineDate = () => {
    const ts = data?.deadline;

    const date = new Date(ts.seconds * 1000 + ts.nanoseconds / 1000000);

    const deadline = getLastDayOfMonth(date.getFullYear(), date.getMonth());

    return moment(deadline).format("LLL");
  };

  const displayPercentage = () => {
    const rounded_percent =
      Math.round((data?.overallPercentage + Number.EPSILON) * 100) / 100;

    if (rounded_percent < 0) {
      return 0;
    } else if (rounded_percent > 100) {
      return 100;
    } else {
      return rounded_percent;
    }
  };
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
                    <CircularProgressbar
                      value={displayPercentage()}
                      text={`${displayPercentage()}%`}
                    />
                  </div>
                </div>
                <div className="flex flex-col mt-4 space-y-2">
                  <div className="flex">
                    <h1 className="font-semibold text-md">Objective:</h1>
                    {data?.goalStatus?.name === "Lossing weight" ? (
                      <p className="ml-2">Lossing weight</p>
                    ) : (
                      <p className="ml-2">Gaining weight</p>
                    )}
                  </div>
                  <div className="flex">
                    <h1 className="font-semibold text-md">
                      Weight lost this week:
                    </h1>
                    <p className="ml-2">{data?.WeightLoss} kg</p>
                  </div>
                  <div className="flex">
                    <h1 className="font-semibold text-md">
                      Weight gained this week:
                    </h1>
                    <p className="ml-2">{data?.WeightGain} kg</p>
                  </div>
                  <div className="flex">
                    {Math.sign(data?.currentPercentage) === 1 ? (
                      <div className="space-y-2">
                        <div className="flex">
                          <h1 className="font-semibold text-md">
                            Percentage increase:
                          </h1>
                          <p className="ml-2 text-green-500 font-semibold">
                            + {data?.currentPercentage}%
                          </p>
                        </div>
                        <div className="flex">
                          <h1 className="font-semibold text-md">
                            Percentage decrease:
                          </h1>
                          <p className="ml-2 text-red-500 font-semibold">0%</p>
                        </div>
                      </div>
                    ) : Math.sign(data?.currentPercentage) === -1 ? (
                      <div className="space-y-2">
                        <div className="flex">
                          <h1 className="font-semibold text-md">
                            Percentage increase:
                          </h1>
                          <p className="ml-2 text-green-500 font-semibold">
                            0%
                          </p>
                        </div>
                        <div className="flex">
                          <h1 className="font-semibold text-md">
                            Percentage decrease:
                          </h1>
                          <p className="ml-2 text-red-500 font-semibold">
                            - {data?.currentPercentage}%
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex">
                          <h1 className="font-semibold text-md">
                            Percentage increase:
                          </h1>
                          <p className="ml-2 text-green-500 font-semibold">
                            0%
                          </p>
                        </div>
                        <div className="flex">
                          <h1 className="font-semibold text-md">
                            Percentage decrease:
                          </h1>
                          <p className="ml-2 text-red-500 font-semibold">0%</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex">
                    <h1 className="font-semibold text-md">Current week:</h1>
                    <p className="ml-2">{displayCurrentWeek()}</p>
                  </div>
                  <div className="flex">
                    <h1 className="font-semibold text-md text-red-500">
                      Deadline:
                    </h1>
                    <p className="ml-2 text-red-500">{getDeadlineDate()}</p>
                  </div>
                  <div className="flex">
                    <h1 className="font-semibold text-md">Last enrty date:</h1>
                    <p className="ml-2">{lastEntryDate}</p>
                  </div>
                </div>

                {/* (currentWeight - targettedWeight) / weeksRemaining */}
                <div className="w-full bg-red-500 text-white border rounded-md p-4 text-md mt-4">
                  {data?.goalStatus?.name === "Lossing weight"
                    ? "You need to loss"
                    : "You need to gain"}
                  <span className="font-semibold ml-1 mr-1">
                    0.{weightToLoseOrGainWeekly()}kg
                  </span>
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
