import React, { useRef, useState } from "react";
import { TextField } from "@mui/material";
import convertSize from "convert-size";
import Charactercounter from "../../Auth/Components/BioCharacterCounter";
import { sendReply } from "../../../Services/InboxFirebase/inbox";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../firebase";
import { updateDoc } from "firebase/firestore";
import { white_spaces_remover } from "../../../Services/whitespaceRegex";

export default function ReplyTextField({ InboxId, refetch, refetchCount }) {
  const custom_user = useSelector((state) => state.user.user);
  const [isLoading, setIsLoading] = useState(false);

  const [filesData, setFilesData] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);

  const [pickedFiles, setPickedFiles] = useState([]);

  const [fileLimit, setFilelimit] = useState(false);

  const navigate = useNavigate();

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

  const totalFileSize = () => {
    var i;
    var sum = 0;
    for (let i = 0; i < pickedFiles.length; i++) {
      sum += pickedFiles[i].size;
    }
    return sum;
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

  const onSubmit = async (data, e) => {
    e.preventDefault();

    const { title, body, reply } = getValues();

    setIsLoading(true);

    if (pickedFiles.length > 0) {
      if (checkLimit === true) {
        setFilelimit(true);
      } else {
        setIsLoading(true);

        const docRef = await sendReply({
          message: reply,
          attachments: [],
          senderId: custom_user.uid,
          inboxId: InboxId,
        });

        const uploadTasks = [];

        for (let i = 0; i < pickedFiles.length; i++) {
          uploadTasks.push(handleUpload(pickedFiles[i], docRef.id));
        }

        Promise.all(uploadTasks).then(async () => {
          try {
            await updateDoc(docRef, {
              attachments: filesData,
            });
          } catch (error) {}
        });
      }
    } else {
      setIsLoading(true);
      await sendReply({
        message: reply,
        attachments: [],
        inboxId: InboxId,
        senderId: custom_user.uid,
      });
      setIsLoading(false);
      navigate(-1);
    }
  };

  return (
    <div className="w-full border shadow-sm rounded-lg p-4">
      <div className="flex flex-col">
        <form className="w-full space-y-2">
          <div className="space-y-2">
            <Controller
              control={control}
              defaultValue=""
              name="reply"
              rules={{
                maxLength: {
                  value: 2000,
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
                    label="Send a reply"
                    inputProps={{
                      maxLength: 2000,
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
              control={control}
              defaultValue={""}
              name={"reply"}
              number={2000}
            />
          </div>
        </form>
        {}
      </div>
    </div>
  );
}
