import useAlgolia from "./hooks/useAlgolia";
import ComponentSkeleton from "../Components/ComponentSkeleton";
import { CircularProgress, Avatar } from "@mui/material";
import SearchCard from "./Components/SearchCard";

export default function SearchResults({ query = "" }) {
  const {
    hits,
    isLoading,
    isFetching,
    status,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useAlgolia({
    indexName: "users",
    query,
    hitsPerPage: 10,
    staleTime: 1000 * 30, // 30s
    cacheTime: 1000 * 60 * 15, // 15m
    enabled: !!query,
  });

  if (!query) return null;

  if (isLoading)
    return (
      <div className="flex flex-col h-screen justify-center items-center">
        <CircularProgress />
      </div>
    );

  console.log(hits);

  return (
    <div>
      <div className="mt-2">
        <div className="w-full ">
          {hits && hits.length > 0 ? (
            <div className="flex flex-col w-full divide-y divide-slate-200 ">
              {hits.map((user) => (
                <div className="w-full" key={user.docId}>
                  <SearchCard user={user} />
                </div>
              ))}
            </div>
          ) : (
            <div className="h-screen flex flex-col justify-center items-center">
              <div
                className="
              text-red-500"
              >
                <div className="text-center text-md font-semibold">
                  No search result
                </div>
              </div>
            </div>
          )}
        </div>
        {hasNextPage && (
          <div
            className="text-center text-blue-500 font-semibold"
            onClick={() => fetchNextPage()}
          >
            more
          </div>
        )}
        {isFetchingNextPage && (
          <div>
            <ComponentSkeleton />
            <ComponentSkeleton />
            <ComponentSkeleton />
            <ComponentSkeleton />
          </div>
        )}
      </div>
    </div>
  );
}
