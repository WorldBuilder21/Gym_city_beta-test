import { useQuery } from "@tanstack/react-query";
import {
  getRatingNumber,
  getTotalNumberOfReviews,
} from "../Services/ReviewFirebase/review";

export function GetStar(id, star) {
  return useQuery(
    {
      queryKey: ["star count", star],
      queryFn: () => getRatingNumber({ uid: id, rating: star }),
    },
    { enabled: false }
  );
}

export function GetTotalReviewCount(id) {
  return useQuery(
    {
      queryKey: ["total review count"],
      queryFn: () => getTotalNumberOfReviews({ uid: id }),
    },
    { enabled: false }
  );
}

export function getAverageRating(id) {
  const { data: one_data, status: one_status } = GetStar(id, 1);
  const { data: two_data, status: two_status } = GetStar(id, 2);
  const { data: three_data, status: three_status } = GetStar(id, 3);
  const { data: four_data, status: four_status } = GetStar(id, 4);
  const { data: five_data, status: five_status } = GetStar(id, 5);

  const { data: count, status: count_status } = GetTotalReviewCount(id);

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

  return average_count;
}
