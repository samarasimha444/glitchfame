import { X } from "lucide-react";

const Modal = ({
  open,
  title,
  children,
  onClose,
  footer,
  size = "lg",
}) => {
  if (!open) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-3xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      
     
      <div
        className={`w-full ${sizes[size]} bg-[#1C1C1E] text-white rounded-2xl shadow-2xl border border-white/10`}
      >
       
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

       \
        <div className="px-6 py-5  max-h-[70vh] overflow-y-auto">
          {children}
        </div>

        {footer && (
          <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;