import React, { useEffect } from "react";

const NewModel = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  message,
  id,
}) => {

  // 🔒 Freeze background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // cleanup (very important)
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(id);
    // ❗ optional: remove onClose from here if you want to wait for API success
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[9999]">
      
      <div className="bg-[#171A1F] w-[360px] rounded-2xl shadow-xl p-6 text-center">
        
        <h2 className="text-lg font-semibold text-gray-300 mb-2">
          {title}
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          {message}
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewModel;