import React, { useEffect, useState } from "react";
import CustomDialogBox from "../../../Settings/Components/CustomDialogBox";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getUserDataUid } from "../../../../Services/firebase";
import { formatDistance } from "date-fns";
import { Avatar } from "@mui/material";
import { Menu } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import ReviewMenu from "./ReviewMenu";
import ReactStars from "react-rating-stars-component";

export default function ReviewCard({
  refetch,
  reviewData,
  refetchCount,
  Fragment,
  senderId,
  ts,
  uid,
}) {
  const navigate = useNavigate();

  console.log(reviewData?.rating);

  const { status, data: userData } = useQuery(
    {
      queryKey: ["review_sender", senderId],
      queryFn: () => getUserDataUid(senderId),
    },
    { enabled: false }
  );

  const Star = ({ isFilled }) => (
    <span className={`${isFilled ? "text-amber-300" : "text-gray-300"}`}>
      {isFilled ? <StarIcon /> : <StarOutlineIcon />}
    </span>
  );

  const StarRating = () => {
    const [rating, setRating] = useState(reviewData?.rating);

    const handleRatingChange = (newRating) => {
      setRating(newRating);
    };

    return (
      <div>
        <div>
          {[1, 2, 3, 4, 5].map((starNumber) => (
            <Star key={starNumber} isFilled={starNumber <= rating} />
          ))}
        </div>
      </div>
    );
  };

  if (status === "loading") {
    return <></>;
  }

  const date = new Date(ts?.seconds * 1000 + ts?.nanoseconds / 1000000);
  const formattedDate = formatDistance(date, new Date());

  return (
    <div className="flex flex-col relative w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center overflow-hidden text-ellipsis truncate">
          <div className="flex w-full">
            <Avatar src={userData?.photoUrl} sx={{ width: 70, height: 70 }} />
            <div className="flex flex-col ml-3 justify-center text-clip overflow-hidden truncate break-all">
              <p className=" mr-2 truncate font-semibold">
                {userData?.usertype === "Gym"
                  ? userData?.gymname
                  : userData?.fullname}
              </p>
              <p className="text-blue-600 text-sm font-semibold truncate">
                @{userData?.username}
              </p>
            </div>
          </div>
        </div>
        <Menu as="div" className="flex md:order-2">
          <div>
            <Menu.Button className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200">
              <EllipsisVerticalIcon className="w-6 h-6" />
            </Menu.Button>
          </div>
          <ReviewMenu
            MenuFragment={Fragment}
            message={reviewData?.message}
            rating={reviewData?.rating}
            uid={uid}
            senderId={senderId}
            refetch={refetch}
          />
        </Menu>
      </div>
      <StarRating />
      <p className="mt-2 break-all">{reviewData?.message}</p>
      <div className="w-full text-slate-500 flex justify-end text-sm items-end">
        {formattedDate}
      </div>
    </div>
  );
}
