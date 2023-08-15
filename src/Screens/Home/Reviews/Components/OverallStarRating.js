import React, { useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarOutlineIcon from "@mui/icons-material/StarOutline";

export default function OverallStarRating({ rating }) {
  return (
    <div>
      <div>
        {[1, 2, 3, 4, 5].map((starNumber) => (
          <Star key={starNumber} rating={rating} starNumber={starNumber} />
        ))}
      </div>
    </div>
  );
}

const Star = ({ rating, starNumber }) => {
  const isFilled = starNumber <= rating;
  const isHalf = starNumber === Math.ceil(rating) && rating % 1 !== 0;

  return (
    <span
      className={`${isFilled || isHalf ? "text-amber-300" : "text-gray-300"}`}
    >
      {isFilled ? (
        <StarIcon sx={{ fontSize: 30 }} />
      ) : isHalf ? (
        <StarHalfIcon sx={{ fontSize: 30 }} />
      ) : (
        <StarOutlineIcon sx={{ fontSize: 30 }} />
      )}
    </span>
  );
};
