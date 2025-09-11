import React from "react";

function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/10">
      <div className="bg-white rounded-lg shadow-lg p-2 max-w-md w-full relative animate-fade-in">
        <button
          className="absolute top-0 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold cursor-pointer"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
