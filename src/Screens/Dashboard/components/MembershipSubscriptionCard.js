import React from "react";

export default function MembershipSubscriptionCard() {
  return (
    <div>
      <div className="flex max-w-md mt-2 w-full flex-col shadow-md border rounded-md p-8">
        <div className="flex justify-center items-center p-2 border rounded-md text-lg bg-green-500 text-white">
          Free
        </div>
        <div className="flex mt-4 justify-center items-center">
          <div className="flex">
            <div className="flex flex-col justify-start items-start mr-1">
              $
            </div>
            <div className="font-semibold text-8xl">0</div>
            <span className="flex flex-col justify-end mb-2">/mo</span>
          </div>
        </div>
        <div className="border p-4 rounded-md mb-4 mt-4">
          This is just for testing purposes in later updates gym owners will be
          able to set up their own membership subscriptions and fees.
        </div>
        <ul className="space-y-3">
          <span className="flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 text-green-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>

            <li className="ml-1">Access to all instructors</li>
          </span>
          <span className="flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 text-green-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
            <li className="ml-1">Access to specialized workout routines</li>
          </span>
          <span className="flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 text-green-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
            <li className="ml-1">
              Access to quality health and fitness advice and posts.
            </li>
          </span>
          <span className="flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 text-green-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
            <li className="ml-1">Acess to all gym equipment.</li>
          </span>
        </ul>
      </div>
    </div>
  );
}
