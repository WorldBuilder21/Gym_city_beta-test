import React, { useState, Fragment } from "react";
import Selector from "../Components/Selector";
import UserScreen from "./UserScreen";
import InstructorScreen from "./InstructorScreen";
import GymScreen from "./GymScreen";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { useNavigate } from "react-router";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const usertypes = [{ name: "User" }, { name: "Instructor" }, { name: "Gym" }];

function Signup() {
  const [selectedType, setSelectedType] = useState(usertypes[0]);
  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "right",
    message: "",
    severity: "",
  });
  const { vertical, horizontal, open, message, severity } = state;
  const navigate = useNavigate();
  const openSnackbar = (newState) => {
    setState({ open: true, ...newState });
  };

  const closeSnackbar = () => {
    setState({ ...state, open: false });
  };

  function conditional_screen() {
    if (selectedType.name === usertypes[0].name) {
      return (
        <UserScreen
          selectedType={usertypes[0].name}
          openSnackbar={openSnackbar}
          closeSnackbar={closeSnackbar}
        />
      );
    }
    if (selectedType.name === usertypes[1].name) {
      return (
        <InstructorScreen
          selectedType={usertypes[1].name}
          openSnackbar={openSnackbar}
          closeSnackbar={openSnackbar}
        />
      );
    }
    if (selectedType.name === usertypes[2].name) {
      return (
        <GymScreen
          selectedType={usertypes[2].name}
          openSnackbar={openSnackbar}
          closeSnackbar={closeSnackbar}
        />
      );
    }
  }

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
      <div className="flex flex-col items-center mt-10 ">
        <h5 className="text-xl font-bold text-center text-gray-900">Sign up</h5>
        <div className="w-full flex flex-col items-center">
          <div className="w-full max-w-sm px-2 md:max-w-lg flex flex-col">
            <Selector
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              list={usertypes}
              Fragment={Fragment}
            />
            {conditional_screen()}
            <p className="text-sm mt-2 mb-10 font-light text-gray-500 dark:text-gray-400">
              Already have an account ?
              <button
                onClick={() => {
                  navigate("/");
                }}
                className="font-medium ml-1 text-blue-600 hover:underline dark:text-blue-500"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
