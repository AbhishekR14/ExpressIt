import LabelledInputBox from "../components/LabelledInputBox";
import Button from "../components/Button";
import SideQuote from "../components/SideQuote";
import { Link, useNavigate } from "react-router-dom";
import React from "react";
import axios from "axios";
import { APIwebsite } from "../App";

export default function Signin() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState("");
  const [signUpInputs, setSignUpInputs] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  async function signup() {
    try {
      setLoading("Verifing your credentials");
      const res = await axios.post(APIwebsite + "api/v1/user/signup", {
        name: signUpInputs.name,
        email: signUpInputs.email,
        password: signUpInputs.password,
      });
      if (res.status == 200) {
        localStorage.setItem("ExpressItAuthToken", "Bearer " + res.data.token);
        navigate("/home");
      } else {
        setLoading("Invaild Data. Try again!");
      }
    } catch (e) {
      setLoading("Invalid Data. Try again!");
    }
  }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <div className="grid items-center justify-center h-screen">
        <div>
          <div className="grid text-3xl font-bold justify-center pb-2">
            Sign up
          </div>
          <div className="grid text-l font-medium text-gray-500 justify-center pb-2">
            Enter your information to create an account
          </div>
          <LabelledInputBox
            type="text"
            placeholder="John"
            label="Name"
            onChange={(e) => {
              setSignUpInputs({
                ...signUpInputs,
                name: e.target.value,
              });
            }}
          />
          <LabelledInputBox
            type="text"
            placeholder="Email@website.com"
            label="Email"
            onChange={(e) => {
              setSignUpInputs({
                ...signUpInputs,
                email: e.target.value,
              });
            }}
          />
          <LabelledInputBox
            type="password"
            placeholder="Enter your password"
            label="Password"
            onChange={(e) => {
              setSignUpInputs({
                ...signUpInputs,
                password: e.target.value,
              });
            }}
          />
          <Button name="Sign Up" onClick={signup} />
          <div className="grid justify-center">{loading}</div>
          <div className="grid justify-center">
            <div>
              Already have an account?{" "}
              <Link to="/signin" className="underline">
                Sign in
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
