import CompactBlog from "../components/CompactBlog";
import { AppBar } from "../components/AppBar";
import React from "react";
import axios from "axios";
import { APIwebsite } from "../App";

interface BlogPost {
  authorId: string;
  postDate: string;
  title: string;
  content: string;
}

export default function Home() {
  const [user, setUser] = React.useState({ userId: "", userName: "" });
  const [publishedBlogs, setPublishedBlogs] = React.useState<BlogPost[]>([]);
  const [unpublishedBlogs, setUnpublishedBlogs] = React.useState<BlogPost[]>(
    []
  );
  const [displayingBlogs, setDisplayingBlogs] = React.useState<BlogPost[]>([]);
  const [selectedOption, setSelectedOption] = React.useState("Published");

  async function callHome() {
    const res = await axios.get(APIwebsite + "api/v1/home", {
      headers: {
        authorization: localStorage.getItem("ExpressItAuthToken"),
      },
    });
    if (res.status === 200) {
      setUser({ userId: res.data.userId, userName: res.data.userName });
    } else {
      alert("Please Sign In!");
    }
  }

  async function getPublishedBlogs() {
    const res = await axios.get(APIwebsite + "api/v1/blog/publish/bulk", {
      headers: {
        authorization: localStorage.getItem("ExpressItAuthToken"),
      },
    });
    if (res.status === 200) {
      setPublishedBlogs(res.data.Posts);
      setDisplayingBlogs(res.data.Posts);
    } else {
      alert("Please Sign In!");
    }
  }
  async function getUnpublishedBlogs() {
    const res = await axios.get(APIwebsite + "api/v1/blog/unpublish/bulk", {
      headers: {
        authorization: localStorage.getItem("ExpressItAuthToken"),
      },
    });
    if (res.status === 200) {
      setUnpublishedBlogs(res.data.Posts);
    } else {
      alert("Please Sign In!");
    }
  }

  React.useEffect(() => {
    callHome();
    getPublishedBlogs();
    getUnpublishedBlogs();
  }, []);

  React.useEffect(() => {
    if (selectedOption == "Published") {
      setDisplayingBlogs(publishedBlogs);
    } else if (selectedOption == "Unpublished") {
      setDisplayingBlogs(unpublishedBlogs);
    }
  }, [selectedOption]);

  return (
    <div>
      <AppBar userName={user.userName} onClick={() => {}} />
      <div className="grid justify-center mt-3 lg:mt-9">
        <div className="flex lg:ml-9">
          <button
            className={`pl-3 ${
              selectedOption == "Published" ? "underline" : ""
            } md:px-3 hover:underline`}
            onClick={() => {
              setSelectedOption("Published");
            }}
          >
            Published Posts
          </button>
          <button
            className={`px-1 ${
              selectedOption == "Unpublished" ? "underline" : ""
            } md:px-3 hover:underline`}
            onClick={() => {
              setSelectedOption("Unpublished");
            }}
          >
            Your Unpublished Posts
          </button>
          <button className="px-1 hover:underline md:px-3">
            Create New Blog
          </button>
        </div>
        <div className="w-screen max-w-5xl cursor-pointer">
          {displayingBlogs.map((post, index) => (
            <CompactBlog
              key={index}
              postCreator={post.authorId}
              postDate="date"
              postTitle={post.title}
              postDescription={post.content}
              onClick={() => {}}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
