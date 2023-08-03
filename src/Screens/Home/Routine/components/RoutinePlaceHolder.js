import React from "react";
import WorkoutRoutineCard from "../../Components/WorkoutRoutineCard";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

export default function RoutinePlaceHolder({
  routines,
  navigate,
  custom_user,
  uid,
}) {
  return routines.empty ? (
    custom_user.uid === uid ? (
      <div className="flex flex-col text-gray-400 items-center justify-center mt-40">
        <FitnessCenterIcon className="text-gray-400" sx={{ fontSize: 100 }} />
        <span className="text-center font-semibold mt-2 text-2xl">
          Create your first workout routines
        </span>
        <span className="mb-2 text-center">
          all workout routines created will be displayed here
        </span>
        <div>
          <button
            onClick={() => {
              navigate("/home/addWorkoutRoutine");
            }}
            className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-10 py-2.5 text-center"
          >
            Create routine
          </button>
        </div>
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center mt-40">
        <FitnessCenterIcon className="text-gray-400" sx={{ fontSize: 100 }} />
        <span className="text-center font-semibold text-gray-400 mt-2 text-xl">
          This user has not created any routines.
        </span>
      </div>
    )
  ) : (
    <div className="flex flex-col items-start">
      {custom_user.uid === uid ? (
        <div className="mb-2">
          <button
            onClick={() => {
              navigate("/home/addWorkoutRoutine");
            }}
            className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-10 py-2.5 text-center"
          >
            Create routine
          </button>
        </div>
      ) : (
        <></>
      )}
      <div className="w-full">
        {routines.docs.map((data, index) => (
          <WorkoutRoutineCard key={index} data={data.data()} />
        ))}
      </div>
    </div>
  );
}
