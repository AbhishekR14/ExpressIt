export default function CompactBlog(props: propsInterface) {
  return (
    <div className="border rounded-lg border-black m-2 p-2 hover:bg-slate-200">
      <div className="flex grid-cols-4 pt-2 ">
        <div className="hidden pr-2 font-semibold text-sm cursor-default lg:text-base lg:block">
          {props.postCreator.slice(0, 30)}
        </div>
        <div className="pr-2 font-semibold text-sm cursor-default lg:text-base lg:hidden">
          {props.postCreator.slice(0, 10).split(" ")[0]}
        </div>
        <div className="flex pr-2 text-slate-500 text-xs cursor-default lg:text-sm">
          |
        </div>
        <div className="flex pr-2 text-slate-600 items-center cursor-default text-xs lg:text-sm ">
          {props.postDate}
        </div>
        <div className="flex-grow"></div>
        {props.blogStatus == "Publish" ? (
          <>
            <button
              type="button"
              className="lg:hidden px-2 text-sm font-medium text-gray-900 bg-beige
              border border-gray-500 rounded-s-lg hover:bg-blue-200 hover:text-blue-700  focus:bg-blue-200"
              onClick={props.editBlog}
            >
              Edit
            </button>
            <button
              type="button"
              className="lg:hidden px-2 text-sm font-medium text-gray-900 bg-beige border border-gray-500 hover:bg-blue-200 hover:text-blue-700  focus:bg-blue-200"
              onClick={props.deleteBlog}
            >
              Delete
            </button>
            <button
              type="button"
              className="hidden lg:block px-4 text-sm font-medium text-gray-900 bg-beige
              border border-gray-500 rounded-s-lg hover:bg-blue-200 hover:text-blue-700  focus:bg-blue-200`"
              onClick={props.editBlog}
            >
              Edit Blog
            </button>
            <button
              type="button"
              className="hidden lg:block px-2 text-sm font-medium text-gray-900 bg-beige border border-gray-500 hover:bg-blue-200 hover:text-blue-700  focus:bg-blue-200"
              onClick={props.deleteBlog}
            >
              Delete Blog
            </button>
          </>
        ) : (
          ""
        )}
        {props.blogStatus != "" ? (
          <>
            <button
              type="button"
              className={` px-2 text-sm font-medium text-gray-900 bg-beige border border-gray-500 ${
                props.blogStatus === "Unpublish" ? "rounded-md" : "rounded-e-lg"
              } hover:bg-blue-200 hover:text-blue-700  focus:bg-blue-200`}
              onClick={props.publishOrUnpublishBlog}
            >
              {props.blogStatus} Blog
            </button>
          </>
        ) : (
          ""
        )}
      </div>
      <div
        className="font-bold text-lg mb-1 lg:text-2xl cursor-pointer line-clamp-2 lg:line-clamp-1"
        onClick={props.expandBlog}
      >
        {props.postTitle}
      </div>
      <div
        className="text-base mb-3 line-clamp-3 cursor-pointer lg:line-clamp-2"
        onClick={props.expandBlog}
      >
        {props.postDescription}
      </div>
    </div>
  );
}

interface propsInterface {
  postCreator: string;
  postDate: string;
  postTitle: string;
  postDescription: string;
  blogStatus?: string;
  expandBlog: (e: any) => void;
  publishOrUnpublishBlog: (e: any) => void;
  deleteBlog: (e: any) => void;
  editBlog: (e: any) => void;
}
