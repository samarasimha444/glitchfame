import React, { useState } from "react";
import Modal from "../drops/Model";
import { TimerReset } from 'lucide-react';
import { RotateCcw } from 'lucide-react';
import { LockOpen } from 'lucide-react';

const seasons = [
  {
    id: "S-101",
    name: "Cyber-Nexus Elite 2024",
    status: "Active",
    prize: "$25,000",
    registration: "2024-01-15 — 2024-02-15",
    voting: "2024-03-01 — 2024-04-01",
  },
  {
    id: "S-102",
    name: "Neo-Tokyo Underground",
    status: "Draft",
    prize: "$12,500",
    registration: "2024-05-20 — 2024-06-20",
    voting: "2024-07-01 — 2024-08-01",
  },
  {
    id: "S-103",
    name: "Void Runner Invitational",
    status: "Ended",
    prize: "$50,000",
    registration: "2023-10-01 — 2023-11-01",
    voting: "2023-11-15 — 2023-12-15",
  },
];

const getStatusStyle = (status) => {
  switch (status) {
    case "Active":
      return "bg-green-500/10 text-green-400 border border-green-500/20";
    case "Draft":
      return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20";
    case "Ended":
      return "bg-gray-500/10 text-gray-400 border border-gray-500/20";
    default:
      return "";
  }
};

const SeasonsTable = () => {
  const [modalType, setModalType] = useState(null);

  return (
    <>
      <div className="p-4 w-full justify-between border-b border-gray-800 flex  items-center">
        <input
          type="text"
          placeholder="Filter by name..."
          className="bg-[#1E2229] border border-gray-700 px-3 py-2 rounded-md text-sm outline-none focus:border-purple-500"
        />

        <section className="flex space-x-4 text-[13px]">
          <p className="rounded-4xl cursor-pointer border border-gray-600 px-3 py-1">
            All
          </p>
          <p className="rounded-4xl cursor-pointer border border-gray-600 px-3 py-1">
            Active
          </p>
          <p className="rounded-4xl cursor-pointer border border-gray-600 px-3 py-1">
            Ended
          </p>
        </section>
      </div>

      <div className=" rounded-xl  border border-gray-800 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="bg-[#1E2229] text-gray-400 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Season Name</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Prize Pool</th>
              <th className="px-6 py-3">Registration Period</th>
              <th className="px-6 py-3">Voting Window</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {seasons.map((season) => (
              <tr
                key={season.id}
                className="border-t border-gray-800 hover:bg-[#1E2229] transition"
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-white">{season.name}</div>
                  <div className="text-xs text-gray-500">{season.id}</div>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${getStatusStyle(
                      season.status,
                    )}`}
                  >
                    {season.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-blue-400 font-medium">
                  {season.prize}
                </td>

                <td className="px-6 py-4 text-gray-400">
                  {season.registration}
                </td>

                <td className="px-6 py-4 text-gray-400">{season.voting}</td>

                <td className="px-6 py-4 space-x-3 text-right ">

             

                  <button
                    onClick={() => setModalType("reset")}
                    className=" cursor-pointer hover:text-purple-300 text-sm"
                  >
                   <LockOpen />
                  </button>

                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Modal
          type={modalType}
          onClose={() => setModalType(null)}
          onConfirm={() => {
            console.log("Season Reset");
            setModalType(null);
          }}
        />

        <div className="py-2  border-t bg-[#1E2229] px-4 border-gray-800 flex justify-between items-center text-xs text-gray-400">
          <span>Showing 1 to {seasons.length} seasons</span>
          <div className="space-x-2">
            <button className="px-3 py-2 bg-[#1E2229] rounded-md border border-gray-700 hover:bg-gray-800">
              Previous
            </button>
            <button className="px-3 py-2 bg-[#1E2229] rounded-md border border-gray-700 hover:bg-gray-800">
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SeasonsTable;
