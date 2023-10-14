import { TextField, IconButton } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { googleSignIn, logout, signIn } from "../../Services/firebase";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import MuiAlert from "@mui/material/Alert";
import { useSelector } from "react-redux";
import { Snackbar } from "@mui/material";
import { auth } from "../../firebase";
import { useDispatch } from "react-redux";
import {
  clearState,
  getUserDocData,
} from "../../utils/store/user/userdocDataSlice";
import { emailVerification, getUserDataUid } from "../../Services/firebase";
import { UserAuth } from "../../Context/AuthContext";
import authErrorHandler from "../../Services/autherrorhandler";
import { doesUserExist } from "../../Services/firebase";
import { logoutuser } from "../../utils/store/user/userSlice";
import { GoogleAuthProvider } from "firebase/auth";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = UserAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassowrd, setShowPassword] = useState(false);
  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "right",
    message: "",
    severity: "",
  });
  const { vertical, horizontal, open, message, severity } = state;
  const { handleSubmit, getValues, control } = useForm();
  const custom_user = useSelector((state) => state.user.user);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const openSnackbar = (newState) => {
    setState({ open: true, ...newState });
  };

  const closeSnackbar = () => {
    setState({ ...state, open: false });
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      googleSignIn()
        .then(async (result) => {
          // const credential = GoogleAuthProvider.credentialFromResult(result);
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const user = result.user;
          console.log(user.uid);
          // checks to see if this is a new or existing user
          const userExists = await doesUserExist(user.uid);
          console.log("userExists:", userExists);
          if (userExists === true) {
            const userdocdata = await getUserDataUid(user.uid);
            dispatch(getUserDocData(userdocdata));
            navigate("/home");
          } else {
            navigate("additionalInfo");
            openSnackbar({
              message: "Complete this form before you can continue.",
              severity: "warning",
            });
          }

          // if (user.metadata.creationTime === user.metadata.lastSignInTime) {
          //   // if the user is new navigate to the additional info page
          //   navigate("additionalInfo");
          //   openSnackbar({
          //     message: "Complete this form before you can continue.",
          //     severity: "warning",
          //   });
          // } else {
          //   // if the user is an existing user and the user document has not been created navigate
          //   // them to the additional info page to complete the form.
          //   if (userExists === false) {
          //     // if not go to the additionalInfo page
          //     navigate("additionalInfo");
          //     openSnackbar({
          //       message: "You have not completed this form",
          //       severity: "error",
          //     });
          //   } else {
          //     // if yes navigate home
          //     console.log(user.uid);
          //     const userdocdata = await getUserDataUid(user.uid);
          //     dispatch(getUserDocData(userdocdata));
          //     navigate("/home");
          //   }
          // }
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
          openSnackbar({
            message: authErrorHandler(error.code),
            severity: "error",
          });
        });
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      openSnackbar({
        message: authErrorHandler(error.code),
        severity: "error",
      });
    }
  };

  const onSubmit = async (data, e) => {
    e.preventDefault();
    const { email, password } = getValues();
    try {
      setIsLoading(true);
      await signIn(email, password);
      const userExists = await doesUserExist(auth.currentUser.uid);
      if (userExists === "false") {
        navigate("additionalInfo");
      } else {
        if (auth.currentUser.emailVerified === false) {
          setIsLoading(false);
          openSnackbar({
            message:
              "This email is not verified. An email verification link has been sent to this email, tap on it to continue the login process.Check your spam if you cannot find the link",
            severity: "warning",
          });
          emailVerification();
        } else {
          openSnackbar({ message: "Log in successful" });
          setIsLoading("false");
          let userData = await getUserDataUid(auth.currentUser.uid)
          console.log(userData)
          dispatch(getUserDocData(userData));
          navigate("/home");
        }
      }
    } catch (error) {
      setIsLoading(false);
      openSnackbar({
        message: authErrorHandler(error.code),
        severity: "error",
      });
    }
  };
  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={10000}
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
        <div className="p-8 mx-5 md:mx-0 max-w-sm md:max-w-md bg-white rounded-lg border border-gray-200 shadow-md md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <h5 className="text-xl font-bold text-center text-gray-900">
              Log in
            </h5>
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
            <Controller
              name="password"
              defaultValue=""
              control={control}
              rules={{ required: "This field is required " }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  type={showPassowrd ? "text" : "password"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {showPassowrd ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  className="w-full"
                  margin="normal"
                  label="Password"
                  value={value}
                  onChange={onChange}
                  helperText={error ? error.message : null}
                  error={!!error}
                />
              )}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 "
                  />
                </div>
                <div className="ml-2 text-sm">
                  <label
                    htmlFor="remember"
                    className="text-gray-500 font-semibold"
                  >
                    Remember me
                  </label>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigate("forgotpassword");
                }}
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                Forgot Password ?
              </button>
            </div>
            <button
              disabled={isLoading}
              type="submit"
              className="w-full disabled:opacity-25 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Login to your account
            </button>
          </form>
          <p className="text-sm font-light mt-2 text-gray-500 dark:text-gray-400">
            Don’t have an account yet?{" "}
            <button
              onClick={() => {
                if (custom_user) {
                  logout();
                  dispatch(logoutuser());
                  dispatch(clearState);
                }
                navigate("signup");
              }}
              // href="signup"
              className="font-medium text-blue-600 hover:underline dark:text-blue-500"
            >
              Sign up here
            </button>
          </p>
          <div className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
            <p className="mx-4 mb-0 text-center font-semibold dark:text-white">
              Or
            </p>
          </div>
          <button
            disabled={isLoading}
            onClick={() => handleGoogleSignIn()}
            className="w-full mt-2 border disabled:opacity-25 hover:bg-gray-100 p-2 bg-white tracking-tight font-semibold rounded-md shadow-md flex justify-center items-center space-x-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              //   xmlns:xlink="http://www.w3.org/1999/xlink"
              aria-hidden="true"
              role="img"
              className="w-4"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 24 24"
            >
              <path
                fill="#EA4335"
                d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0C7.27 0 3.198 2.698 1.24 6.65l4.026 3.115z"
              ></path>
              <path
                fill="#34A853"
                d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987z"
              ></path>
              <path
                fill="#4A90E2"
                d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9c0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21z"
              ></path>
              <path
                fill="#FBBC05"
                d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067z"
              ></path>
            </svg>
            <span>Sign in with Google</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default Login;
