import React, { useState } from "react";
import Modal from "./Model";
import SeasonForm from "./SeasonForm";


const AdminCard = ({ title,paragraph, className, type, cardsInfo, data }) => {
  console.log(cardsInfo);
  console.log(type)

  const [open, setOpen] = useState(false);

  return (
    <div className={`flex flex-col w-full  py-4 ${className}`}>
      
          <Modal
            className="w-full "
            open={open}
            onClose={() => setOpen(false)}
            title="Create Season"
          >
            <SeasonForm />
          </Modal>
      

      <section className="flex w-full  justify-between items-start ">
        <h3 className="flex flex-col font-semibold text-3xl">
          {title}
          <p className="text-[13px] max-w-xl text-gray-300">
            {paragraph}
          </p>
        </h3>

        {type === "home" && (
          <button  onClick={() => setOpen(!open)}
          className="bg-blue-600 px-3 py-2">
    + Create Season
  </button>
)}
         
      </section>

      <section className="mt-12 flex  gap-2 w-full justify-between ">
        {cardsInfo?.map((item, idx) => {
          const Icon = item.icon; 

          return (
            <div
              key={idx}
              className="relative bg-[#111418] border border-[#1E232B] 
                  rounded-2xl p-6 w-full max-w-85"
            >
              <div className="space-y-2">
                <h3 className="text-gray-400 text-sm font-medium">
                  {item.title}
                </h3>

                <p className="text-3xl font-semibold text-white">
                  {item.total}
                </p>

                <p className="text-xs text-gray-500">
                  +15% across 2 continents
                </p>
              </div>

              <div
                className="absolute right-6 top-1/2 -translate-y-1/2
                    w-14 h-14 rounded-full 
                    bg-[#1B2330] flex items-center justify-center"
              >
                <Icon className="text-blue-400" size={24} />
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default AdminCard;
