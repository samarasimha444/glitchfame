import React, { useState, useEffect } from "react";

const DatePicker = ({ value, onChange, placeholder = "Select Date" }) => {
  const [open, setOpen] = useState(false);
  const [tempDate, setTempDate] = useState(value ? new Date(value) : new Date());

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleDone = () => {
    onChange(tempDate.toISOString());
    setOpen(false);
  };

  return (
    <>
     
      <input
        readOnly
        placeholder={placeholder}
        value={value ? new Date(value).toDateString() : ""}
        onClick={() => setOpen(true)}
        className="bg-[#1a202c] border text-gray-400 border-gray-700 rounded-lg px-4 py-3  w-full focus:border-white outline-none"
      />

    
      {open && (
        <div
          className="fixed inset-0 flex items-end justify-center bg-black/60 z-50"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full bg-[#1a1c23] rounded-t-2xl p-4 shadow-xl animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-white transition"
              >
                Cancel
              </button>
              <span className="text-[#9DE2E2] font-medium">
                {months[tempDate.getMonth()]} {tempDate.getDate()}, {tempDate.getFullYear()}
              </span>
              <button
                onClick={handleDone}
                className="text-[#9DE2E2] hover:opacity-80 transition"
              >
                Done
              </button>
            </div>

           
            <div className="flex justify-around text-center h-48 overflow-hidden">
              {/* Day */}
              <div className="flex-1 overflow-y-auto scrollbar-hide">
                {days.map((d) => (
                  <div
                    key={d}
                    onClick={() => setTempDate(new Date(tempDate.setDate(d)))}
                    className={`py-2 cursor-pointer transition ${
                      tempDate.getDate() === d ? "text-[#9DE2E2] text-lg font-semibold" : "text-gray-400"
                    }`}
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* Month */}
              <div className="flex-1 overflow-y-auto scrollbar-hide">
                {months.map((m, i) => (
                  <div
                    key={m}
                    onClick={() => setTempDate(new Date(tempDate.setMonth(i)))}
                    className={`py-2 cursor-pointer transition ${
                      tempDate.getMonth() === i ? "text-[#9DE2E2] text-lg font-semibold" : "text-gray-400"
                    }`}
                  >
                    {m}
                  </div>
                ))}
              </div>

              {/* Year */}
              <div className="flex-1 overflow-y-auto scrollbar-hide">
                {years.map((y) => (
                  <div
                    key={y}
                    onClick={() => setTempDate(new Date(tempDate.setFullYear(y)))}
                    className={`py-2 cursor-pointer transition ${
                      tempDate.getFullYear() === y ? "text-[#9DE2E2] text-lg font-semibold" : "text-gray-400"
                    }`}
                  >
                    {y}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .animate-slideUp { animation: slideUp 0.3s ease-out; }
          @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
        `}
      </style>
    </>
  );
};

export default DatePicker;