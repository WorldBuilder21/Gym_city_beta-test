import React from "react";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import PostCard from "./PostCard";
import CreatePostDialogBox from "./CreatePostDialogBox";
import PostSkeleton from "./PostSkeleton";

export default function PostPlaceholder({
  posts,
  custom_user,
  Fragment,
  openModal,
  openSnackbar,
  closeModal,
  openPostModal,
  uid,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  refetch,
  isInstructor,
  accountData,
}) {

  const sendPostRequest = () =>{

  }

  return posts?.pages?.map((page, index) =>
    page?.posts?.length === 0 ? (
      custom_user.uid === uid ? (
        <div
          key={index}
          className="flex flex-col text-gray-400 items-center justify-center mt-40"
        >
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
              refetch={refetch}
              isInstructor={false}
            />
          </div>
        </div>
      ) : accountData?.usertype === 'Gym' && isInstructor ? <div>
        <span>No post have been created yet</span>
      </div> :(
        <div
          key={index}
          className="flex flex-col justify-center items-center mt-40 text-gray-400"
        >
          <AddPhotoAlternateIcon sx={{ fontSize: 100 }} />
          <span className="text-center font-semibold text-gray-400 mt-2 text-xl">
            This user has not created any posts.
          </span>
        </div>
      )
    ) : (
      <div key={index} className="flex flex-col items-start">
        {custom_user.uid === uid ? (
          <div className="mb-2">
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
              refetch={refetch}
              isInstructor={false}
            />
          </div>
        ) : (
          <></>
        )}

        <div className="w-full flex flex-wrap">
          {page?.posts?.map((data, index) => (
            <PostCard uid={uid} key={index} data={data} />
          ))}
          {hasNextPage && (
            <div
              className="flex flex-col
              w-full hover:cursor-pointer"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? (
                <div className="flex flex-wrap">
                  <PostSkeleton />
                  <PostSkeleton />
                  <PostSkeleton />
                </div>
              ) : (
                <div className="text-center mt-5 text-blue-500 font-semibold">
                  Load more
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  );
}
