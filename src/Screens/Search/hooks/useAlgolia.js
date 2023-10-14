import { useInfiniteQuery } from "@tanstack/react-query";
import { search } from "../algolia";

export default function useAlgolia({
  indexName,
  query,
  hitsPerPage = 10,
  staleTime,
  cacheTime,
  enabled,
}) {
  const queryInfo = useInfiniteQuery({
    queryKey: ["algolia", indexName, query, hitsPerPage],
    queryFn: ({ pageParam }) =>
      search({ indexName, query, pageParam, hitsPerPage }),
    getNextPageParam: (lastPage) => lastPage?.nextPage,
    staleTime,
    cacheTime,
    enabled,
  });

  const hits = queryInfo.data?.pages.map((page) => page.hits).flat();

  return { ...queryInfo, hits };
}
