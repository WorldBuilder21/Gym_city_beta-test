import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Divider } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { getUserId } from "../../../utils/store/user/getUserIdSlice";

export default function AccountModal({
  Fragment,
  isOpen,
  handleClose,
  uid,
  usertype,
  viewStatus,
  isblocked,
  refetch,
}) {
  const userdoc = useSelector((state) => state.userdoc.userdoc);
  const custom_user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const location = useLocation();
  const pathname = location.pathname;

  return (
    <Transition as={Fragment} appear show={isOpen}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex flex-col space-y-2 items-center justify-center">
                  {usertype === "Gym" ? (
                    // if user is not a member of instructor, send memeber ship request
                    <>
                      {custom_user.uid === uid ? (
                        <button className="flex border justify-center items-center py-2.5 w-full px-2 rounded-lg  hover:bg-gray-100 hover:text-blue-700 ">
                          Edit profile
                        </button>
                      ) : (
                        <></>
                      )}
                      <button
                        onClick={() => {
                          if (pathname === "/profile") {
                            navigate("/profile/members");
                            dispatch(getUserId(" "));
                          } else {
                            navigate(`/${uid}/members`);
                            dispatch(getUserId(uid));
                          }
                        }}
                        className="flex border justify-center items-center py-2.5 w-full px-2 rounded-lg  hover:bg-gray-100 hover:text-blue-700 "
                      >
                        View members
                      </button>

                      <button
                        onClick={() => {
                          if (pathname === "/profile") {
                            navigate("/profile/instructors");
                            dispatch(getUserId(" "));
                          } else {
                            navigate(`/${uid}/instructors`);
                            dispatch(getUserId(uid));
                          }
                        }}
                        className="flex border justify-center items-center py-2.5 w-full px-2 rounded-lg  hover:bg-gray-100 hover:text-blue-700 "
                      >
                        View instructors
                      </button>

                      <button className="flex border justify-center items-center py-2.5 w-full px-2 rounded-lg  hover:bg-gray-100 hover:text-blue-700 ">
                        View reviews
                      </button>
                    </>
                  ) : usertype === "Instructor" ? (
                    <>
                      {custom_user.uid === uid ? (
                        <button className="flex border justify-center items-center py-2.5 w-full px-2 rounded-lg  hover:bg-gray-100 hover:text-blue-700 ">
                          Edit profile
                        </button>
                      ) : (
                        <></>
                      )}
                      <button className="flex border justify-center items-center py-2.5 w-full px-2 rounded-lg  hover:bg-gray-100 hover:text-blue-700 ">
                        View reviews
                      </button>
                      <button
                        onClick={() => {
                          if (pathname === "/profile") {
                            navigate("/profile/friends");
                            dispatch(getUserId(" "));
                          } else {
                            navigate(`/${uid}/friends`);
                            dispatch(getUserId(uid));
                          }
                        }}
                        className="flex border justify-center items-center py-2.5 w-full px-2 rounded-lg  hover:bg-gray-100 hover:text-blue-700 "
                      >
                        View friends
                      </button>
                      {custom_user.uid !== uid && (
                        <button className="flex boreder justify-center items-center py-2.5 w-full px-2 rounded-lg text-white hover:bg-blue-600 bg-blue-500">
                          Send friend request
                        </button>
                      )}
                      {custom_user.uid === uid ? (
                        <button className="flex border justify-center items-center py-2.5 w-full px-2 rounded-lg  hover:bg-gray-100 hover:text-blue-700 ">
                          View clients
                        </button>
                      ) : (
                        <></>
                      )}
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          if (pathname === "/profile") {
                            navigate("/profile/friends");
                            dispatch(getUserId(" "));
                          } else {
                            navigate(`/${uid}/friends`);
                            dispatch(getUserId(uid));
                          }
                        }}
                        className="flex border justify-center items-center py-2.5 w-full px-2 rounded-lg  hover:bg-gray-100 hover:text-blue-700 "
                      >
                        View friends
                      </button>
                      {custom_user.uid !== uid && (
                        <button className="flex boreder justify-center items-center py-2.5 w-full px-2 rounded-lg text-white bg-blue-500">
                          Send friend request
                        </button>
                      )}
                      {custom_user.uid === uid ? (
                        <button className="flex border justify-center items-center py-2.5 w-full px-2 rounded-lg  hover:bg-gray-100 hover:text-blue-700 ">
                          Edit profile
                        </button>
                      ) : (
                        <></>
                      )}
                    </>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
