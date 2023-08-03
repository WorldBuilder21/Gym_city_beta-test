import React from "react";
import { Transition, Dialog } from "@headlessui/react";
import { Controller, useForm } from "react-hook-form";
import { TextField, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { white_spaces_remover } from "../../../Services/whitespaceRegex";

export default function WorkoutModal({
  isOpen,
  Fragment,
  handleClose,
  day,
  groupedWorkout,
}) {
  const {
    handleSubmit: handleSubmit2,
    getValues: getValues2,
    control: control2,
    watch,
    reset,
  } = useForm();

  const watchTracker = (fieldName) => {
    return watch(fieldName) ? watch(fieldName).length : "0";
  };

  const onSubmit = async (data, e) => {
    e.preventDefault();
    const { name_of_exercise, body_part, equipment, sets, reps } = getValues2();
    const item = {
      weekday: day,
      name_of_exercise,
      body_part,
      equipment,
      sets,
      reps,
    };

    if (day in groupedWorkout) {
      groupedWorkout[day].push(item);
    }

    handleClose();
    reset();
  };
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => {
          handleClose();
          //   reset({}, { keepErrors: true });
          reset({}, { keepErrors: false });
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex flex-row items-center justify-between mb-2">
                  <Dialog.Title as="h3" className="font-semibold text-lg">
                    Add workout
                  </Dialog.Title>
                  <IconButton onClick={handleClose}>
                    <Close />
                  </IconButton>
                </div>
                <form
                  onSubmit={handleSubmit2(onSubmit)}
                  className="mt-5 space-y-5"
                >
                  <div>
                    <Controller
                      name="name_of_exercise"
                      defaultValue=""
                      control={control2}
                      rules={{
                        required: "This field is required",
                        pattern: {
                          value: white_spaces_remover,
                          message:
                            "Entered value cant start/end or contain only white spacing",
                        },
                      }}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <TextField
                          className="w-full"
                          value={value}
                          onChange={onChange}
                          inputProps={{
                            maxLength: 60,
                          }}
                          label="Name of exercise"
                          error={!!error}
                          helperText={error ? error.message : null}
                        />
                      )}
                    />
                    <p
                      className={`${
                        watchTracker("name_of_exercise") >= 60
                          ? "text-red-500"
                          : "text-slate-400"
                      }  flex flex-row items-end justify-end`}
                    >
                      {watchTracker("name_of_exercise")}/ 60 characters
                    </p>
                  </div>
                  <div>
                    <Controller
                      name="body_part"
                      defaultValue=""
                      control={control2}
                      rules={{
                        //   required: "This field is required",
                        pattern: {
                          value: white_spaces_remover,
                          message:
                            "Entered value cant start/end or contain only white spacing",
                        },
                      }}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <TextField
                          className="w-full"
                          inputProps={{
                            maxLength: 60,
                          }}
                          value={value}
                          onChange={onChange}
                          label="Targeted body part (optional)"
                          error={!!error}
                          helperText={error ? error.message : null}
                        />
                      )}
                    />
                    <p
                      className={`${
                        watchTracker("body_part") >= 60
                          ? "text-red-500"
                          : "text-slate-400"
                      }  flex flex-row items-end justify-end`}
                    >
                      {watchTracker("body_part")}/ 60 characters
                    </p>
                  </div>
                  <div>
                    <Controller
                      name="equipment"
                      defaultValue=""
                      control={control2}
                      rules={{
                        //   required: "This field is required",
                        pattern: {
                          value: white_spaces_remover,
                          message:
                            "Entered value cant start/end or contain only white spacing",
                        },
                      }}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <TextField
                          className="w-full"
                          value={value}
                          inputProps={{
                            maxLength: 60,
                          }}
                          onChange={onChange}
                          label="Equipment (optional)"
                          error={!!error}
                          helperText={error ? error.message : null}
                        />
                      )}
                    />
                    <p
                      className={`${
                        watchTracker("equipment") >= 60
                          ? "text-red-500"
                          : "text-slate-400"
                      }  flex flex-row items-end justify-end`}
                    >
                      {watchTracker("equipment")}/ 60 characters
                    </p>
                  </div>
                  <Controller
                    name="sets"
                    defaultValue=""
                    control={control2}
                    rules={{
                      required: "This field is empty.",
                      pattern: {
                        value:
                          /^([0-9]*[1-9][0-9]*(\.[0-9]+)?|[0]+\.[0-9]*[1-9][0-9]*)$/,
                        message: "Invalid input",
                      },
                    }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <TextField
                        label="Sets"
                        className="w-full"
                        type="number"
                        value={value}
                        error={!!error}
                        helperText={error ? error.message : null}
                        onChange={onChange}
                      />
                    )}
                  />
                  <Controller
                    name="reps"
                    defaultValue=""
                    control={control2}
                    rules={{
                      required: "This field is empty.",
                      pattern: {
                        value:
                          /^([0-9]*[1-9][0-9]*(\.[0-9]+)?|[0]+\.[0-9]*[1-9][0-9]*)$/,
                        message: "Invalid input",
                      },
                    }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <TextField
                        label="Reps"
                        className="w-full"
                        type="number"
                        value={value}
                        error={!!error}
                        helperText={error ? error.message : null}
                        onChange={onChange}
                      />
                    )}
                  />
                  <div className="flex items-center justify-between mt-5 mb-5 mx-10">
                    <button type="submit" className="font-semibold">
                      Done
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        // clearErrors(["name_of_exercise"]);
                        handleClose();
                        reset({}, { keepErrors: false });
                      }}
                      className="font-semibold text-red-700"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
