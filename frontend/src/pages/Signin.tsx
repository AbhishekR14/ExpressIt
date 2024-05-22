import LabelledInputBox from "../components/LabelledInputBox";
import Button from "../components/Button";
import SideQuote from "../components/SideQuote";
import { Link } from "react-router-dom";
import React from "react";

export default function Signin() {
  const [signInInputs, setSignInInputs] = React.useState({
    email: "",
    password: "",
  });
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <div className="grid items-center justify-center h-screen">
        <div>
          <div className="grid text-3xl font-bold justify-center pb-2">
            Sign in
          </div>
          <div className="grid text-l font-medium text-gray-500 justify-center pb-2">
            Enter your credentials to access your account
          </div>
          <LabelledInputBox
            type="text"
            placeholder="Email@website.com"
            label="Email"
            onChange={(e) => {
              setSignInInputs({
                ...signInInputs,
                email: e.target.value,
              });
            }}
          />
          <LabelledInputBox
            type="password"
            placeholder="Enter your password"
            label="Password"
            onChange={(e) => {
              setSignInInputs({
                ...signInInputs,
                password: e.target.value,
              });
            }}
          />
          <Button name="Sign In" />
          <div className="hidden justify-center">
            <div>
              Already signed in before? Try{" "}
              <Link to="/dashboard" className="underline">
                One Click Signin
              </Link>
            </div>
          </div>
          <div className="grid justify-center">
            <div>
              Don't have an account?{" "}
              <Link to="/signup" className="underline">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:block">
        <SideQuote />
      </div>
    </div>
  );
}