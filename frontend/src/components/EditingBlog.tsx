import axios from "axios";
import React, { ChangeEvent } from "react";
import { APIwebsite } from "../App";

export default function EditingBlog(props: propsInterface) {
  const [blog, setBlog] = React.useState({
    title: "",
    content: "",
  });
  const [loading, setLoading] = React.useState("");

  React.useEffect(() => {
    if (props.title && props.content) {
      setBlog({
        title: props.title,
        content: props.content,
      });
    }
  }, [props.title, props.content]);

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setBlog((prevData) => {
      return {
        ...prevData,
        [event.target.name]: event.target.value,
      };
    });
  }

  async function sendNewBlog() {
    try {
      const res = await axios.post(
        APIwebsite + "api/v1/blog",
        {
          title: blog.title,
          content: blog.content,
        },
        {
          headers: {
            authorization: localStorage.getItem("ExpressItAuthToken"),
          },
        }
      );
      console.log(res);
      if (res.data.message === "Post created") {
        setLoading("Blog Created!!");
        setTimeout(() => {
          setLoading("");
        }, 3000);
      }
    } catch (e) {
      console.log(e);
      setLoading("Error while saving the Blog");
    }
  }

  async function sendEditBlog() {
    try {
      const res = await axios.put(
        APIwebsite + "api/v1/blog",
        {
          title: blog.title,
          content: blog.content,
          postId: props.blogid,
        },
        {
          headers: {
            authorization: localStorage.getItem("ExpressItAuthToken"),
          },
        }
      );
      console.log(res);
      if (res.data.message === "Post updated") {
        setLoading("Blog Saved!!");
        setTimeout(() => {
          setLoading("");
        }, 2000);
      }
    } catch (e) {
      console.log(e);
      setLoading("Error while saving the Blog");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 flex-grow p-3 dark:bg-slate-400">
      <div className="w-full max-w-2xl p-6 bg-white shadow-lg rounded-lg">
        <div className="mb-4">
          <input
            type="text"
            id="title"
            className="block w-full p-4 text-gray-900 border border-gray-300 rounded-md bg-gray-50 text-2xl font-bold focus:ring-blue-500 focus:border-blue-500 placeholder:font-normal placeholder:text-opacity-70 placeholder:text-gray-600"
            placeholder="Enter Title"
            name="title"
            defaultValue={props.title}
            onChange={handleChange}
          />
        </div>
        <div>
          <textarea
            id="content"
            rows={10}
            className="block w-full p-4 border border-gray-300 rounded-md bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 placeholder:font-normal placeholder:text-opacity-70 placeholder:text-gray-600"
            placeholder="Tell your story..."
            defaultValue={props.content}
            name="content"
            onChange={handleChange}
          />
        </div>
        <div className="flex pt-2 justify-center">{loading}</div>
        <button
          className="pt-6 w-full px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          onClick={async () => {
            setLoading("Saving the blog...");
            if (blog.title === "" || blog.content === "") {
              setLoading("Title or Contents of blog cannot be empty");
              setTimeout(() => {
                setLoading("");
              }, 7000);
            } else {
              if (props.blogid === "newblog") {
                sendNewBlog();
              } else {
                sendEditBlog();
              }
            }
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

interface propsInterface {
  title: string;
  content: string;
  blogid: string | undefined;
}
