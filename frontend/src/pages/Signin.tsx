import LabelledInputBox from "../components/LabelledInputBox";
import Button from "../components/Button";
import SideQuote from "../components/SideQuote";
import { Link, useNavigate } from "react-router-dom";
import React from "react";
import axios from "axios";
import { APIwebsite } from "../App";
import Spinner from "../components/Spinner";

export default function Signin() {
  const navigate = useNavigate();
  const [signInInputs, setSignInInputs] = React.useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = React.useState("");
  const [isExpressItAuthToken, setIsExpressItAuthToken] = React.useState(false);

  async function signin() {
    try {
      setLoading("Verifing your credentials");
      const res = await axios.post(APIwebsite + "api/v1/user/signin", {
        email: signInInputs.email,
        password: signInInputs.password,
      });
      if (res.status == 200) {
        localStorage.setItem("ExpressItAuthToken", "Bearer " + res.data.token);
        navigate("/home");
      } else {
        setLoading("Invalid credentials. Try again!");
      }
    } catch (e) {
      setLoading("Invalid credentials. Try again!");
    }
  }
  async function callHome() {
    try {
      const res = await axios.get(APIwebsite + "api/v1/home", {
        headers: {
          authorization: localStorage.getItem("ExpressItAuthToken"),
        },
      });
      if (res.status == 200) {
        navigate("/home");
      }
    } catch (e) {}
  }
  React.useEffect(() => {
    const token = localStorage.getItem("ExpressItAuthToken");
    if (token != null) {
      setIsExpressItAuthToken(true);
      callHome();
    }
  }, []);

  if (isExpressItAuthToken) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
        <div className="px-2">Signing you in</div>
      </div>
    );
  } else {
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
            <Button name="Sign In" onClick={signin} />
            <div className="grid justify-center">{loading}</div>
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
}
