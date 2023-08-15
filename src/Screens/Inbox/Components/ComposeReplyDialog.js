import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import convertSize from "convert-size";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../firebase";
import { Controller, useForm } from "react-hook-form";
import { sendReply } from "../../../Services/InboxFirebase/inbox";
import { updateDoc } from "firebase/firestore";
import { Dialog, Transition } from "@headlessui/react";
import { IconButton, TextField, Alert } from "@mui/material";
import { Close } from "@mui/icons-material";
import { white_spaces_remover } from "../../../Services/whitespaceRegex";
import Charactercounter from "../../Auth/Components/BioCharacterCounter";

export default function ComposeReplyDialog({
  inboxId,
  handleClose,
  openSnackbar,
  isOpen,
  Fragment,
  refetch,
  refetchCount,
}) {
  const custom_user = useSelector((state) => state.user.user);
  const imageRef = useRef();
  const addMoreRef = useRef();

  const [isLoading, setIsLoading] = useState(false);

  const [filesData, setFilesData] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);

  const [pickedFiles, setPickedFiles] = useState([]);

  const [fileLimit, setFilelimit] = useState(false);

  const { handleSubmit, getValues, control, reset } = useForm();

  const handleFileSize = (fileSize) => {
    return convertSize(fileSize, { accuracy: 0 });
  };

  const addMoreFiles = (event) => {
    const files = Array.from(event.target.files);
    console.log(files);
    files.forEach((item) => {
      pickedFiles.push(item);
    });
    console.log(pickedFiles);
    setPickedFiles([...pickedFiles]);
  };

  const deleteFiles = (item) => {
    let index = pickedFiles.indexOf(item);
    if (index !== -1) {
      pickedFiles.splice(index, 1);
      console.log(pickedFiles);
      setPickedFiles([...pickedFiles]);
    }
  };

  const checkLimit = () => {
    const totalSize = totalFileSize();
    const sizeInMB = totalSize / (1024 * 1024);
    if (sizeInMB > 20) {
      // The file Limit has been exceeded
      return true;
    }
    // The file Limit has not been exceeded
    return false;
  };

  const handleChange = (event) => {
    const files = Array.from(event.target.files);
    console.log("files", files);
    files.forEach((item) => {
      pickedFiles.push(item);
    });
    setPickedFiles([...pickedFiles]);
  };

  const totalFileSize = () => {
    var i;
    var sum = 0;
    for (let i = 0; i < pickedFiles.length; i++) {
      sum += pickedFiles[i].size;
    }
    return sum;
  };

  const handleUpload = async (file, id) => {
    const fileName = file.name;
    const fileSize = file.size;

    const storageRef = ref(
      storage,
      `inbox/${id}/pictures/${Date.now()}${fileName}`
    );
    const uploadImage = uploadBytes(storageRef, file);
    await uploadImage.then(async (snapshot) => {
      await getDownloadURL(snapshot.ref).then((url) => {
        const data = {
          fileName,
          fileSize,
          url,
        };
        imageUrls.push(url);
        filesData.push(data);
      });
    });
    setFilesData([...filesData]);
  };

  const onSubmit = async (data, e) => {
    e.preventDefault();

    const { message } = getValues();

    setIsLoading(true);

    if (pickedFiles.length > 0) {
      if (checkLimit === true) {
        setFilelimit(true);
      } else {
        setIsLoading(true);

        const docRef = await sendReply({
          message: message,
          attachments: [],
          senderId: custom_user.uid,
          inboxId,
        });

        const uploadTasks = [];

        for (let i = 0; i < pickedFiles.length; i++) {
          uploadTasks.push(handleUpload(pickedFiles[i], docRef.id));
        }

        Promise.all(uploadTasks).then(async () => {
          try {
            await updateDoc(docRef, {
              attachments: filesData,
            });
            refetch();
            refetchCount();
            handleClose();
            setFilesData([]);
            setImageUrls([]);
            setPickedFiles([]);
            setFilelimit(false);
          } catch (error) {}
        });
      }
    } else {
      setIsLoading(true);
      await sendReply({
        message: message,
        attachments: [],
        inboxId: inboxId,
        senderId: custom_user.uid,
      });
      setIsLoading(false);
      handleClose();
      refetch();
      refetchCount();
      setFilesData([]);
      setImageUrls([]);
      setPickedFiles([]);
      setFilelimit(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => {
          reset();
          handleClose();
          setFilesData([]);
          setImageUrls([]);
          setPickedFiles([]);
          setFilelimit(false);
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
          <div className="mb-20" />
          <div className="flex flex-col min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              {/* max-h-screen */}
              <Dialog.Panel className=" mt-4 max-h-screen  w-full max-w-md transform overflow-auto rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex flex-row items-center justify-between mb-2">
                  <Dialog.Title as="h3" className="font-semibold text-lg">
                    Compose a reply
                  </Dialog.Title>
                  <IconButton
                    onClick={() => {
                      reset();
                      handleClose();
                      setFilesData([]);
                      setImageUrls([]);
                      setPickedFiles([]);
                      setFilelimit(false);
                    }}
                  >
                    <Close />
                  </IconButton>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-2">
                    <Controller
                      name="message"
                      defaultValue=""
                      control={control}
                      rules={{
                        required: "This field is required",
                        maxLength: {
                          value: 2000,
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
                            label="Message"
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
                      number={2000}
                      control={control}
                    />
                  </div>
                  {pickedFiles.length === 0 ? (
                    <div>
                      <label className="mt-3 justify-center w-full items-center flex py-2 pr-4 pl-3 text-white hover:bg-blue-900 bg-blue-700 rounded-lg hover:cursor-pointer">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="mr-2 -ml-1 w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4.5v15m7.5-7.5h-15"
                          />
                        </svg>
                        Add attachments
                        <input
                          ref={imageRef}
                          disabled={isLoading}
                          onChange={handleChange}
                          hidden
                          multiple
                          type="file"
                        />
                      </label>
                    </div>
                  ) : (
                    <div className="flex border-solid border-2 border-neutral-200 flex-col rounded-md  bg-white p-4 shadow-lg">
                      <div className="text-lg mb-2 font-semibold text-slate-700">
                        Attachments
                      </div>
                      {pickedFiles.map((file, index) => {
                        const fileSize = handleFileSize(file.size);
                        return (
                          <div
                            key={index}
                            className="flex mb-2 justify-between rounded-md border p-4 "
                          >
                            <div className="flex justify-between truncate">
                              <div className="flex items-center justify-center">
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
                                    d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
                                  />
                                </svg>
                              </div>
                              <div className="ml-4">
                                <div
                                  // style={{
                                  //   overflow: "hidden",
                                  //   textOverflow: "ellipsis",
                                  //   whiteSpace: "nowrap",
                                  // }}
                                  className="text-sm text-ellipsis overflow-hidden  font-semibold"
                                >
                                  {file.name}
                                </div>
                                <div className="text-sm  text-slate-500">
                                  {fileSize}
                                </div>
                              </div>
                            </div>
                            <button onClick={() => deleteFiles(file)}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                className="fill-red-500 w-6 h-6"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        );
                      })}
                      {
                        <div
                          className={
                            checkLimit() === true
                              ? "text-red-600 font-semibold text-lg"
                              : "text-green-600 font-semibold text-lg"
                          }
                        >
                          {pickedFiles.length === 0 ? null : (
                            <div>
                              {convertSize(totalFileSize(), { accuracy: 1 })} /
                              20MB
                            </div>
                          )}
                        </div>
                      }
                      <label className="mt-3 hover:cursor-pointer disabled:opacity-25 w-full justify-center items-center flex py-2 pr-4 pl-3 text-white hover:bg-blue-900 bg-blue-700 rounded-lg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="mr-2 -ml-1 w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4.5v15m7.5-7.5h-15"
                          />
                        </svg>
                        Add attachments
                        <input
                          ref={addMoreRef}
                          disabled={isLoading}
                          multiple
                          onChange={addMoreFiles}
                          hidden
                          className="disabled:opacity-25"
                          type="file"
                        />
                      </label>
                    </div>
                  )}
                  {fileLimit && (
                    <Alert sx={{ mt: 2 }} severity="error" variant="outlined">
                      You have exceeded the file limit
                    </Alert>
                  )}
                  <button
                    disabled={isLoading}
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
          <div className="mt-10" />
        </div>
      </Dialog>
    </Transition>
  );
}
