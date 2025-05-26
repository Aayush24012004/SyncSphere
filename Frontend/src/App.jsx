import React from "react";
import { Navigate, Route, Routes } from "react-router";
import HomePage from "./routes/HomePage";
import SignupPage from "./routes/SignupPage";
import SigninPage from "./routes/SigninPage";
import NotificationsPage from "./routes/NotificationsPage";
import CallPage from "./routes/CallPage";
import ChatPage from "./routes/ChatPage";
import OnboardingPage from "./routes/OnboardingPage";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { axiosInstance } from "./lib/axios";
const App = () => {
  const {
    data: authData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/me");
      return res.data;
    },
    retry: false,
  });
  const authUser = authData?.user;
  return (
    <div className=" h-screen" data-theme="forest">
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/signin" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignupPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signin"
          element={!authUser ? <SigninPage /> : <Navigate to="/" />}
        />
        <Route
          path="/notification"
          element={authUser ? <NotificationsPage /> : <Navigate to="/signin" />}
        />
        <Route
          path="/call"
          element={authUser ? <CallPage /> : <Navigate to="/signin" />}
        />
        <Route
          path="/chat"
          element={authUser ? <ChatPage /> : <Navigate to="/signin" />}
        />
        <Route
          path="/onboarding"
          element={authUser ? <OnboardingPage /> : <Navigate to="/signin" />}
        />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
