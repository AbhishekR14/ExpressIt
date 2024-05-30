import React from "react";
import axios from "axios";
import { APIwebsite } from "../App";
import { useNavigate, useParams } from "react-router-dom";
import ExpandedBlog from "../components/ExpandedBlog";
import { EmptyAppBar } from "../components/AppBar";

interface BlogPost {
  id: string;
  author: {
    name: string;
  };
  postDate: string;
  title: string;
  content: string;
  publishedDate: string;
  authorId: string;
}

export default function Unpublished() {
  const navigate = useNavigate();
  const { id } = useParams(); // Accessing the id parameter from the URL
  const [blog, setBlog] = React.useState<BlogPost | null>(null);
  const [validUser, setValidUser] = React.useState(false);

  async function getBlog() {
    try {
      const res = await axios.get(APIwebsite + "api/v1/blog/post/" + id, {
        headers: {
          authorization: localStorage.getItem("ExpressItAuthToken"),
        },
      });
      setBlog(res.data.Post);
    } catch (e) {
      console.log(e);
    }
  }

  async function callHome(blog: BlogPost) {
    try {
      const res = await axios.get(APIwebsite + "api/v1/home", {
        headers: {
          authorization: localStorage.getItem("ExpressItAuthToken"),
        },
      });
      if (res.status === 200 && res.data.userId === blog.authorId) {
        setValidUser(true);
      } else {
        alert("Blog is not published");
      }
    } catch (e) {
      alert("Blog is not published");
    }
  }

  React.useEffect(() => {
    getBlog();
  }, []);

  React.useEffect(() => {
    if (blog) {
      callHome(blog);
    }
  }, [blog]);

  if (!blog) {
    return <div></div>;
  }

  if (validUser) {
    return (
      <>
        <EmptyAppBar
          color="slate-200"
          onClick={() => {
            navigate("/home");
          }}
        />
        <div className="grid justify-center mt-4 lg:mt-12">
          <div className="w-screen max-w-5xl">
            <ExpandedBlog
              postCreator={blog.author.name}
              postDate={blog.publishedDate}
              postTitle={blog.title}
              postDescription={blog.content}
              expandBlog={() => {}}
            />
          </div>
        </div>
      </>
    );
  } else {
    return null;
  }
}
