import React, { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import checkLimit from "../../Services/filesizeChecker";
// import { sendMessage } from "../../Services/InboxFirebase/inbox";
import { TextField } from "@mui/material";
import { white_spaces_remover } from "../../Services/whitespaceRegex";
import { InputAdornment } from "@mui/material";
import convertSize from "convert-size";
import Charactercounter from "../Auth/Components/BioCharacterCounter";
import { doesUserNameExist } from "../../Services/firebase";
import { Snackbar } from "@mui/material";
import { sendMessage } from "../../Services/InboxFirebase/inbox";
import MuiAlert from "@mui/material/Alert";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { checkifFriendOrMember } from "../../Services/firebase";
import { checkIfInstructor } from "../../Services/firebase";
import { checkIfUserisBlocked } from "../../Services/firebase";
import { db, storage } from "../../firebase";
import { useSelector } from "react-redux";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function ComposeScreen() {
  const imageRef = useRef();
  const addMoreRef = useRef();
  const [isOpen, setIsOpen] = useState(false);

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

  const custom_user = useSelector((state) => state.user.user);
  const userdoc = useSelector((state) => state.userdoc.userdoc);

  const closeSnackbar = () => {
    setState({ ...state, open: false });
  };

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [filesData, setFilesData] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);

  const [pickedFiles, setPickedFiles] = useState([]);

  const [fileLimit, setFilelimit] = useState(false);

  const [openError, setOpenError] = useState({ message: "", status: false });

  const { handleSubmit, getValues, control } = useForm();

  const handleFileSize = (fileSize) => {
    return convertSize(fileSize, { accuracy: 0 });
  };

  const addMoreFiles = (event) => {
    const files = Array.from(event.target.files);
    console.log(files);
    files.forEach((item) => {
      pickedFiles.push(item);
    });
    console.log(pickedFiles);
    setPickedFiles([...pickedFiles]);
  };

  const deleteFiles = (item) => {
    let index = pickedFiles.indexOf(item);
    if (index !== -1) {
      pickedFiles.splice(index, 1);
      console.log(pickedFiles);
      setPickedFiles([...pickedFiles]);
    }
  };

  const checkLimit = () => {
    const totalSize = totalFileSize();
    const sizeInMB = totalSize / (1024 * 1024);
    if (sizeInMB > 20) {
      // The file Limit has been exceeded
      return true;
    }
    // The file Limit has not been exceeded
    return false;
  };

  const handleChange = (event) => {
    const files = Array.from(event.target.files);
    console.log("files", files);
    files.forEach((item) => {
      pickedFiles.push(item);
    });
    setPickedFiles([...pickedFiles]);
  };

  const totalFileSize = () => {
    var i;
    var sum = 0;
    for (let i = 0; i < pickedFiles.length; i++) {
      sum += pickedFiles[i].size;
    }
    return sum;
  };

  const handleUpload = async (file, id) => {
    const fileName = file.name;
    const fileSize = file.size;

    const storageRef = ref(
      storage,
      `inbox/${id}/pictures/${Date.now()}${fileName}`
    );
    const uploadImage = uploadBytes(storageRef, file);
    await uploadImage.then(async (snapshot) => {
      await getDownloadURL(snapshot.ref).then((url) => {
        const data = {
          fileName,
          fileSize,
          url,
        };
        imageUrls.push(url);
        filesData.push(data);
      });
    });
    setFilesData([...filesData]);
  };

  const sendMessageFunc = async ({
    recieverData,
    usernameExists,
    title,
    body,
  }) => {
    if (pickedFiles.length > 0) {
      // Check if user is blocked
      // check the inbox privacy status of this user

      if (checkLimit === true) {
        setFilelimit(true);
      } else {
        setIsLoading(true);

        const collectionRef = collection(db, "inbox");

        const docRef = await addDoc(collectionRef, {
          title,
          body,
          // attachments,
          senderId: custom_user.uid,
          recieverId: recieverData[0].docId,
          ts: serverTimestamp(),
          users: [custom_user.uid, recieverData[0].docId],
        });

        // const docRef = await sendMessage({
        //   title,
        //   body,
        //   recieverId: recieverId[0],
        //   senderId: custom_user.uid,
        // });

        const uploadTasks = [];

        for (let i = 0; i < pickedFiles.length; i++) {
          uploadTasks.push(handleUpload(pickedFiles[i], docRef.id));
        }

        console.log(docRef.id);
        console.log("uploadTasks:", uploadTasks);
        console.log("urls:", imageUrls);
        console.log("array", ["HelloWorld"]);
        Promise.all(uploadTasks).then(async () => {
          try {
            console.log("filesDatalength:", filesData.length);
            console.log("filesData:", filesData);
            await updateDoc(docRef, {
              // attachments: filesData,
              attachments: filesData,
            }).then(() => {
              setIsLoading(false);
              navigate(-1);
            });
          } catch (error) {
            console.log(error);
          }
        });
      }
    } else {
      const recieverId = usernameExists.data.map((data, index) => data.docId);
      setIsLoading(true);

      const docRef = await sendMessage({
        title,
        body,
        recieverId: recieverId[0],
        senderId: custom_user.uid,
      });
      const inboxRef = doc(db, "inbox", docRef.id);
      await updateDoc(inboxRef, {
        attachments: [],
      });
      setIsLoading(false);
      navigate(-1);
    }
  };

  const onSubmit = async (data, e) => {
    e.preventDefault();
    setIsLoading(true);

    const { title, body, username } = getValues();
    const usernameExists = await doesUserNameExist(username);

    if (usernameExists.exist === true) {
      const recieverData = usernameExists.data.map((data, index) => data);

      if (recieverData[0].docId === custom_user.uid) {
        setOpenError({
          message: "You cannot send a message to yourself.",
          status: true,
        });
        setIsLoading(false);
      } else {
        const blocked = await checkIfUserisBlocked(
          recieverData[0].docId,
          custom_user.uid
        );
        if (blocked) {
          setOpenError({
            status: true,
            message:
              "You cannot send a message to this user because you are on this user's blocked list.",
          });
          setIsLoading(false);
        }
        if (
          recieverData[0].inboxPrivacyStatus === "Friends only" ||
          recieverData[0].inboxPrivacyStatus ===
            "Gym Instructors and Members only"
        ) {
          if (recieverData[0].usertype === "Gym") {
            if (userdoc.usertype === "Instructor") {
              const isInstructor = await checkIfInstructor(
                recieverData[0].docId,
                custom_user.uid
              );
              if (isInstructor) {
                // then send message
                await sendMessageFunc({
                  title,
                  body,
                  recieverData,
                  usernameExists,
                });
              } else {
                setOpenError({
                  status: true,
                  message:
                    "Only employed gym instructors of this can send messages to this user",
                });
                setIsLoading(false);
              }
            } else {
              // if user is "User", they have to be a member to send a message.
              const isMember = await checkifFriendOrMember(
                recieverData[0].docId,
                custom_user.uid,
                "Gym"
              );
              if (isMember) {
                // then send message
                await sendMessageFunc({
                  title,
                  body,
                  recieverData,
                  usernameExists,
                });
              } else {
                setOpenError({
                  status: true,
                  message:
                    "Only members of this gym can send messages to this user",
                });
                setIsLoading(false);
              }
            }
          } else {
            const isFriend = await checkifFriendOrMember(
              recieverData[0].docId,
              custom_user.uid,
              "User"
            );
            if (isFriend) {
              // then send message
              await sendMessageFunc({
                title,
                body,
                recieverData,
                usernameExists,
              });
            } else {
              setOpenError({
                status: true,
                message:
                  "Message inbox accessible only to users on their friends list.",
              });
              setIsLoading(false);
            }
          }
        } else if (recieverData[0].inboxPrivacyStatus === "Private") {
          setOpenError({
            status: true,
            message: "This users inbox is privated.",
          });
          setIsLoading(false);
        } else if (recieverData[0].inboxPrivacyStatus === "Public") {
          // then send message
          await sendMessageFunc({
            title,
            body,
            recieverData,
            usernameExists,
          });
        }
      }
    } else {
      // show prompt indicating that the user does not exist.
      setOpenError({ status: true, message: "This username does not exist." });
      setIsLoading(false);
    }
  };

  return (
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
              Compose message
            </span>
          </div>
        </div>
      </nav>
      <div className="flex flex-col items-center justify-center">
        <form
          className="w-full max-w-xl px-5 space-y-5 mt-10"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <Controller
              control={control}
              defaultValue=""
              name="title"
              rules={{
                maxLength: {
                  value: 50,
                  message: "Cannot exceed 50 characters",
                },
                required: "This field is required",
                pattern: {
                  value: white_spaces_remover,
                  message: "Remove all white spaces.",
                },
              }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <TextField
                    margin="normal"
                    fullWidth
                    label="Title"
                    inputProps={{
                      maxLength: 50,
                    }}
                    onChange={onChange}
                    value={value}
                    error={!!error}
                    helperText={error ? error.message : null}
                    autoFocus
                  />
                </>
              )}
            />
            <Charactercounter
              defaultValue={""}
              name={"title"}
              number={50}
              control={control}
            />
          </div>
          <Controller
            control={control}
            defaultValue=""
            name="username"
            rules={{
              required: "This field is required",
              pattern: {
                value: white_spaces_remover,
                message: "Remove all white spaces.",
              },
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <TextField
                  margin="normal"
                  fullWidth
                  label="Enter username"
                  onChange={onChange}
                  value={value}
                  error={!!error}
                  helperText={error ? error.message : null}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">To:</InputAdornment>
                    ),
                  }}
                />
              </>
            )}
          />
          {openError.status && (
            <div className="bg-red-100 mt-2 w-full text-red-800 font-medium text-md px-2.5 py-0.5 rounded border border-red-400">
              {openError.message}
            </div>
          )}
          <div className="space-y-2">
            <Controller
              name="body"
              defaultValue=""
              control={control}
              rules={{
                required: "This field is required",
                maxLength: {
                  value: 2000,
                  message: "Cannot exceed 2,000 characters",
                },
                pattern: {
                  value: white_spaces_remover,
                  message: "Remove all white spaces",
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
                    maxLength: 2000,
                  }}
                  helperText={error ? error.message : null}
                  onChange={onChange}
                  label="Body"
                  className="w-full"
                  multiline
                  rows={15}
                />
              )}
            />
            <Charactercounter
              defaultValue={""}
              name={"body"}
              control={control}
              number={2000}
            />
          </div>
          {pickedFiles.length === 0 ? (
            <div>
              <label className="mt-3 justify-center w-full items-center flex py-2 pr-4 pl-3 text-white hover:bg-blue-900 bg-blue-700 rounded-lg hover:cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="mr-2 -ml-1 w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                Add attachments
                <input
                  ref={imageRef}
                  disabled={isLoading}
                  onChange={handleChange}
                  hidden
                  multiple
                  type="file"
                />
              </label>
            </div>
          ) : (
            <div className="flex border-solid border-2 border-neutral-200 flex-col rounded-md  bg-white p-4 shadow-lg">
              <div className="text-lg mb-2 font-semibold text-slate-700">
                Attachments
              </div>
              {pickedFiles.map((file, index) => {
                const fileSize = handleFileSize(file.size);
                return (
                  <div
                    key={index}
                    className="flex mb-2 justify-between rounded-md border p-4 "
                  >
                    <div className="flex justify-between truncate">
                      <div className="flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
                          />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <div
                          // style={{
                          //   overflow: "hidden",
                          //   textOverflow: "ellipsis",
                          //   whiteSpace: "nowrap",
                          // }}
                          className="text-sm text-ellipsis overflow-hidden  font-semibold"
                        >
                          {file.name}
                        </div>
                        <div className="text-sm  text-slate-500">
                          {fileSize}
                        </div>
                      </div>
                    </div>
                    <button onClick={() => deleteFiles(file)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="fill-red-500 w-6 h-6"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                );
              })}
              {
                <div
                  className={
                    checkLimit() === true
                      ? "text-red-600 font-semibold text-lg"
                      : "text-green-600 font-semibold text-lg"
                  }
                >
                  {pickedFiles.length === 0 ? null : (
                    <div>
                      {convertSize(totalFileSize(), { accuracy: 1 })} / 20MB
                    </div>
                  )}
                </div>
              }
              <label className="mt-3 hover:cursor-pointer disabled:opacity-25 w-full justify-center items-center flex py-2 pr-4 pl-3 text-white hover:bg-blue-900 bg-blue-700 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="mr-2 -ml-1 w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                Add attachments
                <input
                  ref={addMoreRef}
                  disabled={isLoading}
                  multiple
                  onChange={addMoreFiles}
                  hidden
                  className="disabled:opacity-25"
                  type="file"
                />
              </label>
            </div>
          )}
          {fileLimit && (
            <Alert sx={{ mt: 2 }} severity="error" variant="outlined">
              You have exceeded the file limit
            </Alert>
          )}
          <button
            disabled={isLoading}
            type="submit"
            className="flex w-full justify-center items-center mt-2 py-2 pr-4 pl-3 text-white hover:bg-blue-900 bg-blue-700 rounded-lg disabled:opacity-25 "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
            Done
          </button>
        </form>
      </div>
      <div className="mb-10" />
    </div>
  );
}
