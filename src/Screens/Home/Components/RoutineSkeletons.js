import React from "react";

export default function RoutineSkeletons() {
  return (
    <div className="w-full m-2 max-w-sm animate-pulse rounded-lg border border-gray-200 p-2 shadow">
      <div className="flex flex-col">
        <div className="flex items-center space-x-3">
          <div className="h-20 w-20 rounded-md bg-gray-200"></div>
          <div>
            <div className="mb-2 h-2 w-48 rounded-full bg-gray-200"></div>
            <div className="mb-2 h-2.5 w-32 rounded-full bg-gray-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
