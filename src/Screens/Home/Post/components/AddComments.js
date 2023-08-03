import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment } from "../../../../Services/firebase";

export default function AddComments({ commentInput, docId }) {
  const [comment, setComment] = useState("");
  const custom_user = useSelector((state) => state.user.user);
  const uid = custom_user.uid;
  const queryClient = useQueryClient();

  const createCommentMutation = useMutation({
    mutationFn: createComment,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["comments"]);
    },
  });

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    createCommentMutation.mutate({
      uid,
      docId,
      comment,
    });

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
