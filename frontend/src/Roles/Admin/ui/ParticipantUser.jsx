import React from "react";
import { UserPlus, Trash2 } from "lucide-react";

const data = [
  {
    id: 1,
    name: "Sarah Connor",
    location: "Resistance Camp",
    votes: 12450,
    avatar: "https://i.pravatar.cc/100?img=45",
  },
  {
    id: 2,
    name: "Deckard Blade",
    location: "Los Angeles 2019",
    votes: 9820,
    avatar: "https://i.pravatar.cc/100?img=12",
  },
  {
    id: 3,
    name: "Major Kusanagi",
    location: "Section 9",
    votes: 15600,
    avatar: "https://i.pravatar.cc/100?img=5",
  },
  {
    id: 4,
    name: "Neo Anderson",
    location: "Zion Mainframe",
    votes: 11200,
    avatar: "https://i.pravatar.cc/100?img=33",
  },
];

const ActiveParticipantsTable = ({ type,className,userData}) => {

  return (

    <div className={` flex ${className ? className : "w-full"}`}>

      <div className="w-full mt-12   border border-gray-700 p-8 ">
        <h3 className="text-xl flex gap-3 font-semibold"><UserPlus/> Active Contestants</h3>
        <div className="overflow-x-auto">
          <table className="w-full  text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400 text-sm">
                <th className="py-4">Contestant</th>
                 <th className="py-4">Season</th>
                <th>Votes</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-800 hover:bg-[#141821] transition"
                >
                  
                  <td className="py-5">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span className="text-white text-xs font-medium">
                        {item.name}
                      </span>
                    </div>
                  </td>

                  
                  <td className="text-gray-400">
                    {item.location}
                  </td>

                  <td className="text-blue-400 font-semibold">
                    {item.votes.toLocaleString()}
                  </td>

                 
                  <td className="text-right">
                    <div className="flex justify-end gap-3">

                       <button className="bg-[#141821] border border-gray-700 text-gray-300 text-xs px-3 py-1.5 rounded-md hover:border-gray-500 transition">
                        Custom
                      </button>
                      
                      <button className="bg-[#141821] border border-gray-700 text-gray-300 text-xs px-3 py-1.5 rounded-md hover:border-gray-500 transition">
                        +5
                      </button>

                      

                      <button className="bg-[#141821] border border-gray-700 text-gray-300 text-xs px-3 py-1.5 rounded-md hover:border-gray-500 transition">
                        +10
                      </button>

                      <button className="text-red-500 hover:text-red-400 transition">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
         
         <section className="w-full  flex items-center mt-4 justify-center">
              <button className="bg-blue-500 px-4 py-2 rounded-xs">Load More</button>

         </section>
       

      </div>

      
    </div>
  );
};

export default ActiveParticipantsTable;