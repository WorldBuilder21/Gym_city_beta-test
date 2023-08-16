import React, { useState, Fragment, useEffect } from "react";
import { useNavigate } from "react-router";
import ReviewDialogBox from "./Components/ReviewDialogBox";
import { useSelector } from "react-redux";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { viewRatings } from "../../../Services/ReviewFirebase/review";
import { LastPage } from "@mui/icons-material";
import ErrorMessage from "../../Components/ErrorMessage";
import ReviewsIcon from "@mui/icons-material/Reviews";
import ReviewCard from "./Components/ReviewCard";
import ComponentSkeleton from "../../Components/ComponentSkeleton";
import { checkifFriendOrMember } from "../../../Services/firebase";
import ReactStars from "react-rating-stars-component";
import { getTotalNumberOfReviews } from "../../../Services/ReviewFirebase/review";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import { getRatingNumber } from "../../../Services/ReviewFirebase/review";
import OverallStarRating from "./Components/OverallStarRating";
import RatingSelector from "./Components/RatingSelector";
import MuiAlert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function ReviewScreen() {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  const userId = useSelector((state) => state.userId.userId);
  const custom_user = useSelector((state) => state.user.user);

  const [isMember, setIsMember] = useState(false);

  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "right",
    message: "",
    severity: "",
  });
  const { vertical, horizontal, open, message, severity } = state;

  const openSnackbar = (newState) => {
    setState({ open: true, ...newState });
  };

  const closeSnackbar = () => {
    setState({ ...state, open: false });
  };

  const numberRatings = [1, 2, 3, 4, 5];

  const [selectedType, setSelectedType] = useState(numberRatings[0]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  console.log(userId);

  const {
    status,
    error,
    data,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    {
      queryKey: ["reviews", selectedType],
      queryFn: (pageParam) =>
        viewRatings(userId, selectedType, pageParam.pageParam),
      getNextPageParam: (lastpage) => lastpage.nextPage,
    },
    { enabled: false }
  );

  console.log("uid:", userId);

  // rating 1 star
  const {
    status: one_status,
    data: one_data,
    refetch: one_refetch,
  } = useQuery(
    {
      queryKey: ["one_star_count"],
      queryFn: () => getRatingNumber({ uid: userId, rating: 1 }),
    },
    { enabled: false }
  );

  // rating 2 star
  const {
    status: two_status,
    data: two_data,
    refetch: two_refetch,
  } = useQuery(
    {
      queryKey: ["two_star_count"],
      queryFn: () => getRatingNumber({ uid: userId, rating: 2 }),
    },
    { enabled: false }
  );

  // rating 3 star
  const {
    status: three_status,
    data: three_data,
    refetch: three_refetch,
  } = useQuery(
    {
      queryKey: ["three_star_count"],
      queryFn: () => getRatingNumber({ uid: userId, rating: 3 }),
    },
    { enabled: false }
  );

  // rating 4 star
  const {
    status: four_status,
    data: four_data,
    refetch: four_refetch,
  } = useQuery(
    {
      queryKey: ["four_star_count"],
      queryFn: () => getRatingNumber({ uid: userId, rating: 4 }),
    },
    { enabled: false }
  );

  // rating 5 star
  const {
    status: five_status,
    data: five_data,
    refetch: five_refetch,
  } = useQuery(
    {
      queryKey: ["five_star_count"],
      queryFn: () => getRatingNumber({ uid: userId, rating: 5 }),
    },
    { enabled: false }
  );

  const {
    status: count_status,
    data: count,
    refetch: refetch_count,
  } = useQuery(
    {
      queryKey: ["count_reviews"],
      queryFn: () => getTotalNumberOfReviews({ uid: userId }),
    },
    { enabled: false }
  );

  const review_count =
    count_status === "loading" ? 0 : count_status === "error" ? 0 : count;

  const one_count =
    one_status === "loading" ? 0 : one_status === "error" ? 0 : one_data;

  const two_count =
    two_status === "loading" ? 0 : two_status === "error" ? 0 : two_data;

  const three_count =
    three_status === "loading" ? 0 : three_status === "error" ? 0 : three_data;

  const four_count =
    four_status === "loading" ? 0 : four_status === "error" ? 0 : four_data;

  const five_count =
    five_status === "loading" ? 0 : five_status === "error" ? 0 : five_data;

  const average_count =
    (one_count * 1 +
      two_count * 2 +
      three_count * 3 +
      four_count * 4 +
      five_count * 5) /
    review_count;

  const one_percent = (one_count / review_count) * 100;
  const two_percent = (two_count / review_count) * 100;
  const three_percent = (three_count / review_count) * 100;
  const four_percent = (four_count / review_count) * 100;
  const five_percent = (five_count / review_count) * 100;

  console.log("average count:", average_count);

  console.log(count);

  console.log("five percent:", five_percent);

  useEffect(() => {
    checkifFriendOrMember(userId, custom_user.uid, "Gym").then((result) => {
      setIsMember(result);
    });
  }, [custom_user.uid, userId]);
  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={10000}
        onClose={closeSnackbar}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        key={vertical + horizontal}
      >
        <Alert
          onClose={closeSnackbar}
          sx={{ width: "100%" }}
          severity={severity}
        >
          {message}
        </Alert>
      </Snackbar>
      <nav className="bg-white px-4 py-4 relative  z-20 top-0 left-0 border-b border-gray-200 mb-2 drop-shadow-md">
        <div className="container flex flex-wrap  items-center">
          <div className="flex flex-wrap items-center justify-center">
            <button
              onClick={() => {
                navigate(-1);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="active:stroke-slate-200 -ml-1 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
            </button>
            <span className="text-xl ml-4 font-semibold whitespace-nowrap">
              View reviews
            </span>
          </div>
        </div>
      </nav>
      <div className="flex flex-col m-5">
        <div className="flex flex-col w-full md:flex-row ">
          <div className="flex justify-center items-center mb-2 md:mb-0 md:mr-10">
            <div className="flex flex-col space-y-2 justify-center items-center">
              <span className="font-semibold text-7xl">
                {isNaN(average_count) || average_count === Infinity
                  ? 0
                  : average_count.toFixed(1)}
              </span>
              <div>
                <OverallStarRating rating={average_count} />
                {/* <ReactStars
                  isHalf={true}
                  edit={false}
                  size={40}
                  value={
                    isNaN(average_count) || average_count === Infinity
                      ? 0
                      : average_count
                  }
                /> */}
              </div>
              <p>{review_count}</p>
            </div>
          </div>
          {/* progress bars */}
          <div className="flex flex-col grow space-y-1">
            <div className="flex justify-center items-center">
              <span>1</span>
              <div className="w-full mx-5">
                <div className="h-2 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-orange-500"
                    style={{
                      width: `${isNaN(one_percent) ? 0 : one_percent}%`,
                    }}
                  ></div>
                </div>
              </div>
              <span>{one_count}</span>
            </div>

            <div className="flex justify-center items-center">
              <span>2</span>
              <div className="w-full mx-5">
                <div className="h-2 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-orange-500"
                    style={{
                      width: `${isNaN(two_percent) ? 0 : two_percent}%`,
                    }}
                  ></div>
                </div>
              </div>
              <span>{two_count}</span>
            </div>

            <div className="flex justify-center items-center">
              <span>3</span>
              <div className="w-full mx-5">
                <div className="h-2 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-orange-500"
                    style={{
                      width: `${isNaN(three_percent) ? 0 : three_percent}%`,
                    }}
                  ></div>
                </div>
              </div>
              <span>{three_count}</span>
            </div>

            <div className="flex justify-center items-center">
              <span>4</span>
              <div className="w-full mx-5">
                <div className="h-2 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-orange-500"
                    style={{
                      width: `${isNaN(four_percent) ? 0 : four_percent}%`,
                    }}
                  ></div>
                </div>
              </div>
              <span>{four_count}</span>
            </div>

            <div className="flex justify-center items-center">
              <span>5</span>
              <div className="w-full mx-5">
                <div className="h-2 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-orange-500"
                    style={{
                      width: `${isNaN(five_percent) ? 0 : five_percent}%`,
                    }}
                  ></div>
                </div>
              </div>
              <span>{five_count}</span>
            </div>
          </div>
        </div>

        <div className="w-full rounded-full mt-4 border bg-gray-300 h-0.5" />

        {custom_user.uid !== userId &&
          (isMember ? (
            <div>
              <button
                className="mt-2 mb-2 disabled:opacity-25 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-12 py-2.5 text-center"
                onClick={handleOpenModal}
              >
                <div className="flex items-center justify-center">
                  <span className="mr-1">Write a review </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                    />
                  </svg>
                </div>
              </button>
              <ReviewDialogBox
                uid={userId}
                isOpen={openModal}
                Fragment={Fragment}
                handleClose={handleCloseModal}
                refetch={refetch}
                openSnackbar={openSnackbar}
              />
            </div>
          ) : (
            <></>
          ))}
        <RatingSelector
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          list={numberRatings}
          Fragment={Fragment}
        />
        {status === "loading" ? (
          <></>
        ) : status === "error" ? (
          <ErrorMessage />
        ) : (
          <div className="mt-2">
            {data?.pages?.map((page, index) =>
              page?.reviews?.length === 0 ? (
                <div
                  key={index}
                  className="flex flex-col justify-center items-center h-screen text-gray-500"
                >
                  <ReviewsIcon sx={{ fontSize: 150 }} />
                  <span className="mt-3 text-lg text-center font-semibold">
                    There are no reviews to display.
                  </span>
                </div>
              ) : (
                <div
                  key={index}
                  className="flex flex-col divide-y divide-slate-200 justify-center items-center"
                >
                  {page?.reviews?.map((review, index) => (
                    <div key={index} className="w-full">
                      <ReviewCard
                        ts={review?.ts}
                        senderId={review?.senderId}
                        Fragment={Fragment}
                        uid={custom_user.uid}
                        reviewData={review}
                        refetch={refetch}
                      />
                    </div>
                  ))}
                </div>
              )
            )}
            {hasNextPage && (
              <div
                className="flex flex-col
              justify-center items-center w-full hover:cursor-pointer"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? (
                  <>
                    <ComponentSkeleton />
                    <ComponentSkeleton />
                    <ComponentSkeleton />
                  </>
                ) : (
                  <div className="text-center text-blue-500 font-semibold">
                    Load more
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
