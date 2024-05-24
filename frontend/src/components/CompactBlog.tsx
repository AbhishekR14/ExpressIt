export default function CompactBlog(props: propsInterface) {
  return (
    <div className="border rounded-lg border-black m-2 p-2 hover:bg-slate-200">
      <div className="flex grid-cols-3 pt-2 ">
        <div className="pr-2 font-semibold text-sm cursor-default lg:text-base">
          {props.postCreator}
        </div>
        <div className="flex pr-2 text-slate-500 text-xs cursor-default lg:text-sm">
          |
        </div>
        <div className="flex pr-2 text-slate-600 items-center cursor-default text-xs lg:text-sm ">
          {props.postDate}
        </div>
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
  expandBlog: (e: any) => void;
}
