import { useNavigate, useParams } from "react-router-dom";
import { EmptyAppBar } from "../components/AppBar";
import EditingBlog from "../components/EditingBlog";
import React from "react";
import axios from "axios";
import { APIwebsite } from "../App";

interface BlogPost {
  id: string;
  author: {
    name: string;
  };
  postDate: string;
  title: string;
  content: string;
  publishedDate: string;
}

export default function EditBlog() {
  const navigate = useNavigate();
  const { blogid } = useParams();
  const [blog, setBlog] = React.useState<BlogPost>({
    id: "",
    author: { name: "" },
    postDate: "",
    title: "",
    content: "",
    publishedDate: "",
  });

  React.useEffect(() => {
    if (blogid != "newblog") {
      getBlog();
    }
  }, []);

  async function getBlog() {
    try {
      const res = await axios.get(APIwebsite + "api/v1/blog/post/" + blogid, {
        headers: {
          authorization: localStorage.getItem("ExpressItAuthToken"),
        },
      });
      setBlog(res.data.Post);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <EmptyAppBar
        color="white"
        onClick={() => {
          navigate("/home");
        }}
      />
      <EditingBlog
        title={blogid === "newblog" ? "" : blog.title}
        content={blogid === "newblog" ? "" : blog.content}
        blogid={blogid}
      />
    </div>
  );
}
