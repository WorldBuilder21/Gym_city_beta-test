import { Transition, Dialog } from "@headlessui/react";
import { TextField, IconButton } from "@mui/material";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import { auth } from "../../../firebase";
import { updatePassword } from "firebase/auth";

export default function ChangePasswordModal({
  isOpen,
  Fragment,
  handleClose,
  openSnackbar,
}) {
  const [isLoading, setIsLoading] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    handleSubmit,
    getValues,
    control,
    watch,
    // formState: { errors },
  } = useForm();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseDownConfirmPassword = (event) => {
    event.preventDefault();
  };

  const onSubmit = async (data, e) => {
    e.preventDefault();
    setIsLoading(true);
    const { newpassword } = getValues();
    try {
      const user = auth.currentUser;
      updatePassword(user, newpassword);
      setIsLoading(false);
      openSnackbar({
        message: "Password changed successfully.",
      });
      handleClose();
    } catch (error) {
      setIsLoading(false);
      openSnackbar({
        message: "An error occurred, please try again later.",
        severity: "error",
      });
      handleClose();
    }
  };
  return (
    <Transition appear show={isOpen} as={Fragment}>
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
                <Dialog.Title as="h3" className="font-semibold text-lg mb-2">
                  Change your password
                </Dialog.Title>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="mt-5 space-y-5"
                >
                  <Controller
                    name="password"
                    defaultValue=""
                    control={control}
                    rules={{
                      required: "This field is required",
                      pattern: {
                        value:
                          "^(?=.*[A-Za-z])(?=.*d)(?=.*[@$!%*#?&])[A-Za-zd@$!%*#?&]{8,}$",
                        message:
                          "Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.",
                      },
                    }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <TextField
                        type={showPassword ? "text" : "password"}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        className="w-full"
                        label="Password"
                        value={value}
                        onChange={onChange}
                        error={!!error}
                        helperText={error ? error.message : null}
                      />
                    )}
                  />
                  <Controller
                    name="confirmpassword"
                    defaultValue=""
                    control={control}
                    rules={{
                      required: "This field is required",
                      validate: (val) => {
                        if (watch("password") !== val) {
                          return "Your passwords do not match";
                        }
                      },
                    }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <TextField
                        type={showConfirmPassword ? "text" : "password"}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={handleClickShowConfirmPassword}
                                onMouseDown={handleMouseDownConfirmPassword}
                              >
                                {showConfirmPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        className="w-full"
                        label="Confirm password"
                        value={value}
                        onChange={onChange}
                        error={!!error}
                        helperText={error ? error.message : null}
                      />
                    )}
                  />
                  <div className="flex items-center justify-between mt-5 mb-5 mx-10">
                    <button
                      disabled={isLoading}
                      className="font-semibold disabled:opacity-25"
                      type="submit"
                    >
                      Done
                    </button>
                    <button
                      disabled={isLoading}
                      className="font-semibold text-red-700 disabled:opacity-25"
                      onClick={handleClose}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
