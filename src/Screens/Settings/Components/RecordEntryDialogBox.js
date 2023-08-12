import { Dialog, Transition } from "@headlessui/react";
import { Close } from "@mui/icons-material";
import { IconButton, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import InputAdornment from "@mui/material/InputAdornment";
import React, { useState } from "react";
import { addRecordEntry } from "../../../Services/firebase";
import { useSelector } from "react-redux";

export default function RecordEntryDialogBox({
  isOpen,
  Fragment,
  handleClose,
  refetch,
  data,
}) {
  const { handleSubmit, getValues, control, watch, reset } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const custom_user = useSelector((state) => state.user.user);
  const onSubmit = async (data, e) => {
    e.preventDefault();
    const { weight_log } = getValues();

    addRecordEntry({
      uid: custom_user.uid,
      weight: parseInt(weight_log),
      currentWeight: parseInt(weight_log),
      week1Weight: parseInt(data?.week1Weight),
      targetWeight: parseInt(data?.targetWeight),
      previousWeight: parseInt(data?.previousWeight),
      goalStatus: data?.goalStatus,
    });
    handleClose();
    refetch();
  };
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => {
          handleClose();
          reset();
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
                    Add entry
                  </Dialog.Title>
                  <IconButton
                    onClick={() => {
                      handleClose();
                      reset();
                    }}
                  >
                    <Close />
                  </IconButton>
                </div>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-5 mt-4"
                >
                  <Controller
                    name="current_weight"
                    defaultValue=""
                    control={control}
                    rules={{
                      required: "This field is empty.",
                      pattern: {
                        value:
                          /^([0-9]*[1-9][0-9]*(\.[0-9]+)?|[0]+\.[0-9]*[1-9][0-9]*)$/,
                        message: "Invalid weight",
                      },
                    }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <TextField
                        label="Current weight"
                        className="w-full"
                        type="number"
                        value={value}
                        error={!!error}
                        helperText={error ? error.message : null}
                        onChange={onChange}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">kg</InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                  <button
                    className="w-full disabled:opacity-25  text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    type="submit"
                    disabled={isLoading}
                  >
                    Done
                  </button>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
