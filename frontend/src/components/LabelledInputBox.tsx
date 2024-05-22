export default function LabelledInputBox(props: LabelledInputBoxType) {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-900">
        {props.label}
      </label>
      <input
        type={props.type}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder={props.placeholder}
      />
    </div>
  );
}

interface LabelledInputBoxType {
  label: string;
  type: string;
  placeholder: string;
}
