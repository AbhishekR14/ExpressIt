export default function Button(props: { name: string }) {
  return (
    <div className="py-2.5 w-full">
      <button className="text-white bg-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 w-full ">
        {props.name}
      </button>
    </div>
  );
}
