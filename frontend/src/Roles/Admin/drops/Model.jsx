import React from "react";

const Modal = ({ type, onClose, onConfirm }) => {
  if (!type) return null; 

  return (
    
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
      
     
      <div className="bg-[#1C1C1E] text-white w-[90%] max-w-md rounded-2xl shadow-2xl p-6 animate-fadeIn">
        
        
        <h2 className="text-xl font-semibold mb-3">
          {type === "reset" && "Reset Season"}
        </h2>

        
        <p className="text-sm text-gray-300 mb-6">
          {type === "reset" &&
            "Are you sure you want to reset the season? This action cannot be undone."}
        </p>

     
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 transition"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;