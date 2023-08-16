import React, { useState, Fragment } from "react";
import AddComments from "./AddComments";
import CommentsTile from "./CommentsTile";
import { getAllComments } from "../../../../Services/firebase";
import { useQuery } from "@tanstack/react-query";
import CommentSkeleton from "./CommentSkeleton";
import CommentIcon from "@mui/icons-material/Comment";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CommentDialogBox from "./CommentDialogBox";
import LikeButton from "./LikeButton";
import { getCommentCount } from "../../../../Services/firebase";

export default function CommentSection({
  docId,
  uid,

  commentInput,
}) {
  const [openModal, setOpenModal] = useState(false);
  const { status, data: comments } = useQuery(
    {
      queryKey: ["comments"],
      queryFn: () => getAllComments({ docId, uid }),
    },
    { enabled: false }
  );

  console.log("uid:", uid);
  console.log("docId:", docId);

  const {
    status: comment_status,
    data: count,
    refetch: refetchCount,
  } = useQuery(
    {
      queryKey: ["count"],
      queryFn: () => getCommentCount(docId, uid),
      // enabled: docId != null,
    },
    { enabled: false }
  );

  const commentsSlice = 2;

  const commentCount =
    comment_status === "loading" ? 0 : comment_status === "error" ? 0 : count;

  const closeModal = () => {
    setOpenModal(false);
  };

  const openCommentModal = () => {
    setOpenModal(true);
  };

  if (status === "loading") {
    return <div></div>;
  }

  return (
    <>
      <div className=" pt-1 pb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <CommentIcon />
            <div className="ml-1">
              {comment_status === "loading"
                ? 0
                : comment_status === "error"
                ? 0
                : commentCount}
            </div>
          </div>
          <div className="flex items-center">
            <LikeButton uid={uid} docId={docId} />
          </div>
        </div>
        {status === "loading" ? (
          <div>
            <CommentSkeleton />
          </div>
        ) : status === "error" ? (
          <div className="flex mb-2 mt-2 flex-col items-center justify-center text-red-500">
            Comments could not be displayed
          </div>
        ) : (
          <div>
            {comments.empty ? (
              <div className="flex mb-2 mt-2 flex-col items-center justify-center text-gray-500">
                No comments have been posted
              </div>
            ) : (
              <>
                <div className="flex flex-col space-y-2 mt-4 mb-2 items-start justify-start">
                  {comments?.docs
                    ?.slice(0, commentsSlice)
                    ?.map((item, index) => (
                      <CommentsTile
                        item={item?.data()}
                        docId={docId}
                        uid={item?.data()?.uid}
                        key={index}
                      />
                    ))}
                </div>
                <div className="flex items-center justify-center">
                  {commentCount > commentsSlice && (
                    <>
                      <button
                        onClick={() => {
                          openCommentModal();
                        }}
                        className="mb-1 mt-1 text-sm font-semibold hover:text-blue-700 text-blue-500"
                      >
                        View more comments
                      </button>
                      <CommentDialogBox
                        Fragment={Fragment}
                        isOpen={openModal}
                        // comments={comments}
                        handleClose={closeModal}
                        docId={docId}
                      />
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
      <AddComments
        refetch={refetchCount}
        docId={docId}
        commentInput={commentInput}
      />
    </>
  );
}
