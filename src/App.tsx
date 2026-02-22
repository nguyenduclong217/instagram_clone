import { Route, Routes } from "react-router-dom";

import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import EmailSignUp from "./pages/EmailSignUp";
import UserInfo from "./pages/UserInfo";
import MessagePage from "./pages/MessagePage";
import RequestsPage from "./pages/RequestsPage";
import HiddenPage from "./pages/HiddenPage";
import EditPage from "./pages/Setting/EditPage";
import SettingPage from "./layout/SettingPage";
import NotificationsPage from "./pages/Setting/NotificationsPage";
import AccountPrivacyPage from "./pages/Setting/AccountPrivacyPage";
import CloseFriendsPage from "./pages/Setting/CloseFriendsPage";
import BlockedAccountsPage from "./pages/Setting/BlockedAccountsPage";
import HideStory from "./pages/Setting/HideStory";
import MessagesAndStoryPage from "./pages/Setting/MessagesAndStoryPage";
import TagsPage from "./pages/Setting/TagsPage";
import CommentsPage from "./pages/Setting/CommentsPage";
import { Toaster } from "react-hot-toast";
import VerifyEmailNotice from "./pages/VerifyEmailNotice";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import ChangePasswordAfterLogin from "./pages/ChangePasswordAfterLogin";
import EditProfilePage from "./pages/EditProfilePage";

export default function App() {
  return (
    <div>
      <Toaster position="top-right" />
      <Routes>
        <Route element={<MainLayout />}>
          <Route element={<Home />} path="/" />
          <Route element={<Explore />} path="/explore" />
          <Route element={<UserInfo />} path="/users/:userId?" />
          <Route element={<MessagePage />} path="/messages" />
          <Route element={<MessagePage />} path="/direct/:conversationId" />
          <Route element={<RequestsPage />} path="/direct/requests/" />
          <Route element={<HiddenPage />} path="/direct/requests/hidden/" />
          <Route element={<EditProfilePage />} path="/edit-profile" />
          {/* <Route element={<EditProfilePage />} path="/accounts"> */}
          <Route path="/accounts" element={<SettingPage />}>
            <Route path="edit" element={<EditPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="account_privacy" element={<AccountPrivacyPage />} />
            <Route path="close_friends" element={<CloseFriendsPage />} />
            <Route path="blocked_accounts" element={<BlockedAccountsPage />} />
            <Route path="hide_story_and_live" element={<HideStory />} />
            <Route
              path="messages_and_story_replies"
              element={<MessagesAndStoryPage />}
            />
            <Route path="tags_and_mentions" element={<TagsPage />} />
            <Route path="comments" element={<CommentsPage />} />
          </Route>
        </Route>

        <Route element={<LoginPage />} path="/login"></Route>
        <Route element={<UserInfo />} path="/userinfo"></Route>
        <Route element={<ForgotPasswordPage />} path="/forgot-password"></Route>
        <Route
          element={<ChangePasswordAfterLogin />}
          path="/change-password"
        ></Route>
        <Route element={<EmailSignUp />} path="/accounts/emailsignup"></Route>
        <Route
          element={<ChangePasswordPage />}
          path="/reset-password/:token?"
        ></Route>
        {/* <Route element={<VerifyEmailNotice />} path="/verify-email"></Route> */}
        <Route
          element={<VerifyEmailNotice />}
          path="/verify-email/:token?"
        ></Route>
      </Routes>
    </div>
  );
}

// import { Route, Routes } from "react-router-dom";
// import { Toaster } from "react-hot-toast";

// import MainLayout from "./layout/MainLayout";
// import SettingPage from "./layout/SettingPage";

// import Home from "./pages/Home";
// import Explore from "./pages/Explore";
// import UserInfo from "./pages/UserInfo";
// import MessagePage from "./pages/MessagePage";
// import RequestsPage from "./pages/RequestsPage";
// import HiddenPage from "./pages/HiddenPage";
// import EditProfilePage from "./pages/EditProfilePage";

// // Setting pages
// import EditPage from "./pages/Setting/EditPage";
// import NotificationsPage from "./pages/Setting/NotificationsPage";
// import AccountPrivacyPage from "./pages/Setting/AccountPrivacyPage";
// import CloseFriendsPage from "./pages/Setting/CloseFriendsPage";
// import BlockedAccountsPage from "./pages/Setting/BlockedAccountsPage";
// import HideStory from "./pages/Setting/HideStory";
// import MessagesAndStoryPage from "./pages/Setting/MessagesAndStoryPage";
// import TagsPage from "./pages/Setting/TagsPage";
// import CommentsPage from "./pages/Setting/CommentsPage";

// // Public pages
// import LoginPage from "./pages/LoginPage";
// import ForgotPasswordPage from "./pages/ForgotPasswordPage";
// import EmailSignUp from "./pages/EmailSignUp";
// import VerifyEmailNotice from "./pages/VerifyEmailNotice";
// import ChangePasswordPage from "./pages/ChangePasswordPage";
// import ChangePasswordAfterLogin from "./pages/ChangePasswordAfterLogin";
// import ProtectedRoute from "./middlewares/ProtectRouter";

// export default function App() {
//   return (
//     <div>
//       <Toaster position="top-right" />

//       <Routes>
//         {/* ================= PUBLIC ROUTES ================= */}
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/forgot-password" element={<ForgotPasswordPage />} />
//         <Route path="/accounts/emailignup" element={<EmailSignUp />} />
//         <Route path="/verify-email/:token?" element={<VerifyEmailNotice />} />
//         <Route
//           path="/reset-password/:token?"
//           element={<ChangePasswordPage />}
//         />
//         <Route path="/change-password" element={<ChangePasswordAfterLogin />} />

//         {/* ================= PRIVATE ROUTES ================= */}
//         <Route element={<ProtectedRoute />}>
//           <Route element={<MainLayout />}>
//             <Route path="/" element={<Home />} />
//             <Route path="/explore" element={<Explore />} />
//             <Route path="/users/:userId?" element={<UserInfo />} />

//             {/* Messages */}
//             <Route path="/messages" element={<MessagePage />} />
//             <Route path="/direct/:conversationId" element={<MessagePage />} />
//             <Route path="/direct/requests" element={<RequestsPage />} />
//             <Route path="/direct/requests/hidden" element={<HiddenPage />} />

//             {/* Edit profile */}
//             <Route path="/edit-profile" element={<EditProfilePage />} />

//             {/* Settings */}
//             <Route path="/accounts" element={<SettingPage />}>
//               <Route path="edit" element={<EditPage />} />
//               <Route path="notifications" element={<NotificationsPage />} />
//               <Route path="account_privacy" element={<AccountPrivacyPage />} />
//               <Route path="close_friends" element={<CloseFriendsPage />} />
//               <Route
//                 path="blocked_accounts"
//                 element={<BlockedAccountsPage />}
//               />
//               <Route path="hide_story_and_live" element={<HideStory />} />
//               <Route
//                 path="messages_and_story_replies"
//                 element={<MessagesAndStoryPage />}
//               />
//               <Route path="tags_and_mentions" element={<TagsPage />} />
//               <Route path="comments" element={<CommentsPage />} />
//             </Route>
//           </Route>
//         </Route>
//       </Routes>
//     </div>
//   );
// }
