import CompactBlog from "../components/CompactBlog";
import { AppBar } from "../components/AppBar";
import React from "react";
import axios from "axios";
import { APIwebsite } from "../App";
import { useNavigate } from "react-router-dom";

interface BlogPost {
  id: string;
  author: {
    id: string;
    name: string;
  };
  postDate: string;
  title: string;
  content: string;
  publishedDate: string;
  published: boolean;
}

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = React.useState({ userId: "", userName: "" });
  const [publishedBlogs, setPublishedBlogs] = React.useState<BlogPost[]>([]);
  const [unpublishedBlogs, setUnpublishedBlogs] = React.useState<BlogPost[]>(
    []
  );
  const [displayingBlogs, setDisplayingBlogs] = React.useState<BlogPost[]>([]);
  const [selectedOption, setSelectedOption] = React.useState("Published");
  const [statusChanged, setStatusChanged] = React.useState(1);

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
  function getBlogStatus(blogStatus: boolean, authorId: string): string {
    if (authorId == user.userId) {
      return blogStatus ? "Unpublish" : "Publish";
    } else {
      return "";
    }
  }

  React.useEffect(() => {
    callHome();
  }, []);

  React.useEffect(() => {
    getPublishedBlogs();
    getUnpublishedBlogs();
  }, [statusChanged]);

  React.useEffect(() => {
    if (selectedOption === "Published") {
      setDisplayingBlogs(publishedBlogs);
    } else if (selectedOption === "Unpublished") {
      setDisplayingBlogs(unpublishedBlogs);
    }
  }, [selectedOption, publishedBlogs, unpublishedBlogs]);

  return (
    <div>
      <AppBar userName={user.userName} onClick={() => {}} />
      <div className="grid justify-center pt-3 lg:pt-9">
        <div className="flex lg:pl-9 ">
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
          <button
            className="px-1 hover:underline md:px-3"
            onClick={() => {
              navigate("/edit/newblog");
            }}
          >
            Create New Blog
          </button>
        </div>
        <div className="w-screen max-w-5xl">
          {displayingBlogs.map((post, index) => (
            <CompactBlog
              key={index}
              postCreator={post.author.name}
              postDate={post.publishedDate}
              postTitle={post.title}
              postDescription={post.content}
              blogStatus={getBlogStatus(post.published, post.author.id)}
              expandBlog={() => {
                if (post.published) {
                  navigate(`/blog/${post.id}`);
                } else {
                  navigate(`/edit/${post.id}`);
                }
              }}
              publishOrUnpublishBlog={() => {
                async function sendPublishOrUnpublishBlog() {
                  if (getBlogStatus(post.published, post.author.id) != "") {
                    try {
                      const res = await axios.put(
                        APIwebsite +
                          "api/v1/blog/" +
                          getBlogStatus(
                            post.published,
                            post.author.id
                          ).toLowerCase(),
                        { postId: post.id }, // This is the request body
                        {
                          headers: {
                            authorization:
                              localStorage.getItem("ExpressItAuthToken"),
                          },
                        }
                      );
                      if (res.status == 200) {
                        setStatusChanged(statusChanged + 1);
                      }
                    } catch (e) {
                      console.log({ error: e });
                    }
                  }
                }
                sendPublishOrUnpublishBlog();
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
