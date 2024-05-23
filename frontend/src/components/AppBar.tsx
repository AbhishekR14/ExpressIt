import Button from "./Button";
import { useNavigate } from "react-router-dom";
import expressItLogo from "../util/ExpressIt-logo.jpg";

export function AppBar(props: propsInterface) {
  const navigate = useNavigate();
  return (
    <div className="shadow h-14 flex justify-between">
      <div className="flex ml-4">
        <img
          src={expressItLogo}
          className="rounded-full h-12 w-12 flex justify-center mt-1 mr-2"
        />
        <div className="hidden md:flex flex-col justify-center h-full">
          ExpressIt
        </div>
      </div>
      <div className="flex">
        <div className="rounded-full h-12 w-12 bg-gray-200 flex justify-center mt-1 mr-2">
          <div className="flex flex-col justify-center h-full text-xl">
            {props.userName[0].toUpperCase() + props.userName[1].toUpperCase()}
          </div>
        </div>
        <div className="flex flex-col justify-center h-full mr-4">
          {props.userName}
        </div>
      </div>
      <div className="flex flex-col justify-center h-full mr-4 mt-1">
        <Button
          name="Log Out"
          onClick={() => {
            navigate("/signin");
            localStorage.removeItem("ExpressItAuthToken");
          }}
        />
      </div>
    </div>
  );
}

interface propsInterface {
  userName: string;
  onClick: (e: any) => void;
}