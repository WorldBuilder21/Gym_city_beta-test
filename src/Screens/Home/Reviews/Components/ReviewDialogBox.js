import { Dialog, Transition } from "@headlessui/react";
import { Close } from "@mui/icons-material";
import { IconButton, TextField } from "@mui/material";
import React, { useState } from "react";
import { useForm, getValues, Controller } from "react-hook-form";
import { white_spaces_remover } from "../../../../Services/whitespaceRegex";
import Charactercounter from "../../../Auth/Components/BioCharacterCounter";
import ReactStars from "react-rating-stars-component";
import { sendReview } from "../../../../Services/ReviewFirebase/review";
import { useSelector } from "react-redux";

export default function ReviewDialogBox({
  uid,
  handleClose,
  Fragment,
  refetch,
  refetchCount,
  isOpen,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState(0);

  const custom_user = useSelector((state) => state.user.user);

  const handleRating = (rate) => {
    console.log(rate);
    setRating(rate);
  };

  console.log(rating);

  const { handleSubmit, getValues, control, reset } = useForm();

  const onSubmit = async (data, e) => {
    e.preventDefault();

    setIsLoading(true);

    const { message } = getValues();

    await sendReview({ senderId: custom_user.uid, uid, message, rating });

    refetch();
    setIsLoading(false);
    handleClose();
    setRating(0);
  };
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-0"
        onClose={() => {
          reset();
          setRating(0);
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex flex-row items-center justify-between ">
                  <Dialog.Title as="h3" className="font-semibold text-lg">
                    Draft your review
                  </Dialog.Title>
                  <IconButton
                    onClick={() => {
                      reset();
                      setRating(0);
                      handleClose();
                    }}
                  >
                    <Close />
                  </IconButton>
                </div>

                <div className="flex items-center justify-center">
                  <ReactStars
                    value={rating}
                    onChange={handleRating}
                    size={50}
                    count={5}
                  />
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-2">
                    <Controller
                      name="message"
                      defaultValue=""
                      control={control}
                      rules={{
                        maxLength: {
                          value: 500,
                          message: "Cannot exceed 2,000 characters",
                        },
                        pattern: {
                          value: white_spaces_remover,
                          message: "Remove all white spaces",
                        },
                      }}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <>
                          <TextField
                            margin="normal"
                            fullWidth
                            label="Describe your experience(optional)"
                            inputProps={{
                              maxLength: 2000,
                            }}
                            onChange={onChange}
                            value={value}
                            error={!!error}
                            helperText={error ? error.message : null}
                            autoFocus
                            multiline
                            rows={3}
                          />
                        </>
                      )}
                    />
                    <Charactercounter
                      defaultValue={""}
                      name={"message"}
                      number={500}
                      control={control}
                    />
                  </div>
                  <button
                    disabled={rating === 0 || isLoading === true ? true : false}
                    type="submit"
                    className="flex w-full justify-center items-center mt-2 py-2 pr-4 pl-3 text-white hover:bg-blue-900 bg-blue-700 rounded-lg disabled:opacity-25 "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
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
