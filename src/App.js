import { Routes, Route } from "react-router";
import Login from "./Screens/Auth/Login";
import Signup from "./Screens/Auth/Signup/Signup";
import ForgotPassword from "./Screens/Auth/ForgotPassword";
import Home from "./Screens/Home/Home";
import InboxScreen from "./Screens/Inbox/InboxScreen";
import SettingsScreen from "./Screens/Settings/SettingsScreen";
import SearchScreen from "./Screens/Search/SearchScreen";
import ProfileScreen from "./Screens/Profile/ProfileScreen";
import ViewProfieScreen from "./Screens/Profile/ViewProfieScreen";
import PageNotFound from "./Screens/PageNotFound";
import ViewPostScreen from "./Screens/Home/Post/ViewPostScreen";
import AdditionalInfo from "./Screens/Auth/Signup/AdditionalInfo";
import ProtectedRoute from "./Router/ProtectedRouter";
import GymProtectedRouter from "./Router/GymProtectedRouter";
import UserDrawer from "./Screens/Components/UserDrawer";
import DashboardScreen from "./Screens/Dashboard/DashboardScreen";
import EditProfileScreen from "./Screens/Settings/EditProfileScreen";
import EditWorkoutRoutine from "./Screens/Home/Routine/EditWorkoutRoutine";
import AddWorkoutRoutine from "./Screens/Home/Routine/AddWorkoutRoutine";
// import AddWorkoutRoutine from "./Screens/Home/AddWorkoutRoutine";
// import EditWorkoutRoutine from "./Screens/Home/EditWorkoutRoutine";
import ViewWorkoutRoutine from "./Screens/Home/ViewWorkoutRoutine";
import { AuthContextProvider } from "./Context/AuthContext";
import WeightTrackerScreen from "./Screens/Settings/WeightTrackerScreen";
import NotificationsScreen from "./Screens/Notifications/NotificationsScreen";
import ViewFriendsScreen from "./Screens/Friends/ViewFriendsScreen";
import MemberScreen from "./Screens/Member/MemberScreen";
import ViewInstructorScreen from "./Screens/Instructors/ViewInstructorScreen";
import PrivacyScreen from "./Screens/Settings/Privacy/PrivacyScreen";
import ViewBlockedUsers from "./Screens/Home/Blocked/ViewBlockedUsers";

function App() {
  return (
    <div>
      <AuthContextProvider>
        <Routes>
          <Route path="*" element={<PageNotFound />} />
          <Route exact path="/" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="forgotpassword" element={<ForgotPassword />} />
          <Route path="additionalInfo" element={<AdditionalInfo />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<UserDrawer />}>
              <Route path="/home" element={<Home />} />
              <Route path="inbox" element={<InboxScreen />} />
              <Route path="settings" element={<SettingsScreen />} />
              <Route path="search" element={<SearchScreen />} />
              <Route path="profile" element={<ProfileScreen />} />
              <Route path="notifications" element={<NotificationsScreen />} />
              <Route element={<GymProtectedRouter />}>
                <Route path="dashboard" element={<DashboardScreen />} />
              </Route>
            </Route>
            <Route
              path="/settings/viewProfile/editProfile"
              element={<EditProfileScreen />}
            />
            <Route
              path="/settings/viewProfile"
              element={<ViewProfieScreen />}
            />
            <Route
              path="/settings/viewProfile/weightTracker"
              element={<WeightTrackerScreen />}
            />
            <Route path="/settings/viewPrivacy" element={<PrivacyScreen />} />
            <Route
              path="/settings/blockedUsers"
              element={<ViewBlockedUsers />}
            />

            <Route path="/profile/friends" element={<ViewFriendsScreen />} />
            <Route path="/profile/members" element={<MemberScreen />} />
            <Route
              path="/profile/instructors"
              element={<ViewInstructorScreen />}
            />

            {/* <Route path="/search/:id" element={<ProfileScreen />} /> */}

            {/* <Route
              path="/search/:id/viewFriends"
              element={<ViewFriendsScreen />}
            /> */}

            {/* when checking users global path rendered */}
            <Route path="/:id" element={<ProfileScreen />} />
            <Route path="/:id/friends" element={<ViewFriendsScreen />} />
            <Route path="/:id/members" element={<MemberScreen />} />
            <Route path="/:id/instructors" element={<ViewInstructorScreen />} />

            <Route path="/home/:id" element={<ViewPostScreen />} />

            <Route
              path="/home/editWorkoutRoutine"
              element={<EditWorkoutRoutine />}
            />

            <Route
              path="/home/addWorkoutRoutine"
              element={<AddWorkoutRoutine />}
            />
            <Route path="/home/viewRoutine" element={<ViewWorkoutRoutine />} />
          </Route>
        </Routes>
      </AuthContextProvider>
    </div>
  );
}

export default App;
