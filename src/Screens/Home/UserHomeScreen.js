import React, { Fragment, useState, useRef } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import RoutineSkeletons from "./Components/RoutineSkeletons";
import WorkoutRoutineCard from "./Components/WorkoutRoutineCard";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { db, storage } from "../../firebase";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getRoutineDocs } from "../../Services/firebase";
import MuiAlert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";
import checkLimit from "../../Services/filesizeChecker";
import PictureDisplayBox from "./Components/PictureDisplayBox";
import { getUserDataUid } from "../../Services/firebase";
import Groups2Icon from "@mui/icons-material/Groups2";
import CustomCarousel from "./Components/CustomCarousel/CustomCarousel";
import GymCard from "./GymCard/GymCard";
import ComponentSkeleton from "../Components/ComponentSkeleton";
import { deleteObject, ref } from "firebase/storage";
import { getFiveRoutines } from "../../Services/firebase";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function UserHomeScreen() {
  const imageRef = useRef();
  const custom_user = useSelector((state) => state.user.user);
  const userdoc = useSelector((state) => state.userdoc.userdoc);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "right",
    message: "",
    severity: "",
  });
  const { vertical, horizontal, open, message, severity } = state;

  const handleDelete = async ({ item }) => {
    const docRef = doc(db, "users", custom_user.uid);
    const fileRef = ref(storage, item);
    deleteObject(fileRef);
    return await updateDoc(docRef, {
      photoUrls: arrayRemove(item),
    });
  };

  // user themselves
  const {
    status: userStatus,
    data: userData,
    refetch,
  } = useQuery(
    {
      queryKey: ["userData"],
      queryFn: () => getUserDataUid(custom_user.uid),
    },
    { enabled: false }
  );

  const pictureDeletMutate = useMutation({
    mutationFn: handleDelete,
    onSuccess: (data) => {
      handleDeleteCloseModal();
      refetch();
      openSnackbar({ message: "Item deleted" });
    },
  });

  const handleTask = ({ item }) => {
    pictureDeletMutate.mutate({
      item,
    });
  };

  const [imageFile, setImageFile] = useState(null);
  const [url, setUrl] = useState(null);

  console.log(userdoc);

  const {
    status,
    data: routines,
    refetch: refetch_routine,
  } = useQuery({
    queryKey: ["routines", "5"],
    queryFn: () => getFiveRoutines(custom_user.uid),
  });

  const closeModal = () => {
    setOpenModal(false);
  };

  const openPostModal = () => {
    setOpenModal(true);
  };

  const handleDeleteCloseModal = () => {
    setDeleteModal(false);
  };

  const handleDeleteOpenModal = () => {
    setDeleteModal(true);
  };

  const openSnackbar = (newState) => {
    setState({ open: true, ...newState });
  };

  const closeSnackbar = () => {
    setState({ ...state, open: false });
  };

  const handleChange = (event) => {
    if (userData?.photoUrls?.length < 15) {
      const files = Array.from(event.target.files);
      const [file] = files;
      console.log(file.size);
      const size_checker = checkLimit(file);
      console.log(size_checker);
      if (size_checker === false) {
        setImageFile(file);
        setUrl(URL.createObjectURL(file));
        openPostModal();
      } else {
        openSnackbar({
          message: "The image size must not exceed 20MB",
          severity: "error",
        });
      }
    } else {
      openSnackbar({
        message: "You can add a maximum of 15 photos to the carousel.",
        severity: "error",
      });
    }
  };

  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={closeSnackbar}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        key={vertical + horizontal}
      >
        <Alert
          onClose={closeSnackbar}
          sx={{ width: "100%" }}
          severity={severity}
        >
          {message}
        </Alert>
      </Snackbar>
      <div className="m-4">
        {userStatus === "loading" ? (
          <div className="mb-2 mt-2 w-full animate-pulse flex h-80 items-center justify-center rounded bg-gray-300 dark:bg-gray-700">
            <svg
              className="h-10 w-10 text-gray-200 dark:text-gray-600"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 16 20"
            >
              <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
              <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
            </svg>
          </div>
        ) : userStatus === "error" ? (
          <div className="mb-2 mt-2 w-full flex h-80 items-center justify-center rounded bg-gray-300 dark:bg-gray-700">
            <div className="flex flex-col justify-center items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-24 h-24 stroke-red-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
              <span className="text-red-500 text-lg font-semibold">
                An error has occurred
              </span>
            </div>
          </div>
        ) : (
          <>
            {userData?.photoUrls?.length === 0 ? (
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      SVG, PNG, JPG
                    </p>
                    <p className="text-xs text-gray-500">
                      Select images that motivate you to be placed into your
                      slider
                    </p>
                  </div>
                  <input
                    ref={imageRef}
                    onChange={handleChange}
                    id="dropzone-file"
                    type="file"
                    accept="image/*"
                    className="hidden"
                  />
                  <PictureDisplayBox
                    Fragment={Fragment}
                    isOpen={openModal}
                    handleClose={closeModal}
                    openSnackbar={openSnackbar}
                    url={url}
                    file={imageFile}
                    setFile={setImageFile}
                    setUrl={setUrl}
                    refetch={refetch}
                  />
                </label>
              </div>
            ) : (
              <>
                <div className="flex justify-start items-start">
                  <label className="flex justify-center hover:text-blue-500 hover:bg-gray-100 items-center border px-8 py-3 rounded-md">
                    <AddAPhotoIcon />
                    <span className="ml-2">Add a picture</span>
                    <input
                      ref={imageRef}
                      onChange={handleChange}
                      hidden
                      accept="image/*"
                      type="file"
                    />
                  </label>
                  <PictureDisplayBox
                    Fragment={Fragment}
                    isOpen={openModal}
                    handleClose={closeModal}
                    openSnackbar={openSnackbar}
                    url={url}
                    file={imageFile}
                    setFile={setImageFile}
                    setUrl={setUrl}
                    refetch={refetch}
                  />
                </div>
                <div className="flex justify-center items-center">
                  <CustomCarousel
                    data={userData?.photoUrls}
                    options={{ loop: true }}
                    handleTask={handleTask}
                    isOpen={deleteModal}
                    handleOpen={handleDeleteOpenModal}
                    handleClose={handleDeleteCloseModal}
                    Fragment={Fragment}
                    message="Are you sure you want to delete this item."
                  />
                </div>
              </>
            )}
          </>
        )}

        <div className="mt-4">
          <h1 className="font-semibold text-2xl">Gym membership's</h1>
          {userStatus === "loading" ? (
            <div className="w-full max-w-sm">
              <ComponentSkeleton />
            </div>
          ) : (
            <>
              {userData?.memberships?.length !== 0 ? (
                <div>
                  {userData?.memberships?.map((data, index) => (
                    <GymCard key={index} refetch={refetch} docId={data} />
                  ))}
                </div>
              ) : (
                <div className="flex justify-center items-center text-gray-500">
                  <Groups2Icon sx={{ fontSize: 70 }} />
                  <span className="ml-4">
                    You have not subscribed to any gym memberships
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        <div className="mt-4">
          <h1 className="font-semibold text-2xl">Routines</h1>
          <button
            onClick={() => {
              navigate("/home/addWorkoutRoutine");
            }}
            className="mt-2 disabled:opacity-25 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-10 py-2.5 text-center"
          >
            <div className="flex items-center justify-center">
              <AddIcon />
              <span className="ml-1">Create workout routine</span>
            </div>
          </button>
          <div className="mt-2">
            {status === "loading" ? (
              <RoutineSkeletons />
            ) : status === "error" ? (
              <div className="flex text-red text-red-500 justify-center items-center mt-2 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-24 h-24 mr-4 stroke-red-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                  />
                </svg>
                An error has occurred while trying to retrieve the routines,
                please try again later.
              </div>
            ) : (
              <div>
                {routines?.empty ? (
                  <div className="flex text-gray-500 justify-center items-center mt-4 mb-2">
                    <FitnessCenterIcon
                      // className="text-gray-700"
                      sx={{ fontSize: 70 }}
                    />
                    <span className="ml-4">
                      Create your first workout routine to have a more organised
                      gym session
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-wrap">
                    {routines?.docs?.map((data, index) => (
                      <WorkoutRoutineCard key={index} data={data.data()} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="w-full"></div>
      </div>
    </>
  );
}
