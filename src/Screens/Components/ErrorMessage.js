import React from "react";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export default function ErrorMessage({ message }) {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="text-red-500">
        <div className="text-center">
          <ErrorOutlineIcon sx={{ fontSize: 150 }} />
        </div>
        <div className="mt-3 text-lg text-center font-semibold">{message}</div>
      </div>
    </div>
  );
}
