import React, { useState, useRef } from "react";
import { Avatar, Snackbar, TextField } from "@mui/material";
import { useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import InputAdornment from "@mui/material/InputAdornment";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useSelector } from "react-redux";
import { DatePicker } from "@mui/x-date-pickers";
import { useDispatch } from "react-redux";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { updateDoc, doc } from "firebase/firestore";
import { db, storage, auth } from "../../firebase";
import { updateProfile } from "firebase/auth";
import { doesUserNameExist, getUserDataUid } from "../../Services/firebase";
import { getUserDocData } from "../../utils/store/user/userdocDataSlice";
import Charactercounter from "../Auth/Components/BioCharacterCounter";
import MuiAlert from "@mui/material/Alert";
import checkLimit from "../../Services/filesizeChecker";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function EditProfileScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user_doc = useSelector((state) => state.userdoc.userdoc);
  const custom_user = useSelector((state) => state.user.user);
  const [date, setDate] = useState(
    user_doc.usertype !== "Gym" &&
      new Date(
        user_doc.dateofbirth.seconds * 1000 +
          user_doc.dateofbirth.nanoseconds / 1000000
      )
  );
  const [isLoading, setIsLoading] = useState(false);
  const imageRef = useRef();
  const [editProfileFile, setEditProfileFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [openError, setOpenError] = useState(false);
  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "right",
    message: "",
    severity: "",
  });
  const { vertical, horizontal, open, message, severity } = state;

  const { handleSubmit, getValues, control } = useForm();

  const openSnackbar = (newState) => {
    setState({ open: true, ...newState });
  };

  const closeSnackbar = () => {
    setState({ ...state, open: false });
  };

  const handleChange = (event) => {
    const files = Array.from(event.target.files);
    const [file] = files;
    console.log(file.size);
    const size_checker = checkLimit(file);
    console.log(size_checker);
    if (size_checker === false) {
      setImageFile(file);
      setEditProfileFile(URL.createObjectURL(file));
    } else {
      openSnackbar({
        message: "The image size must not exceed 20MB",
        severity: "error",
      });
    }
  };

  console.log(custom_user);

  const onSubmit = async (data, e) => {
    e.preventDefault();
    setIsLoading(true);
    const {
      fullname,
      username,
      bio,
      dateofbirth,
      height,
      weight,
      gymname,
      ownername,
    } = getValues();
    const usernameExists = await doesUserNameExist(user_doc.username);

    try {
      const docRef = doc(db, "users", custom_user.uid);
      if (imageFile !== null) {
        let fileRef = ref(storage, custom_user.uid);
        deleteObject(fileRef);
        const storageRef = ref(
          storage,
          `/userprofilepic/${Date.now()}${imageFile.name}`
        );
        const uploadImage = uploadBytes(storageRef, imageFile);
        uploadImage.then((snapshot) => {
          getDownloadURL(snapshot.ref).then(async (url) => {
            const docRef = doc(db, "users", custom_user.uid);
            await updateDoc(docRef, {
              photUrl: url,
            });
          });
        });
      }

      if (user_doc.usertype === "Gym") {
        if (gymname !== user_doc.gymname) {
          await updateDoc(docRef, {
            gymname: fullname,
          });
          updateProfile(auth.currentUser, {
            displayName: gymname,
          });
        }

        if (ownername !== user_doc.ownername) {
          await updateDoc(docRef, {
            ownername: ownername,
          });
        }
      } else {
        if (fullname !== user_doc.fullname) {
          await updateDoc(docRef, {
            fullname: fullname,
          });
          updateProfile(auth.currentUser, {
            displayName: fullname,
          });
        }
      }

      if (username !== user_doc.username) {
        if (usernameExists.exist) {
          setOpenError(true);
        } else {
          await updateDoc(docRef, {
            username: username,
          });
        }
      }
      if (bio !== user_doc.bio) {
        await updateDoc(docRef, {
          bio: bio,
        });
      }

      if (user_doc.usertype !== "Gym") {
        if (dateofbirth !== user_doc.dateofbirth) {
          await updateDoc(docRef, {
            dateofbirth: dateofbirth,
          });
        }
        if (height !== user_doc.height) {
          await updateDoc(docRef, {
            height: height,
          });
        }
        if (weight !== user_doc.weight) {
          await updateDoc(docRef, {
            weight: weight,
          });
        }
      }

      const newData = await getUserDataUid(custom_user.uid);
      dispatch(getUserDocData(newData));
      console.log(user_doc);
      navigate(-1);
      setEditProfileFile(null);
      setImageFile(null);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      openSnackbar({
        message: "An error has occured, please try again later.",
        severity: "error",
      });
      console.log(error);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div>
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
        <nav className="bg-white px-4 py-4 relative w-full z-20 top-0 left-0 border-b border-gray-200 mb-2 drop-shadow-md">
          <div className="container flex flex-wrap  items-center">
            <div className="flex flex-wrap items-center justify-center">
              <button
                onClick={() => {
                  navigate(-1);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="active:stroke-slate-200 -ml-1 w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                  />
                </svg>
              </button>
              <span className="text-xl ml-4 font-semibold whitespace-nowrap">
                Edit profile
              </span>
            </div>
          </div>
        </nav>
        <div className="flex flex-col mt-16 mb-16 items-center">
          {editProfileFile === null ? (
            user_doc.photUrl !== "" ? (
              <Avatar
                src={user_doc.photoUrl}
                sx={{ width: 120, height: 120 }}
              />
            ) : (
              <Avatar sx={{ width: 120, height: 120 }}>
                <CameraAltIcon sx={{ fontSize: 30 }} />
              </Avatar>
            )
          ) : (
            <Avatar src={editProfileFile} sx={{ width: 120, height: 120 }} />
          )}
          {/* inline-flex */}
          <label className="rounded inline-flex text-center items-center px-5 py-2.5 hover:bg-slate-200 mt-4 mb-4 font-semibold text-lg text-blue-600">
            <AddAPhotoIcon />
            <span className="ml-2">Change Profile icon</span>
            <input
              ref={imageRef}
              onChange={handleChange}
              hidden
              accept="image/*"
              type="file"
            />
          </label>
          <div className="w-full max-w-sm px-2 md:max-w-md flex flex-col">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {user_doc.usertype === "Gym" ? (
                <>
                  <Controller
                    name="gymname"
                    defaultValue={user_doc.gymname}
                    control={control}
                    rules={{ required: "This field is required" }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <TextField
                        label="Gym's name"
                        className="w-full"
                        value={value}
                        onChange={onChange}
                        error={!!error}
                        helperText={error ? error.message : null}
                      />
                    )}
                  />
                  <Controller
                    name="ownername"
                    defaultValue={user_doc.ownername}
                    control={control}
                    rules={{
                      required: "This field is required ",
                      pattern: {
                        value:
                          /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u,
                        message: "Invalid first name",
                      },
                    }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <TextField
                        className="w-full"
                        label="Owner's name"
                        value={value}
                        onChange={onChange}
                        error={!!error}
                        helperText={error ? error.message : null}
                      />
                    )}
                  />
                </>
              ) : (
                <Controller
                  name="fullname"
                  defaultValue={user_doc.fullname}
                  control={control}
                  rules={{
                    required: "This field is required",
                    pattern: {
                      value:
                        /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u,
                      message: "Invalid full name",
                    },
                  }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <TextField
                        className="w-full"
                        value={value}
                        onChange={onChange}
                        label="Full name"
                        error={!!error}
                        helperText={error ? error.message : null}
                      />
                    </>
                  )}
                />
              )}
              <div>
                <Controller
                  name="username"
                  defaultValue={user_doc.username}
                  control={control}
                  rules={{
                    required: "This field is required",
                    minLength: {
                      value: 6,
                      message: "Minimum length is 6 character.",
                    },
                    maxLength: {
                      value: 30,
                      message: "Maximum length is 30 characters.",
                    },
                    pattern: {
                      value:
                        /^(?=.{6,30}$)(?!.*[._-]{2})[a-z][a-z0-9._-]*[a-z0-9]$/,
                      message:
                        "Invalid username, must not start or end with a special character [@<*_->].",
                    },
                  }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <TextField
                      label="Username"
                      className="w-full"
                      value={value}
                      error={!!error}
                      helperText={error ? error.message : null}
                      onChange={onChange}
                    />
                  )}
                />

                {openError && (
                  <div className="bg-red-100 mt-2 w-full text-red-800 font-medium text-md px-2.5 py-0.5 rounded border border-red-400">
                    This username already exits.
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Controller
                  name="bio"
                  defaultValue={user_doc.bio}
                  control={control}
                  rules={{
                    maxLength: {
                      value: 100,
                      message: "Cannot exceed 100 characters.",
                    },
                  }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <TextField
                      value={value}
                      error={!!error}
                      inputProps={{
                        maxLength: 100,
                      }}
                      helperText={error ? error.message : null}
                      onChange={onChange}
                      label="Bio"
                      className="w-full"
                      multiline
                      rows={4}
                    />
                  )}
                />
                <Charactercounter
                  control={control}
                  number={100}
                  defaultValue={user_doc.bio}
                  name={"bio"}
                />
              </div>

              {user_doc.usertype === "Gym" ? (
                <></>
              ) : (
                <>
                  <Controller
                    control={control}
                    name="dateofbirth"
                    defaultValue={date}
                    rules={{
                      required: "This field is empty",
                    }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <DatePicker
                        label="Date of birth"
                        value={value}
                        onChange={onChange}
                        className="w-full"
                        renderInput={(props) => (
                          <TextField
                            helperText={error ? error.message : null}
                            {...props}
                            error={!!error}
                          />
                        )}
                      />
                    )}
                  />
                  <Controller
                    name="height"
                    defaultValue={user_doc.height}
                    control={control}
                    rules={{
                      required: "This field is empty.",
                      pattern: {
                        value:
                          /^([0-9]*[1-9][0-9]*(\.[0-9]+)?|[0]+\.[0-9]*[1-9][0-9]*)$/,
                        message: "Invalid height",
                      },
                    }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <TextField
                        label="height"
                        className="w-full"
                        value={value}
                        type="number"
                        error={!!error}
                        helperText={error ? error.message : null}
                        onChange={onChange}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">cm</InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                  <Controller
                    name="weight"
                    defaultValue={user_doc.weight}
                    control={control}
                    rules={{
                      required: "This field is empty.",
                      pattern: {
                        value:
                          /^([0-9]*[1-9][0-9]*(\.[0-9]+)?|[0]+\.[0-9]*[1-9][0-9]*)$/,
                        message: "Invalid weight",
                      },
                    }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <TextField
                        label="Weight"
                        className="w-full"
                        type="number"
                        value={value}
                        error={!!error}
                        helperText={error ? error.message : null}
                        onChange={onChange}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">kg</InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </>
              )}
              <button
                disabled={isLoading}
                type="submit"
                className="w-full disabled:opacity-25  text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Done
              </button>
            </form>
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
}
