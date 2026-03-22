import React, { lazy, Suspense, useState } from "react";

import SeasonForm from "./SeasonForm";
const Modal = lazy(() => import("./Model"));

const AdminCard = ({ title, paragraph, className, type, cardsInfo,stats}) => {
  const [open, setOpen] = useState(false);

  console.log(stats)

  return (
 <div className={`flex flex-col  w-full py-4 ${className}`}>

  <Suspense fallback={null}>
       
          <Modal
            className="w-full"
            open={open}
            onClose={() => setOpen(false)}
            title="Create Season"
          >
          <SeasonForm close={() => setOpen(false)} />

          </Modal>
       
      </Suspense>

  
  <section className="flex w-full flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 ">
    <h3 className="flex flex-col font-semibold text-2xl sm:text-3xl">
      {title}
      <p className="text-[13px] max-w-full sm:max-w-xl text-gray-300 mt-1">
        {paragraph}
      </p>
    </h3>

    {type === "home" && (
      <button
        onClick={() => setOpen(!open)}
        className="bg-blue-600 px-3 py-2 rounded-md text-white text-sm sm:text-base hover:opacity-90 transition"
      >
        + Create Season
      </button>
    )}
  </section>

  
<section className="mt-8 sm:mt-12 w-full grid grid-cols-2 sm:grid-cols-2 md:flex md:flex-wrap gap-4 sm:gap-6">
  {cardsInfo?.map((item, idx) => {
    const Icon = item.icon;

    return (
      <div
        key={idx}
        className="relative bg-[#111418] border border-[#1E232B] rounded-2xl p-4 sm:p-6 flex-1 sm:min-w-50"
      >
        <div className="space-y-2">
          <h3 className="text-gray-400 text-[12px] sm:text-sm font-medium">
            {item.title}
          </h3>

          <p className="text-xl sm:text-3xl font-semibold text-white">
            {stats?.[item.key] ?? 0}
          </p>

          <p className="text-xs text-gray-500">
           
          </p>
        </div>

        <div
          className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2
          w-10 h-10 sm:w-14 sm:h-14 rounded-full 
          bg-[#1B2330] flex items-center justify-center"
        >
          <Icon className="text-blue-400" size={20} />
        </div>
      </div>
    );
  })}
</section>
</div>
  );
};

export default AdminCard;