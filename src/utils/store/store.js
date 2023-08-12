import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";
import routineReducer from "./routine/routineSlice";
import userReducer from "./user/userSlice";
import userdocDataReducer from "./user/userdocDataSlice";
import postDataReducer from "./post/postDataSlice";
import getUserIdReducer from "./user/getUserIdSlice";
import messageReducer from "./inbox/inboxSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "userdoc", "routine", "postData", "userId", "message"],
};

const userIdPeristedReducer = persistReducer(persistConfig, getUserIdReducer);
const userPersistedReducer = persistReducer(persistConfig, userReducer);
const userdocdataPersistedReducer = persistReducer(
  persistConfig,
  userdocDataReducer
);
const routinePersistedReducer = persistReducer(persistConfig, routineReducer);
const postDataPersistedReducer = persistReducer(persistConfig, postDataReducer);
const messagePersistedReducer = persistReducer(persistConfig, messageReducer);

const store = configureStore({
  reducer: {
    user: userPersistedReducer,
    userdoc: userdocdataPersistedReducer,
    routine: routinePersistedReducer,
    postData: postDataPersistedReducer,
    userId: userIdPeristedReducer,
    message: messagePersistedReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: [thunk],
});

const persis_store = persistStore(store);

export default store;
export { persis_store };
