import React, { useRef, useState } from "react";
import { TextField, IconButton } from "@mui/material";
import { Dialog, Transition } from "@headlessui/react";
import { Close } from "@mui/icons-material";
import CommentsTile from "./CommentsTile";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createComment,
  handlePaginateComments,
} from "../../../../Services/firebase";
import CommentSkeleton from "./CommentSkeleton";
import { useSelector } from "react-redux";

export default function CommentDialogBox({
  isOpen,
  Fragment,
  handleClose,
  //   comments,
  uid,
  docId,
}) {
  const [comment, setComment] = useState("");
  const commentInput = useRef(null);
  const queryClient = useQueryClient();
  const custom_user = useSelector((state) => state.user.user);
  // const uid = custom_user.uid;

  console.log("comments uids:", uid);

  const {
    status,
    error,
    data,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["comments", "infinite"],
    queryFn: (pageParam) =>
      handlePaginateComments(docId, uid, pageParam.pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  console.log(data);

  //   const comments = data?.pages.flatMap((page) => page.comments) || [];

  console.log("error:", error);

  const createCommentMutation = useMutation({
    mutationFn: createComment,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["comments", "infinite"]);
    },
  });

  const onSubmit = async (e) => {
    e.preventDefault();

    createCommentMutation.mutate({
      uid,
      docId,
      comment,
    });

    setComment("");
  };
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => {
          handleClose();
          //   reset({}, { keepErrors: true });
          setComment("");
        }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="max-h-screen mt-4  w-full max-w-md transform overflow-auto rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex flex-row items-center justify-between mb-2">
                  <Dialog.Title as="h3" className="font-semibold text-lg">
                    Comments
                  </Dialog.Title>
                  <IconButton onClick={handleClose}>
                    <Close />
                  </IconButton>
                </div>

                <form
                  method="POST"
                  onSubmit={(e) =>
                    comment.length >= 1 ? onSubmit(e) : e.preventDefault()
                  }
                  className="mt-2"
                >
                  <div className="flex space-x-4">
                    <TextField
                      value={comment}
                      name="add-comment"
                      autoComplete="off"
                      inputProps={{
                        maxLength: 200,
                      }}
                      onChange={({ target }) => setComment(target.value)}
                      ref={commentInput}
                      label="Add a comment"
                      className="w-full mr-3 py-3 px-4 text-sm text-gray-base"
                    />

                    <button
                      disabled={comment?.length < 1}
                      onClick={onSubmit}
                      type="button"
                      className={`text-sm font-bold text-blue-600 ${
                        !comment && "opacity-25"
                      }`}
                    >
                      Post
                    </button>
                  </div>
                </form>
                <div className="flex flex-col   mt-4 space-y-4">
                  {status === "loading" ? (
                    <div>
                      <CommentSkeleton />
                      <CommentSkeleton />
                      <CommentSkeleton />
                      <CommentSkeleton />
                    </div>
                  ) : status === "error" ? (
                    <div className="text-red-500 text-center flex justify-center items-center">
                      Comment could not be displayed
                    </div>
                  ) : (
                    <div>
                      {data?.pages?.map((page, index) => (
                        <div key={index} className="space-y-3">
                          {page?.comments?.docs?.map((comment, index) => (
                            <div
                              className="w-full flex-col space-y-3"
                              key={comment.id}
                            >
                              <CommentsTile
                                item={comment}
                                uid={comment?.uid}
                                docId={docId}
                              />
                            </div>
                          ))}
                        </div>
                      ))}
                      {hasNextPage && (
                        <button
                          onClick={() => fetchNextPage()}
                          disabled={isFetchingNextPage}
                        >
                          {isFetchingNextPage ? (
                            <div>
                              <CommentSkeleton />
                              <CommentSkeleton />
                              <CommentSkeleton />
                            </div>
                          ) : (
                            <div className="text-center text-blue-500 font-semibold">
                              Load more
                            </div>
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
