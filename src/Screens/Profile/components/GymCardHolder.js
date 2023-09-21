import React from "react";
import GymSearchCard from "../../Search/Components/GymSearchCard";
import ComponentSkeleton from "../../Components/ComponentSkeleton";
import { useQuery } from "@tanstack/react-query";
import { getUserDataUid } from "../../../Services/firebase";

export default function GymCardHolder({ id }) {
  const { status, data } = useQuery(
    {
      queryKey: ["gymCard", id],
      queryFn: () => getUserDataUid(id),
    },
    { enabled: false }
  );

  if (status === "loading") {
    return <ComponentSkeleton />;
  }

  if (status === "error") {
    return <></>;
  }

  return (
    <div className="w-full max-w-md">
      <GymSearchCard
        docId={data?.docId}
        username={data?.username}
        photoUrl={data?.photoUrl}
        gymName={data?.gymname}
      />
    </div>
  );
}
