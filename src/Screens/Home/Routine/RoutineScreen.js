import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getRoutineDocs } from "../../../Services/firebase";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import RoutineSkeletons from "../Components/RoutineSkeletons";
import ErrorMessage from "../../Components/ErrorMessage";
import RoutinePlaceHolder from "./components/RoutinePlaceHolder";
import { sendUserRequest } from "../../../Services/firebase";
import SubscriptionCard from "../Components/SubscriptionCard";

export default function RoutineScreen({
  uid,
  data,
  viewStatus,
  openSnackbar,
  handleRequest,
  isInstructor,
}) {
  const custom_user = useSelector((state) => state.user.user);
  const userdoc = useSelector((state) => state.userdoc.userdoc);
  // const [viewStatus, setViewStatus] = useState(false);

  const navigate = useNavigate();

  // const { status, data: routines } = useQuery(
  //   {
  //     queryKey: ["routines"],
  //     queryFn: () => getRoutineDocs(uid),
  //   },
  //   { enabled: false }
  // );

  const {
    status,
    error,
    data: routines,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["routines"],
    queryFn: (pageParam) => getRoutineDocs(uid, pageParam.pageParam),
    getNextPageParam: (lastpage) => lastpage.nextPage,
  });

  const displayFunction = () => {
    if (custom_user.uid === uid) {
      return (
        <RoutinePlaceHolder
          routines={routines}
          navigate={navigate}
          custom_user={custom_user}
          uid={uid}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          isInstructor={isInstructor}
          accountData={data}
          refetch={refetch}
          openSnackbar={openSnackbar}
        />
      );
    } else if (userdoc.usertype === "Gym" && userdoc?.usertype === "Gym") {
      return (
        <div className="flex flex-col justify-center items-center mt-40">
          <span className="text-center font-semibold text-gray-400 mt-2 text-xl">
            You are not allowed to view the routines of other gym's.
          </span>
        </div>
      );
    } else {
      if (data?.routinePrivacyStatus === "Private") {
        if (custom_user.uid === uid) {
          return (
            <RoutinePlaceHolder
              routines={routines}
              navigate={navigate}
              custom_user={custom_user}
              uid={uid}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
              isInstructor={isInstructor}
              accountData={data}
              refetch={refetch}
              openSnackbar={openSnackbar}
            />
          );
        } else {
          return (
            <div className="flex flex-col justify-center items-center mt-40">
              <span className="text-center font-semibold text-gray-400 mt-2 text-xl">
                This users routines are private.
              </span>
            </div>
          );
        }
      } else if (data?.routinePrivacyStatus === "Members only") {
        if (viewStatus === true) {
          return (
            <RoutinePlaceHolder
              routines={routines}
              navigate={navigate}
              custom_user={custom_user}
              uid={uid}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
              isInstructor={isInstructor}
              accountData={data}
              openSnackbar={openSnackbar}
              refetch={refetch}
            />
          );
        } else {
          return (
            <div className="mt-40">
              <SubscriptionCard
                handleRequest={handleRequest}
                data={data}
                userdoc={userdoc}
              />
            </div>
          );
        }
      } else if (data?.routinePrivacyStatus === "Friends only") {
        if (viewStatus === true) {
          return (
            <RoutinePlaceHolder
              routines={routines}
              navigate={navigate}
              custom_user={custom_user}
              uid={uid}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
              isInstructor={isInstructor}
              accountData={data}
              refetch={refetch}
              openSnackbar={openSnackbar}
            />
          );
        } else {
          return (
            <div className="flex flex-col justify-center items-center mt-40">
              <span className="text-center font-semibold text-gray-400 mt-2 text-xl">
                To view this user's posts, you must be on their friends list.
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
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
            isInstructor={isInstructor}
            accountData={data}
            refetch={refetch}
            openSnackbar={openSnackbar}
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
        // displayFunction()
        <div>{displayFunction()}</div>
      )}
    </div>
  );
}
