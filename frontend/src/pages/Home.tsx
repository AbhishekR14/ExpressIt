import CompactBlog from "../components/CompactBlog";
import { AppBar } from "../components/AppBar";
import React from "react";
import axios from "axios";
import { APIwebsite } from "../App";
import { useNavigate } from "react-router-dom";
import { DeleteBlogPopUp } from "../components/DeleteBlogPopUp";

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
  const [showDeletePopUp, setShowDeletePopUp] = React.useState(false);
  const [blogToDelete, setBlogToDelete] = React.useState<BlogPost | null>(null);
  const [showNoItemsMessage, setShowNoItemsMessage] = React.useState(false);

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
    if (authorId === user.userId) {
      return blogStatus ? "Unpublish" : "Publish";
    } else {
      return "";
    }
  }

  async function deleteBlog(blogId: string) {
    try {
      const res = await axios.delete(APIwebsite + "api/v1/blog", {
        headers: {
          authorization: localStorage.getItem("ExpressItAuthToken"),
        },
        data: {
          postId: blogId,
        },
      });
      if (res.status === 200) {
        setStatusChanged(statusChanged + 1);
      }
    } catch (e) {
      console.log({ error: e });
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

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (displayingBlogs.length === 0) {
        setShowNoItemsMessage(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [displayingBlogs]);

  return (
    <div className="min-h-screen bg-beige">
      <AppBar userName={user.userName} onClick={() => {}} />
      <div className="grid justify-center pt-3 lg:pt-9 ">
        <div className="flex justify-center">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className={`hidden lg:block px-4 py-2 text-sm font-medium text-gray-900 ${
                selectedOption === "Published" ? "bg-blue-200" : "bg-beige"
              } border border-gray-500 rounded-s-lg hover:bg-blue-200 hover:text-blue-700  focus:bg-blue-200`}
              onClick={() => {
                setSelectedOption("Published");
              }}
            >
              Published Blogs
            </button>
            <button
              type="button"
              className={`hidden lg:block px-4 py-2 text-sm font-medium text-gray-900 ${
                selectedOption === "Unpublished" ? "bg-blue-200" : "bg-beige"
              } border-t border-b border-gray-500 hover:bg-blue-200 hover:text-blue-700 focus:bg-blue-200 `}
              onClick={() => {
                setSelectedOption("Unpublished");
              }}
            >
              Your Unpublished Blogs
            </button>
            <button
              type="button"
              className="hidden lg:block px-4 py-2 text-sm font-medium text-gray-900 bg-beige border border-gray-500 rounded-e-lg hover:bg-blue-200 hover:text-blue-700  focus:bg-blue-200 "
              onClick={() => {
                navigate("/edit/newblog");
              }}
            >
              Create New Blog
            </button>
          </div>
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className={`lg:hidden px-4 py-2 text-sm font-medium text-gray-900 ${
                selectedOption === "Published" ? "bg-blue-200" : "bg-beige"
              } border border-gray-500 rounded-s-lg hover:bg-blue-200 hover:text-blue-700  focus:bg-blue-200`}
              onClick={() => {
                setSelectedOption("Published");
              }}
            >
              Published
            </button>
            <button
              type="button"
              className={`lg:hidden px-4 py-2 text-sm font-medium text-gray-900 ${
                selectedOption === "Unpublished" ? "bg-blue-200" : "bg-beige"
              } border-t border-b border-gray-500 hover:bg-blue-200 hover:text-blue-700 focus:bg-blue-200 `}
              onClick={() => {
                setSelectedOption("Unpublished");
              }}
            >
              Unpublished
            </button>
            <button
              type="button"
              className="lg:hidden px-4 py-2 text-sm font-medium text-gray-900 bg-beige border border-gray-500 rounded-e-lg hover:bg-blue-200 hover:text-blue-700  focus:bg-blue-200 "
              onClick={() => {
                navigate("/edit/newblog");
              }}
            >
              Create New Blog
            </button>
          </div>
        </div>
        <div className="w-screen max-w-5xl">
          {displayingBlogs.length === 0 && showNoItemsMessage ? (
            <div className="text-center pt-6">You don't have any Unpublished Blogs</div>
<div className="text-center py-2">Please create a new Blog!!</div>
          ) : (
            displayingBlogs.map((post, index) => (
              <CompactBlog
                key={index}
                postCreator={post.author.name}
                postDate={post.publishedDate}
                postTitle={post.title}
                postDescription={post.content}
                blogStatus={getBlogStatus(post.published, post.author.id)}
                expandBlog={() => {
                  {
                    navigate(`/blog/${post.id}`);
                  }
                }}
                editBlog={() => {
                  navigate(`/edit/${post.id}`);
                }}
                publishOrUnpublishBlog={() => {
                  async function sendPublishOrUnpublishBlog() {
                    if (getBlogStatus(post.published, post.author.id) !== "") {
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
                        if (res.status === 200) {
                          setStatusChanged(statusChanged + 1);
                        }
                      } catch (e) {
                        console.log({ error: e });
                      }
                    }
                  }
                  sendPublishOrUnpublishBlog();
                }}
                deleteBlog={() => {
                  setBlogToDelete(post);
                  setShowDeletePopUp(true);
                }}
              />
            ))
          )}
        </div>
      </div>
      <DeleteBlogPopUp
        show={showDeletePopUp}
        onClose={() => setShowDeletePopUp(false)}
        onDelete={() => {
          if (blogToDelete) {
            deleteBlog(blogToDelete.id);
          }
          setShowDeletePopUp(false);
        }}
      />
    </div>
  );
}
