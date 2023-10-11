import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  checkIfUserisBlocked,
  createComment,
} from "../../../../Services/firebase";

export default function AddComments({
  commentInput,
  docId,
  refetch,
  userId,
  refetchBlockedStatus,
}) {
  const [comment, setComment] = useState("");
  const custom_user = useSelector((state) => state.user.user);
  const queryClient = useQueryClient();

  const createCommentMutation = useMutation({
    mutationFn: createComment,
    onSuccess: (data) => {
      console.log("success:", data);
      refetch();
      refetchBlockedStatus();
      queryClient.invalidateQueries(["comments"]);
    },
  });

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    const isblocked = await checkIfUserisBlocked(userId, custom_user.uid);

    if (isblocked.exists()) {
      console.log(isblocked.exists());
      console.log("pressed");
      refetchBlockedStatus();
    } else {
      try {
        createCommentMutation.mutate({
          // id of the person's profile
          uid: userId,
          // post id
          docId: docId,
          comment: comment,
          // id of the person sending the comment
          senderId: custom_user.uid,
        });
      } catch (error) {
        console.log("error:", error);
      }
    }

    setComment("");
  };

  return (
    <div className=" border-gray-inherit">
      <form
        className="flex justify-between pl-0 pr-5"
        method="POST"
        onSubmit={(e) =>
          comment.length >= 1 ? handleSubmitComment(e) : e.preventDefault()
        }
      >
        <input
          aria-label="Add a comment"
          autoComplete="off"
          className="text-sm text-gray-base w-full mr-3 py-3 px-4"
          type="text"
          name="add-comment"
          placeholder="Add a comment..."
          value={comment}
          onChange={({ target }) => setComment(target.value)}
          ref={commentInput}
        />
        <button
          disabled={comment.length < 1}
          onClick={handleSubmitComment}
          type="button"
          className={`text-sm font-bold text-blue-600 ${
            !comment && "opacity-25"
          }`}
        >
          Post
        </button>
      </form>
    </div>
  );
}
