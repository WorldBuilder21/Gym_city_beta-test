import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getRoutineDocs } from "../../../Services/firebase";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import RoutineSkeletons from "../Components/RoutineSkeletons";
import ErrorMessage from "../../Components/ErrorMessage";
import RoutinePlaceHolder from "./components/RoutinePlaceHolder";
import { checkifFriendOrMember } from "../../../Services/firebase";

export default function RoutineScreen({ uid, data, viewStatus }) {
  const custom_user = useSelector((state) => state.user.user);
  // const [viewStatus, setViewStatus] = useState(false);
  const navigate = useNavigate();
  const { status, data: routines } = useQuery(
    {
      queryKey: ["routines"],
      queryFn: () => getRoutineDocs(uid),
    },
    { enabled: false }
  );

  // useEffect(() => {
  //   if (
  //     data?.routinePrivacyStatus === "Friends only" ||
  //     data?.routinePrivacyStatus === "Members only"
  //   ) {
  //     checkifFriendOrMember(uid, custom_user.uid, data?.usertype).then(
  //       (result) => {
  //         setViewStatus(result);
  //       }
  //     );
  //   }
  // }, [custom_user.uid, uid, data?.routinePrivacyStatus, data?.usertype]);

  const displayFunction = () => {
    if (data?.routinePrivacyStatus === "Private") {
      if (custom_user.uid === uid) {
        return (
          <RoutinePlaceHolder
            routines={routines}
            navigate={navigate}
            custom_user={custom_user}
            uid={uid}
          />
        );
      } else {
        return (
          <div className="flex flex-col justify-center items-center mt-40">
            <span className="text-center font-semibold text-gray-400 mt-2 text-xl">
              This users posts are private.
            </span>
          </div>
        );
      }
    } else if (
      data?.routinePrivacyStatus === "Friends only" ||
      data?.routinePrivacyStatus === "Members only"
    ) {
      if (viewStatus === true) {
        return (
          <RoutinePlaceHolder
            routines={routines}
            navigate={navigate}
            custom_user={custom_user}
            uid={uid}
          />
        );
      } else {
        return (
          <div className="flex flex-col mt-40 justify-center items-center">
            <span className="text-center font-semibold text-gray-400 mt-2 text-xl">
              {data?.usertype === "Gym"
                ? "Only members can view this post."
                : "Only the users friends can view this post."}
            </span>
          </div>
        );
      }
    } else if (data?.routinePrivacyStatus === "Public") {
      return (
        <RoutinePlaceHolder
          routines={routines}
          navigate={navigate}
          custom_user={custom_user}
          uid={uid}
        />
      );
    } else {
      return <></>;
      // <div className="flex flex-col mt-40 justify-center items-center">
      //   <span className="text-center font-semibold text-gray-500 mt-2 text-xl">
      //     Invalid privacy status
      //   </span>
      // </div>;
    }
  };
  return (
    <div className="h-screen">
      {status === "loading" ? (
        <RoutineSkeletons />
      ) : status === "error" ? (
        <ErrorMessage
          message="An error has occured please check your internet connection and try
        again"
        />
      ) : (
        <div>{displayFunction()}</div>
      )}
    </div>
  );
}
