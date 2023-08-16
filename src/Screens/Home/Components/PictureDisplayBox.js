import { useState, useRef } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../../firebase";
import { useSelector } from "react-redux";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadPicture } from "../../../Services/firebase";

export default function PictureDisplayBox({
  isOpen,
  Fragment,
  handleClose,
  url,
  file,
  openSnackbar,
  setFile,
  setUrl,
  refetch,
  //   photoUrls,
  //   setPhotoUrl,
}) {
  const custom_user = useSelector((state) => state.user.user);
  const userdoc = useSelector((state) => state.userdoc.userdoc);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const uid = custom_user.uid;

  const pictureMutation = useMutation({
    mutationFn: uploadPicture,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["photoUrls"]);

      openSnackbar({ message: "Upload complete." });
      setIsLoading(false);
      refetch();
      setFile(null);
      setUrl(null);
    },
    onError: () => {
      setFile(null);
      setUrl(null);
    },
  });

  console.log("url", uid);

  const handleUpload = async () => {
    // update the firestore and update the redux
    openSnackbar({
      message: "This may take a few minutes.",
      severity: "warning",
    });
    if (file !== null) {
      setIsLoading(true);
      handleClose();
      try {
        pictureMutation.mutate({
          uid,
          file,
        });

        // const storageRef = ref(
        //   storage,
        //   `motivationalpictures/${custom_user.uid}/${Date.now()}${file.name}`
        // );
        // const uploadImage = uploadBytes(storageRef, file);
        // uploadImage.then((snapshot) => {
        //   getDownloadURL(snapshot.ref).then(async (url) => {
        //     await updateDoc(docRef, {
        //       photoUrls: arrayUnion(url),
        //     });
        //     openSnackbar({ message: "Upload complete." });
        //     setIsLoading(false);
        //     setFile(null);
        //     setUrl(null);
        //   });
        // });
      } catch (error) {
        openSnackbar({
          message: "An error has occurred whiles uploading the image.",
          severity: "error",
        });
        setIsLoading(false);
        handleClose();
      }
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => {
          handleClose();
          setFile(null);
          setUrl(null);
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
                    Add picture
                  </Dialog.Title>
                  <IconButton
                    onClick={() => {
                      handleClose();
                      setFile(null);
                      setUrl(null);
                    }}
                  >
                    <Close />
                  </IconButton>
                </div>
                <img className="w-full rounded-sm" src={url} alt="post file" />
                <button
                  onClick={handleUpload}
                  disabled={isLoading}
                  type="button"
                  className="w-full disabled:opacity-25 mt-5 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Post
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
