export default function ExpandedBlog(props: propsInterface) {
  return (
    <div className="m-10 font-sans">
      <h1 className="text-2xl font-bold lg:text-4xl">{props.postTitle}</h1>
      <p className="text-gray-600 text-sm lg:text-lg">
        Posted on {props.postDate}
      </p>
      <div className="flex items-center mt-4">
        <div className="flex mr-2 rounded-full bg-gray-300 w-10 h-10 justify-center ">
          <div className="flex flex-col justify-center h-full text-xl">
            {props.postCreator[0]?.toUpperCase() +
              props.postCreator[1]?.toUpperCase()}
          </div>
        </div>
        <div>
          <h3 className="text-lg lg:text-xl">{props.postCreator}</h3>
        </div>
      </div>
      <div className="mt-4 leading-loose lg:mt-6">
        {props.postDescription.split("\n").map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
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
