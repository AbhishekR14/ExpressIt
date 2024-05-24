import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Blog from "./pages/Blog";
import Home from "./pages/Home";

export const APIwebsite: string = "https://backend.aranjan0288.workers.dev/"; //http://localhost:8787/

function App() {
  return (
    <BrowserRouter basename={import.meta.env.DEV ? "/" : "/ExpressIt/"}>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/blog/:id" element={<Blog />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
