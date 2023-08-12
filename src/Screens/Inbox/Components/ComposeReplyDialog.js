import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import convertSize from "convert-size";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../firebase";
import { Controller, useForm } from "react-hook-form";
import { sendReply } from "../../../Services/InboxFirebase/inbox";
import { updateDoc } from "firebase/firestore";
import { Dialog, Transition } from "@headlessui/react";
import { IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { white_spaces_remover } from "../../../Services/whitespaceRegex";

export default function ComposeReplyDialog({
  inboxId,
  handleClose,
  openSnackbar,
  isOpen,
  Fragment,
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
            handleClose();
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
              <Dialog.Panel className="max-h-screen mt-4  w-full max-w-md transform overflow-auto rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex flex-row items-center justify-between mb-2">
                  <Dialog.Title as="h3" className="font-semibold text-lg">
                    Compose a reply
                  </Dialog.Title>
                  <IconButton
                    onClick={() => {
                      reset();
                      handleClose();
                    }}
                  >
                    <Close />
                  </IconButton>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div>
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
                      render={({field: {onChange, value}, fie})}
                    />
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
