import React from "react";

export default function PageNotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="text-9xl">404</div>
      <div className="mt-3 text-lg font-semibold">
        The page you have requested cannot be found
      </div>
    </div>
  );
}
