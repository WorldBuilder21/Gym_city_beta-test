import React from "react";
import GroupIcon from "@mui/icons-material/Group";
import { useQuery } from "@tanstack/react-query";
import { getFriendCount } from "../../../Services/firebase";

export default function FriendChip({ id }) {
  const { status, data } = useQuery({
    queryKey: ["friend_count"],
    queryFn: () => getFriendCount(id),
  });

  const count = status === "loading" ? 0 : status === "error" ? 0 : data;
  return (
  
      <div className="rounded-md flex flex-row border px-4 justify-center items-center py-1.5 font-semibold border-black text-center text-sm">
        <GroupIcon />
        Friends: {count}
      </div>

  );
}
