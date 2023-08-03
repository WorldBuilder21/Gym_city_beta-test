import React, { useState } from "react";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { forgotPassword } from "../../Services/firebase";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function ForgotPassword() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "right",
    message: "",
    severity: "",
  });
  const { vertical, horizontal, open, message, severity } = state;
  const openSnackbar = (newState) => {
    setState({ open: true, ...newState });
  };

  const closeSnackbar = () => {
    setState({ ...state, open: false });
  };
  const { handleSubmit, getValues, control, reset } = useForm();

  const onSubmit = (data, e) => {
    e.preventDefault();
    const { email } = getValues();
    setIsLoading(true);
    forgotPassword(email).then((_) => {
      openSnackbar({
        message:
          "A reset password link has been sent to this email. Tap on it to reset your password.",
      });
      reset();
      setIsLoading(false);
    });
  };

  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={1000}
        onClose={closeSnackbar}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        key={vertical + horizontal}
      >
        <Alert
          onClose={closeSnackbar}
          sx={{ width: "100%" }}
          severity={severity}
        >
          {message}
        </Alert>
      </Snackbar>
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="p-4 mx-5 max-w-sm md:max-w-lg bg-white rounded-lg border border-gray-200 shadow-md sm:p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className=" w-full">
            <h5 className="text-xl mb-2 font-semibold text-gray-900">
              Forgot your password
            </h5>
            <p className="mb-4">
              A password reset link will be sent to this email address.
            </p>
            <Controller
              name="email"
              defaultValue=""
              control={control}
              rules={{
                required: "This field is required",
                pattern: {
                  value:
                    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: "This is an invalid email",
                },
              }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  className="w-full"
                  margin="normal"
                  label="Email"
                  value={value}
                  onChange={onChange}
                  error={!!error}
                  helperText={error ? error.message : null}
                />
              )}
            />
            <button
              disabled={isLoading}
              type="submit"
              className="w-full disabled:opacity-25 mt-4 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Request reset link
            </button>
          </form>
          <button
            onClick={() => {
              navigate("/");
            }}
            className="font-medium flex flex-row items-center justify-center mt-5 text-blue-600 hover:text-blue-800"
          >
            Back to login
          </button>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
