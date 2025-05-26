import React, { useState } from "react";

const SignupPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const handelSignup = (e) => {
    e.preventDefault();
  };
  return (
    <div
      className="h-screen flex item-center justify-center p-4  sm:p-6 ms:p-8 "
      data-theme="forest"
    >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col"></div>
      </div>
    </div>
  );
};

export default SignupPage;
