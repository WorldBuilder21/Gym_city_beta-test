import React from "react";
import WorkoutRoutineCard from "../../Components/WorkoutRoutineCard";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import RoutineSkeletons from "../../Components/RoutineSkeletons";
import { useDispatch, useSelector } from "react-redux";
import { getUserId } from "../../../../utils/store/user/getUserIdSlice";

export default function RoutinePlaceHolder({
  routines,
  navigate,
  custom_user,
  uid,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  isInstructor,
  accountData,
  refetch,
  openSnackbar,
}) {
  const dispatch = useDispatch();
  // const displayButtonFunction = () => {
  //   // only owners can view the create the post button
  //   // if the user is a "Gym" only instructors can view the post button\
  //   if(custom_user.uid === uid){
  //     // they can see button
  //   }

  //   if(userdoc.usertyep === 'Gym'){
  //     if(isInstructor){
  //       // they can see button and send a request
  //     }
  //   }
  // }
  return routines?.pages?.map((page, index) =>
    page?.routines?.length === 0 ? (
      custom_user.uid === uid ? (
        <div
          key={index}
          className="flex flex-col text-gray-400 items-center justify-center mt-40"
        >
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
      ) : accountData?.usertype === "Gym" && isInstructor ? (
        <div
          key={index}
          className="flex flex-col items-center justify-center mt-40"
        >
          <FitnessCenterIcon className="text-gray-400" sx={{ fontSize: 100 }} />
          <span className="text-center font-semibold text-gray-400 mt-2 text-xl">
            No routines have been created.
          </span>
          <span className="text-center text-gray-500 text-md ">
            A request will be sent to the gym's account for approval of your
            created routine.
          </span>
          <div className="mt-2">
            <div className="mb-2">
              <button
                onClick={() => {
                  navigate("/profile/routineDraft");
                  dispatch(getUserId(uid));
                }}
                className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-10 py-2.5 text-center"
              >
                Create routine
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          key={index}
          className="flex flex-col items-center justify-center mt-40"
        >
          <FitnessCenterIcon className="text-gray-400" sx={{ fontSize: 100 }} />
          <span className="text-center font-semibold text-gray-400 mt-2 text-xl">
            This user has not created any routines.
          </span>
        </div>
      )
    ) : (
      <div key={index} className="flex flex-col items-start">
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
        <div className="w-full flex flex-wrap">
          {page?.routines?.map((data, index) => (
            <WorkoutRoutineCard accountData={accountData} usertype={accountData?.usertype} openSnackbar={openSnackbar} refetch={refetch} key={index} data={data} />
          ))}
          {hasNextPage && (
            <div
              className="flex flex-col
               w-full hover:cursor-pointer"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? (
                <div className="flex flex-wrap">
                  <RoutineSkeletons />
                  <RoutineSkeletons />
                  <RoutineSkeletons />
                </div>
              ) : (
                <div className="text-center mt-5 text-blue-500 font-semibold">
                  Load more
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  );
  // return routines.empty ? (
  //   custom_user.uid === uid ? (
  //     <div className="flex flex-col text-gray-400 items-center justify-center mt-40">
  //       <FitnessCenterIcon className="text-gray-400" sx={{ fontSize: 100 }} />
  //       <span className="text-center font-semibold mt-2 text-2xl">
  //         Create your first workout routines
  //       </span>
  //       <span className="mb-2 text-center">
  //         all workout routines created will be displayed here
  //       </span>
  //       <div>
  //         <button
  //           onClick={() => {
  //             navigate("/home/addWorkoutRoutine");
  //           }}
  //           className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-10 py-2.5 text-center"
  //         >
  //           Create routine
  //         </button>
  //       </div>
  //     </div>
  //   ) : (
  //     <div className="flex flex-col items-center justify-center mt-40">
  //       <FitnessCenterIcon className="text-gray-400" sx={{ fontSize: 100 }} />
  //       <span className="text-center font-semibold text-gray-400 mt-2 text-xl">
  //         This user has not created any routines.
  //       </span>
  //     </div>
  //   )
  // ) : (
  //   <div className="flex flex-col items-start">
  //     {custom_user.uid === uid ? (
  //       <div className="mb-2">
  //         <button
  //           onClick={() => {
  //             navigate("/home/addWorkoutRoutine");
  //           }}
  //           className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-10 py-2.5 text-center"
  //         >
  //           Create routine
  //         </button>
  //       </div>
  //     ) : (
  //       <></>
  //     )}
  //     <div className="w-full flex flex-wrap">
  //       {routines.docs.map((data, index) => (
  //         <WorkoutRoutineCard key={index} data={data.data()} />
  //       ))}
  //     </div>
  //   </div>
  // );
}
