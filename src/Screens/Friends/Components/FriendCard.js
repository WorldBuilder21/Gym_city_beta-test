import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { getUserDataUid } from "../../../Services/firebase";
import { useSelector } from "react-redux";
import { removeFriend } from "../../../Services/firebase";

export default function FriendCard({ docId, refetch }) {
  const { status, data: userData } = useQuery({
    queryKey: ["friends_user"],
    queryFn: () => getUserDataUid(docId),
    enabled: docId != null,
  });

  const custom_user = useSelector((state) => state.user.user);

  // removing frnd mutation
  const removeFriendMutation = useMutation({
    mutationFn: removeFriend,
    onSuccess: (data) => {
      refetch();
    },
  });

  return <div>FriendCard</div>;
}
