import React from "react";
import UserChip from "./UserChip";
import { formatDistance } from "date-fns";
import moment from "moment/moment";

export default function ActivityCard({ data }) {
  // activity types
  // - MemberAdded # $
  // - Memberremoved # $
  // - Memberblockedandremoved $
  // - Memberleft # $
  // - Instructorleft # $
  // - InstructorAdded # $
  // - Instructorblockedandremoved $
  // - Routineapproved # $
  // - Routinerejected # $
  // - Instructorremoved # $
  // - Postapproved # $
  // - Postrejected #

  // blocked
  // <svg
  //   xmlns="http://www.w3.org/2000/svg"
  //   fill="none"
  //   viewBox="0 0 24 24"
  //   stroke-width="1.5"
  //   stroke="currentColor"
  //   class="w-6 h-6"
  // >
  //   <path
  //     stroke-linecap="round"
  //     stroke-linejoin="round"
  //     d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
  //   />
  // </svg>;

  // approved
  // <svg
  //   xmlns="http://www.w3.org/2000/svg"
  //   fill="none"
  //   viewBox="0 0 24 24"
  //   stroke-width="1.5"
  //   stroke="currentColor"
  //   class="w-6 h-6"
  // >
  //   <path
  //     stroke-linecap="round"
  //     stroke-linejoin="round"
  //     d="M4.5 12.75l6 6 9-13.5"
  //   />
  // </svg>;

  // rejected
  // <svg
  //   xmlns="http://www.w3.org/2000/svg"
  //   fill="none"
  //   viewBox="0 0 24 24"
  //   stroke-width="1.5"
  //   stroke="currentColor"
  //   class="w-6 h-6"
  // >
  //   <path
  //     stroke-linecap="round"
  //     stroke-linejoin="round"
  //     d="M6 18L18 6M6 6l12 12"
  //   />
  // </svg>;

  // added
  // <svg
  //   xmlns="http://www.w3.org/2000/svg"
  //   fill="none"
  //   viewBox="0 0 24 24"
  //   stroke-width="1.5"
  //   stroke="currentColor"
  //   class="w-6 h-6"
  // >
  //   <path
  //     stroke-linecap="round"
  //     stroke-linejoin="round"
  //     d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
  //   />
  // </svg>;

  // left or removed
  // <svg
  //   xmlns="http://www.w3.org/2000/svg"
  //   fill="none"
  //   viewBox="0 0 24 24"
  //   stroke-width="1.5"
  //   stroke="currentColor"
  //   class="w-6 h-6"
  // >
  //   <path
  //     stroke-linecap="round"
  //     stroke-linejoin="round"
  //     d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
  //   />
  // </svg>;

  const date = new Date(
    data?.ts?.seconds * 1000 + data?.ts?.nanoseconds / 1000000
  );

  const formattedDate = moment(date).format("LLLL");

  function icons_status() {
    if (data?.type === "MemberAdded" || data === "InstructorAdded") {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-3.5 h-3.5 text-blue-800"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
          />
        </svg>
      );
    } else if (
      data?.type === "Memberremoved" ||
      data?.type === "Instructorremoved" ||
      data?.type === "Instructorleft" ||
      data?.type === "Memberleft"
    ) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="w-3.5 h-3.5 text-blue-800"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
          />
        </svg>
      );
    } else if (
      data?.type === "Postapproved" ||
      data?.type === "Routineapproved"
    ) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="w-3.5 h-3.5 text-blue-800"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>
      );
    } else if (
      data?.type === "Postrejected" ||
      data?.type === "Routinerejected"
    ) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-3.5 h-3.5 text-blue-800"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      );
    } else if (
      data?.type === "Memberblockedandremoved" ||
      data?.type === "Instructorblockedandremoved"
    ) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-3.5 h-3.5 text-blue-800"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
          />
        </svg>
      );
    }
    console.log("HelloWorld");
  }

  // `${Object.create(
  //   <UserChip data={data} />
  // )} is a new member at your gym.`

  function for_title_body() {
    let return_data = {};

    if (data?.type === "MemberAdded") {
      return_data = {
        title: "Member added",
        body: (
          <div className="flex flex-wrap items-center">
            <div className="flex-wrap">{<UserChip data={data} />}</div>
            <span className="break-all  ml-2">
              is a new member at your gym.
            </span>
          </div>
        ),
      };
      return return_data;
    } else if (data?.type === "Memberremoved") {
      return_data = {
        title: "Member removed",
        body: (
          <div className="flex flex-wrap items-center">
            <div className="flex-wrap">{<UserChip data={data} />}</div>
            <span className="break-all  ml-2">
              has been removed from your gym.
            </span>
          </div>
        ),
      };
      return return_data;
    } else if (data?.type === "Memberblockedandremoved") {
      return_data = {
        title: "Member blocked and removed",
        body: (
          <div className="flex flex-wrap items-center">
            <div className="flex-wrap">{<UserChip data={data} />}</div>
            <span className="break-all  ml-2">
              has been blocked and removed from your gym.
            </span>
          </div>
        ),
      };
      return return_data;
    } else if (data?.type === "Memberleft") {
      return_data = {
        title: "Member left",
        body: (
          <div className="flex flex-wrap items-center">
            <div className="flex-wrap">{<UserChip data={data} />}</div>
            <span className="break-all  ml-2">has left your gym.</span>
          </div>
        ),
      };
      return return_data;
    } else if (data?.type === "Instructorleft") {
      return_data = {
        title: "Instructor left",
        body: (
          <div className="flex flex-wrap items-center">
            <span className="mr-2">Instructor</span>
            <div className="flex-wrap">{<UserChip data={data} />}</div>
            <span className="break-all  ml-2">has left your gym.</span>
          </div>
        ),
      };
      return return_data;
    } else if (data?.type === "InstructorAdded") {
      return_data = {
        title: "Instructor added",
        body: (
          <div className="flex flex-wrap items-center">
            <span className="mr-2">Instructor</span>
            <div className="flex-wrap">{<UserChip data={data} />}</div>
            <span className="break-all  ml-2">
              is a new instructor at your gym.
            </span>
          </div>
        ),
      };
      return return_data;
    } else if (data?.type === "Instructorblockedandremoved") {
      return_data = {
        title: "Instructor blocked and removed",
        body: (
          <div className="flex flex-wrap items-center">
            <span className="mr-2">Instructor</span>
            <div className="flex-wrap">{<UserChip data={data} />}</div>
            <span className="break-all  ml-2">
              has been blocked and removed from your gym.
            </span>
          </div>
        ),
      };
      return return_data;
    } else if (data?.type === "Routineapproved") {
      return_data = {
        title: "Routine approved",
        body: (
          <div className="flex flex-wrap items-center">
            <span className="break-all  ml-2">
              you have approved a routine created by
            </span>
            <div className="flex-wrap">{<UserChip data={data} />}.</div>
          </div>
        ),
      };
      return return_data;
    } else if (data?.type === "Routinerejected") {
      return_data = {
        title: "Routine rejected",
        body: (
          <div className="flex flex-wrap items-center">
            <span className="break-all  ml-2">
              You have rejected a routine created by
            </span>
            <div className="flex-wrap">{<UserChip data={data} />}.</div>
          </div>
        ),
      };
      return return_data;
    } else if (data?.type === "Instructorremoved") {
      return_data = {
        title: "Instructor removed",
        body: (
          <div className="flex flex-wrap items-center">
            <div className="flex-wrap">{<UserChip data={data} />}</div>
            <span className="break-all  ml-2">
              has been removed from your gym.
            </span>
          </div>
        ),
      };
      return return_data;
    } else if (data?.type === "Postapproved") {
      return_data = {
        title: "Post approved",
        body: (
          <div className="flex flex-wrap items-center">
            <span className="break-all  ml-2">
              You have approved a post created by
            </span>
            <div className="flex-wrap">{<UserChip data={data} />}.</div>
          </div>
        ),
      };
      return return_data;
    } else if (data?.type === "Postrejected") {
      return_data = {
        title: "Post rejected",

        body: (
          <div className="flex flex-wrap items-center">
            <span className="break-all  ml-2">
              You have rejected a post created by
            </span>
            <div className="flex-wrap">{<UserChip data={data} />}.</div>
          </div>
        ),
      };
      return return_data;
    }
    return return_data;
  }

  return (
    <li className="mb-5 ml-6">
      <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
        {icons_status()}
        {/* <svg
          className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
        </svg> */}
      </span>
      <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
        {for_title_body().title}
      </h3>
      <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
        Posted on {formattedDate}
      </time>
      <div className="text-base mt-4 font-normal text-gray-500 dark:text-gray-400">
        {for_title_body().body}
      </div>
    </li>
  );
}
