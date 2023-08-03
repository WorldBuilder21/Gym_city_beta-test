import React from "react";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import PostCard from "./PostCard";
import CreatePostDialogBox from "./CreatePostDialogBox";

export default function PostPlaceholder({
  posts,
  custom_user,
  Fragment,
  openModal,
  openSnackbar,
  closeModal,
  openPostModal,
  uid,
}) {
  return posts.empty ? (
    custom_user.uid === uid ? (
      <div className="flex flex-col text-gray-400 items-center justify-center mt-40">
        <AddPhotoAlternateIcon
          // className="text-gray-700"
          sx={{ fontSize: 100 }}
        />
        <span className="text-center font-semibold mt-2 text-2xl">
          Create your first post
        </span>
        <span className="mb-2 text-center">
          all posts created will be displayed here
        </span>
        <div>
          <button
            onClick={() => {
              openPostModal();
            }}
            className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-10 py-2.5 text-center"
          >
            Create post
          </button>
          <CreatePostDialogBox
            Fragment={Fragment}
            isOpen={openModal}
            handleClose={closeModal}
            openSnackbar={openSnackbar}
          />
        </div>
      </div>
    ) : (
      <div className="flex flex-col justify-center items-center mt-40 text-gray-400">
        <AddPhotoAlternateIcon sx={{ fontSize: 100 }} />
        <span className="text-center font-semibold text-gray-400 mt-2 text-xl">
          This user has not created any posts.
        </span>
      </div>
    )
  ) : (
    <div className="flex flex-col items-start">
      <div className="mb-2">
        {custom_user.uid === uid ? (
          <button
            onClick={() => {
              openPostModal();
            }}
            className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-10 py-2.5 text-center"
          >
            Create post
          </button>
        ) : (
          <></>
        )}
        <CreatePostDialogBox
          Fragment={Fragment}
          isOpen={openModal}
          handleClose={closeModal}
          openSnackbar={openSnackbar}
        />
      </div>
      <div className="w-full">
        {posts.docs.map((data, index) => (
          <PostCard key={index} data={data.data()} />
        ))}
      </div>
    </div>
  );
}
