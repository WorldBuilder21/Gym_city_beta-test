// only gym users will have access to this screen
import React, { useRef, useState } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { Controller, useForm } from "react-hook-form";
import { TextField, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import Charactercounter from "../../Auth/Components/BioCharacterCounter";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import { db } from "../../../firebase";
import { addActivity } from "../../../Services/firebase";
import { useQueryClient } from "@tanstack/react-query";

export default function DraftPostDialogBox({
  isOpen,
  Fragment,
  handleClose,
  openSnackbar,
  refetch,
  gymId,
  refetchCount,
  handleDecline,
  item,
}) {
  const { handleSubmit, getValues, control, watch, reset } = useForm();
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [postFile, setPostFile] = useState(null);
  const custom_user = useSelector((state) => state.user.user);
  const userdoc = useSelector((state) => state.userdoc.userdoc);

  const queryClient = useQueryClient()

  const onSubmit = async (data, e) => {
    e.preventDefault();

    try {
      const gymId = custom_user.uid;
      setIsLoading(true);
      const collection_ref = collection(db, "users", gymId, "posts");

      const postRef = await addDoc(collection_ref, {
        caption: item?.caption,
        photoUrl: item?.photoUrl,
        creatorId: item?.senderId,
        ts: serverTimestamp(),
      });

      console.log("Post REF: ", postRef.id);

      const updateRef = doc(db, "users", gymId, "posts", postRef.id);
      await updateDoc(updateRef, {
        docId: postRef.id,
      });

      addActivity(gymId, item?.senderId, "Postapproved");

      // delete Request
      const request_ref = doc(db, "users", gymId, "requests", item?.docId);
      await deleteDoc(request_ref);
      refetch();
      refetchCount();
      queryClient.invalidateQueries('posts')
      openSnackbar({ message: "Post added successfully." });
      handleClose();
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      handleClose();
      console.log("Hello World");
      openSnackbar({
        message: "An error has occurred. Please try again later.",
        severity: "error",
      });
      setIsLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => {
          handleClose();
          setIsLoading(false);
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
              <Dialog.Panel className="w-full mt-16 max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex flex-row items-center justify-between mb-2">
                  <Dialog.Title as="h3" className="font-semibold text-lg">
                    {"Create post"}
                  </Dialog.Title>
                  <IconButton
                    onClick={() => {
                      handleClose();
                      setImageFile(null);
                      setPostFile(null);
                      reset();
                    }}
                  >
                    <Close />
                  </IconButton>
                </div>
                <img
                  className="w-full rounded-sm"
                  src={item?.photoUrl}
                  alt="post file"
                />
                <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
                  <Controller
                    name="caption"
                    control={control}
                    rules={{
                      maxLength: {
                        value: 200,
                        message: "Cannot exceed 200 characters.",
                      },
                    }}
                    render={({
                      field: { onChange },
                      fieldState: { error },
                    }) => (
                      <TextField
                        defaultValue={item?.caption}
                        error={!!error}
                        inputProps={{
                          maxLength: 200,
                        }}
                        helperText={error ? error.message : null}
                        onChange={onChange}
                        disabled={true}
                        // label="Caption"
                        className="w-full"
                        multiline
                        rows={5}
                      />
                    )}
                  />
                  <Charactercounter
                    control={control}
                    number={200}
                    defaultValue={""}
                    name={"caption"}
                  />
                  <div className="flex space-x-4 justify-between">
                    <button
                      disabled={isLoading}
                      type="submit"
                      className="w-full disabled:opacity-25 mt-5 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                      Post
                    </button>
                    <button
                      onClick={() => {
                        addActivity(gymId, item?.senderId, 'Postrejected')
                        handleDecline();
                      }}
                      disabled={isLoading}
                      className="w-full text-red-500 border-red-500 disabled:opacity-25 mt-5 hover:border-red-300 hover:text-red-300  border font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                      type="button"
                    >
                      Decline
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
