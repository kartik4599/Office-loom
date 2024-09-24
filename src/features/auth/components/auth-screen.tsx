"use client";

import { useState } from "react";
import { SignInFlow } from "../types";
import SigninCard from "./signin-card";
import SignupCard from "./signup-card";

const Authscreen = () => {
  const [state, setState] = useState<SignInFlow>("signIn");

  return (
    <div className="h-full flex items-center justify-center bg-[#50767a]">
      <div className="md:h-auto md:w-[420px]">
        {state === "signIn" ? (
          <SigninCard changeState={setState.bind(null, "signUp")} />
        ) : (
          <SignupCard changeState={setState.bind(null, "signIn")} />
        )}
      </div>
    </div>
  );
};

export default Authscreen;
