import React, { useRef, useState } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { Controller, useForm } from "react-hook-form";
import { TextField, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { white_spaces_remover } from "../../../../Services/whitespaceRegex";
import checkLimit from "../../../../Services/filesizeChecker";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import Charactercounter from "../../../Auth/Components/BioCharacterCounter";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import { db, storage } from "../../../../firebase";

export default function CreatePostDialogBox({
  isOpen,
  Fragment,
  handleClose,
  openSnackbar,
  refetch,
}) {
  const { handleSubmit, getValues, control, watch, reset } = useForm();
  const imageRef = useRef();
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [postFile, setPostFile] = useState(null);
  const custom_user = useSelector((state) => state.user.user);

  const handleChange = (event) => {
    const files = Array.from(event.target.files);
    const [file] = files;
    console.log(file.size);
    const size_checker = checkLimit(file);
    console.log(size_checker);
    if (size_checker === false) {
      setImageFile(file);
      setPostFile(URL.createObjectURL(file));
    } else {
      openSnackbar({
        message: "The image size must not exceed 20MB",
        severity: "error",
      });
    }
  };

  const onSubmit = async (data, e) => {
    e.preventDefault();
    const { caption } = getValues();
    setIsLoading(true);
    if (imageFile !== null) {
      const storageRef = ref(storage, `/post/${Date.now()}${postFile.name}`);
      const uploadImage = uploadBytes(storageRef, imageFile);
      uploadImage.then((snapshot) => {
        getDownloadURL(snapshot.ref).then(async (url) => {
          const docRef = collection(db, `users/${custom_user.uid}/posts`);
          const postRef = await addDoc(docRef, {
            caption,
            photoUrl: url,
            creatorId: custom_user.uid,
            ts: serverTimestamp(),
          });
          const updateRef = doc(
            db,
            "users",
            custom_user.uid,
            "posts",
            postRef.id
          );
          await updateDoc(updateRef, {
            docId: postRef.id,
          });
          refetch();
          handleClose();
          setImageFile(null);
          setPostFile(null);
          reset();
        });
      });
    } else {
      handleClose();
      reset();
    }
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
                    Create post
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

                {postFile === null ? (
                  <div className="flex flex-col justify-center items-center">
                    <label className="rounded inline-flex text-center items-center px-5 py-2.5 hover:bg-slate-200 mt-4 mb-4 font-semibold text-lg text-blue-600">
                      <AddAPhotoIcon />
                      <span className="ml-2">Pick a picture</span>
                      <input
                        ref={imageRef}
                        onChange={handleChange}
                        hidden
                        accept="image/*"
                        type="file"
                      />
                    </label>
                  </div>
                ) : (
                  <img
                    className="w-full rounded-sm"
                    src={postFile}
                    alt="post file"
                  />
                )}
                <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
                  <Controller
                    name="caption"
                    defaultValue=""
                    control={control}
                    rules={{
                      maxLength: {
                        value: 200,
                        message: "Cannot exceed 200 characters.",
                      },
                    }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <TextField
                        value={value}
                        error={!!error}
                        inputProps={{
                          maxLength: 200,
                        }}
                        helperText={error ? error.message : null}
                        onChange={onChange}
                        label="Caption"
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
                  <button
                    disabled={isLoading}
                    type="submit"
                    className="w-full disabled:opacity-25 mt-5 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  >
                    Post
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
