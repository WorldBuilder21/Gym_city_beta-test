import React from "react";
import { getNotifications } from "../../Services/firebase";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import ErrorMessage from "../Components/ErrorMessage";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import NotificationCard from "./Components/NotificationCard";
import ComponentSkeleton from "../Components/ComponentSkeleton";

export default function NotificationsScreen() {
  const custom_user = useSelector((state) => state.user.user);
  const { status, data, refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotifications(custom_user.uid),
  });
  return (
    <div>
      {status === "error" ? (
        <ErrorMessage
          message={
            "An error has occurred, please refresh the page to try again."
          }
        />
      ) : status === "loading" ? (
        <div className="flex flex-col mx-2 mt-10 justify-center items-center">
          <ComponentSkeleton />
          <ComponentSkeleton />
          <ComponentSkeleton />
        </div>
      ) : (
        <div>
          {data.empty ? (
            <div className="flex flex-col justify-center items-center h-screen text-gray-500">
              <NotificationsOffIcon sx={{ fontSize: 150 }} />
              <span className="mt-3 text-lg text-center font-semibold">
                There are no notifications to display.
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center mt-10">
              {data.docs.map((data, index) => (
                <NotificationCard key={index} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
