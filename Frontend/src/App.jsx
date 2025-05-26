import React from "react";
import { Route, Routes } from "react-router";
import HomePage from "./routes/HomePage";
import SignupPage from "./routes/SignupPage";
import SigninPage from "./routes/SigninPage";
import NotificationsPage from "./routes/NotificationsPage";
import CallPage from "./routes/CallPage";
import ChatPage from "./routes/ChatPage";
import OnboardingPage from "./routes/OnboardingPage";
import { Toaster } from "react-hot-toast";
const App = () => {
  return (
    <div className=" h-screen" data-theme="forest">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/notification" element={<NotificationsPage />} />
        <Route path="/call" element={<CallPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
