import { Avatar } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getUserDataUid } from "../../../Services/firebase";

export default function CustomAvatar({ id, length }) {
  const { status, data } = useQuery(
    {
      queryKey: ["user_avatar", id],
      queryFn: () => getUserDataUid(id),
    },
    { enabled: false }
  );
  return status === "loading" || status === "error" ? (
    <Avatar sx={{ width: 24, height: 24 }} src={""} />
  ) : length === 1 ? (
    <div className="flex justify-center items-center">
      <Avatar sx={{ width: 24, height: 24 }} src={data?.photoUrl} />
      <span className="ml-1">{data?.gymname}</span>
    </div>
  ) : (
    <Avatar
      sx={{ width: 24, height: 24 }}
      alt={data?.username}
      src={data?.photoUrl}
    />
  );
}
