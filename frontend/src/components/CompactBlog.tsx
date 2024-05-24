export default function CompactBlog(props: propsInterface) {
  return (
    <div
      className="border rounded-lg border-black m-2 p-2 hover:bg-slate-200"
      onClick={props.onClick}
    >
      <div className="flex grid-cols-3 pt-2 ">
        <div className="pr-2 font-semibold text-sm lg:text-base">
          {props.postCreator}
        </div>
        <div className="flex pr-2 text-slate-500 text-xs lg:text-sm">|</div>
        <div className="flex pr-2 text-slate-600 items-center text-xs lg:text-sm ">
          {props.postDate}
        </div>
      </div>
      <div className="font-bold text-lg mb-1 lg:text-2xl line-clamp-2 lg:line-clamp-1">
        {props.postTitle}
      </div>
      <div className="text-base mb-3 line-clamp-3 lg:line-clamp-2">
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
  onClick: (e: any) => void;
}
