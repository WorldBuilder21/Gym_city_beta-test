import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getMemberCount } from "../../../Services/firebase";

export default function MemberChip({ id, type }) {
  const { status: count_status, data } = useQuery({
    queryKey: ["member_count"],
    queryFn: () => getMemberCount(id),
  });

  const count =
    count_status === "loading" ? 0 : count_status === "error" ? 0 : data;

  return type === "profile" ? (
    <div className="flex font-semibold flex-row items-center justify-center">
      Members: {count}
    </div>
  ) : (
    <div className="border border-black flex-row items-center justify-cente flex p-2 rounded-lg text-sm px-4 font-semibold">
      Members: {count}
    </div>
  );
}
