import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Avatar } from "@mui/material";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { Menu } from "@headlessui/react";
import MenuComponent from "./MenuComponent";
import ImageIcon from "@mui/icons-material/Image";
import { getRoutineData } from "../../../utils/store/routine/routineSlice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRoutine } from "../../../Services/firebase";
import { doc } from "firebase/firestore";
import { formatDistance } from "date-fns";

export default function WorkoutRoutineCard({ data }) {
  const navigate = useNavigate();
  const custom_user = useSelector((state) => state.user.user);
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const deleteRoutineMutation = useMutation({
    mutationFn: deleteRoutine,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["routines", "5"]);
    },
  });
  const uid = custom_user.uid;
  const docId = data?.docId;

  console.log("docId:", data);

  const routineColorCode = () => {
    if (data?.difficulty.name === "Beginner") {
      return "bg-green-500";
    }
    if (data?.difficulty.name === "Intermediate") {
      return "bg-amber-500";
    }
    if (data?.difficulty.name === "Expert") {
      return "bg-red-500";
    }
  };

  const date = new Date(
    data?.ts?.seconds * 1000 + data?.ts?.nanoseconds / 1000000
  );
  const formattedDate = formatDistance(date, new Date());

  const handleDeleteRoutine = () => {
    deleteRoutineMutation.mutate({ uid, docId, data });
    handleClose();
  };
  // const deleteRoutine = async () => {
  //   const docRef = doc(db, `users/${custom_user.uid}/routines/${data.id}`);
  //   if (data.photoUrl !== "") {
  //     let fileRef = ref(storage, data.photoUrl);
  //     deleteObject(fileRef);
  //   }
  //   await deleteDoc(docRef);
  //   handleClose();
  // };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <div className="p-4 relative w-full max-w-sm mb-4 md:mr-4 rounded-lg border-gray-200 shadow">
      <div className="flex flex-col">
        <div className="flex items-center mb-2 justify-between">
          <div className="font-semibold text-lg">Your routine</div>
          <Menu as="div" className="flex md:order-2">
            <div>
              <Menu.Button className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200">
                <EllipsisVerticalIcon className="w-6 h-6" />
              </Menu.Button>
            </div>
            <MenuComponent
              Fragment={Fragment}
              openModal={handleOpen}
              isOpen={isOpen}
              handleClose={handleClose}
              message={"Are you sure you want to delete this routine"}
              deleteFunc={handleDeleteRoutine}
              editFunc={() => {
                dispatch(getRoutineData(data));
                navigate("/home/editWorkoutRoutine");
              }}
            />
          </Menu>
        </div>
        <div
          onClick={() => {
            dispatch(getRoutineData(data));
            navigate("/home/viewRoutine");
          }}
          className="flex items-center"
        >
          <Avatar
            src={data?.photoUrl}
            sx={{ width: 100, height: 100 }}
            variant="rounded"
          >
            <ImageIcon />
          </Avatar>
          <span className="w-full ml-3 text-ellipsis overflow-hidden">
            <p className="font-bold text-xl block truncate">{data?.title}</p>
            <div>total workouts: {data?.total_workouts}</div>
            <div>
              <div
                className={`${routineColorCode()} text-white text-center w-full mt-2 font-medium text-md px-2.5 py-1.5 rounded border`}
              >
                {data.difficulty.name}
              </div>
            </div>
          </span>
        </div>
        <span className="flex mt-2 justify-end items-end text-sm text-slate-500">
          {formattedDate}
        </span>
      </div>
    </div>
  );
}
