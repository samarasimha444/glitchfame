import React from "react";

const messages = {
  DELETE_SEASON: {
    title: "Delete Season",
    message: "Are you sure you want to delete this season? This action cannot be undone.",
    confirmText: "Delete",
  },

  DELETE_PHOTOS: {
    title: "Delete Photos",
    message: "Are you sure you want to delete all photos?",
    confirmText: "Delete",
  },

  DELETE_FILES: {
    title: "Delete Files",
    message: "Are you sure you want to delete all files?",
    confirmText: "Delete",
  },
};

const FunctionModel = ({ type, onConfirm, onCancel }) => {
  const data = messages[type];

  if (!data) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">

      <div className="bg-white w-[360px] rounded-2xl shadow-xl p-6 text-center">

        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          {data.title}
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          {data.message}
        </p>

        <div className="flex gap-3 justify-center">

          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm"
          >
            {data.confirmText}
          </button>

        </div>
      </div>

    </div>
  );
};

export default FunctionModel;