import React, { useState } from "react";
import { TextField, IconButton } from "@mui/material";
import { useForm, Controller, useWatch } from "react-hook-form";
import { useNavigate } from "react-router";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useSelector } from "react-redux";
import InputAdornment from "@mui/material/InputAdornment";
import Charactercounter from "../Components/BioCharacterCounter";
import { useDispatch } from "react-redux";
import { createGym } from "../../../Services/firebase";
import { emailVerification, creatGymDoc } from "../../../Services/firebase";
import authErrorHandler from "../../../Services/autherrorhandler";
import { doesUserNameExist } from "../../../Services/firebase";
import { getUserDataUid } from "../../../Services/firebase";
import { getUserDocData } from "../../../utils/store/user/userdocDataSlice";

function GymScreen({ openSnackbar, closeSnackbar, selectedType }) {
  const [isLoading, setIsLoading] = useState();
  const [showPassowrd, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [openError, setOpenError] = useState(false);
  const { handleSubmit, getValues, control, watch, reset } = useForm();
  const custom_user = useSelector((state) => state.user.user);
  const provider_bool =
    custom_user?.providerData[0].providerId === "google.com" ? true : false;
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    const { gymname, ownername, username, bio, email, password } = getValues();
    const photoUrl = provider_bool ? custom_user.photoURL : "";

    setIsLoading(true);
    const usernameExists = await doesUserNameExist(username);
    if (usernameExists.exist === false) {
      try {
        if (provider_bool === false) {
          await createGym({
            email,
            password,
            usertype: selectedType,
            gymname,
            ownername,
            username,
            bio,
            photoUrl,
          });
          reset();
          setIsLoading(false);
          emailVerification().then((_) => {
            openSnackbar({
              severity: "warning",
              message:
                "A verification link has been sent to this email. Tap on the link and return to proceed with the login process.",
            });
          });
        } else {
          const user_uid = custom_user.uid;
          await creatGymDoc({
            email,
            usertype: selectedType,
            gymname,
            ownername,
            username,
            bio,
            photoUrl,
            uid: user_uid,
          });
          const userdocdata = await getUserDataUid(custom_user.uid);
          dispatch(getUserDocData(userdocdata));
          navigate("/home");
          reset();
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
        console.log(error);
        openSnackbar({
          message: authErrorHandler(error.code),
          severity: "error",
        });
      }
    } else {
      setOpenError(true);
      setIsLoading(false);
    }
  };
  return (
    <div className="mt-5 w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Controller
          name="gymname"
          defaultValue=""
          control={control}
          rules={{ required: "This field is required" }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
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
          defaultValue={!custom_user ? "" : custom_user.displayName}
          control={control}
          rules={{
            required: "This field is required ",
            pattern: {
              value:
                /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u,
              message: "Invalid first name",
            },
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              disabled={provider_bool}
              className="w-full"
              label="Owner's name"
              value={value}
              onChange={onChange}
              error={!!error}
              helperText={error ? error.message : null}
            />
          )}
        />

        <div>
          <Controller
            name="username"
            defaultValue=""
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
                value: /^(?=.{6,30}$)(?!.*[._-]{2})[a-z][a-z0-9._-]*[a-z0-9]$/,
                message:
                  "Invalid username, must not start or end with a special character [@<*_->].",
              },
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
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
        <div className="space-y-1">
          <Controller
            name="bio"
            defaultValue=""
            control={control}
            rules={{
              maxLength: {
                value: 200,
                message: "Cannot exceed 200 characters.",
              },
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                value={value}
                error={!!error}
                inputProps={{
                  maxLength: 200,
                }}
                helperText={error ? error.message : null}
                onChange={onChange}
                label="Bio (Include your workdays and opening hours)."
                className="w-full"
                multiline
                rows={5}
              />
            )}
          />
          <Charactercounter
            control={control}
            number={200}
            defaultValue={""}
            name={"bio"}
          />
        </div>
        <Controller
          name="email"
          defaultValue={!custom_user ? "" : custom_user.email}
          control={control}
          rules={{
            required: "This field is required",
            pattern: {
              value:
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              message: "This is an invalid email",
            },
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              disabled={provider_bool}
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
        {provider_bool ? (
          <></>
        ) : (
          <>
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
          </>
        )}

        <button
          disabled={isLoading}
          type="submit"
          className="w-full disabled:opacity-25 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Create account
        </button>
      </form>
    </div>
  );
}

export default GymScreen;
