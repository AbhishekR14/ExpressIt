interface DeleteBlogPopUpProps {
  show: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export function DeleteBlogPopUp({
  show,
  onClose,
  onDelete,
}: DeleteBlogPopUpProps) {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl font-bold mb-4">Delete Blog</h2>
        <p className="mb-4">Are you sure you want to delete this blog post?</p>
        <div className="flex justify-end">
          <button
            className="mr-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
